import { updateDatabase } from "./add-to-db.js";
import { formatDate,addEntryToMediaList } from "./utility-functions.js";
import {TimeTracker} from "./timetracker.js";

import {md5} from "./md5_algo.js";

window.addEventListener("load", function () {
    createVideoPlayer();
    createAudioPlayer();

    var input = document.getElementById("video-input");
    input.addEventListener('change', loadVideo, false);

    var input = document.getElementById("audio-input");
    input.addEventListener('change', loadAudio, false);
});

var currentVideo = {
    hash: "",
    fileName: "",
    lastWatched: "",
    loadedNew: false,
    timesClickPlay: 0
}

var currentAudio = {
    hash: "",
    fileName: "",
    lastWatched: "",
    loadedNew: false,
    timesClickPlay: 0
}

var values = [];

var timetracker = new TimeTracker();
var timetracker2 = new TimeTracker();

function createVideoPlayer() {
    var videoPlayer = document.createElement("video");
    videoPlayer.setAttribute("id", "local-video-player");
    videoPlayer.setAttribute("controls", "true");
    videoPlayer.setAttribute("height","240");
    videoPlayer.setAttribute("width","320");

    var videoSpace = document.getElementById("video-player");
    videoSpace.appendChild(videoPlayer);

    var videoInput = document.getElementById("video-input");

    videoPlayer.addEventListener("playing", onVideoPlaying);
    videoPlayer.addEventListener("pause", onVideoPause);
    videoPlayer.addEventListener("waiting", onVideoWaiting);
    videoPlayer.addEventListener("ended",onVideoPause);
}

function onVideoPlaying() {
    timetracker.start();

    if (timetracker.bufferingHappened) {
        timetracker.addBufferingTime();
    }

    currentVideo.timesClickPlay++;

    // update the counter with 1 when entering new video link and playing
    if (currentVideo.timesClickPlay === 1) {
        updateDatabase(currentVideo.hash, "", "", "", 1, "");
    }
    else {
        currentVideo.timesClickPlay = 2;
    }

    // insert entry into history table
    if (currentVideo.loadedNew) {
        updateDatabase(currentVideo.hash, currentVideo.fileName, "", currentVideo.lastWatched, "", currentVideo.loadedNew);
        currentVideo.loadedNew = false;
    }
}

function onVideoPause() {
    var timePlayed = timetracker.calculateTime();

    // send a request with the time to update the DB value
    updateDatabase(currentVideo.hash, "", timePlayed, currentVideo.lastWatched, "", false);

    timetracker.stop();
}

function onVideoWaiting() {
    timetracker.trackBuffering();
}

function onAudioPlaying() {
    timetracker2.start();

    if (timetracker2.bufferingHappened) {
        timetracker2.addBufferingTime();
    }

    currentAudio.timesClickPlay++;

    // update the counter with 1 when entering new video link and playing
    if (currentAudio.timesClickPlay === 1) {
        updateDatabase(currentAudio.hash, "", "", "", 1, "");
    }
    else {
        currentAudio.timesClickPlay = 2;
    }

    // insert entry into history table
    if (currentAudio.loadedNew) {
        updateDatabase(currentAudio.hash, currentAudio.fileName, "", currentAudio.lastWatched, "", currentAudio.loadedNew);
        currentAudio.loadedNew = false;
    }
}

function onAudioPause() {
    var timePlayed = timetracker2.calculateTime();

    // send a request with the time to update the DB value
    updateDatabase(currentAudio.hash, "", timePlayed, currentAudio.lastWatched, "", false);

    timetracker2.stop();
}

function onAudioWaiting() {
    timetracker2.trackBuffering();
}

function loadVideo(event) {
    var videoPlayer = document.getElementById("local-video-player");

    var URL = window.URL;
    var file = this.files[0];
    var type = file.type;
    var canPlay = videoPlayer.canPlayType(type);

    var playLabel = document.getElementsByClassName("play-label")[0];

    if (canPlay === '') {
        playLabel.innerHTML = "За този формат няма предварителен преглед :-/";
    }
    else {
        playLabel.innerHTML = "";
    }

    currentVideo.timesClickPlay = 0;
    currentVideo.loadedNew = true;

    var reader = new FileReader();

    reader.onload = function (event) {
        var binary = event.target.result;
        var md5value = md5(binary).toString();

        var today = new Date();
        var lastWatched = formatDate(today);

        currentVideo.fileName = file.name;
        currentVideo.lastWatched = lastWatched;
        currentVideo.hash = md5value;

        addEntryToMediaList(file.name,values);

        updateDatabase(md5value, file.name, 0, lastWatched, 0, "");
    }

    reader.readAsBinaryString(file);

    var fileURL = URL.createObjectURL(file);
    videoPlayer.src = fileURL;
}

function createAudioPlayer() {
    var audioPlayer = document.createElement("audio");
    audioPlayer.setAttribute("id", "local-audio-player");
    audioPlayer.setAttribute("controls", "true");

    var audioSpace = document.getElementById("audio-player");
    audioSpace.appendChild(audioPlayer);

    audioPlayer.addEventListener("playing", onAudioPlaying);
    audioPlayer.addEventListener("pause", onAudioPause);
    audioPlayer.addEventListener("waiting", onAudioWaiting);
    audioPlayer.addEventListener("ended",onAudioPause);
}

function loadAudio(event) {
    var audioPlayer = document.getElementById("local-audio-player");

    var URL = window.URL;
    var file = this.files[0];
    var type = file.type;
    var canPlay = audioPlayer.canPlayType(type);

    var playLabel = document.getElementsByClassName("play-label")[1];

    if (canPlay === '') {
        playLabel.innerHTML = "За този формат няма предварителен преглед :-/";
    }
    else {
        playLabel.innerHTML = "";
    }

    currentAudio.timesClickPlay = 0;
    currentAudio.loadedNew = true;

    var reader = new FileReader();

    reader.onload = function (event) {
        var binary = event.target.result;
        var md5value = md5(binary).toString();

        var today = new Date();
        var lastWatched = formatDate(today);

        currentAudio.fileName = file.name;
        currentAudio.lastWatched = lastWatched;
        currentAudio.hash = md5value;

        addEntryToMediaList(file.name,values);

        updateDatabase(md5value, file.name, 0, lastWatched, 0, "");
    }

    reader.readAsBinaryString(file);

    var fileURL = URL.createObjectURL(file);
    audioPlayer.src = fileURL;
}