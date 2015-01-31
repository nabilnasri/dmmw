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
    gamersSocket.on('playerJoinGame', playerJoinGame);
    gamersSocket.on('playerJoinGame', playerJoinGame);

    // Game Events
    //gamersSocket.on('motion', motionSocket);
    gamersSocket.on('gameData', gameDataSocket);
    gamersSocket.on('gamePause', gamePauseSocket);
    gamersSocket.on('keyMove', keyMoveSocket);
    gamersSocket.on('keyRelease', keyReleaseSocket);
    gamersSocket.on('brickColor', brickColorSocket);
};

/** ********************************
 *           HOST EVENTS           *
 * ****************************** **/

 /**
 * The 'random game' button was clicked and 'createNewRandomGame' event occurred.
 */
function createNewRandomGame(data) {
    // Create a unique Socket.IO Room
    var thisGameId = Math.floor( Math.random() * 90000) + 10000;

    //TODO gameId 5 stellig machen. 6 stellig mit 1 oder 2 dahinter um device zum jeweiligen user hinzuzufuegen!
    var playerSocketId = this.id;
    gm.addGame(thisGameId, serverSocket, gamersSocket);
    var playerNumber = gm.addUser(thisGameId, playerSocketId, data.username);

    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    this.emit('initUser', {
        gameId: thisGameId,
        mySocketId: playerSocketId,
        role: data.role,
        username: data.username,
        playernumber: playerNumber
    });

    //joint den User in den Loooom!
    this.join(thisGameId.toString());

    serverSocket.sockets.in(thisGameId).emit('updatePlayerInfos', {playerList: gm.getAllUsers(thisGameId)});
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

        var playerNumber = gm.addUser(gameId, playerSocketId, data.username);

        // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
        this.emit('initUser', {
            gameId: gameId,
            mySocketId: playerSocketId,
            role: data.role,
            username: data.username,
            playernumber: playerNumber
        });

        // Join the room
        this.join(data.gameId.toString());
        // Emit an event notifying the clients that the player has joined the room.
        serverSocket.sockets.in(data.gameId).emit('updatePlayerInfos', {playerList: gm.getAllUsers(gameId)});
    } else {
        winston.log('info', 'error in playerJoinGame(data) in socketActionsServer.js');
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

/** ********************************
 *           GAME EVENTS           *
 * ****************************** **/

function motionSocket(data) {
    gm.motionGame(data);
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