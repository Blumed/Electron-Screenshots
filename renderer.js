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
const log = console.log.bind(console);
// const btnCustom = document.getElementById('js-btn-custom');
// const btnFile = document.getElementById('js-btn-file');
const toggleCustom = document.getElementById('js-toggle-custom');
const toggleFile = document.getElementById('js-toggle-file');

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

document.querySelector('.js-clear-screenshots').addEventListener('click', function () {
    fs.readdir(screenshots, (err, files) => {
        if (err) throw err;

        for (const file of files) {
            fs.unlink(path.join(screenshots, file), err => {
                if (err) throw err;
            });
        }
    });
}, false);

  // Toggle url parsing options

  document.getElementById('js-btn-custom').addEventListener('click', function () {
    toggleCustom.classList.remove("js-is-inactive");
    toggleCustom.classList.add("js-is-active");
    toggleFile.classList.remove("js-is-active");
    toggleFile.classList.add("js-is-inactive");
    console.log('costom');
  }, false);

  document.getElementById('js-btn-file').addEventListener('click', function () {
    toggleCustom.classList.remove("js-is-active");
    toggleCustom.classList.add("js-is-inactive");
    toggleFile.classList.remove("js-is-inactive");
    toggleFile.classList.add("js-is-active");
    console.log('file');
}, false);
//   myFunction = ()=> {
//       if(){}
//     var x = document.getElementById("myDIV");
//     if (x.style.display === "none") {
//         x.style.display = "block";
//     } else {
//         x.style.display = "none";
//     }
// }