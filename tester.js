document.addEventListener("onOxideSpeedChange", function(e) { console.log(e); });
document.addEventListener("onOxideIpAddress", function(e) { console.log(e); });

var files = [
    'https://upload.wikimedia.org/wikipedia/commons/1/18/F-35_EOTS.jpeg',
    'https://upload.wikimedia.org/wikipedia/commons/6/67/Hydra_70_M261.jpeg',
    'https://upload.wikimedia.org/wikipedia/commons/0/0c/Oasis_Hong_Kong.jpeg'
];

document.addEventListener("onOxideSpeedChange", function(e) {
    console.log( 'Connection speed: ' + Math.round(e.detail.speed) + ' kB/s, last file speed: '+Math.round(e.detail.lastFileSpeed) + ' kB/s, last file size: '+Math.round((e.detail.lastFileLoadTime*e.detail.lastFileSpeed)/1000) + ' kB');
    if( e.detail.queueSize == 0 ) {
        if( e.detail.speed >= 1000 ) {
            document.write('<iframe width="560" height="315" src="https://www.youtube.com/embed/4SNGyKZ1DjM" frameborder="0" allowfullscreen></iframe>');
        }
        else {
            alert('We only recommend video if your internet speed is over 1000 kB/s');
        }
    }
});

var oxide = new Oxide();
for(var i = 0; i < files.length; i++ ) {
    oxide.load(files[i]);
}
