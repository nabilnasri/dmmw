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
function drawBricks() {
    var scaleX = canvas.FieldWidth() / playingField.FieldWidth;
    var scaleY = canvas.FieldHeight() / playingField.FieldHeight;
    var i, j;
    for (i = 0; i < playingField.nRows; i++) {
        canvas.Context().lineWidth = 2;
        for (j = 0; j < playingField.nCols; j++) {
            if (playingField.bricks[i][j] != 0) {
                var current_brick = playingField.bricks[i][j];
                current_brick.currentColor = colorpicker[j];
                rect(
                    canvas.Context(),
                    current_brick.xCoor * scaleX,
                    current_brick.yCoor * scaleY,
                    current_brick.brickWidth,
                    current_brick.brickHeight,
                    current_brick.currentColor
                );
            }
        }
    }
}

function drawPaddle(ctx, yCoor, player_paddle) {
    var scaleX = canvas.FieldWidth() / playingField.FieldWidth;
    var scaleY = canvas.FieldHeight() / playingField.FieldHeight;
    rect(
        ctx,
        player_paddle.xCoor * scaleX,
        yCoor * scaleY,
        player_paddle.PaddleWidth,
        player_paddle.PaddleHeight,
        player_paddle.PaddleColor
    );
}

function drawBall(ctx, player_ball) {

    var scaleX = canvas.FieldWidth() / playingField.FieldWidth;
    var scaleY = canvas.FieldHeight() / playingField.FieldHeight;
    circle(
        ctx,
        player_ball.xCoor * scaleX,
        player_ball.yCoor * scaleY,
        player_ball.radius,
        player_ball.color
    );
}

/*
Wie soll das Spielfeld aussehen?
 */
function setCanvasStyle(){
    canvas.Context().font = "80pt Impact";
    canvas.Context().textAlign = "center";
    canvas.Context().fillStyle = playingField.color;
    canvas.Context().lineWidth = 1;
}

/*
 Funktion "säubert" den "alten" Stand, damit "frisch" neu gezeichnet werden kann.
 */
function clear() {
    canvas.Context().clearRect(0, 0, canvas.FieldWidth(), canvas.FieldHeight());
    rect(canvas.Context(), 0, 0, canvas.FieldWidth(), canvas.FieldHeight(), canvas.color);
}


var canvasInit = function(){
    this.ele = document.getElementById("playground");

    this.Context = function(){
        return this.ele.getContext("2d");
    };

    this.FieldWidth = function(){
        return document.getElementsByTagName('canvas')[0].width;
    };

    this.FieldHeight = function(){
        return document.getElementsByTagName('canvas')[0].height;
    }
};

/*
Nötige Variablen, die vom Server kommen
 */
///START

var balls;
var paddles;
var bricks;
var colorpicker;
var playingField;
var canvas = new canvasInit();

////ENDE

function draw() {
    /*
    Um nicht immer die Variablen "auszuschreiben".
     */
    var ctx = canvas.Context();

    var player_one_ball = balls[0];
    var player_one_paddle = paddles[0];

    var player_two_ball = balls[1];
    var player_two_paddle = paddles[1];

    /*
    Canvas stylen.
     */
    setCanvasStyle();
    clear();
    //Zeichne alle "statischen" Sachen
    drawPaddle(ctx, playingField.FieldHeight - player_one_paddle.PaddleHeight, player_one_paddle);
    drawPaddle(ctx, 0, player_two_paddle);
    drawBall(ctx, player_one_ball);
    drawBall(ctx, player_two_ball);
    drawBricks();

    /*
    Geht nicht.
     */
    //player_two_paddle.checkRightDown();
    //player_two_paddle.checkLeftDown();


    /*
    Hier wird überprüft, ob noch Bricks vorhanden sind.
    Falls nicht, wird der MasterBrick gezeichnet.
     */
    //var bricks_available = canvas.bricksAvailable();
    //if(!bricks_available){
    //    animate(canvas);
    //}

    /*
    Alle möglichen Fälle, wohin der Ball dotzt werden hier überprüft.
    Die Logik dafür befindet sich in der Ball-Klasse
     */

    /*
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
    */

    /*
    Bewegung der Bälle
     */
    //player_one_ball.xCoor += player_one_ball.dx;
    //player_one_ball.yCoor += player_one_ball.dy;

    //player_two_ball.xCoor += player_two_ball.dx;
    //player_two_ball.yCoor += player_two_ball.dy;
}



/*
Animation des MasterBricks
 */
function animate() {
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
        canvas.Context(),
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