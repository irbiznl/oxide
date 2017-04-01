function Oxide() {
    'use strict';

    var self = this;

    this.benchmarker = new OxideBenchmarker( JSON.parse( localStorage.getItem( 'nlIrbizOxideBenchmarkResults' ) ), JSON.parse(localStorage.getItem( 'nlIrbizOxideBenchmarkQueue' ) ) );
    this.ipMonitor = new OxideIpMonitor( JSON.parse( localStorage.getItem( 'nlIrbizOxideIpAddresses' ) ) );
    this.ipMonitor.init();

    document.addEventListener("onOxideSpeedChange", function() {
        localStorage.setItem( 'nlIrbizOxideBenchmarkResults', JSON.stringify( self.benchmarker.benchmarkResults ) );
        localStorage.setItem( 'nlIrbizOxideBenchmarkQueue', JSON.stringify( self.benchmarker.benchmarkQueue ) );
    });

    document.addEventListener("onOxideIpAddress", function() {
        localStorage.setItem( 'nlIrbizOxideIpAddresses', JSON.stringify( self.ipMonitor.ipAddresses ) );
    });
};

Oxide.prototype.load = function(resource) {
    this.benchmarker.load(resource);
};
