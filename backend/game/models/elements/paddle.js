/*
"Paddle-Klasse" - Logik für die Bewegung der Paddles
 */
exports.Paddle = function Paddle(x, color) {
    this.PaddleWidth = 100;
    this.PaddleHeight = 10;
    this.xCoor = x;
    this.PaddleColor = color;

    this.rightDown = false;
    this.leftDown = false;
};

var winston = require("winston");

/*
Tastatur Pfeil Rechts
 */
exports.Paddle.prototype.checkRightDown = function () {
    if (this.rightDown) {
        var move = 10;
        if(this.xCoor + 10 > 500 - this.PaddleWidth + 10){
            move = 500 - this.PaddleWidth + 10 - this.xCoor;
        }
        this.xCoor += move;
    }
};
/*
 Tastatur Pfeil Links
 */
exports.Paddle.prototype.checkLeftDown = function () {
    var move = 10;
    if (this.leftDown) {
        if(this.xCoor - 10 < 0){
            move = this.xCoor;
        }
        this.xCoor -= move;
    }
};

