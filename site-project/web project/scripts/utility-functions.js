import { sendRequest } from "./request.js";

export function formatDate(rawDate) {
    var yyyy = rawDate.getFullYear();
    var mm = rawDate.getMonth() + 1;
    var dd = rawDate.getDate();
    var hrs = rawDate.getHours();
    var mins = rawDate.getMinutes();
    var secs = rawDate.getSeconds();

    if (dd < 10) { dd = '0' + dd; }
    if (mm < 10) { mm = '0' + mm; }
    if (hrs < 10) { hrs = '0' + hrs; }
    if (mins < 10) { mins = '0' + mins; }
    if (secs < 10) { secs = '0' + secs; }

    var formatted = yyyy + "-" + mm + "-" + dd + " " + hrs + ":" + mins + ":" + secs;

    return formatted;
}

export function convertTime(num) {
    // num is in seconds

    var rem = num;
    var days = 0, hrs = 0, mins = 0, secs = 0;

    if (num >= 60 * 60 * 24) {
        days = Math.floor(num / (60 * 60 * 24));
        rem = num % (60 * 60 * 24);
    }

    if (rem >= 60 * 60) {
        hrs = Math.floor(rem / (60 * 60));
        rem = rem % (60 * 60);
    }

    if (rem >= 60) {
        mins = Math.floor(rem / 60);
        secs = rem % 60;
    }
    else {
        secs = rem;
    }

    var timeStr = "";

    if (days !== 0) {
        timeStr += days + "д ";
    }
    if (hrs !== 0) {
        timeStr += hrs + "ч ";
    }
    if (mins !== 0) {
        timeStr += mins + "мин ";
    }

    timeStr += secs + "сек ";

    return timeStr;
}

export function createDatabase() {
    var options = {
        method: 'POST',
        params: "",
        contentType: 'application/x-www-form-urlencoded'
    }

    sendRequest("./php/create-db.php", options, dbSuccess, connFail);
}

function dbSuccess(response) {
    createPlaylist("yt");
    createPlaylist("local");
}

function connFail() {
    alert("проблем при връзката с базата данни!");
}

export function addEntryToMediaList(entryTitle, values) {

    const MAX_MEDIA_ELEMENTS = 1000;

    var mediaBox = document.getElementById("media-box");

    var mediaBoxSize = mediaBox.length;
    var hasDups = false;

    if (values.indexOf(entryTitle) != -1) {
        hasDups = true;
    }
    else {
        values.push(entryTitle);
    }

    if (!hasDups && mediaBoxSize <= MAX_MEDIA_ELEMENTS) {
        let opt = document.createElement('option');
        opt.value = `${mediaBoxSize}`;
        opt.innerHTML = entryTitle;
        mediaBox.appendChild(opt);
    }

    var lastAddedOpt = mediaBox.options[mediaBox.length-1];
    lastAddedOpt.selected = true;

    for(let i=0;i<mediaBox.length-1;i++) {
        let opt = mediaBox.options[i];
        opt.selected = false;
    }
}

function createSuccess() {
}

function createPlaylist(type) {
    var options = {
        method: 'POST',
        params: "type=" + type,
        contentType: 'application/x-www-form-urlencoded'
    }

    sendRequest('./php/create-playlist.php', options, createSuccess, connFail);
}

function shiftSuccess(response) {
}

export function shiftPlaylistEntries(position, direction, type) {
    var options = {
        method: 'POST',
        params: "position=" + position + "&direction=" + direction + "&type=" + type + "&operation=shift",
        contentType: 'application/x-www-form-urlencoded'
    }

    sendRequest('./php/update-playlist.php', options, shiftSuccess, connFail);
}

function removeSuccess(response) {
}

export function removeFromPlaylist(type) {
    var playlist = document.getElementById("playlist-box");
    var selectedItems = playlist.selectedOptions;

    var items = [], positions = [];

    for (let i = 0; i < selectedItems.length; i++) {
        items[i] = selectedItems[i].label;
        positions[i] = selectedItems[i].index;
    }

    for(let i=positions.length - 1;i>=0;i--) {
        let posIndex = positions[i];
        playlist.removeChild(playlist.options[posIndex]);
    }

    for (let i=positions.length - 1;i>=0;i--) {
        let position = positions[i];

        var options = {
            method: 'POST',
            params: "type=" + type + "&position=" + position,
            contentType: 'application/x-www-form-urlencoded'
        }

        sendRequest('./php/remove-from-playlist.php', options, removeSuccess, connFail);
    }
}

export function loadPlaylist(type) {
    var options = {
        method: 'POST',
        params: "type=" + type,
        contentType: 'application/x-www-form-urlencoded'
    }

    sendRequest('./php/load-playlist.php', options, loadSuccess, connFail);
}

function loadSuccess(response) {
    var arrObject = JSON.parse(response);
    var playlist = document.getElementById("playlist-box");

    for (var subarr of arrObject) {

        var title = subarr['title'];
        var opt = document.createElement("option");
        opt.innerHTML = title;

        playlist.appendChild(opt);
    }
}

export function downloadFile(fileContent, fileName, fileFormat) {
    var value = `${fileName}` + "." + `${fileFormat}`;

    var file = new File(fileContent, value, {
        type: "text/plain",
    });

    var url = window.URL.createObjectURL(file);

    var a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = file.name;
    a.click();
    window.URL.revokeObjectURL(url);
}

export function isLink(value) {
    return /^(http:\/\/|https:\/\/)?(www\.)?youtube.com/.test(value) == true;
}