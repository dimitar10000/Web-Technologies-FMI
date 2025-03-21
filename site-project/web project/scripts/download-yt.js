import {sendRequest} from "./request.js";
import { downloadFile } from "./utility-functions.js";

window.addEventListener("load",function () {

    var dButton1 = document.getElementById("download-html-button");
    dButton1.addEventListener('click', getURLs);

    var dButton2 = document.getElementById("download-json-button");
    dButton2.addEventListener('click', getURLs);

    var dButton3 = document.getElementById("download-txt-button");
    dButton3.addEventListener('click', getURLs);
});

function connFail() {
    alert("проблем при връзката с базата данни!");
}

var buttonID;

function getURLs(event) {
    buttonID = event.target.id;

    var options = {
        method: 'POST',
        params: "type=yt",
        contentType: 'application/x-www-form-urlencoded'
    }
    
    sendRequest('./php/load-playlist.php',options,URLSuccess,connFail);
}

function URLSuccess(response) {
    var titles = [];
    var URLs = [];

    var arrObject = JSON.parse(response);
    
    for (var subarr of arrObject) {

        var URL = subarr['videoURL'];
        URLs.push(URL);
        
        var title = subarr['title'];
        titles.push(title);
    }

    if(buttonID == "download-html-button") {
        downloadPlaylistHTML(URLs,titles);
    }
    else if(buttonID == "download-json-button") {
        downloadPlaylistJSON(URLs,titles);
    }
    else if(buttonID == "download-txt-button") {
        downloadPlaylistTXT(URLs,titles);
    }
}

function downloadPlaylistHTML(urlsArray,titlesArray) {

    var fileContent = [];

    var firstHTML = "<html>\n" + "<head>\n"
    + "<meta charset=\"UTF-8\">\n"
    + "<title> Плейлист </title>\n" + "</head>\n <body> \n";

    var secondHTML = "</body>\n </html>";

    var rows = [];

    for (let i = 0; i < urlsArray.length; i++) {
        var row = titlesArray[i] + ": <a href=\"" + urlsArray[i]
         + "\">" + urlsArray[i] +"</a><br>\n";

        rows.push(row);
    }

    fileContent.push(firstHTML);

    for(let i=0;i<rows.length;i++) {
        fileContent.push(rows[i]);
    }

    fileContent.push(secondHTML);

    downloadFile(fileContent,"playlist","html");
}

function downloadPlaylistTXT(urlsArray,titlesArray) {
    var rows = [];

    for (let i = 0; i < urlsArray.length; i++) {
        var row = titlesArray[i] + ": " + urlsArray[i] + "\n";
        rows.push(row);
    }

    downloadFile(rows,"playlist","txt");
}

function downloadPlaylistJSON(urlsArray,titlesArray) {
    var playlistObj = {};

    for(var i=0;i<titlesArray.length;i++) {
        playlistObj[titlesArray[i]] = urlsArray[i];
    }

    var fileContent = [JSON.stringify(playlistObj)];

    downloadFile(fileContent,"playlist","json");
}