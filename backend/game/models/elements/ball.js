var winston = require('winston');
var Particle = require('./ball');
var handler = require('../../../communication/socket_request_handler');
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
    this.particles = [];
};
exports.Ball.prototype.createParticles = function() {
    for (var particles = [], counter = 0;counter < 25;counter++) {
        particles.push(new Particle.Particle(this));
    }
    this.particles = particles;
};

/*
 BALL LOGIC --START--
 */
exports.Ball.prototype.checkHitBrick = function (canvas, sio, gameId, mobileSocketId) {
    var real_row = ((canvas.getFieldHeight() - ((canvas.getRowHeight() * canvas.getRows()))) / 2) / canvas.getRowHeight();
    var row = Math.floor(this.yCoor / canvas.getRowHeight() - real_row);
    var col = Math.floor(this.xCoor / canvas.getColWidth());
    var wallHeight = canvas.getRows() * canvas.getRowHeight();
    if (
        (
        row < canvas.getRows()
        && this.getYCoor(canvas) <= wallHeight
        && row >= 0
        && col >= 0
        && canvas.getBricks()[row][col] != 0
        )
        ||
        (!canvas.bricksAvailable() && this.getYCoor(canvas) == canvas.masterBrick.getYCoor() && this.getXCoor() == canvas.masterBrick.getXCoor())
    ) {
        this.dy = -this.dy; //Ball dotzt zurueck
        var points = canvas.getBricks()[row][col].getPoints();
        canvas.countDestroyedBricks += 1;
        var hasPowerUp = canvas.getBricks()[row][col].getHasPowerUp();
        canvas.getBricks()[row][col] = 0; //destroy Brick
        handler.sendBrickCoordinates(sio, row, col, gameId, hasPowerUp, mobileSocketId);
        //Ab hier muss anders gelöst werden!!
        if (this.player === "one") {
            handler.sendPoints(sio, points, "one", gameId);
        } else if (this.player === "two") {
            handler.sendPoints(sio, points, "two", gameId);
        }
    }
};
exports.Ball.prototype.checkHitRightBorder = function (canvas) {
    if (this.xCoor + this.dx + this.getRadius() > canvas.FieldWidth) {
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
exports.Ball.prototype.checkHitBottomBorder = function (canvas) {
    if (this.yCoor + this.dy + this.getRadius() > canvas.FieldHeight) {
        this.dy = -this.dy;
    }
};
exports.Ball.prototype.checkHitPaddle = function (canvas, player_paddle, player) {
    if (player === 1) {
        if (this.yCoor + this.dy + this.getRadius() > canvas.FieldHeight - player_paddle.PaddleHeight) {
            this.afterHittingPaddle(player_paddle);
        }
    } else {
        if (this.yCoor + this.dy + this.getRadius() < player_paddle.PaddleHeight + this.getRadius() - this.dy) {
            this.afterHittingPaddle(player_paddle);
        }
    }
};
exports.Ball.prototype.afterHittingPaddle = function (player_paddle) {
    if (this.xCoor > player_paddle.xCoor && this.xCoor < player_paddle.xCoor + player_paddle.PaddleWidth) {
        //BALL trifft PADDLE
        this.dx = 8 * ((this.xCoor - (player_paddle.xCoor + player_paddle.PaddleWidth / 2)) / player_paddle.PaddleWidth);
        this.dy = -this.dy; //SOLL zurück dotzen
    }
};
exports.Ball.prototype.checkOutside = function (canvas, player, sio, mobilesocket, ballstate) {
    if (player === 1) {
        if (this.yCoor + this.dy + this.getRadius() > canvas.FieldHeight) {
            //BALL IST DRAUßEN / UNTERER RAND / PLAYER 0
            this.xCoor = canvas.getPaddle(0).xCoor + 10;
            this.yCoor = 350;
            sio.sockets.to(mobilesocket).emit('ballWasOutside', {ballstate: ballstate, playerNumber: 0});
        }
    } else {
        if (this.yCoor + this.dy - this.getRadius() < 0) {
            //BALL IST DRAUßEN / UNTERER RAND / PLAYER 1
            this.xCoor = canvas.getPaddle(1).xCoor + 10;
            this.yCoor = 150;
            sio.sockets.to(mobilesocket).emit('ballWasOutside', {ballstate: ballstate, playerNumber: 1});
        }
    }
};
/*
 BALL LOGIC --END--
 */
exports.Ball.prototype.getYCoor = function (canvas) {
    return Math.floor(this.yCoor - (canvas.getFieldHeight() - (canvas.getRowHeight() * canvas.getRows()) / 2));
};
exports.Ball.prototype.getRadius = function () {
    return this.radius;
};
exports.Ball.prototype.getColor = function () {
    return this.ballColor;
};
exports.Particle = function(ball) {
    this.x = ball.xCoor;
    this.y = ball.yCoor;
    this.radius = 10 + Math.random() * 20;  // radius zwischen = 10-30
    //this.life = 20 + Math.random() * 10;    // life zwischen = 20-30
    this.remainingLife = this.life = 20 + 10 * Math.random();         // Restleben

    if (ball.ballColor == "#009a80") {
        this.r = Math.round(192 * Math.random());       // davor 255
        this.g = Math.round(100 + 255 * Math.random());
        this.b = Math.round(170 * Math.random());       // davor 250
    }
    else {
        this.r = Math.round(139 + 255 * Math.random());
        this.g = Math.round(110 * Math.random()); //davor 228 gewesen
        this.b = Math.round(180 * Math.random()); //davor 225 gewesen
    }

};
