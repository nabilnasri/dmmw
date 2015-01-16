#!/usr/bin/env node
var debug = require('debug')('dmmw');
var app = require('../app');
var io = require('socket.io');

app.set('port', process.env.PORT || 8082);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

var sio = io.listen(server);

// jemand connectet zu unsere tollen Seite
sio.sockets.on('connection', function (socket) {
    // das an den client senden
    socket.emit('motion', {text: 'Du bist nun mit dem Server verbunden!'});
    // eingehende nachricht eines nutzers
    socket.on('motion', function (data) {
        // schickt an alle angemeldeten diese nachricht
        sio.sockets.emit('motion', {text: data.text});
    });
});