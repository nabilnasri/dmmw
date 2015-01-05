#!/usr/bin/env node
var debug = require('debug')('dmmw');
var app = require('../app');

app.set('port', process.env.PORT || 8082);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

var io = require('socket.io').listen(server);

// Websocket
io.sockets.on('connection', function (socket) {
    // der Client ist verbunden
    socket.emit('chat', {text: 'Du bist nun mit dem Server verbunden!'});
    // wenn ein Benutzer einen Text sendet
    socket.on('chat', function (data) {
        // so wird dieser Text an alle anderen Benutzer gesendet
        io.sockets.emit('chat', {text: data.text});
    });
});