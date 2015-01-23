var game = require('../game/game');
var gameInfo = {};

module.exports =
{
    sendComplete: function sendComplete(sio){
        game.Dmmw.getInstance().init(); //Spiel initialisieren
        gameInfo["game"] = game.Dmmw.getInstance(); //Spiel ins dictionary packen
        sio.sockets.emit('gameInfo', {game: gameInfo["game"]});
    },

    sendBalls: function sendBalls(sio){
        gameInfo["balls"] = game.Dmmw.getInstance().playingField.balls;
        sio.sockets.emit('gameBalls', {balls: gameInfo["balls"]});
    },

    sendPaddles: function sendPaddles(sio){
        gameInfo["paddles"] = game.Dmmw.getInstance().playingField.paddles;
        sio.sockets.emit('gamePaddles', {paddles: gameInfo["paddles"]});
    },

    sendBrickCoordinates: function sendBrickCoordinates(sio, row, col){
        sio.sockets.emit('gameBricks', {row: row, col:col});
    },

    sendMasterBrick: function sendMasterBrick(sio, masterBrick){
        sio.sockets.emit('gameMasterBrick', {masterBrick: masterBrick});
    },

    sendColorpicker: function sendColorPicker(sio){
        gameInfo["colorpicker"] = game.Dmmw.getInstance().colorpicker;
        sio.sockets.emit('gameColorPicker', {colorpicker: gameInfo["colorpicker"]});
    },

    sendPoints: function sendPoints(sio, points, player){
        sio.sockets.emit('playerPoints', {points: points, player: player});
    }

};