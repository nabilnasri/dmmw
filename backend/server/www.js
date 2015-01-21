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


function playGame(){
    var gameInfo = {};
    game.Dmmw.getInstance().playingField.simulateGame();
    gameInfo["game"] = game.Dmmw.getInstance(); //Spiel ins dictionary packen
    sio.sockets.emit('gameInfo', {game: gameInfo["game"]}); //Spiel absenden
}



sio.sockets.on('connection', function (socket) {
    // das an den client senden
    socket.emit('motion', {text: 'Du bist nun mit dem Server verbunden!'});
    // eingehende nachricht eines nutzers
    socket.on('motion', function (data) {
        // schickt an alle angemeldeten diese nachricht
        sio.sockets.emit('motion', {text: data.text});
    });

    //MUSS SPÄTER AN DEN RAUM GESCHICKT WERDEN - Einmalig
    socket.on('gameData', function(){
        var gameInfo = {};
        game.Dmmw.getInstance().init(); //Spiel initialisieren
        gameInfo["game"] = game.Dmmw.getInstance(); //Spiel ins dictionary packen
        sio.sockets.emit('gameInfo', {game: gameInfo["game"]}); //Spiel absenden
        setInterval(playGame, 10*20);
    });

});