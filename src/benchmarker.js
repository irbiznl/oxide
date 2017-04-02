/**
 * Downloads resources and uses them to run a crude speed test.
 * As a side effect the resources will be cached by your browser after the test,
 * so the benchmarker can double as a preloader.
 * @constructor
 */
function OxideBenchmarker( previousBenchmarkResults, previousBenchmarkQueue ) {
    'use strict';

    this.BENCHMARK_STATE_IDLE = 'idle';
    this.BENCHMARK_STATE_QUEUE = 'queue';
    this.BENCHMARK_STATE_BUSY = 'busy';

    /**
     * Holds the results of the speeds tests grouped by url
     * @type {Array}
     */
    this.benchmarkResults = {};
    if( typeof previousBenchmarkResults === 'object' ) {
        this.benchmarkResults = previousBenchmarkResults;
    }

    /**
     * Holds the queue of resources to load. Resources are not loaded concurrently
     * to prevent different benchmarks from slowing eachother down.
     * @type {Array}
     */
    this.benchmarkQueue = [];
    if( typeof previousBenchmarkQueue === 'object' ) {
        this.benchmarkQueue = previousBenchmarkQueue;
    }

    /**
     * Read and updated by the benchmark queue handler to prevent concurrent resource loads.
     * Can be one of these values:
     * - BENCHMARK_STATE_IDLE: not doing any requests and the benchmark queue is empty, any call to benchmark() now would not interfere with other calls.
     * - BENCHMARK_STATE_QUEUE: not doing any request right now but there are still items in the queue, a call to benchmark() now would slow down handling of the queue
     * - BENCHMARK_STATE_BUSY: busy doing one or more requests, a call to benchmark() now would reduce reliability of the results
     * @type {string}
     */
    this.benchmarkState = this.BENCHMARK_STATE_IDLE;

    //noinspection JSUnusedGlobalSymbols
    /**
     * Benchmark queue handler. If for any reason you want to stop it, call clearTimeout() on this.
     */
    this.worker = function() {};

    this.work();
};

/**
 * Processes the current benchmark queue.
 */
OxideBenchmarker.prototype.work = function() {
    var self = this;
    //console.log( 'benchmark state: ' + this.benchmarkState );
    //console.log( 'benchmark queue size: ' + this.benchmarkQueue.length );
    if( this.benchmarkState === this.BENCHMARK_STATE_IDLE || this.benchmarkState === this.BENCHMARK_STATE_QUEUE ) {
        var currentItem = this.benchmarkQueue.shift();
        if( typeof currentItem === 'string' ) {
            //console.log('benchmark going to process: ' + currentItem);
            this.benchmark(currentItem);
        }
    }

    this.worker = setTimeout(function(){ self.work() }, 100);
};

/**
 * Adds a resource to the benchmark queue.
 * @param resource the url of the resource to load.
 */
OxideBenchmarker.prototype.load = function(resource) {
    this.benchmarkQueue.push(resource);
};

/**
 * Benchmarks an item immediately. Used by the benchmark queue handler.
 * @param resource the url of the resource to load.
 */
OxideBenchmarker.prototype.benchmark = function(resource) {
    this.benchmarkState = this.BENCHMARK_STATE_BUSY;
    var self = this;
    var xhr = new XMLHttpRequest(),
        method = "GET";

    xhr.open(method, resource, true);
    var benchmarkStart = (new Date()).getTime();
    xhr.onreadystatechange = function () {
        if(xhr.readyState === XMLHttpRequest.DONE ) {
            self.benchmarkState = ( self.benchmarkQueue.length > 0 ? self.BENCHMARK_STATE_QUEUE : self.BENCHMARK_STATE_IDLE);
            if( xhr.status === 200 ) {
                if( typeof self.benchmarkResults[xhr.responseURL] === 'undefined' ) {
                    self.benchmarkResults[xhr.responseURL] = { size: xhr.response.length, loadTimes: [] };
                }
                var benchmarkTime = (new Date()).getTime() - benchmarkStart;
                self.benchmarkResults[xhr.responseURL].loadTimes.push(benchmarkTime);

                var event = new CustomEvent("onOxideSpeedChange", {
                    detail: {
                        // Include speed over all stored benchmarks and the number of files left to benchmark.
                        speed: self.getSpeed(),
                        queueSize: self.benchmarkQueue.length,
                        // And include most recent file and its loadtime
                        lastUrl: xhr.responseURL,
                        lastFileLoadTime: benchmarkTime,
                        lastFileSpeed: self.benchmarkResults[xhr.responseURL].size/benchmarkTime,
                    }
                });
                document.dispatchEvent(event);

                // TODO build outlier detection: if all new results are outliers -> invalidate older results?
            }
        }
    };
    xhr.send();

};

/**
 * Calculates the average speed over all completed benchmarks in the result table.
 * Returned value is in kilobytes (SI definition) per second.
 * @returns {number}
 */
OxideBenchmarker.prototype.getSpeed = function() {
    var totalSize = 0.0;
    var totalTime = 0.0;
    for ( var key in this.benchmarkResults ) {
        if ( this.benchmarkResults.hasOwnProperty(key) ) {
            var resourceInfo = this.benchmarkResults[key];
            totalSize += ( resourceInfo.size * resourceInfo.loadTimes.length );
            for ( var i = 0; i < resourceInfo.loadTimes.length; i++ ) {
                totalTime += resourceInfo.loadTimes[i];
            }
        }
    }

    /**
     * Converting from bytes to kilobytes and milliseconds to seconds cancel eachother out.
     */
    return (totalSize/totalTime);
};