var handler = require('../../../communication/socket_request_handler');
var winston = require("winston");

/*
"Paddle-Klasse" - Logik für die Bewegung der Paddles
 */
exports.Paddle = function Paddle(x, color) {
    this.PaddleWidth = 100;
    this.PaddleHeight = 10;
    this.xCoor = x;
    this.PaddleColor = color;

    this.currentMotion = "stop";
    this.rightDown = false;
    this.leftDown = false;
};

/*
Tastatur Pfeil Rechts
 */
exports.Paddle.prototype.checkRightDown = function () {
    if (this.rightDown) {
        this.calculateMovementRight(10);
    }
};
/*
 Tastatur Pfeil Links
 */
exports.Paddle.prototype.checkLeftDown = function () {
    if (this.leftDown) {
        this.calculateMovementLeft(10);
    }
};

exports.Paddle.prototype.motionMove = function (direction, sio) {
    this.currentMotion = direction;
    if(this.currentMotion == "right"){
        this.calculateMovementRight(20);
        handler.sendPaddles(sio);
    }else if(this.currentMotion == "left"){
        this.calculateMovementLeft(20);
        handler.sendPaddles(sio);
    }
};

exports.Paddle.prototype.calculateMovementRight = function(move){
    if(this.xCoor + 10 > 500 - this.PaddleWidth + 10){
        move = 500 - this.PaddleWidth + 10 - this.xCoor;
    }
    this.xCoor += move;
};

exports.Paddle.prototype.calculateMovementLeft = function(move){
    if(this.xCoor - 10 < 0){
        move = this.xCoor;
    }
    this.xCoor -= move;
};