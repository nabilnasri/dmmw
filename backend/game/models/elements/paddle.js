var handler = require('../../../communication/socket_request_handler');

/*
 "Paddle-Klasse" - Logik für die Bewegung der Paddles
 */
exports.Paddle = function Paddle(x, color) {
    this.PaddleWidth = 100;
    this.PaddleHeight = 10;
    this.xCoor = x;
    this.PaddleColor = color;
    this.currentMotion = "stop";
};

/**
 * bekommt rechts oder links Befehl und fuehrt dann
 * die entsprechende Funktion aus
 */
exports.Paddle.prototype.motionMove = function (sio, gameId) {
    if (this.currentMotion == "right") {
        this.calculateMovementRight(10);
        handler.sendPaddles(sio, gameId);
    } else if (this.currentMotion == "left") {
        this.calculateMovementLeft(10);
        handler.sendPaddles(sio, gameId);
    }
};

/**
 * berechnet ob Bewegung nach rechts moeglich ist und bewegt dann
 */
exports.Paddle.prototype.calculateMovementRight = function (move) {
    if (this.xCoor + 10 > 500 - this.PaddleWidth + 10) {
        move = 500 - this.PaddleWidth + 10 - this.xCoor;
    }
    this.xCoor += move;
};
/**
 * berechnet ob Bewegung nach links moeglich ist und bewegt dann
 */
exports.Paddle.prototype.calculateMovementLeft = function (move) {
    if (this.xCoor - 10 < 0) {
        move = this.xCoor;
    }
    this.xCoor -= move;
};