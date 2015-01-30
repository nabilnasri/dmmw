var winston = require('winston');

var serverSocket;
var gamersSocket;
var gm;

/**
 * Die Methode wird durch www.js aufgrufen
 *
 * @param sio ->socket lib
 * @param socket ->socket-object vom verbundenen client
 */
exports.initGame = function (sio, socket, gamesManager) {
    serverSocket = sio;
    gamersSocket = socket;
    gm = gamesManager;

    gamersSocket.emit('connected', {message: "Ahoi !"});

    // Host Events
    gamersSocket.on('createNewRandomGame', createNewRandomGame);
    gamersSocket.on('createNewPrivateGame', createNewPrivateGame);
    gamersSocket.on('hostRoomFull', hostPrepareGame);

    // Player Events
    gamersSocket.on('playerJoinGame', playerJoinGame);

    // Game Events
    //gamersSocket.on('motion', motion);
    gamersSocket.on('gameData', gameDataSocket);
    gamersSocket.on('gamePause', gamePauseSocket);
    gamersSocket.on('keyMove', keyMoveSocket);
    gamersSocket.on('keyRelease', keyReleaseSocket);
    gamersSocket.on('brickColor', brickColorSocket);
};

/**
 * The 'random game' button was clicked and 'createNewRandomGame' event occurred.
 */
function createNewRandomGame(data) {
    // Create a unique Socket.IO Room
    var thisGameId = ( Math.random() * 100000 ) | 0;
    var playerSocketId = this.id;
    gm.addGame(thisGameId, serverSocket, gamersSocket);
    gm.addUser(data.role, playerSocketId, thisGameId);

    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    this.emit('initUser', {
        gameId: thisGameId,
        mySocketId: playerSocketId,
        //playerNumber: playerNumber,
        role: data.role
    });

    //joint den User in den Loooom!
    this.join(thisGameId.toString());
}

function createNewPrivateGame() {

}


/**
 * A player clicked the 'START GAME' button.
 * Attempt to connect them to the room that matches
 * the gameId entered by the player.
 * @param data Contains data entered via player's input - playerName and gameId.
 */
function playerJoinGame(data) {
    var playerSocketId = this.id;
    var gameId = data.gameId;

    // Look up the room ID in the Socket.IO manager object.
    // If the room exists...
    if (serverSocket.sockets.adapter.rooms[data.gameId] != undefined) {
        winston.log('info', 'user joined dem room : ' + data.gameId);
        // attach the socket id to the data object.
        data.mySocketId = playerSocketId;

        gm.addUser(data.role, playerSocketId, gameId);

        // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
        this.emit('initUser', {
            gameId: gameId,
            mySocketId: playerSocketId,
            //playerNumber: playerNumber,
            role: data.role
        });

        // Join the room
        this.join(data.gameId.toString());
        // Emit an event notifying the clients that the player has joined the room.
        serverSocket.sockets.in(data.gameId).emit('playerJoinedRoom', data);

    } else {
        winston.log('info', 'error : ');
        // Otherwise, send an error m.essage back to the player.
        //this.emit('error',{message: "This room does not exist."} );
    }
}

/*
 * Two players have joined!
 * @param gameId The game ID / room ID
 */
function hostPrepareGame(gameId) {
    var sock = this;
    var data = {
        mySocketId: sock.id,
        gameId: gameId
    };

    //TODO stoesst beim host(s) die methode zum spielstart aus
    serverSocket.sockets.in(data.gameId).emit('beginNewGame', data);
}

function gameDataSocket(data) {
    gm.startGame(data.gameId);
}

function gamePauseSocket(data) {
    gm.pauseGame(data);
}

function keyMoveSocket(data) {
    gm.keyMoveGame(data);
}

function keyReleaseSocket(data) {
    gm.keyReleaseGame(data);
}

function brickColorSocket(data) {
    gm.brickColorGame(data);
}


/**
 * The game is over, and a player has clicked a button to restart the game.
 * @param data

 function playerRestart(data) {
    // console.log('Player: ' + data.playerName + ' ready for new game.');

    // Emit the player's data back to the clients in the game room.
    data.playerId = this.id;
    gamersSocket.sockets.in(data.gameId).emit('playerJoinedRoom',data);
}
 */