/*
 Funktion zeichnet einen Kreis.
 Benötigt als erstes Attribut einen Context, um
 darin zeichnen zu können.
 */
function circle(ctx, x, y, r, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

/*
 Funktion zeichnet ein Rechteck.
 Wird verwendet für Bricks, Paddle.
 Benötigt einen Context, um da rein zeichnen zu können.
 */
function rect(ctx, x, y, w, h, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

/*
 Funktion zeichnet Bricks ins Feld.
 */
function drawBricks(canvas, colorpicker) {
    var i, j;
    for (i = 0; i < canvas.getRows(); i++) {
        canvas.getContext().lineWidth = 2;
        for (j = 0; j < canvas.getCols(); j++) {
            if (canvas.bricks[i][j] instanceof Brick) {
                var current_brick = canvas.bricks[i][j];

                current_brick.currentColor = colorpicker[j];

                var xCoor = j * (current_brick.getWidth() + current_brick.getPadding());
                var offset = (canvas.getFieldHeight() - (canvas.getRows() * (current_brick.getHeight() + current_brick.getPadding()))) / 2;
                var yCoor = offset + i * (current_brick.getHeight() + current_brick.getPadding());
                if(i===0){
                    yCoor = offset;
                }
                if(j===0){
                    xCoor = j * current_brick.getWidth();
                }
                current_brick.xCoor = xCoor;
                current_brick.yCoor = yCoor;
                rect(
                    canvas.getContext(),
                    xCoor,
                    yCoor,
                    current_brick.getWidth(),
                    current_brick.getHeight(),
                    current_brick.getCurrentColor()
                );
            }
        }
    }
}

function drawPaddle(ctx, yCoor, player_paddle) {
    rect(
        ctx,
        player_paddle.xCoor,
        yCoor,
        player_paddle.PaddleWidth,
        player_paddle.PaddleHeight,
        player_paddle.PaddleColor
    );
}

function drawBall(ctx, player_ball) {
    circle(
        ctx,
        player_ball.xCoor,
        player_ball.yCoor,
        player_ball.getRadius(),
        player_ball.getColor()
    );
}


/*
 Funktion "säubert" den "alten" Stand, damit "frisch" neu gezeichnet werden kann.
 */
function clear(canvas) {
    canvas.getContext().clearRect(0, 0, canvas.FieldWidth, canvas.FieldHeight);
    rect(canvas.getContext(), 0, 0, canvas.FieldWidth, canvas.FieldHeight, canvas.color);
}

function draw(canvas, intervalId, colorpicker) {
    var ctx = canvas.getContext();

    var player_one_ball = canvas.getBall(0);
    var player_one_paddle = canvas.getPaddle(0);

    var player_two_ball = canvas.getBall(1);
    var player_two_paddle = canvas.getPaddle(1);

    ctx.font = "80pt Impact";
    ctx.textAlign = "center";
    ctx.fillStyle = canvas.color;
    ctx.strokeStyle = canvas.color;
    ctx.lineWidth = 1;
    clear(canvas);


    //Zeichne alle "statischen" Sachen
    drawPaddle(ctx, canvas.FieldHeight - player_one_paddle.PaddleHeight, player_one_paddle);
    drawPaddle(ctx, 0, player_two_paddle);
    drawBall(ctx, player_one_ball);
    drawBall(ctx, player_two_ball);
    drawBricks(canvas, colorpicker);

    player_two_paddle.checkRightDown();
    player_two_paddle.checkLeftDown();

    var bricks_available = canvas.bricksAvailable();
    if(!bricks_available){
        animate(canvas.masterBrick,canvas);
    }
    player_one_ball.checkHitBrick(canvas);
    player_one_ball.checkHitRightBorder(canvas);
    player_one_ball.checkHitLeftBorder(canvas);
    //-- Reihenfolge WICHTIG!--
    player_one_ball.checkHitTopBorder();
    player_one_ball.checkOutside(canvas, intervalId, 1);
    player_one_ball.checkHitPaddle(canvas, player_one_paddle, 1);

    player_two_ball.checkHitBrick(canvas);
    player_two_ball.checkHitRightBorder(canvas);
    player_two_ball.checkHitLeftBorder(canvas);
    //-- Reihenfolge WICHTIG!--
    player_two_ball.checkHitBottomBorder(canvas);
    player_two_ball.checkOutside(canvas, intervalId, 2);
    player_two_ball.checkHitPaddle(canvas, player_two_paddle, 2);


    player_one_ball.xCoor += player_one_ball.dx;
    player_one_ball.yCoor += player_one_ball.dy;

    player_two_ball.xCoor += player_two_ball.dx;
    player_two_ball.yCoor += player_two_ball.dy;
}




function animate(masterBrick, canvas) {
    // update
    var time = (new Date()).getTime();
    var amplitude = 150;

    // in ms
    var period = 2000;
    var centerX = canvas.getFieldWidth() / 2 - masterBrick.getWidth() / 2;
    var nextX = amplitude * Math.sin(time * 2 * Math.PI / period) + centerX;
    masterBrick.xCoor = nextX;
    // draw
    rect(canvas.getContext(), masterBrick.getXCoor(), canvas.getFieldHeight()/2, masterBrick.getWidth(), masterBrick.getHeight(), "#4183D7");


}