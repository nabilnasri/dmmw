var Brick = require("./brick");
var Ball = require("./ball");
var Paddle = require("./paddle");
var winston = require('winston');

/*
"Spielfeld-Klasse" - Hier werden die einzelnen Elemente(Ball, Paddle, Bricks) initialisiert.
 */
exports.PlayingField = function PlayingField(rows, cols) {
    this.FieldWidth = 500; //document.getElementsByTagName('canvas')[0].width;
    this.FieldHeight = 500; //document.getElementsByTagName('canvas')[0].height;
    this.nRows = rows;
    this.nCols = cols;
    this.color = "#2f241e";
    this.rowHeight = 0; //Wird in setBricks überschrieben
    this.colWidth = 0; //Wird in setBricks überschrieben
    this.bricks = this.setBricks();
    this.masterBrick = null;
    this.paddles = this.initPaddles();
    this.balls = this.initBalls();
    this.countDestroyedBricks = 0;
};


/*
Bricks werden initialisiert.
 */
exports.PlayingField.prototype.setBricks = function () {
    var i, j;
    var b;
    var brickWidthNoPadding = this.getFieldWidth() / this.getCols();
    var brickPadding = brickWidthNoPadding/6;
    var brickWidth = brickWidthNoPadding - brickPadding;
    //NACHTRÄGLICH: Um den rechten Abstand beim letzten Brick entgegen zu kommen
    brickPadding = brickPadding + (brickPadding/this.getCols());
    var brickHeight = brickWidth / 3;
    b = new Array(this.getRows());
    for (i = 0; i < this.getRows(); i++) {
        b[i] = new Array(this.getCols());
        for (j = 0; j < this.getCols(); j++) {
            var new_brick = new Brick.Brick(brickWidth, brickHeight, brickPadding);
            var xCoor = j * (new_brick.getWidth() + new_brick.getPadding());
            var offset = (this.getFieldHeight() - (this.getRows() * (new_brick.getHeight() + new_brick.getPadding()))) / 2;
            var yCoor = offset + i * (new_brick.getHeight() + new_brick.getPadding());
            if(i===0){
                yCoor = offset;
            }
            if(j===0){
                xCoor = j * new_brick.getWidth();
            }
            new_brick.xCoor = xCoor;
            new_brick.yCoor = yCoor;
            b[i][j] = new_brick;
        }
    }
    //RowHeight und ColWidth kann man erst nachträglich bestimmen, da die Bricks dynamisch sind.
    this.rowHeight = brickHeight + brickPadding;
    this.colWidth = brickWidth + brickPadding;

    return b;
};

/*
Funktion prüft ob Bricks verfügbar sind, wenn nicht, dann
wird der MasterBrick (s.o) initialisiert.
 */
exports.PlayingField.prototype.bricksAvailable = function(){
    var totalBricks = this.getRows()*this.getCols();

    var brickWidthNoPadding = this.getFieldWidth() / this.getCols();
    var brickPadding = brickWidthNoPadding/6;
    var brickWidth = brickWidthNoPadding - brickPadding;
    var brickHeight = brickWidth / 3;

    if(this.countDestroyedBricks==totalBricks){
        if(this.masterBrick == null){
            this.masterBrick = new Brick.Brick(brickWidth,brickHeight,brickPadding);
        }
        return false;
    }
    return true;

};

/*
Paddles für die zwei Spieler werden initialisiert.
 */
exports.PlayingField.prototype.initPaddles = function () {
    var p = {};
    p[0] = new Paddle.Paddle(this.FieldWidth / 2, "#009a80");
    p[1] = new Paddle.Paddle(this.FieldWidth / 2, "#fe5332");

    return p;
};


/*
 Bälle für die Spieler werden initialisiert.
 */
exports.PlayingField.prototype.initBalls = function () {
    var b = {};
    b[0] = new Ball.Ball("#009a80", this.getPaddle(0).xCoor + 10, 500, "one");
    b[1] = new Ball.Ball("#fe5332", this.getPaddle(1).xCoor + 10, 200, "two");

    return b;
};

exports.PlayingField.prototype.getRows = function () {

    return this.nRows;
};

exports.PlayingField.prototype.getCols = function () {
    return this.nCols;
};

exports.PlayingField.prototype.getBricks = function () {
    return this.bricks;
};

exports.PlayingField.prototype.getPaddle = function (paddle_id) {
    return this.paddles[paddle_id];
};

exports.PlayingField.prototype.getBall = function (ball_id) {
    return this.balls[ball_id];
};

exports.PlayingField.prototype.getFieldHeight = function () {
    return this.FieldHeight;
};

exports.PlayingField.prototype.getFieldWidth = function () {
    return this.FieldWidth;
};

exports.PlayingField.prototype.getRowHeight = function () {
    return this.rowHeight;
};

exports.PlayingField.prototype.getColWidth = function () {
    return this.colWidth;
};


exports.PlayingField.prototype.simulateGame = function () {
    var player_one_ball = this.getBall(0);
    var player_one_paddle = this.getPaddle(0);

    var player_two_ball = this.getBall(1);
    var player_two_paddle = this.getPaddle(1);
    player_one_ball.checkHitBrick(this);
    player_one_ball.checkHitRightBorder(this);
    player_one_ball.checkHitLeftBorder(this);
    //Ab hier ist die Reihenfolge wichtig. Ansonsten funktioniert das nicht
    player_one_ball.checkHitTopBorder();
    player_one_ball.checkOutside(this, 1);
    player_one_ball.checkHitPaddle(this, player_one_paddle, 1);
    ////////////////////////////////////////////////////////////////////////
    player_two_ball.checkHitBrick(this);
    player_two_ball.checkHitRightBorder(this);
    player_two_ball.checkHitLeftBorder(this);
    //Ab hier ist die Reihenfolge wichtig. Ansonsten funktioniert das nicht.
    player_two_ball.checkHitBottomBorder(this);
    player_two_ball.checkOutside(this, 2);
    player_two_ball.checkHitPaddle(this, player_two_paddle, 2);

    player_one_ball.xCoor += player_one_ball.dx;
    player_one_ball.yCoor += player_one_ball.dy;

    player_two_ball.xCoor += player_two_ball.dx;
    player_two_ball.yCoor += player_two_ball.dy;


};

