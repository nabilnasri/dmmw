var serverSocket;
var gamersSocket;
var gameManager = new Gamemanager();

/**
 * Die Methode wird durch www.js aufgerufen, um neue Game-Instanzen zu erzeugen.
 *
 * @param sio ->socket lib
 * @param socket ->socket-object vom verbundenen client
 */
exports.initGame = function(sio, socket){
    serverSocket = sio;
    gamersSocket = socket;
    gamersSocket.emit('connected', { message: "Ahoi !" });

    // Host Events
    gamersSocket.on('createNewGame', createNewGame);
    gamersSocket.on('hostRoomFull', hostPrepareGame);
    gamersSocket.on('hostCountdownFinished', hostStartGame);
    gamersSocket.on('hostNextRound', hostNextRound);

    // Player Events
    gamersSocket.on('playerJoinGame', playerJoinGame);
    gamersSocket.on('playerAnswer', playerAnswer);
    gamersSocket.on('playerRestart', playerRestart);
};

/* ***************************** *
 *          HOST ACTIONS         *
 * ***************************** */

/**
 * The 'START' button was clicked and 'createNewGame' event occurred.
 */
function createNewGame() {
    // Create a unique Socket.IO Room
    var thisGameId = ( Math.random() * 100000 ) | 0;
    var playerSockerId = this.id;
    gameManager.addGame(thisGameId);
    gameManager.setUser(thisGameId, playerSockerId);
    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    this.emit('newGameCreated', {gameId: thisGameId, mySocketId: playerSockerId});

    // Join the Room and wait for the players
    this.join(thisGameId.toString());
};


/**
 * A player clicked the 'START GAME' button.
 * Attempt to connect them to the room that matches
 * the gameId entered by the player.
 * @param data Contains data entered via player's input - playerName and gameId.
 */
function playerJoinGame(data) {
    //console.log('UserClient ' + data.playerName + 'versucht einen join in room: ' + data.gameId );

    // A reference to the player's Socket.IO socket object
    var sock = this;

    // Look up the room ID in the Socket.IO manager object.
    var room = gamersSocket.manager.rooms["/" + data.gameId];

    // If the room exists...
    if( room != undefined ){
        // attach the socket id to the data object.
        data.mySocketId = sock.id;

        // Join the room
        sock.join(data.gameId);

        //console.log('Player ' + data.playerName + ' joining game: ' + data.gameId );

        // Emit an event notifying the clients that the player has joined the room.
        serverSocket.sockets.in(data.gameId).emit('playerJoinedRoom', data);

    } else {
        // Otherwise, send an error message back to the player.
        this.emit('error',{message: "This room does not exist."} );
    }
}

/*
 * Two players have joined. Alert the host!
 * @param gameId The game ID / room ID
 */
function hostPrepareGame(gameId) {
    var sock = this;
    var data = {
        mySocketId : sock.id,
        gameId : gameId
    };
    //console.log("All Players Present. Preparing game...");
    //TODO stoesst beim host(s) die methode zum spielstart aus
    serverSocket.sockets.in(data.gameId).emit('beginNewGame', data);
}

/**
 * The game is over, and a player has clicked a button to restart the game.
 * @param data
 */
function playerRestart(data) {
    // console.log('Player: ' + data.playerName + ' ready for new game.');

    // Emit the player's data back to the clients in the game room.
    data.playerId = this.id;
    serverSocket.sockets.in(data.gameId).emit('playerJoinedRoom',data);
}