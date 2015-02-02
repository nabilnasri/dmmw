Draw = (function () {
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

function Drawing() {
    this.canvas = new CanvasInit();
    this.gameInfo = GameInfo.getInstance(); //WIRD gesettet bei client Comm
    this.scaleX = 0;
    this.scaleY = 0;
}


Drawing.prototype.setScale = function () {
    if (this.canvas.FieldWidth() >= this.gameInfo.playingField.FieldWidth) {
        this.scaleX = this.canvas.FieldWidth() / this.gameInfo.playingField.FieldWidth;
    } else {
        this.scaleX = this.gameInfo.playingField.FieldWidth / this.canvas.FieldWidth();
    }

    if (this.canvas.FieldHeight() >= this.gameInfo.playingField.FieldHeight) {
        this.scaleY = this.canvas.FieldHeight() / this.gameInfo.playingField.FieldHeight;
    } else {
        this.scaleY = this.gameInfo.playingField.FieldHeight / this.canvas.FieldHeight();
    }
};

/*
 Funktion zeichnet einen Kreis.
 Benötigt als erstes Attribut einen Context, um
 darin zeichnen zu können.
 */
Drawing.prototype.circle = function (ctx, x, y, r, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
};

/*
 Funktion zeichnet ein Rechteck.
 Wird verwendet fuer Bricks, Paddle.
 Benötigt einen Context, um da rein zeichnen zu können.
 */
Drawing.prototype.rect = function (ctx, x, y, w, h, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
};

/*
 Funktion zeichnet ein Rechteck.
 Wird verwendet fuer Paddle.
 Benötigt einen Context, um da rein zeichnen zu können.
 */
Drawing.prototype.rect2 = function (ctx, x, y, w, h, color) {
    ctx.beginPath();
    var scaledFieldWidth = this.gameInfo.playingField.FieldWidth * this.scaleX;
    var gradient = ctx.createLinearGradient(scaledFieldWidth, y, w, h);
    for(var i = 0, j = 0; i < color.length; i++, j+=2){
        gradient.addColorStop(j / 10, color[j / 2]);
    }
    ctx.fillStyle = gradient;
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
};


/*
 Funktion zeichnet Bricks ins Feld.
 */
Drawing.prototype.drawBricks = function () {
    var i, j, current_brick;
    for (i = 0; i < this.gameInfo.playingField.nRows; i++) {
        this.canvas.Context().lineWidth = 2;
        for (j = 0; j < this.gameInfo.playingField.nCols; j++) {
            if (this.gameInfo.playingField.bricks[i][j] != 0) {
                current_brick = this.gameInfo.playingField.bricks[i][j];
                current_brick.currentColor = this.gameInfo.colorpicker[j];
                IO.sendBrickColor(i, j, current_brick.currentColor);
                this.rect(
                    this.canvas.Context(),
                    current_brick.xCoor * this.scaleX,
                    current_brick.yCoor * this.scaleY,
                    current_brick.brickWidth * this.scaleX,
                    current_brick.brickHeight * this.scaleY,
                    current_brick.currentColor
                );
            }
        }
    }
};

Drawing.prototype.drawPaddle = function (ctx, yCoor, player_paddle) {
    yCoor = yCoor * this.scaleY;
    if (yCoor < 0) {
        yCoor = 0;
    }
    this.rect2(
        ctx,
        player_paddle.xCoor * this.scaleX,
        yCoor,
        player_paddle.PaddleWidth * this.scaleX,
        player_paddle.PaddleHeight * this.scaleY,
        player_paddle.PaddleColor
    );
};

Drawing.prototype.drawBall = function (ctx, player_ball) {
    this.circle(
        ctx,
        player_ball.xCoor * this.scaleX,
        player_ball.yCoor * this.scaleY,
        player_ball.radius,
        player_ball.ballColor
    );
    for (var j = 0;j < player_ball.particles.length;j++) {
        var p = player_ball.particles[j];
        ctx.beginPath();
        // Deckkraft geht gegen 0 am Ende eines Partikels
        p.opacity = Math.round(p.remainingLife / p.life * 100) / 100;
        // gradient (wortwörtlich -> Steigung) aber siehe Wikipedia fuer Erklaerung
        var gradient = ctx.createRadialGradient(p.x * this.scaleX, p.y * this.scaleY, 0, p.x * this.scaleX, p.y * this.scaleY, 1.2 * player_ball.radius);
        gradient.addColorStop(0, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
        gradient.addColorStop(0.5, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", " + p.opacity + ")");
        gradient.addColorStop(1, "rgba(" + p.r + ", " + p.g + ", " + p.b + ", 0)");
        ctx.fillStyle = gradient;
        ctx.arc(p.x * this.scaleX, p.y * this.scaleY, p.radius, 2 * Math.PI, !1);
        ctx.fill();
    }

};

/*
 Wie soll das Spielfeld aussehen?
 */
Drawing.prototype.setCanvasStyle = function () {
    this.canvas.Context().font = "80pt Impact";
    this.canvas.Context().textAlign = "center";
    this.canvas.Context().lineWidth = 1;
};

/*
 Funktion "säubert" den "alten" Stand, damit "frisch" neu gezeichnet werden kann.
 */
Drawing.prototype.clear = function () {
    this.canvas.Context().clearRect(0, 0, this.canvas.FieldWidth(), this.canvas.FieldHeight());
    this.rect(this.canvas.Context(), 0, 0, this.canvas.FieldWidth(), this.canvas.FieldHeight(), "rgba(0,0,0,0.7");
};

Drawing.prototype.draw = function () {
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
    this.drawPaddle(ctx, this.gameInfo.playingField.FieldHeight - player_one_paddle.PaddleHeight , player_one_paddle);
    this.drawPaddle(ctx, 0, player_two_paddle);
    this.drawBall(ctx, player_one_ball);
    this.drawBall(ctx, player_two_ball);
    if (this.gameInfo.bricksAvailable) {
        this.drawBricks();
    } else {
        this.animate();
    }
};


/*
 Animation des MasterBricks
 */
Drawing.prototype.animate = function () {
    //Hier wird der Brick gezeichnet.
    var masterBrick = this.gameInfo.masterBrick;
    //var color = this.gameInfo.colorpicker[Math.floor(Math.random()*this.gameInfo.colorpicker.length)];
    this.rect(
        this.canvas.Context(),
        masterBrick.xCoor * this.scaleX,
        this.canvas.FieldHeight() / 2,
        masterBrick.brickWidth * this.scaleX,
        masterBrick.brickHeight * this.scaleY,
        "#4183D7"
    );
};

/*
 Wenn Bricks getroffen werden, werden die "ausgefadet"
 */
Drawing.prototype.fadingOut = function (brick) {
    var xCorr = brick.xCoor * this.scaleX;
    var yCorr = brick.yCoor * this.scaleY;
    var width = brick.brickWidth * this.scaleX;
    var height = brick.brickHeight * this.scaleY;
    var rgb = hexToRgb(brick.currentColor);

    var r = rgb["r"];
    var g = rgb["g"];
    var g = rgb["g"];
    var b = rgb["b"];
    var steps = 10;
    var dr = (255 - r); // steps
    var dg = (255 - g);
    var db = (255 - b);

    var i = 0;
    var ctx = this.canvas.Context();
    var interval = setInterval(function () {
        ctx.fillStyle = 'rgb(' + Math.round(r + dr * i) + ','
        + Math.round(g + dg * i) + ','
        + Math.round(b + db * i) + ')';
        ctx.fillRect(xCorr, yCorr, width, height);
        i++;
        if (i === steps) {
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


function CanvasInit() {
    this.ele = document.getElementById("playground");

    this.Context = function () {
        return this.ele.getContext("2d");
    };

    this.FieldWidth = function () {
        return document.getElementsByTagName('canvas')[0].width;
    };

    this.FieldHeight = function () {
        return document.getElementsByTagName('canvas')[0].height;
    }
}