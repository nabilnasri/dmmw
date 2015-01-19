#!/usr/bin/env node
var debug = require('debug')('dmmw');
var app = require('../app');
// Unser Spieleaufbau
var dmmwAction = require('./socketActionsServer');

app.set('port', process.env.PORT || 8082);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

var io = require('socket.io').listen(server);

// jemand connectet zu unsere tollen Seite
io.sockets.on('connection', function (socket) {
    //console.log('client connected');
    dmmwAction.initGame(io, socket);
});