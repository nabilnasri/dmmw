#!/usr/bin/env node
var debug = require('debug')('dmmw');
var app = require('../app');
var io = require('socket.io');
var winston = require('winston');
var socketServerAction = require('./socketActionsServer');
var gamesManager = require('../game/models/administration/GamesManager');

app.set('port', process.env.PORT || 8082);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

var sio = io.listen(server);
var gm = new gamesManager.Gamemanager();

sio.sockets.on('connection', function (socket) {
    socketServerAction.initGame(sio, socket, gm);
});