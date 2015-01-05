function fullscreen() {
    var canvas = document.getElementById('playground');

    if (canvas.webkitRequestFullScreen) {
        canvas.webkitRequestFullScreen();

    } else {
        canvas.mozRequestFullScreen();
    }
    canvas.height = window.screen.availHeight;
    canvas.width = window.screen.availWidth * (2 / 3);
}

document.getElementById('fullscreen').addEventListener("click", fullscreen);

$("#playground-container").height(600);
$("#player-one").css("margin-top", ($("#playground-container").height() - $("#player-one").height()));

window.onload = function () {
    setCanvasProperties();
    drawIntroImage();
    document.getElementById("start").onclick = function () {
        startGame();
    };
};
$(document).keyup(onKeyUp);


function onKeyUp(evt) {
    if (evt.keyCode === 32) {
        startGame();
    }
}