# <sub>8</sub>O (Oxide)
> <sub>8</sub>O (Oxide) is a javascript library to get connection information and allows the browser to load certain content only if a minimum speed requirements are met.

## Getting started

### Install
Install: `npm install --save-dev 8o`

After that you can either:
- Include/copy one of the files in **release** to your project to start using the full library.
- Include one or more of the files in **src** if you require only some of the functionality. The most suitable files for standalone use are:
  - **benchmarker.js** if you only want to use the speedtest components and not store the results across page navigations.
  - **ipmonitor.js** if you want to check ip address/connection changes while the user stays on the same webpage.

In all other scenarios you probably want to include the entire built library from the **release** folder.

### Usage
The following example determines the average speed over 3 file downloads and when all three are done downloading decides wether or not to show a video.
``` js
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
```

### Build
The library comes pre-built if you get it from Github or NPM.
However if you want to customise it or build it yourself the **package.json** config file for npm includes build commands.

Use `npm run build` to build the releases from your source or `npm run` to see an overview of all other commands.

## License
ISC License

Copyright (c) 2017, irbiz.nl and other contributors

Permission to use, copy, modify, or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE
OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.