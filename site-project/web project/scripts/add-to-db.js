import { sendRequest } from "./request.js";

export function updateDatabase(videoURL, videoTitle="",timeWatched="",lastWatched="",viewedCount="",newLink="") {

    var paramsValue = "videoURL=" + videoURL;

    if(videoTitle !== "") {
        paramsValue += "&videoTitle=" + videoTitle;
    }

    if(timeWatched !== "") {
        paramsValue += "&timeWatched=" + timeWatched;
    }

    if(lastWatched !== "") {
        paramsValue += "&lastWatched=" + lastWatched;
    }

    if(viewedCount !== "") {
        paramsValue += "&viewedCount=" + viewedCount;
    }

    if(newLink !== "") {
        paramsValue += "&newLink=" + newLink;
    }

    var options = {
        method: 'POST',
        params: paramsValue,
        contentType: 'application/x-www-form-urlencoded'
    }

    sendRequest("./php/update-db.php", options, modifySuccess, modifyFail);
}

function modifySuccess(response) {
}

function modifyFail() {
    alert("модификацията на базата беше неуспешна");
}