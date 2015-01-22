Draw = (function(){
    var drawing;

    function createInstance() {
        drawing = new Drawing();
        return drawing;
    }

    //Gibt die Instanz vom Spiel zurück
    return {
        getInstance: function () {
            if (!drawing) {
                drawing = createInstance();
            }
            return drawing;
        }
    };

})();

function Drawing(){
    this.canvas = new CanvasInit();
    this.gameInfo = GameInfo.getInstance(); //WIRD gesettet bei client Comm
    this.scaleX = 0;
    this.scaleY = 0;
}


Drawing.prototype.setScale = function(){
    this.scaleX = this.canvas.FieldWidth() / this.gameInfo.playingField.FieldWidth;
    this.scaleY = this.canvas.FieldHeight() / this.gameInfo.playingField.FieldHeight;
};

/*
 Funktion zeichnet einen Kreis.
 Benötigt als erstes Attribut einen Context, um
 darin zeichnen zu können.
 */
Drawing.prototype.circle = function(ctx, x, y, r, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
};

/*
 Funktion zeichnet ein Rechteck.
 Wird verwendet für Bricks, Paddle.
 Benötigt einen Context, um da rein zeichnen zu können.
 */
Drawing.prototype.rect = function(ctx, x, y, w, h, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
};

/*
 Funktion zeichnet Bricks ins Feld.
 */
Drawing.prototype.drawBricks = function() {
    var i, j;
    for (i = 0; i < this.gameInfo.playingField.nRows; i++) {
        this.canvas.Context().lineWidth = 2;
        for (j = 0; j < this.gameInfo.playingField.nCols; j++) {
            if (this.gameInfo.playingField.bricks[i][j] != 0) {
                var current_brick = this.gameInfo.playingField.bricks[i][j];
                current_brick.currentColor = this.gameInfo.colorpicker[j];
                sendBrickColor(i, j, current_brick.currentColor);
                //ToDO: Brickfarbe muss hochgeschickt werden
                this.rect(
                    this.canvas.Context(),
                    current_brick.xCoor * this.scaleX,
                    current_brick.yCoor * this.scaleY,
                    current_brick.brickWidth,
                    current_brick.brickHeight,
                    current_brick.currentColor
                );
            }
        }
    }
};

Drawing.prototype.drawPaddle = function(ctx, yCoor, player_paddle) {
    this.rect(
        ctx,
        player_paddle.xCoor * this.scaleX,
        yCoor * this.scaleY,
        player_paddle.PaddleWidth,
        player_paddle.PaddleHeight,
        player_paddle.PaddleColor
    );
};

Drawing.prototype.drawBall = function(ctx, player_ball) {
    this.circle(
        ctx,
        player_ball.xCoor * this.scaleX,
        player_ball.yCoor * this.scaleY,
        player_ball.radius,
        player_ball.ballColor
    );
};

/*
Wie soll das Spielfeld aussehen?
 */
Drawing.prototype.setCanvasStyle = function(){
    this.canvas.Context().font = "80pt Impact";
    this.canvas.Context().textAlign = "center";
    this.canvas.Context().lineWidth = 1;
};

/*
 Funktion "säubert" den "alten" Stand, damit "frisch" neu gezeichnet werden kann.
 */
Drawing.prototype.clear = function() {
    this.canvas.Context().clearRect(0, 0, this.canvas.FieldWidth(), this.canvas.FieldHeight());
    this.rect(this.canvas.Context(), 0, 0, this.canvas.FieldWidth(), this.canvas.FieldHeight(), "rgba(0,0,0,0.7");
};

Drawing.prototype.draw = function() {
    /*
    Um nicht immer die Variablen "auszuschreiben".
     */
    var ctx = this.canvas.Context();

    var player_one_ball = this.gameInfo.balls[0];
    var player_one_paddle = this.gameInfo.paddles[0];

    var player_two_ball = this.gameInfo.balls[1];
    var player_two_paddle = this.gameInfo.paddles[1];


    /*
    Canvas stylen.
     */
    this.setCanvasStyle();
    this.clear();
    //Zeichne alle "statischen" Sachen
    this.drawPaddle(ctx, this.gameInfo.playingField.FieldHeight - player_one_paddle.PaddleHeight, player_one_paddle);
    this.drawPaddle(ctx, 0, player_two_paddle);
    this.drawBall(ctx, player_one_ball);
    this.drawBall(ctx, player_two_ball);
    this.drawBricks();

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

};



/*
Animation des MasterBricks
 */
Drawing.prototype.animate = function() {
    var time = (new Date()).getTime();
    var amplitude = 150;
    var masterBrick = this.canvas.masterBrick;

    var period = 2000;  //Millisekunden
    var centerX = this.canvas.getFieldWidth() / 2 - masterBrick.getWidth() / 2;
    //Einfache Sinus-Funktion
    var nextX = amplitude * Math.sin(time * 2 * Math.PI / period) + centerX;
    masterBrick.xCoor = nextX;

    //Hier wird der Brick gezeichnet.
    this.rect(
        this.canvas.Context(),
        masterBrick.getXCoor(),
        this.canvas.getFieldHeight()/2,
        masterBrick.getWidth(),
        masterBrick.getHeight(),
        "#4183D7"
    );
};

/*
Wenn Bricks getroffen werden, werden die "ausgefadet"
 */
Drawing.prototype.fadingOut = function(brick){
    var xCorr = brick.xCoor * this.scaleX;
    var yCorr = brick.yCoor * this.scaleY;
    var width = brick.brickWidth;
    var height = brick.brickHeight;
    var rgb= hexToRgb(brick.currentColor);

    var r = rgb["r"];
    var g = rgb["g"];
    var b = rgb["b"];
    var steps = 10;
    var dr = (255 - r); // steps
    var dg = (255 - g);
    var db = (255 - b);

    var i = 0;
    var ctx = this.canvas.Context();
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
};

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}



function CanvasInit(){
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
}
