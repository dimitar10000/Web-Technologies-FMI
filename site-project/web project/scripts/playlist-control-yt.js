import { sendRequest } from "./request.js";
import { loadPlaylist, shiftPlaylistEntries, removeFromPlaylist } from "./utility-functions.js";

window.addEventListener("load", function () {
    loadPlaylist("yt");

    var addButton = document.getElementById("playlist-add-button");
    addButton.addEventListener('click', addToPlaylist);

    var deleteButton = document.getElementById("delete-button");
    deleteButton.addEventListener('click', function () {
        removeFromPlaylist("yt");
    });

    var upButton = document.getElementById("move-up-button");
    upButton.addEventListener('click', movePlaylistItemUp);

    var downButton = document.getElementById("move-down-button");
    downButton.addEventListener('click', movePlaylistItemDown);
});

function connFail() {
    alert("проблем при връзката с базата данни!");
}

const MAX_PLAYLIST_ELEMENTS = 100;

function addToPlaylist() {
    var mediaBox = document.getElementById("media-box");
    var selectedItems = mediaBox.selectedOptions;

    var items = [], positions = [], titles = [];

    for (let i = 0; i < selectedItems.length; i++) {
        items[i] = selectedItems[i].label;
    }

    var playlist = document.getElementById("playlist-box");
    var playlistSize = playlist.length;

    if (playlistSize + items.length <= MAX_PLAYLIST_ELEMENTS) {
        for (let i = 0; i < items.length; i++) {

            let opt = document.createElement('option');
            opt.value = `${playlistSize}`;
            opt.innerHTML = items[i];
            playlist.appendChild(opt);

            playlistSize = playlist.length;

            titles.push(items[i]);
            positions.push(opt.value);
        }
    }

    for(let i=0;i<titles.length;i++) {
        getVideoURL(titles[i],positions[i]);
    }
}

function getVideoURL(title,position) {
    var options = {
        method: 'POST',
        params: "title=" + title + "&position=" + position,
        contentType: 'application/x-www-form-urlencoded'
    }

    sendRequest('./php/get-video-url.php', options, getURLSuccess, connFail);
}

function getURLSuccess(response) {
    const words = JSON.parse(response);

    const url = words.url;
    const title = words.title;
    const position = words.position;

    insertInPlaylist(url, title,position);
}

function insertInPlaylist(url, title,position) {
    var options = {
        method: 'POST',
        params: "position=" + position + "&url=" + url + "&title=" + title + "&type=yt" + "&operation=insert",
        contentType: 'application/x-www-form-urlencoded'
    }

    sendRequest('./php/update-playlist.php', options, updateSuccess, connFail);
}

function updateSuccess(response) {
}

function movePlaylistItemUp() {
    var playlist = document.getElementById("playlist-box");
    var selectedItem = playlist.options[playlist.selectedIndex];

    if (playlist.selectedIndex - 1 >= 0) {
        var itemBefore = playlist.options[playlist.selectedIndex - 1];
        var position = playlist.selectedIndex;

        let tmp = selectedItem.text;
        selectedItem.text = itemBefore.text;
        itemBefore.text = tmp;

        itemBefore.selected = true;
        selectedItem.selected = false;

        shiftPlaylistEntries(position, "up", "yt");
    }
}

function movePlaylistItemDown() {
    var playlist = document.getElementById("playlist-box");
    var selectedItem = playlist.options[playlist.selectedIndex];

    if (playlist.selectedIndex + 1 <= MAX_PLAYLIST_ELEMENTS &&
        playlist.selectedIndex + 1 < playlist.length) {
        var itemAfter = playlist.options[playlist.selectedIndex + 1];
        var position = playlist.selectedIndex;

        let tmp = selectedItem.text;
        selectedItem.text = itemAfter.text;
        itemAfter.text = tmp;

        itemAfter.selected = true;
        selectedItem.selected = false;

        shiftPlaylistEntries(position, "down", "yt");
    }
}