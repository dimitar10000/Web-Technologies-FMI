import { downloadFile } from "./utility-functions.js";

window.addEventListener("load",function () {

    var addButton = document.getElementById("download-m3u-button");
    addButton.addEventListener('click', downloadPlaylist);
});

function downloadPlaylist() {
    var playlist = document.getElementById("playlist-box");

    var pathPrefix = document.getElementById("location-specifier").value;

    var entries = [];

    for (let i = 0; i < playlist.length; i++) {
        entries.push(pathPrefix + "\\" + playlist[i].innerHTML + "\n");
    }

    downloadFile(entries,"playlist","m3u");
}