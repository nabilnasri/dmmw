function breakout() {
    var nyan = document.getElementById("nyan");
    var canvas = new PlayingField(555, 600, 5, 23);


    var intervalId = 0,
        canvasMinX = 0,
        canvasMaxX = 0;


    function init() {
        canvas.getPaddle(0).xCoor = canvas.FieldWidth / 2;
        canvas.getPaddle(1).xCoor = canvas.FieldWidth / 2;
        canvasMinX = $("#playground").offset().left;
        canvasMaxX = canvasMinX + canvas.FieldWidth;
        intervalId = window.setInterval(function() { draw(canvas,intervalId); }, 15 );
        return intervalId;
    }

    $(document).keydown(Paddle.onKeyDown);
    $(document).keyup(Paddle.onKeyUp);

    function onMouseMove(evt) {
        if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
            canvas.getPaddle(0).xCoor = Math.max(evt.pageX - canvasMinX - (canvas.getPaddle(0).PaddleWidth / 2), 0);
            canvas.getPaddle(1).xCoor = Math.max(evt.pageX - canvasMinX - (canvas.getPaddle(1).PaddleWidth / 2), 0);
            canvas.getPaddle(0).xCoor = Math.min(canvas.FieldWidth - canvas.getPaddle(0).PaddleWidth, canvas.getPaddle(0).xCoor);
            canvas.getPaddle(1).xCoor = Math.min(canvas.FieldWidth - canvas.getPaddle(1).PaddleWidth, canvas.getPaddle(0).xCoor);
        }
    }
    $(document).mousemove(onMouseMove);

    init();
}




window.onload = function () {
    //nyan.play();
    //breakout();
    drawIntroImage();
    document.getElementById("start").onclick = function () {
        //nyan.play();
        breakout();
    };
};
$(document).keyup(onKeyUp);

function drawIntroImage(){
    var img = document.getElementById("nyanImg");
    var pg = document.getElementById("playground");
    var ctx = pg.getContext("2d");
    ctx.drawImage(img, 0, 0, 555, 600);
}

function onKeyUp(evt) {
    if (evt.keyCode === 32) {
        breakout();
    }
}