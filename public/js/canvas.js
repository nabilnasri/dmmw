function breakout() {
    "use strict";
    var x = 350,
        y = 500,
        dx = 1.5,
        dy = -4,
        i,
        j,
        row,
        col,
        rowheight,
        colwidth,
        canvas,
        ctx,
        WIDTH,
        HEIGHT,
        paddlex,
        paddleh = 20,
        paddlew = 100,
        rightDown = false,
        leftDown = false,
        canvasMinX = 0,
        canvasMaxX = 0,
        intervalId = 0,
        bricks,
        NROWS = 10,
        NCOLS = 20,
        BRICKWIDTH = 60,
        BRICKHEIGHT = 20,
        PADDING = 9.5,
        score = 0,
        ballr = 10,
        rowcolors = ["#9CF", "#9CF", "#C9F", "#C9F", "#F9C", "#F9C", "#FC9", "#FC9", "#CF9", "#CF9"],
        paddlecolor = "#ddd",
        ballcolor = "green",
        backcolor = "#111",
        //brickTrack = document.getElementById("brick"),
        paddleTrack = document.getElementById("paddle");
    function circle(x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
    function rect(x, y, w, h) {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
        ctx.fill();
    }
    function clear() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        rect(0, 0, WIDTH, HEIGHT);
    }
    function drawbricks() {
        for (i = 0; i < NROWS; i++) {
            ctx.fillStyle = rowcolors[i];
            ctx.lineWidth = 2;
            for (j = 0; j < NCOLS; j++) {
                if (bricks[i][j] === 1) {
                    rect((j * (BRICKWIDTH + PADDING)) + PADDING,
                        (i * (BRICKHEIGHT + PADDING)) + PADDING,
                        BRICKWIDTH, BRICKHEIGHT);
                }
            }
        }
    }
    function draw() {
        ctx.font = "80pt Impact";
        ctx.textAlign = "center";
        ctx.fillStyle = backcolor;
        ctx.strokeStyle = backcolor;
        ctx.lineWidth = 1;
        clear();
        ctx.fillStyle = ballcolor;
        circle(x, y, ballr);
        if (rightDown) {
            paddlex += 5;
        } else if (leftDown) {
            paddlex -= 5;
        }
        ctx.fillStyle = paddlecolor;
        rect(paddlex, HEIGHT-paddleh, paddlew, paddleh);
        drawbricks();
        rowheight = BRICKHEIGHT + PADDING;
        colwidth = BRICKWIDTH + PADDING;
        row = Math.floor(y / rowheight);
        col = Math.floor(x / colwidth);
        if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] === 1) {
            dy = -dy;
            bricks[row][col] = 0;
            score++;
            document.getElementById("score").innerHTML = score;
            if (score === 100) {
                ctx.fillStyle = "#ddd";
                ctx.fillText("WIN", WIDTH / 2, 505);
                window.clearInterval(intervalId);
            }
        }
        if (x + dx + ballr > WIDTH || x + dx - ballr < 0) {
            dx = -dx;
        }
        if (y + dy - ballr < 0) {
            dy = -dy;
        } else if (y + dy + ballr > HEIGHT - paddleh) {
            if (x > paddlex && x < paddlex + paddlew) {
                dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
                dy = -dy;
                paddleTrack.play();
            } else if (y + dy + ballr > HEIGHT) {
                window.clearInterval(intervalId);
            }
        }
        if (y + dy + ballr > HEIGHT) {
            ctx.fillStyle = "#ddd";
            ctx.fillText("FAIL", WIDTH / 2, 505);
        }
        x += dx;
        y += dy;
    }
    function init() {
        canvas = document.getElementById("playground");
        ctx = canvas.getContext("2d");
        WIDTH = canvas.width;
        HEIGHT = canvas.height;
        paddlex = WIDTH / 2;
        canvasMinX = $("#playground").offset().left;
        console.log(canvasMinX + "min");
        canvasMaxX = canvasMinX + WIDTH;
        console.log(canvasMaxX + "max");
        intervalId = window.setInterval(draw, 10);
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
            paddlex = Math.min(WIDTH - paddlew, paddlex);
        }
    }
    $(document).mousemove(onMouseMove);
    function initbricks() {
        bricks = new Array(NROWS);
        for (i = 0; i < NROWS; i++) {
            bricks[i] = new Array(NCOLS);
            for (j = 0; j < NCOLS; j++) {
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