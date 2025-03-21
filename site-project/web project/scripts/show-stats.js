import { sendRequest } from "./request.js";
import { isLink,convertTime } from "./utility-functions.js";

window.addEventListener("load", function () {
    getStatsLongest();
    getStatsPlayed();
    getHistory();
    
    var button1 = document.getElementById("load-top-button1");
    var button2 = document.getElementById("load-top-button2");

    button1.addEventListener('click',getStatsLongestN);
    button2.addEventListener('click',getStatsPlayedN);
});

function isNumeric(value) {
    return Number(value) === value;
}

function getStatsLongestN() {
    var top = document.getElementById("top-number-longest-box");

    var options = {
        method: 'POST',
        params: "table=longestWatched" + "&top=" + top.value,
        contentType: 'application/x-www-form-urlencoded'
    }

    sendRequest("./php/get-stats.php", options, statsSuccessLong, statsFail);

    top.value = "";
}

function getStatsPlayedN() {
    var top = document.getElementById("top-number-played-box");

    var options = {
        method: 'POST',
        params: "table=mostWatched" + "&top=" + top.value,
        contentType: 'application/x-www-form-urlencoded'
    }

    sendRequest("./php/get-stats.php", options, statsSuccessPlayed, statsFail);

    top.value = "";
}

export function getStatsLongest() {
    var options = {
        method: 'POST',
        params: "table=longestWatched"+"&top=10",
        contentType: 'application/x-www-form-urlencoded'
    }

    sendRequest("./php/get-stats.php", options, statsSuccessLong, statsFail);
}

function clearTable(table) {
    var num = table.childElementCount;

    if(num > 1) {
        for(var i=1;i<num;i++) {
            table.deleteRow(1);
        }
    }
}

function addToTable1(table,arrObject) {
    for (var subarr of arrObject) {
        var tr = document.createElement("tr");
        table.appendChild(tr);

        for (var data in subarr) {
            var td = document.createElement("td");

            if (isNumeric(subarr[data])) {
                var num = Math.round(Number(subarr[data]));
                var newStr = convertTime(num);
                td.innerHTML = newStr;
            }
            else if (isLink(subarr[data])) {
                var link = document.createElement('a');
                link.setAttribute("href", subarr[data]);
                link.innerHTML = subarr[data];
                td.appendChild(link);
            }
            else {
                td.innerHTML = subarr[data];
            }

            tr.appendChild(td);
        }
    }

    var num = table.childElementCount;
}

function addToTable2(table,arrObject) {
    for (var subarr of arrObject) {
        var tr = document.createElement("tr");
        table.appendChild(tr);

        for (var data in subarr) {
            var td = document.createElement("td");

            if (isLink(subarr[data])) {
                var link = document.createElement('a');
                link.setAttribute("href", subarr[data]);
                link.innerHTML = subarr[data];
                td.appendChild(link);
            }
            else {
                td.innerHTML = subarr[data];
            }

            tr.appendChild(td);
        }
    }
}



function resolve() {

}

function reject() {
    alert("table promise couldn't be fulfilled!");
}

function statsSuccessLong(response) {
    var arrObject = JSON.parse(response);
    var table = document.getElementById("longest-played-media");

    let promise = new Promise(function(resolve,reject) {
        clearTable(table);
        resolve();
    });

    promise.then(() => {addToTable1(table,arrObject);});
}

export function getStatsPlayed() {
    var options = {
        method: 'POST',
        params: "table=mostWatched"+"&top=10",
        contentType: 'application/x-www-form-urlencoded'
    }

    sendRequest("./php/get-stats.php", options, statsSuccessPlayed, statsFail);
}

function statsSuccessPlayed(response) {
    var arrObject = JSON.parse(response);
    var table = document.getElementById("most-played-media");

    let promise = new Promise(function(resolve,reject) {
        clearTable(table);
        resolve();
    });

    promise.then(() => {addToTable2(table,arrObject);});
}

export function getHistory() {
    var options = {
        method: 'POST',
        params: "table=history",
        contentType: 'application/x-www-form-urlencoded'
    }

    sendRequest("./php/get-stats.php", options, historySuccess, statsFail);
}

function historySuccess(response) {
    var arrObject = JSON.parse(response);
    var table = document.getElementById("history-table");

    let promise = new Promise(function(resolve,reject) {
        clearTable(table);
        resolve();
    });

    promise.then(() => {addToTable1(table,arrObject);});
}

function statsFail() {
    alert("заявката до базата беше неуспешна!");
}

