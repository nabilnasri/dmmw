function breakout() {
    "use strict";
    var nyan = document.getElementById("nyan");
    var canvas = new PlayingField(1400, 650, 6, 20);

    var row,
        col,
        intervalId = 0,
        rightDown = false,
        leftDown = false,
        canvasMinX = 0,
        canvasMaxX = 0,
        score = 0;

    function clear() {
        canvas.getContext().clearRect(0, 0, canvas.FieldWidth, canvas.FieldHeight);
        rect(canvas.getContext(), 0, 0, canvas.FieldWidth, canvas.FieldHeight, canvas.color);
    }

    function draw() {
        canvas.getContext().font = "80pt Impact";
        canvas.getContext().textAlign = "center";
        canvas.getContext().fillStyle = canvas.color;
        canvas.getContext().strokeStyle = canvas.color;
        canvas.getContext().lineWidth = 1;
        clear();
        canvas.getContext().fillStyle = canvas.getBall(0).getColor();
        circle(canvas.getContext(), canvas.getBall(0).xCoor, canvas.getBall(0).yCoor, canvas.getBall(0).getRadius());
        if (rightDown) {
            canvas.getPaddle(0).xCoor += 10;
        } else if (leftDown) {
            canvas.getPaddle(0).xCoor -= 10;
        }
        rect(
            canvas.getContext(),
            canvas.getPaddle(0).xCoor,
            canvas.FieldHeight-canvas.getPaddle(0).PaddleHeight,
            canvas.getPaddle(0).PaddleWidth,
            canvas.getPaddle(0).PaddleHeight,
            canvas.getPaddle(0).PaddleColor
        );
        rect(
            canvas.getContext(),
            canvas.getPaddle(1).xCoor,
            0,
            canvas.getPaddle(1).PaddleWidth,
            canvas.getPaddle(1).PaddleHeight,
            canvas.getPaddle(1).PaddleColor
        );
        drawBricks(canvas);
        row = Math.floor((canvas.getBall(0).yCoor / canvas.rowHeight) - 17);
        console.log(row + " ROOOOW");
        col = Math.floor(canvas.getBall(0).xCoor / canvas.colWidth);

        if (row < canvas.getRows() && canvas.getBall(0).getYCoor() < canvas.getRows() * canvas.rowHeight && row >= 0 && col >= 0 && canvas.getBricks()[row][col] instanceof Brick) {
            canvas.getBall(0).dy = -canvas.getBall(0).dy; //Ball dotzt zurueck
            console.log(row + " "+ col);
            canvas.getBricks()[row][col] = 0; //Brick zerstört
            score++;
            document.getElementById("score").innerHTML = score;
            if (score === 100) {
                canvas.getContext().fillStyle = "#ddd";
                canvas.getContext().fillText("WIN", canvas.FieldWidth / 2, 505);
                window.clearInterval(intervalId);
            }
        }

        if (canvas.getBall(0).xCoor + canvas.getBall(0).dx + canvas.getBall(0).getRadius() > canvas.FieldWidth || canvas.getBall(0).xCoor + canvas.getBall(0).dx - canvas.getBall(0).getRadius() < 0) {
            //RECHTER RAND
            canvas.getBall(0).dx = -canvas.getBall(0).dx;
        }
        if (canvas.getBall(0).yCoor + canvas.getBall(0).dy - canvas.getBall(0).getRadius() < 0) {
            //LINKER RAND
            canvas.getBall(0).dy = -canvas.getBall(0).dy;
        } else if (canvas.getBall(0).yCoor + canvas.getBall(0).dy + canvas.getBall(0).getRadius() > canvas.FieldHeight - canvas.getPaddle(0).PaddleHeight) {
            if (canvas.getBall(0).xCoor > canvas.getPaddle(0).xCoor && canvas.getBall(0).xCoor < canvas.getPaddle(0).xCoor + canvas.getPaddle(0).PaddleWidth) {
                //BALL trifft PADDLE
                canvas.getBall(0).dx = 8 * ((canvas.getBall(0).xCoor - (canvas.getPaddle(0).xCoor + canvas.getPaddle(0).PaddleWidth / 2)) / canvas.getPaddle(0).PaddleWidth);
                canvas.getBall(0).dy = -canvas.getBall(0).dy; //SOLL zurück dotzen
            } else if (canvas.getBall(0).yCoor + canvas.getBall(0).dy + canvas.getBall(0).getRadius() > canvas.FieldHeight) {
                window.clearInterval(intervalId);
            }
        }
        if (canvas.getBall(0).yCoor + canvas.getBall(0).dy + canvas.getBall(0).getRadius() > canvas.FieldHeight) {
            //BALL DRAUßEN
            canvas.getContext().fillStyle = "#ddd";
            canvas.getContext().fillText("FAIL", canvas.FieldWidth / 2, 505);
            //nyan.pause();
            //nyan.currentTime = 0;
        }
        canvas.getBall(0).xCoor += canvas.getBall(0).dx;
        canvas.getBall(0).yCoor += canvas.getBall(0).dy;
    }
    function init() {
        canvas.getPaddle(0).xCoor = canvas.FieldWidth / 2;
        canvas.getPaddle(1).xCoor = canvas.FieldWidth / 2;
        canvasMinX = $("#playground").offset().left;
        canvasMaxX = canvasMinX + canvas.FieldWidth;
        intervalId = window.setInterval(draw, 20);
        return intervalId;
    }
    function onKeyDown(evt) {
        if (evt.keyCode === 39) {
            rightDown = true;
        } else if (evt.keyCode === 37) {
            leftDown = true;
        }
    }
    function onKeyUp(evt) {
        if (evt.keyCode === 39) {
            rightDown = false;
        } else if (evt.keyCode === 37) {
            leftDown = false;
        }
    }
    $(document).keydown(onKeyDown);
    $(document).keyup(onKeyUp);
    function onMouseMove(evt) {
        if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
            canvas.getPaddle(0).xCoor = Math.max(evt.pageX - canvasMinX - (canvas.getPaddle(0).PaddleWidth / 2), 0);
            canvas.getPaddle(0).xCoor = Math.min(canvas.FieldWidth - canvas.getPaddle(0).PaddleWidth, canvas.getPaddle(0).xCoor);
        }
    }
    $(document).mousemove(onMouseMove);

    init();
}
window.onload = function () {
    "use strict";
    //nyan.play();
    breakout();
    document.getElementById("start").onclick = function () {
        //nyan.play();
        breakout();
    };
};