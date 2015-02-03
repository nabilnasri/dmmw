var game = require('../game/game');
var winston = require('winston');
var gameInfo = {};

module.exports =
{
    sendComplete: function sendComplete(sio, gameId) {
        winston.log('info', ['spiel mit gameid ', gameId, ' wurde gestartet'].join(' '));
        game.Dmmw.getInstance(gameId).init(); //Spiel initialisieren
        gameInfo["game"] = game.Dmmw.getInstance(gameId); //Spiel ins dictionary packen
        sio.sockets.in(gameId).emit('gameInfo', {game: gameInfo["game"]});
    },

    sendBalls: function sendBalls(sio, gameId) {
        gameInfo["balls"] = game.Dmmw.getInstance(gameId).playingField.balls;
        sio.sockets.in(gameId).emit('gameBalls', {balls: gameInfo["balls"]});
    },

    sendPaddles: function sendPaddles(sio, gameId) {
        gameInfo["paddles"] = game.Dmmw.getInstance(gameId).playingField.paddles;
        sio.sockets.in(gameId).emit('gamePaddles', {paddles: gameInfo["paddles"]});
    },

    sendBrickCoordinates: function sendBrickCoordinates(sio, row, col, gameId, hasPowerUp, mobileSocketId) {
        sio.sockets.in(gameId).emit('gameBricks', {row: row, col: col});
        if (hasPowerUp){
            sio.sockets.to(mobileSocketId).emit('unlockedPowerUp');
        }
    },

    sendMasterBrick: function sendMasterBrick(sio, masterBrick, gameId) {
        sio.sockets.in(gameId).emit('gameMasterBrick', {masterBrick: masterBrick});
    },

    sendColorpicker: function sendColorPicker(sio, gameId) {
        gameInfo["colorpicker"] = game.Dmmw.getInstance(gameId).colorpicker;
        sio.sockets.in(gameId).emit('gameColorPicker', {colorpicker: gameInfo["colorpicker"]});
    },

    sendPoints: function sendPoints(sio, points, player, gameId) {
        sio.sockets.in(gameId).emit('playerPoints', {points: points, player: player});
    }

};