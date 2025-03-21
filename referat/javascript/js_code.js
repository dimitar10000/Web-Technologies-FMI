function changeImage() {
    var image = document.getElementById("change-image");

    if (image.getAttribute('src') == "light-mode.png") {
        image.src = "dark-mode.png";
        document.body.style.background = "white";
        document.body.style.color = "black";
    }
    else {
        image.src = "light-mode.png";
        document.body.style.background = "black";
        document.body.style.color = "white";
    }
}