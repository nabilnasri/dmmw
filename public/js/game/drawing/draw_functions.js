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
Wie soll das Spielfeld aussehen?
 */
function setCanvasStyle(canvas){
    canvas.getContext().font = "80pt Impact";
    canvas.getContext().textAlign = "center";
    canvas.getContext().fillStyle = canvas.color;
    canvas.getContext().strokeStyle = canvas.color;
    canvas.getContext().lineWidth = 1;
}

/*
 Funktion "säubert" den "alten" Stand, damit "frisch" neu gezeichnet werden kann.
 */
function clear(canvas) {
    canvas.getContext().clearRect(0, 0, canvas.FieldWidth, canvas.FieldHeight);
    rect(canvas.getContext(), 0, 0, canvas.FieldWidth, canvas.FieldHeight, canvas.color);
}

function draw(canvas, intervalId, colorpicker) {
    /*
    Um nicht immer die Variablen "auszuschreiben".
     */
    var ctx = canvas.getContext();

    var player_one_ball = canvas.getBall(0);
    var player_one_paddle = canvas.getPaddle(0);

    var player_two_ball = canvas.getBall(1);
    var player_two_paddle = canvas.getPaddle(1);

    /*
    Canvas stylen.
     */
    setCanvasStyle(canvas);
    clear(canvas);

    //Zeichne alle "statischen" Sachen
    drawPaddle(ctx, canvas.FieldHeight - player_one_paddle.PaddleHeight, player_one_paddle);
    drawPaddle(ctx, 0, player_two_paddle);
    drawBall(ctx, player_one_ball);
    drawBall(ctx, player_two_ball);
    drawBricks(canvas, colorpicker);

    /*
    Geht nicht.
     */
    player_two_paddle.checkRightDown();
    player_two_paddle.checkLeftDown();


    /*
    Hier wird überprüft, ob noch Bricks vorhanden sind.
    Falls nicht, wird der MasterBrick gezeichnet.
     */
    var bricks_available = canvas.bricksAvailable();
    if(!bricks_available){
        animate(canvas);
    }

    /*
    Alle möglichen Fälle, wohin der Ball dotzt werden hier überprüft.
    Die Logik dafür befindet sich in der Ball-Klasse
     */
    player_one_ball.checkHitBrick(canvas);
    player_one_ball.checkHitRightBorder(canvas);
    player_one_ball.checkHitLeftBorder(canvas);
    //Ab hier ist die Reihenfolge wichtig. Ansonsten funktioniert das nicht
    player_one_ball.checkHitTopBorder();
    player_one_ball.checkOutside(canvas, intervalId, 1);
    player_one_ball.checkHitPaddle(canvas, player_one_paddle, 1);
    ////////////////////////////////////////////////////////////////////////
    player_two_ball.checkHitBrick(canvas);
    player_two_ball.checkHitRightBorder(canvas);
    player_two_ball.checkHitLeftBorder(canvas);
    //Ab hier ist die Reihenfolge wichtig. Ansonsten funktioniert das nicht.
    player_two_ball.checkHitBottomBorder(canvas);
    player_two_ball.checkOutside(canvas, intervalId, 2);
    player_two_ball.checkHitPaddle(canvas, player_two_paddle, 2);


    /*
    Bewegung der Bälle
     */
    player_one_ball.xCoor += player_one_ball.dx;
    player_one_ball.yCoor += player_one_ball.dy;

    player_two_ball.xCoor += player_two_ball.dx;
    player_two_ball.yCoor += player_two_ball.dy;
}



/*
Animation des MasterBricks
 */
function animate(canvas) {
    var time = (new Date()).getTime();
    var amplitude = 150;
    var masterBrick = canvas.masterBrick;

    var period = 2000;  //Millisekunden
    var centerX = canvas.getFieldWidth() / 2 - masterBrick.getWidth() / 2;
    //Einfache Sinus-Funktion
    var nextX = amplitude * Math.sin(time * 2 * Math.PI / period) + centerX;
    masterBrick.xCoor = nextX;

    //Hier wird der Brick gezeichnet.
    rect(
        canvas.getContext(),
        masterBrick.getXCoor(),
        canvas.getFieldHeight()/2,
        masterBrick.getWidth(),
        masterBrick.getHeight(),
        "#4183D7"
    );
}

/*
Wenn Bricks getroffen werden, werden die "ausgefadet"
 */
function fadingOut(ctx,brick){
    var xCorr = brick.getXCoor();
    var yCorr = brick.getYCoor();
    var width = brick.getWidth();
    var height = brick.getHeight();
    var rgb= hexToRgb(brick.getCurrentColor());

    var r = rgb["r"];
    var g = rgb["g"];
    var b = rgb["b"];
    var steps = 10;
    var dr = (255 - r); // steps
    var dg = (255 - g);
    var db = (255 - b);

    var i = 0;
    var interval = setInterval(function() {
        ctx.fillStyle = 'rgb(' + Math.round(r + dr * i) + ','
        + Math.round(g + dg * i) + ','
        + Math.round(b + db * i) + ')';
        ctx.fillRect(xCorr,yCorr,width,height);
        i++;
        if(i === steps) {
            clearInterval(interval);
        }
    }, 20);
}