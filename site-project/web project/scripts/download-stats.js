import { downloadFile,isLink } from "./utility-functions.js";

window.addEventListener("load", function () {
    var exportButton1 = document.getElementById("export-longest");
    exportButton1.addEventListener('click', exportLongest);

    var exportButton2 = document.getElementById("export-played");
    exportButton2.addEventListener('click', exportPlayed);

    var exportButton3 = document.getElementById("export-history");
    exportButton3.addEventListener('click', exportHistory);

});

function exportLongest() {
    var table = document.getElementById("longest-played-media");
    var fileArray = [];

    var timeChecked = document.getElementById("checkbox-time-longest").checked;
    var watchedChecked = document.getElementById("checkbox-last-played-longest").checked;
    var linkChecked = document.getElementById("checkbox-link-longest").checked;

    for (var i = 0, row; row = table.rows[i]; i++) {
        var rowContent = "";
        if (i > 0) {
            rowContent += `${i}) `;
        }
        for (var j = 0, col; col = row.cells[j]; j++) {
            if ((j == 1 && !timeChecked) || (j == 2 && !watchedChecked)
                || (j == 3 && !linkChecked)) {
                continue;
            }
            if (i > 0 && j == 3 && linkChecked) {
                if (isLink(col.firstChild.innerHTML)) {
                    rowContent += col.firstChild.innerHTML + "    ";
                }
            }
            else {
                rowContent += col.innerHTML + "    ";
            }
        }
        fileArray.push(rowContent + '\n');
    }

    downloadFile(fileArray, "export-longest", "txt");
}

function exportPlayed() {
    var table = document.getElementById("most-played-media");
    var fileArray = [];

    var hitsChecked = document.getElementById("checkbox-hits-played").checked;
    var watchedChecked = document.getElementById("checkbox-last-played-played").checked;
    var linkChecked = document.getElementById("checkbox-link-played").checked;

    for (var i = 0, row; row = table.rows[i]; i++) {
        var rowContent = "";
        if (i > 0) {
            rowContent += `${i}) `;
        }
        for (var j = 0, col; col = row.cells[j]; j++) {
            if ((j == 1 && !hitsChecked) || (j == 2 && !watchedChecked)
                || (j == 3 && !linkChecked)) {
                continue;
            }
            if (i > 0 && j == 3 && linkChecked) {
                if (isLink(col.firstChild.innerHTML)) {
                    rowContent += col.firstChild.innerHTML + "    ";
                }
            }
            else {
                rowContent += col.innerHTML + "    ";
            }
        }
        fileArray.push(rowContent + '\n');
    }

    downloadFile(fileArray, "export-played", "txt");
}

function exportHistory() {
    var table = document.getElementById("history-table");
    var fileArray = [];

    var durChecked = document.getElementById("checkbox-duration-history").checked;
    var linkChecked = document.getElementById("checkbox-link-history").checked;

    for (var i = 0, row; row = table.rows[i]; i++) {
        var rowContent = "";
        for (var j = 0, col; col = row.cells[j]; j++) {
            if ((j == 2 && !durChecked) || (j == 3 && !linkChecked)) {
                continue;
            }
            if (i > 0 && j == 3 && linkChecked) {
                if (isLink(col.firstChild.innerHTML)) {
                    rowContent += col.firstChild.innerHTML + "    ";
                }
            }
            else {
                rowContent += col.innerHTML + "    ";
            }
        }
        fileArray.push(rowContent + '\n');
    }

    downloadFile(fileArray, "export-history", "txt");
}