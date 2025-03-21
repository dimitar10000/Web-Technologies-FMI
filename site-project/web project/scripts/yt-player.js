import { updateDatabase } from "./add-to-db.js";
import { videoURL, videoTitle, lastWatched, mutableVars } from "./submit-form.js";
import { TimeTracker } from "./timetracker.js"

var player;
var timePlayedElement = document.getElementById("play-time");

window.addEventListener("load", function () {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

});

var timetracker = new TimeTracker();

export function onYouTubeIframeAPIReady(videoID) {

    player = new YT.Player('media-window', {
        height: '390',
        width: '640',
        videoId: videoID,
        playerVars: {
            'playsinline': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

export function loadVideo(videoID) {
    var videoURL = "https://www.youtube.com/v/" + videoID + "?version=3";
    player.cueVideoByUrl(videoURL);
}

function onPlayerReady(event) {

}

function onPlayerStateChange(event) {

    if (event.data == YT.PlayerState.PLAYING) {
        timetracker.start();

        if (timetracker.bufferingHappened) {
            timetracker.addBufferingTime();
        }

        mutableVars.timesClickPlay++;

        // update the counter with 1 when entering new video link and playing
        if (mutableVars.timesClickPlay === 1) {
            updateDatabase(videoURL, "", "", "", 1, "");
        }

        // insert entry into history table
        if (mutableVars.enteredNewLink && mutableVars.timesClickPlay === 1) {
            updateDatabase(videoURL, videoTitle, "", lastWatched, "", mutableVars.enteredNewLink);
            mutableVars.enteredNewLink = false;
        }
    }

    if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
        var timePlayed = timetracker.calculateTime();

        // send a request with the time to update the DB value
        updateDatabase(videoURL, "", timePlayed, lastWatched, "", false);
        timetracker.stop();
    }

    if (event.data == YT.PlayerState.BUFFERING) {
        timetracker.trackBuffering();
    }

    if (event.data == YT.PlayerState.CUED) {
        timetracker.elapsedTime = 0;
    }
}