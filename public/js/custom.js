function fullscreen(){
    var canvas = document.getElementById('playground');

    if(canvas.webkitRequestFullScreen) {
        canvas.webkitRequestFullScreen();
        console.log("moin");

    } else {
        canvas.mozRequestFullScreen();
        console.log("moin moin");
    }
        canvas.height = window.screen.availHeight;
        //ibos intelligenter input (i^)
        canvas.width = window.screen.availWidth * (2/3);
}

document.getElementById('playground').addEventListener("click",fullscreen);
