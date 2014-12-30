function breakout() {
    "use strict";
    var canvas = new PlayingField(1400, 650, 10, 10);
    var x = 1200,
        y = 500,
        dx = 1.5,
        dy = -4,
        i,
        j,
        row,
        col,
        rowheight,
        colwidth,
        paddlex,
        paddleh = 20,
        paddlew = 100,
        rightDown = false,
        leftDown = false,
        canvasMinX = 0,
        canvasMaxX = 0,
        intervalId = 0,
        bricks,
        BRICKWIDTH = 60,
        BRICKHEIGHT = 20,
        PADDING = 20,
        score = 0,
        ballr = 10,
        rowcolors = ["#9CF", "#9CF", "#C9F", "#C9F", "#F9C", "#F9C", "#FC9", "#FC9", "#CF9", "#CF9"],
        paddlecolor = "#ddd",
        ballcolor = "#ddd",
        backcolor = "#111";
    function circle(x, y, r) {
        canvas.getContext().beginPath();
        canvas.getContext().arc(x, y, r, 0, Math.PI * 2, true);
        canvas.getContext().closePath();
        canvas.getContext().fill();
    }
    function rect(x, y, w, h) {
        canvas.getContext().beginPath();
        canvas.getContext().rect(x, y, w, h);
        canvas.getContext().closePath();
        canvas.getContext().fill();
    }
    function clear() {
        canvas.getContext().clearRect(0, 0, canvas.FieldWidth, canvas.FieldHeight);
        rect(0, 0, canvas.FieldWidth, canvas.FieldHeight);
    }
    function drawbricks() {
        for (i = 0; i < canvas.getRows(); i++) {
            canvas.getContext().fillStyle = rowcolors[i];
            canvas.getContext().lineWidth = 2;
            for (j = 0; j < canvas.getCols(); j++) {
                if (bricks[i][j] === 1) {
                    rect((j * (BRICKWIDTH + PADDING)) + PADDING,
                        (i * (BRICKHEIGHT + PADDING)) + PADDING,
                        BRICKWIDTH, BRICKHEIGHT);
                }
            }
        }
    }
    function draw() {
        canvas.getContext().font = "80pt Impact";
        canvas.getContext().textAlign = "center";
        canvas.getContext().fillStyle = backcolor;
        canvas.getContext().strokeStyle = backcolor;
        canvas.getContext().lineWidth = 1;
        clear();
        canvas.getContext().fillStyle = ballcolor;
        circle(x, y, ballr);
        if (rightDown) {
            paddlex += 5;
        } else if (leftDown) {
            paddlex -= 5;
        }
        canvas.getContext().fillStyle = paddlecolor;
        rect(paddlex, canvas.FieldHeight-paddleh, paddlew, paddleh);
        drawbricks();
        rowheight = BRICKHEIGHT + PADDING;
        colwidth = BRICKWIDTH + PADDING;
        row = Math.floor(y / rowheight);
        col = Math.floor(x / colwidth);
        if (y < canvas.getRows() * rowheight && row >= 0 && col >= 0 && bricks[row][col] === 1) {
            dy = -dy;
            bricks[row][col] = 0;
            score++;
            document.getElementById("score").innerHTML = score;
            if (score === 100) {
                canvas.getContext().fillStyle = "#ddd";
                canvas.getContext().fillText("WIN", canvas.FieldWidth / 2, 505);
                window.clearInterval(intervalId);
            }
        }
        if (x + dx + ballr > canvas.FieldWidth || x + dx - ballr < 0) {
            dx = -dx;
        }
        if (y + dy - ballr < 0) {
            dy = -dy;
        } else if (y + dy + ballr > canvas.FieldHeight - paddleh) {
            if (x > paddlex && x < paddlex + paddlew) {
                dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
                dy = -dy;
            } else if (y + dy + ballr > canvas.FieldHeight) {
                window.clearInterval(intervalId);
            }
        }
        if (y + dy + ballr > canvas.FieldHeight) {
            canvas.getContext().fillStyle = "#ddd";
            canvas.getContext().fillText("FAIL", canvas.FieldWidth / 2, 505);
        }
        x += dx;
        y += dy;
    }
    function init() {
        paddlex = canvas.FieldWidth / 2;
        canvasMinX = $("#playground").offset().left;
        canvasMaxX = canvasMinX + canvas.FieldWidth;
        intervalId = window.setInterval(draw, 10);
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
            paddlex = Math.max(evt.pageX - canvasMinX - (paddlew / 2), 0);
            paddlex = Math.min(canvas.FieldWidth - paddlew, paddlex);
        }
    }
    $(document).mousemove(onMouseMove);
    function initbricks() {
        bricks = new Array(canvas.getRows());
        for (i = 0; i < canvas.getRows(); i++) {
            bricks[i] = new Array(canvas.getCols());
            for (j = 0; j < canvas.getCols(); j++) {
                bricks[i][j] = 1;
            }
        }
    }
    init();
    initbricks();
}
window.onload = function () {
    "use strict";
    breakout();
    document.getElementById("start").onclick = function () {
        breakout();
    };
};