window.addEventListener("load", function () {

  var btn = document.getElementById("collapsible-button");
  var btn2 = document.getElementById("collapsible-button2");
  var btn3 = document.getElementById("collapsible-button3");

  btn.addEventListener('click', hideTable1);
  btn2.addEventListener('click', hideTable2);
  btn3.addEventListener('click', hideTable3);

  var rb1 = document.getElementById("history-clear-week");
  var rb2 = document.getElementById("history-clear-month");
  var rb3 = document.getElementById("history-clear-year");

  rb1.addEventListener('click',deselectOther);  
  rb2.addEventListener('click',deselectOther);  
  rb3.addEventListener('click',deselectOther);  

  var btn4 = document.getElementById("clear-radio-button");
  btn4.addEventListener('click',clearRadio);

});

function hideTable1() {
  var content = document.getElementById("collapsible-content");

  if (content.style.display === "block" || content.style.display === "") {
    content.style.display = "none";
  } else {
    content.style.display = "block";
  }

}

function hideTable2() {
  var content = document.getElementById("collapsible-content2");

  if (content.style.display === "block" || content.style.display === "") {
    content.style.display = "none";
  } else {
    content.style.display = "block";
  }
}

function hideTable3() {
  var content = document.getElementById("collapsible-content3");

  if (content.style.display === "block" || content.style.display === "") {
    content.style.display = "none";
  } else {
    content.style.display = "block";
  }
}

function clearRadio() {
  var rb1 = document.getElementById("history-clear-week");
  var rb2 = document.getElementById("history-clear-month");
  var rb3 = document.getElementById("history-clear-year");

  rb1.checked = false;
  rb2.checked = false;
  rb3.checked = false;

}

function deselectOther(event) {
  var buttonID = event.target.id;
  
  var rb1 = document.getElementById("history-clear-week");
  var rb2 = document.getElementById("history-clear-month");
  var rb3 = document.getElementById("history-clear-year");

  if(buttonID == "history-clear-week") {
    rb2.checked = false;
    rb3.checked = false;
  }
  else if(buttonID == "history-clear-month") {
    rb1.checked = false;
    rb3.checked = false;
  }
  else {
    rb1.checked = false;
    rb2.checked = false;
  }

}