#!/usr/bin/env node
var debug = require('debug')('dmmw');
var app = require('../app');
var io = require('socket.io');

var winston = require('winston');

app.set('port', process.env.PORT || 8082);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

var game = require('../game/game');
var sio = io.listen(server);
var handler = require('../communication/socket_request_handler');

function playGame(){
    game.Dmmw.getInstance().playingField.simulateGame(sio);
    game.Dmmw.getInstance().redraw(); //SHIFT ARRAY
}

sio.sockets.on('connection', function (socket) {
    socket.on('motion', function (data) {
        if(game.Dmmw.getInstance().playingField != null){
            game.Dmmw.getInstance().playingField.getPaddle(0).motionMove(data.text, sio)
        }
    });

    //MUSS SPÄTER AN DEN RAUM GESCHICKT WERDEN - Einmalig
    socket.on('gameData', function(){
        if(!game.Dmmw.getInstance().running){
            handler.sendComplete(sio);
            game.Dmmw.getInstance().running = true;
            game.Dmmw.getInstance().intervallIdsetInterval = setInterval(playGame, 25);
        }
    });

    socket.on('gamePause', function(){
        game.Dmmw.getInstance().pause = !game.Dmmw.getInstance().pause;

        if(game.Dmmw.getInstance().pause){
            clearInterval(game.Dmmw.getInstance().intervallIdsetInterval);
        }else{
            game.Dmmw.getInstance().intervallIdsetInterval = setInterval(playGame, 25);
        }
    });
    //////////////////////////////////

    socket.on('keyMove', function (data) {
        if(data.direction == "right"){
            game.Dmmw.getInstance().playingField.getPaddle(1).rightDown = true;
        }
        if(data.direction == "left"){
            game.Dmmw.getInstance().playingField.getPaddle(1).leftDown = true;
        }

        handler.sendPaddles(sio);
    });

    socket.on('keyRelease', function (data) {
        if(data.direction == "right"){
            game.Dmmw.getInstance().playingField.getPaddle(1).rightDown = false;
        }
        if(data.direction == "left"){
            game.Dmmw.getInstance().playingField.getPaddle(1).leftDown = false;
        }
        handler.sendPaddles(sio);
    });

    socket.on('brickColor', function(data){
        var row = data.row;
        var col = data.col;
        var brickColor = data.brickColor;
        game.Dmmw.getInstance().playingField.bricks[row][col].currentColor = brickColor;
    });
});