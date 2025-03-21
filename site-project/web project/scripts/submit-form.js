import { formatDate,addEntryToMediaList} from "./utility-functions.js";
import { sendRequest } from "./request.js";
import {onYouTubeIframeAPIReady,loadVideo} from "./yt-player.js";
import {updateDatabase} from "./add-to-db.js";

export {videoURL, videoID, videoTitle,timeWatched,lastWatched,viewedCount};
export {mutableVars};

var createdPlayer = false;

var videoURL, videoID, videoTitle,timeWatched,lastWatched,viewedCount;

var mutableVars = {
    enteredNewLink:false,
    timesClickPlay:0
}

var values = [];

window.addEventListener("load", function() {
    var form = document.getElementById("link-form");
    form.addEventListener('submit', getVideoInfos);
});

function getVideoInfos(event) {
    event.preventDefault();
    var linkContent = document.getElementById("link-content");

    if(linkContent.value === "") {
        alert("Въвели сте празен линк, опитайте отново");
        return;
    }

    mutableVars.timesClickPlay = 0;
    mutableVars.enteredNewLink = true;

    const myAPIKey = "AIzaSyCYpld7jKsCQC75MVac8-RoHGIMXgxe0Kc";

    var options = {
        method: 'GET',
        params: "https://www.googleapis.com/youtube/v3/search/?key=" + myAPIKey + "&part=snippet&q=" + linkContent.value,
        contentType: 'application/json'
    }

    sendRequest(options.params, options, infosSuccess, infosFail);
}

function infosSuccess(response) {
    var modified = response.replace(/&quot;/g,'\\"');
    var jsObject = JSON.parse(modified);

    videoID = jsObject.items[0].id.videoId;
    videoTitle = jsObject.items[0].snippet.title;

    addEntryToMediaList(videoTitle,values);

    videoURL = document.getElementById("link-content").value;
    timeWatched = 0;
    viewedCount = 0;

    var today = new Date();
    lastWatched = formatDate(today);

    if(!createdPlayer) {
        removePlaceholder();
        onYouTubeIframeAPIReady(videoID);
        createdPlayer = true;
    }
    else {
        loadVideo(videoID);
    }

    updateDatabase(videoURL, videoTitle,timeWatched,lastWatched,viewedCount,mutableVars.enteredNewLink);
}

function removePlaceholder() {
    var placeholder = document.getElementById("video-placeholder-image");
    placeholder.parentNode.removeChild(placeholder);
}

function infosFail() {
    window.alert("заявката до сървъра беше неуспешна...");
}