// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


const { dialog } = require('electron').remote;
const fs = require('fs');
const chokidar = require('chokidar');
const path = require('path');
const Pageres = require('pageres');

// Global Variables
let myFilePath;
const screenshots = __dirname + '/screenshots';
const toggleCustom = document.getElementById('js-toggle-custom');
const toggleFile = document.getElementById('js-toggle-file');
let watched = watcher.getWatched();

// Initialize watcher.
const watcher = chokidar.watch(screenshots, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    ignored: '*.png.*',
    cwd: '.',
    });
    watcher.on('add', (event, path) => {
        console.log(event, path);
      });


function Photo(src) {
    this.src = src;
    var container = document.getElementById('image-grid'); 
    var img = document.createElement('img');
    img.src = './screenshots/' + watcher.getWatched().screenshots[0];
    img.className = 'thumb';
    img.style.width = '200px';

    this.create = function() {
        container.appendChild(img);
    }
    console.log('clicked');
}
document.body.addEventListener('click', function () {

    //Custom Urls Field and Parse
    if (event.target.classList.contains("js-btn-custom-urls")) {
        if(document.getElementById('js-custom-urls').value === undefined){
            console.log("No file selected");
            return;
        }
    
        let arrUrls = document.getElementById('js-custom-urls').value.split(',');
    
        for(i in arrUrls ) {
            let pageres = new Pageres({delay: 4})
            .src(arrUrls[i].toString(), ['480x320', '1024x768', 'iphone 5s'], {incrementalName: true, filename: '<%= date %>_<%= url %>_<%= size %>'})
            .dest(__dirname + '/screenshots')
            .run()
        }
    }

    // File Select and Parse
    if (event.target.classList.contains("js-file-select")) {
        dialog.showOpenDialog((fileNames) => {
            // fileNames is an array that contains all the selected
            if(fileNames === undefined){
                console.log("No file selected");
                return;
            }
        
            // Store file path
            myFilePath = fileNames[0];
        
            let arrUrls = fs.readFileSync(myFilePath,'utf8').toString().split("\n");
        
            for(i in arrUrls ) {
                let pageres = new Pageres({delay: 4})
                .src(arrUrls[i].toString(), ['480x320', '1024x768', 'iphone 5s'], {incrementalName: true, filename: '<%= date %>_<%= url %>_<%= size %>'})
                .dest(__dirname + '/screenshots')
                .run()
            }
        });
    }

    // Clear Images
    if (event.target.classList.contains("js-clear-screenshots")) {
        fs.readdir(screenshots, (err, files) => {
            if (err) throw err;
    
            for (const file of files) {
                fs.unlink(path.join(screenshots, file), err => {
                    if (err) throw err;
                });
            }
        });
    }

    // Toggle url parsing options
    if (event.target.classList.contains("js-btn-custom")) {
        toggleCustom.classList.remove("js-is-inactive");
        toggleCustom.classList.add("js-is-active");
        toggleFile.classList.remove("js-is-active");
        toggleFile.classList.add("js-is-inactive");
    }
    if (event.target.classList.contains("js-btn-file")) {
        toggleCustom.classList.remove("js-is-active");
        toggleCustom.classList.add("js-is-inactive");
        toggleFile.classList.remove("js-is-inactive");
        toggleFile.classList.add("js-is-active");
    }
    console.log(watcher.getWatched().screenshots);

    if (event.target.classList.contains("js-make-grid")) {
        Photo();
        console.log(watcher.getWatched().screenshots.length);
    }

}, false);

  

