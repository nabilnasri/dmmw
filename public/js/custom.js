function fullscreen(){
    var canvas = document.getElementById('playground');

    if(canvas.webkitRequestFullScreen) {
        canvas.webkitRequestFullScreen();

    } else {
        canvas.mozRequestFullScreen();
    }
        canvas.height = window.screen.availHeight;
        canvas.width = window.screen.availWidth * (2/3);
}

document.getElementById('fullscreen').addEventListener("click",fullscreen);

$("#player-one").css("margin-top", ($("#playground").height()-$("#player-one").height()/2));