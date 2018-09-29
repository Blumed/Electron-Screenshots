// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


const { dialog } = require('electron').remote;
const fs = require('fs');
const chokidar = require('chokidar');
const path = require('path');
const Pageres = require('pageres');

let myFilePath;
const screenshots = __dirname + '/screenshots';
const log = console.log.bind(console);

// Initialize watcher.
let watcher = chokidar.watch(screenshots, {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });

  watcher
  .on('add', path => log(`File ${path} has been added`))
  .on('change', path => log(`File ${path} has been changed`))
  .on('unlink', path => log(`File ${path} has been removed`));

// Stop watching.
watcher.close();

document.getElementById('file-contents').addEventListener('click', function () {
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
        console.log(arrUrls [i]);
        let pageres = new Pageres({delay: 4})
        .src(arrUrls[i].toString(), ['480x320', '1024x768', 'iphone 5s'], {incrementalName: true, filename: '<%= date %>_<%= url %>_<%= size %>'})
        .dest(__dirname + '/screenshots')
        .run()
    }
});
}, false);

document.getElementById('clear-screenshots').addEventListener('click', function () {
    fs.readdir(screenshots, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(screenshots, file), err => {
                if (err) throw err;
            });
        }
    });
}, false);

watcher = chokidar.watch('file, dir, glob, or array', {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });