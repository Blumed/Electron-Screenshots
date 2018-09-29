// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


const { dialog } = require('electron').remote;
const fs = require('fs');
const Pageres = require('pageres');

let myFilePath;

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
        .src(arrUrls[i].toString(), ['480x320', '1024x768', 'iphone 5s'], {incrementalName: true, filename: '<%= date %_-<%= url %>_<%= size %>'})
        .dest(__dirname + '/screenshots')
        .run();
    }
});
}, false);