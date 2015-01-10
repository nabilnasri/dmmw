function startGame() {
    var nyan = document.getElementById("nyan");
    var canvas = new PlayingField(8, 15);

    var intervalId = 0;
    var canvasMinX = 0;
    var canvasMaxX = 0;

    function init() {
        canvasMinX = $("#playground").offset().left;
        canvasMaxX = canvasMinX + canvas.FieldWidth;
        intervalId = window.setInterval(function () {
            canvas.globalCounter += 20;
            draw(canvas, intervalId);
        }, 15);
        return intervalId;
    }

    //$(document).keydown(Paddle.onKeyDown);
    //$(document).keyup(Paddle.onKeyUp);

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


function drawIntroImage(){
    var img = document.getElementById("nyanImg");
    var pg = document.getElementById("playground");

    var ctx = pg.getContext("2d");
    ctx.drawImage(img, 0, 0, 555, 600);
}

function setCanvasProperties(){
    var pg = $("#playground");
    var pg_parent = pg.parent();
    var canvas = document.getElementsByTagName('canvas')[0];
    canvas.width  = pg_parent.width();
    canvas.height = pg_parent.height();
}


function handleOrientation(event) {
    var x = event.beta;  // In degree in the range [-180,180]
    var y = event.gamma; // In degree in the range [-90,90]
}



window.addEventListener('deviceorientation', handleOrientation, true);
