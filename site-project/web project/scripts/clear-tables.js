import { sendRequest } from "./request.js";
import {getStatsLongest,getStatsPlayed, getHistory } from "./show-stats.js";

window.addEventListener("load", function() {
    var deleteButton1 = document.getElementById("clear-stats-button");
    deleteButton1.addEventListener('click', clearStats);

    var deleteButton2 = document.getElementById("clear-history-button");
    deleteButton2.addEventListener('click', clearHistory);
});

function clearStats(event) {
    event.preventDefault();

    if(!confirm("Сигурни ли сте? Това ще изтрие всички видеа в базата")) {
        return;
    }

    var options = {
        method: 'POST',
        params: "table=stats",
        contentType: 'application/x-www-form-urlencoded'
    }

    sendRequest("./php/clear-tables.php", options, clearSuccess, clearFail);
}

function clearHistory() {
    var customClearInput = document.getElementById("custom-history-clear-box").value;

    var radio1 = document.getElementById("history-clear-week");
    var radio2 = document.getElementById("history-clear-month");
    var radio3 = document.getElementById("history-clear-year");

    if(customClearInput === "" && !radio1.checked && !radio2.checked && !radio3.checked) {
        alert("Моля, въведете дни за изтриване или ползвайте бутон за маркиране");
        return;
    }

    if(customClearInput !== "" && (radio1.checked || radio2.checked || radio3.checked)) {
        alert("Моля, използвайте само 1 от двете функции за изтриване");
        return;
    }

    var period="";

    if(radio1.checked) {
        period = "week";
    }
    else if(radio2.checked) {
        period = "month";
    }
    else if(radio3.checked) {
        period = "year";
    }
    
    if(!confirm("Сигурни ли сте? Историята не може да се възстанови")) {
        return;
    }

    var options = {
        method: 'POST',
        params: "table=history" + "&customInput=" + customClearInput
        + "&period=" + period,
        contentType: 'application/x-www-form-urlencoded'
    }

    sendRequest("./php/clear-tables.php", options, clearSuccess, clearFail);
}

function clearSuccess(response) {
    getStatsLongest();
    getStatsPlayed();   
    getHistory();
}

function clearFail() {
    alert("проблем с изчистването на таблиците");
}