var winston = require('winston');
var user = require('./Server_User');
var game = require('../../game');
var handler = require('../../../communication/socket_request_handler');

exports.GameHoster = function GameHost(gameId, serverSocket) {
    winston.log('info', 'GameHoster mit gameId ' + gameId + ' erstellt');
    this.gameId = gameId;
    this.serverSocket = serverSocket;
    this.userList = {};
    this.playerList = [];
    this.playerCounter = 0;
    this.hostCounter = 0;
};

/**
 * gibt game id zurueck
 * */
exports.GameHoster.prototype.getGameId = function () {
    return this.gameId;
};

/**
 * setzt neuen user im GameHoster und gibt die Spielernummern zurueck um auf der Client Seite
 * Punktezahl etc. richtig zu setzen
 * */
exports.GameHoster.prototype.setUser = function (role, playerSocketId, username) {
    winston.log("info", ['role: ', role, ' username: ', username].join(' '));
    if (role === 'host' && this.hostCounter <= 1) {
        var u = new user.Server_User(role, playerSocketId, username);
        this.hostCounter += 1;
        this.userList[this.hostCounter] = u;
        this.playerList.push(u);
        return this.hostCounter;
    } else if (role === 'player' && this.playerCounter <= 1) {
        var u = new user.Server_User(role, playerSocketId, username);
        this.playerCounter += 1;
        this.userList[this.playerCounter] = u;
        return this.playerCounter;
    } else {
        winston.log('error', 'FEHLER BEIM USER SETZEN');
        return null;
    }
};

/**
 * gibt Anzahl der angemeldeten user zurueck als dictionary zurueck
 * */
exports.GameHoster.prototype.userAmount = function () {
    return {
        playCounter: this.playCounter,
        hostCounter: this.hostCounter
    };
};

exports.GameHoster.prototype.playGame = function () {
    game.Dmmw.getInstance(this.gameId).playingField.simulateGame(this.serverSocket, this.gameId);
    game.Dmmw.getInstance(this.gameId).redraw(); //SHIFT ARRAY
};

exports.GameHoster.prototype.motion = function (data) {
    if (game.Dmmw.getInstance(this.gameId).playingField != null) {
        game.Dmmw.getInstance(this.gameId).playingField.getPaddle(0).motionMove(data.text, this.serverSocket, this.gameId)
    }
};

//MUSS SPÄTER AN DEN RAUM GESCHICKT WERDEN - Einmalig
exports.GameHoster.prototype.gameData = function () {
    if (!game.Dmmw.getInstance(this.gameId).running) {
        handler.sendComplete(this.serverSocket, this.gameId);
        game.Dmmw.getInstance(this.gameId).running = true;
        game.Dmmw.getInstance(this.gameId).intervallId = setInterval(this.playGame.bind(this), 25);
    }
};
exports.GameHoster.prototype.gamePause = function () {
    game.Dmmw.getInstance(this.gameId).pause = !game.Dmmw.getInstance(this.gameId).pause;

    if (game.Dmmw.getInstance(this.gameId).pause) {
        clearInterval(game.Dmmw.getInstance(this.gameId).intervallId);
    } else {
        game.Dmmw.getInstance(this.gameId).intervallId = setInterval(this.playGame.bind(this), 25);

    }
};

exports.GameHoster.prototype.keyMove = function (data) {
    if (data.direction == "right") {
        game.Dmmw.getInstance(this.gameId).playingField.getPaddle(1).rightDown = true;
    }
    if (data.direction == "left") {
        game.Dmmw.getInstance(this.gameId).playingField.getPaddle(1).leftDown = true;
    }

    handler.sendPaddles(this.serverSocket, this.gameId);
};


exports.GameHoster.prototype.keyRelease = function (data) {
    if (data.direction == "right") {
        game.Dmmw.getInstance(this.gameId).playingField.getPaddle(1).rightDown = false;
    }
    if (data.direction == "left") {
        game.Dmmw.getInstance(this.gameId).playingField.getPaddle(1).leftDown = false;
    }
    handler.sendPaddles(this.serverSocket, this.gameId);
};

exports.GameHoster.prototype.brickColor = function (data) {
    var row = data.row;
    var col = data.col;
    var brickColor = data.brickColor;
    game.Dmmw.getInstance(this.gameId).playingField.bricks[row][col].currentColor = brickColor;
};