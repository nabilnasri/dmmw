function startGame() {
    var nyan = document.getElementById("nyan");
    var canvas = new PlayingField(8, 15);

    var colorpicker = calculateColColors(canvas);
    var colorcounter = 0;

    var intervalId = 0;
    var canvasMinX = 0;
    var canvasMaxX = 0;

    function init() {
        canvasMinX = $("#playground").offset().left;
        canvasMaxX = canvasMinX + canvas.FieldWidth;
        intervalId = window.setInterval(function () {
            colorcounter += 20;
            if(colorcounter % 60 == 0){
                colorpicker = shiftRight(colorpicker);
            }
            draw(canvas, intervalId, colorpicker);
        }, 20);
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

    this.motionMove = function(direction) {
        if (direction == "right") {
            canvas.getPaddle(0).xCoor += 10;
        } else if (direction == "left") {
            canvas.getPaddle(0).xCoor -= 10;
        }
    };

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
