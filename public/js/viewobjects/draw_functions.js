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
function drawBricks(canvas) {
    var i, j;
    for (i = 0; i < canvas.getRows(); i++) {
        canvas.getContext().lineWidth = 2;
        for (j = 0; j < canvas.getCols(); j++) {
            if (canvas.bricks[i][j] instanceof Brick) {
                var current_brick = canvas.bricks[i][j];

                if(canvas.globalCounter % 2000 == 0){
                    //Rechtsshift
                    var colors = canvas.rowcolors;
                    canvas.rowcolors = colors.concat(colors.splice(0,colors.length - 1));
                }

                canvas.currentColor = calculateColColors(canvas, j);

                var xCoor = j * (current_brick.getWidth() + current_brick.getPadding());
                var offset = (canvas.getFieldHeight() - (canvas.getRows() * (current_brick.getHeight() + current_brick.getPadding()))) / 2;
                var yCoor = offset + i * (current_brick.getHeight() + current_brick.getPadding());
                if(i===0){
                    yCoor = offset;
                }
                if(j===0){
                    xCoor = j * current_brick.getWidth();
                }
                rect(
                    canvas.getContext(),
                    xCoor,
                    yCoor,
                    current_brick.getWidth(),
                    current_brick.getHeight(),
                    canvas.currentColor
                );
            }
        }
    }
}

function calculateColColors(canvas, col){
    var colors = canvas.rowcolors;
    var areas = Math.floor(canvas.getCols()/4);
    var rest = canvas.getCols() % 4;
    var d = {};

    var sum = 0;
    var c = 0;
    while(sum<=canvas.getCols()){
        sum += areas;
        if(sum > canvas.getCols()){
            sum -= areas;
            sum += rest;
            if(rest>0){
                d[sum] = colors[c];
            }
        }else{
            d[sum] = colors[c];
        }
        c+=1;
    }


    var keys = Object.keys(d);
    var found_key = 0;
    for (var i = 0; i <= keys.length; i++) {
        if(col <= keys[i]){
            found_key = keys[i];
            break;
        }
    }

    return d[found_key];



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

function draw(canvas, intervalId) {
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
    drawBricks(canvas);

    player_two_paddle.checkRightDown();
    player_two_paddle.checkLeftDown();


    //if (player_one_ball.checkHitBrick(canvas)) {
    //    document.getElementById("score").innerHTML = score;
    //    if (score === 100) {
    //        ctx.fillStyle = "#ddd";
    //        ctx.fillText("WIN", canvas.FieldWidth / 2, 505);
    //        window.clearInterval(intervalId);
    //    }
    //}
    //ToDo: Ermitteln für welchen Spieler wo der "Todesrand" ist.

    player_one_ball.checkHitBrick(canvas);
    player_one_ball.checkHitRightBorder(canvas);
    player_one_ball.checkHitLeftBorder(canvas);

    player_two_ball.checkHitBrick(canvas);
    player_two_ball.checkHitRightBorder(canvas);
    player_two_ball.checkHitLeftBorder(canvas);


    //Obere Rand für beide Spieler verschieden
    if (player_one_ball.yCoor + player_one_ball.dy - player_one_ball.getRadius() < 0) {
        //OBERER RAND
        player_one_ball.dy = -player_one_ball.dy;
    }
    else if (player_one_ball.hitPaddle(canvas, player_one_paddle)) {
        if (player_one_ball.xCoor > player_one_paddle.xCoor && player_one_ball.xCoor < player_one_paddle.xCoor + player_one_paddle.PaddleWidth) {
            //BALL trifft PADDLE
            player_one_ball.dx = 8 * ((player_one_ball.xCoor - (player_one_paddle.xCoor + player_one_paddle.PaddleWidth / 2)) / player_one_paddle.PaddleWidth);
            player_one_ball.dy = -player_one_ball.dy; //SOLL zurück dotzen
        }
        if (player_one_ball.yCoor + player_one_ball.dy + player_one_ball.getRadius() > canvas.FieldHeight) {
            //BALL IST DRAUßEn / UNTERER RAND
            window.clearInterval(intervalId);
            ctx.fillStyle = "#ddd";
            ctx.fillText("FAIL", canvas.FieldWidth / 2, 505);
            //nyan.pause();
            //nyan.currentTime = 0;
        }
    }

    if (player_two_ball.yCoor + player_two_ball.dy - player_two_ball.getRadius() < 0) {
        //OBERER RAND
        player_two_ball.dy = -player_two_ball.dy;
    }
    else if (player_two_ball.hitPaddle(canvas, player_two_paddle)) {
        if (player_two_ball.xCoor > player_two_paddle.xCoor && player_two_ball.xCoor < player_two_paddle.xCoor + player_two_paddle.PaddleWidth) {
            //BALL trifft PADDLE
            player_two_ball.dx = 8 * ((player_two_ball.xCoor - (player_two_paddle.xCoor + player_two_paddle.PaddleWidth / 2)) / player_two_paddle.PaddleWidth);
            player_two_ball.dy = -player_two_ball.dy; //SOLL zurück dotzen
        }
        if (player_two_ball.yCoor + player_two_ball.dy + player_two_ball.getRadius() > canvas.FieldHeight) {
            //BALL IST DRAUßEn / UNTERER RAND
            window.clearInterval(intervalId);
            ctx.fillStyle = "#ddd";
            ctx.fillText("FAIL", canvas.FieldWidth / 2, 505);
            //nyan.pause();
            //nyan.currentTime = 0;
        }
    }


    player_one_ball.xCoor += player_one_ball.dx;
    player_one_ball.yCoor += player_one_ball.dy;

    player_two_ball.xCoor += player_two_ball.dx;
    player_two_ball.yCoor += player_two_ball.dy;
}