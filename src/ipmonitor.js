function OxideIpMonitor( ipAddresses ) {
    'use strict';

    this.peerConnection = new RTCPeerConnection(null);

    this.ipAddresses = {};
    if( typeof ipAddresses === 'object' ) {
        this.ipAddresses = ipAddresses;
    }
};

OxideIpMonitor.prototype.init = function() {
    var self = this;
    self.peerConnection.onicecandidate = function(e) {
        if( e.candidate && e.candidate.candidate ) {
            var ecc = e.candidate.candidate;

            var ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
            var ipAddr = ipRegex.exec(ecc)[1];

            if(self.ipAddresses[ipAddr] === undefined) {
                self.ipAddresses[ipAddr] = true;

                var event = new CustomEvent("onOxideIpAddress", {
                    detail: {
                        ipAddresses: self.ipAddresses,
                        ipAddress: ipAddr
                    }
                });
                document.dispatchEvent(event);
            }
        }
    };
    self.peerConnection.oniceconnectionstatechange = function(e) {
        //console.log('oniceconnectionstatechange');
        //console.log(e);
    };

    self.peerConnection.createDataChannel("");
    self.peerConnection.createOffer(function(result){

        //trigger the stun server request
        self.peerConnection.setLocalDescription(result, function(){}, function(){});

    }, function(){});

    // TODO ROADMAP 1.1 also set up an actual connection to a STUN server instead of just a local one, this might make it possible to check for dropped connection
};