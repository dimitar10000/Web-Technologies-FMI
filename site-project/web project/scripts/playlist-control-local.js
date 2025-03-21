import { sendRequest } from "./request.js";
import { loadPlaylist, shiftPlaylistEntries, removeFromPlaylist } from "./utility-functions.js";

window.addEventListener("load", function () {

    loadPlaylist("local");

    var addButton = document.getElementById("playlist-add-button");
    addButton.addEventListener('click', addToPlaylist);

    var deleteButton = document.getElementById("delete-button");
    deleteButton.addEventListener('click', function () {
        removeFromPlaylist("local");
    });

    var upButton = document.getElementById("move-up-button");
    upButton.addEventListener('click', movePlaylistItemUp);

    var downButton = document.getElementById("move-down-button");
    downButton.addEventListener('click', movePlaylistItemDown);
});

const MAX_PLAYLIST_ELEMENTS = 100;

function connFail() {
    alert("проблем при връзката с базата данни!");
}

function updateSuccess(response) {

}

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
        insertInPlaylist(titles[i],positions[i]);
    }
}

function insertInPlaylist(title, position) {
    var options = {
        method: 'POST',
        params: "position=" + position + "&title=" + title + "&type=local" + "&operation=insert",
        contentType: 'application/x-www-form-urlencoded'
    }

    sendRequest('./php/update-playlist.php', options, updateSuccess, connFail);
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

        shiftPlaylistEntries(position, "up", "local");
    }
}

function movePlaylistItemDown() {
    var playlist = document.getElementById("playlist-box");
    var selectedItem = playlist.options[playlist.selectedIndex];

    if (playlist.selectedIndex + 1 <= MAX_PLAYLIST_ELEMENTS) {
        var itemAfter = playlist.options[playlist.selectedIndex + 1];
        var position = playlist.selectedIndex;

        let tmp = selectedItem.text;
        selectedItem.text = itemAfter.text;
        itemAfter.text = tmp;

        itemAfter.selected = true;
        selectedItem.selected = false;

        shiftPlaylistEntries(position, "down", "local");
    }
}