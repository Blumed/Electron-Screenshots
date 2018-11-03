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

// Initialize watcher.
const watcher = chokidar.watch(screenshots, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    cwd: '.',
    ignoreInitial: false
    });
    watcher.on('add', (event, path) => {
        console.log(event, path);
        thumbnails();
      });

// Prep images for page
function thumbnails() {
    let watched = watcher.getWatched().screenshots;
    const node = document.getElementById('image-grid'); 

    var img = document.createElement('img');
    var imageWrap = document.createElement('div');
    imageWrap.setAttribute("class", "image-block");
    for (let index = 0; index < watched.length; index++) {
        img.src = './screenshots/' + watched[index];
        console.log(img);
        node.appendChild(imageWrap);
        imageWrap.appendChild(img);
        
    }
}




// Event listeners
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
            .run().then(() => {
                console.log('done');
              });
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
                .run().then(() => {
                  console.log('done');
                });
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
        
        // Clear grid
        document.getElementById('image-grid').innerHTML = '';

        //  Clear text field
        document.getElementById('js-custom-urls').value = '';
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
        thumbnails();
        console.log(watcher.getWatched());
    }

}, false);

  

