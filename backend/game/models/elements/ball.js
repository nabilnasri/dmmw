var winston = require('winston');
var handler = require('../../../communication/socket_request_handler');

var game = require('../../game');

/*
"Ball-Klasse" - Hier wird die Bewegung festgelegt. Und die Logik, wo auch immer der Ball hin dotzt.
 */
exports.Ball = function Ball(color, xCoor, yCoor, player) {
    this.radius = 7;
    this.ballColor = color;
    this.xCoor = xCoor;
    this.yCoor = yCoor;
    this.dx = 1.5;
    this.dy = -4;

    //MUSS WEG
    this.player = player;
    this.score = 0;
};

/*
 BALL LOGIC --START--
 */
exports.Ball.prototype.checkHitBrick = function (playingField, sio) {
    var real_row = ((playingField.getFieldHeight() - ((playingField.getRowHeight() * playingField.getRows()))) / 2) / playingField.getRowHeight();
    var row = Math.floor(this.yCoor / playingField.getRowHeight() - real_row);
    var col = Math.floor(this.xCoor / playingField.getColWidth());
    var wallHeight = playingField.getRows() * playingField.getRowHeight();

    var b1 = false,
        b2 = false,
        b3 = false,
        b4 = false;

    if(!playingField.bricksAvailable()){
        var ballX = this.xCoor;
        //var ballY = this.getYCoor(playingField) * -1;
        var ballY = this.yCoor;
        var brickX = playingField.masterBrick.xCoor;
        var brickY = playingField.masterBrick.yCoor;
        var briHeight = playingField.masterBrick.brickHeight;
        var briwidth = playingField.masterBrick.brickWidth;
        winston.log("info", "#######################################");
        //b1 = brickX<=ballX && ballX<=(brickX+briwidth) && ballY >= brickY;
        //b2 = (brickY<=ballY && ballY <=(brickY+briHeight) && ballX >= brickX);
        //b3 = ((brickY+briHeight)<=ballX && ballX<=(brickY+briHeight+briwidth) && ballY <= (brickY+briHeight));
        //b4 = ((brickX+briwidth)<=ballY && ballY<=(brickX+briwidth+briHeight) && ballX<=(brickX+briwidth));
        //winston.log("info", "b1: " + b1 + " b2: " + b2+ " b3 " + b3 + " b4 "+ b4);
        winston.log("info", "ballX: " + ballX + " ballY: " + ballY);
        winston.log("info", "posx" + brickX + "posy" + brickY );
    }

    if (
        (
        row < playingField.getRows()
        && this.getYCoor(playingField) <= wallHeight
        && row >= 0
        && col >= 0
        && playingField.getBricks()[row][col] != 0
        )
        ||
        (
            playingField.masterBrick != null &&
            !playingField.bricksAvailable()
            &&
            (brickX<=ballX && ballX<= brickX+briwidth)
        )
    ){
        if(!playingField.bricksAvailable()){
            game.Dmmw.getInstance().pause = !game.Dmmw.getInstance().pause;

            if(game.Dmmw.getInstance().pause){
                clearInterval(game.Dmmw.getInstance().intervallIdsetInterval);
            }else{
                game.Dmmw.getInstance().intervallIdsetInterval = setInterval(playGame, 100);
            }
            winston.log("info", "BRICK GETROFFEN");
            return;
        }else{
            var points = playingField.getBricks()[row][col].getPoints();
            playingField.countDestroyedBricks+=1;
            playingField.getBricks()[row][col] = 0; //destroy Brick
            handler.sendBrickCoordinates(sio, row, col);
        }

        this.dy = -this.dy; //Ball dotzt zurueck



        //Ab hier muss anders gelöst werden!!
        if(this.player === "one"){
            handler.sendPoints(sio, points, "one");
        }else if(this.player === "two"){
            handler.sendPoints(sio, points, "two");
        }
    }

};

exports.Ball.prototype.checkHitRightBorder = function (playingField) {
    if (this.xCoor + this.dx + this.getRadius() > playingField.FieldWidth) {
        this.dx = -this.dx;
    }
};

exports.Ball.prototype.checkHitLeftBorder = function () {
    if (this.xCoor + this.dx - this.getRadius() < 0) {
        this.dx = -this.dx;
    }
};

exports.Ball.prototype.checkHitTopBorder = function () {
    if (this.yCoor + this.dy - this.getRadius() < 0) {
        this.dy = -this.dy;
    }
};

exports.Ball.prototype.checkHitBottomBorder = function (playingField) {
    if (this.yCoor + this.dy + this.getRadius() > playingField.FieldHeight) {
        this.dy = -this.dy;
    }
};

exports.Ball.prototype.checkHitPaddle = function (playingField, player_paddle, player) {
    if(player===1){
        if(this.yCoor + this.dy + this.getRadius() > playingField.FieldHeight - player_paddle.PaddleHeight){
            this.afterHittingPaddle(player_paddle);
        }
    }else{
        if(this.yCoor + this.dy + this.getRadius() < player_paddle.PaddleHeight + this.getRadius() - this.dy){
            this.afterHittingPaddle(player_paddle);
        }
    }
};

exports.Ball.prototype.afterHittingPaddle = function(player_paddle){
    if (this.xCoor > player_paddle.xCoor && this.xCoor < player_paddle.xCoor + player_paddle.PaddleWidth) {
        //BALL trifft PADDLE
        this.dx = 8 * ((this.xCoor - (player_paddle.xCoor + player_paddle.PaddleWidth / 2)) / player_paddle.PaddleWidth);
        this.dy = -this.dy; //SOLL zurück dotzen
    }
};

exports.Ball.prototype.checkOutside = function (playingField, player) {
    if(player===1){
        if (this.yCoor + this.dy + this.getRadius() > playingField.FieldHeight) {
            //BALL IST DRAUßEn / UNTERER RAND

            this.xCoor = playingField.getPaddle(0).xCoor + 10;
            this.yCoor = 300;
           // canvas.getContext().fillStyle = "#ddd";
           // canvas.getContext().fillText("FAIL", canvas.FieldWidth / 2, 505);
        }
    }else{
        if (this.yCoor + this.dy - this.getRadius() < 0) {
            //BALL IST DRAUßEn / OBERER RAND
            //window.clearInterval(intervalId);
            this.xCoor = playingField.getPaddle(1).xCoor + 10;
            this.yCoor = 200;
            //canvas.getContext().fillStyle = "#ddd";
            //canvas.getContext().fillText("FAIL", canvas.FieldWidth / 2, 505);
        }
    }
};
/*
 BALL LOGIC --END--
 */


exports.Ball.prototype.getYCoor = function (playingField) {
    return Math.floor(this.yCoor - (playingField.getFieldHeight() - (playingField.getRowHeight()*playingField.getRows()) / 2));
};

exports.Ball.prototype.getRadius = function () {
    return this.radius;
};

exports.Ball.prototype.getColor = function () {
    return this.ballColor;
};