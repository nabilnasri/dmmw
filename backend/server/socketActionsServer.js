var serverSocket;
var gamersSocket;
var gm;

var game = require('../game/game');
var handler = require('../communication/socket_request_handler');

/**
 * Die Methode wird durch www.js aufgrufen
 *
 * @param sio ->socket lib
 * @param socket ->socket-object vom verbundenen client
 */
exports.initGame = function(sio, socket, gamesManager){
    serverSocket = sio;
    gamersSocket = socket;
    gm = gamesManager;


    gamersSocket.emit('connected', { message: "Ahoi !" });

    // Host Events
    gamersSocket.on('createNewRandomGame', createNewRandomGame);
    gamersSocket.on('createNewPrivateGame', createNewPrivateGame);
    gamersSocket.on('hostRoomFull', hostPrepareGame);

    // Player Events
    gamersSocket.on('playerJoinGame', playerJoinGame);
    gamersSocket.on('motion', motion);
    gamersSocket.on('gameData', gameData);
    gamersSocket.on('gamePause', gamePause);
    gamersSocket.on('keyMove', keyMove);
    gamersSocket.on('keyRelease', keyRelease);
    gamersSocket.on('brickColor', brickColor);
};

/**
 * The 'random game' button was clicked and 'createNewRandomGame' event occurred.
 */
function createNewRandomGame(data) {
    // Create a unique Socket.IO Room
    var thisGameId = ( Math.random() * 100000 ) | 0;
    var playerSocketId = this.id;
    gm.addGame(thisGameId);
    var playerNumber = gm.setUser(thisGameId, data.role, playerSocketId);
    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    this.emit('newRandomGameCreated', {gameId: thisGameId, mySocketId: playerSocketId, playerNumber: playerNumber});

    // Join the Room and wait for the players
    this.join(thisGameId.toString());
}

function createNewPrivateGame() {
    // Create a unique Socket.IO Room
    var thisGameId = ( Math.random() * 100000 ) | 0;
    var playerSocketId = this.id;
    //TODO role festlege(smartphone oder laptop, jenachdem Player oder Host)
    gm.addGame(thisGameId);
    gm.setUser(thisGameId, playerSocketId);
    // Return the Room ID (gameId) and the socket ID (mySocketId) to the browser client
    this.emit('newPrivateGameCreated', {gameId: thisGameId, mySocketId: playerSocketId});

    // Join the Room and wait for the players
    this.join(thisGameId.toString());
}


/**
 * A player clicked the 'START GAME' button.
 * Attempt to connect them to the room that matches
 * the gameId entered by the player.
 * @param data Contains data entered via player's input - playerName and gameId.
 */
function playerJoinGame(data) {

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

        // Emit an event notifying the clients that the player has joined the room.
        serverSocket.sockets.in(data.gameId).emit('playerJoinedRoom', data);

    } else {
        // Otherwise, send an error message back to the player.
        this.emit('error',{message: "This room does not exist."} );
    }
}

/*
 * Two players have joined!
 * @param gameId The game ID / room ID
 */
function hostPrepareGame(gameId) {
    var sock = this;
    var data = {
        mySocketId : sock.id,
        gameId : gameId
    };

    //TODO stoesst beim host(s) die methode zum spielstart aus
    serverSocket.sockets.in(data.gameId).emit('beginNewGame', data);
}

function playGame(){
    game.Dmmw.getInstance().playingField.simulateGame(serverSocket);
    game.Dmmw.getInstance().redraw(); //SHIFT ARRAY
}


function motion(data) {
    if(game.Dmmw.getInstance().playingField != null){
        game.Dmmw.getInstance().playingField.getPaddle(0).motionMove(data.text, serverSocket)
    }
}

//MUSS SPÄTER AN DEN RAUM GESCHICKT WERDEN - Einmalig
function gameData(){
    if(!game.Dmmw.getInstance().running){
        handler.sendComplete(serverSocket);
        game.Dmmw.getInstance().running = true;
        game.Dmmw.getInstance().intervallIdsetInterval = setInterval(playGame, 25);
    }
}
function gamePause (){
    game.Dmmw.getInstance().pause = !game.Dmmw.getInstance().pause;

    if(game.Dmmw.getInstance().pause){
        clearInterval(game.Dmmw.getInstance().intervallIdsetInterval);
    }else{
        game.Dmmw.getInstance().intervallIdsetInterval = setInterval(playGame, 25);
    }
}

function keyMove (data) {
    if(data.direction == "right"){
        game.Dmmw.getInstance().playingField.getPaddle(1).rightDown = true;
    }
    if(data.direction == "left"){
        game.Dmmw.getInstance().playingField.getPaddle(1).leftDown = true;
    }

    handler.sendPaddles(serverSocket);
}


function keyRelease(data) {
    if(data.direction == "right"){
        game.Dmmw.getInstance().playingField.getPaddle(1).rightDown = false;
    }
    if(data.direction == "left"){
        game.Dmmw.getInstance().playingField.getPaddle(1).leftDown = false;
    }
    handler.sendPaddles(serverSocket);
}

function brickColor(data){
    var row = data.row;
    var col = data.col;
    var brickColor = data.brickColor;
    game.Dmmw.getInstance().playingField.bricks[row][col].currentColor = brickColor;
}


/**
 * The game is over, and a player has clicked a button to restart the game.
 * @param data

function playerRestart(data) {
    // console.log('Player: ' + data.playerName + ' ready for new game.');

    // Emit the player's data back to the clients in the game room.
    data.playerId = this.id;
    serverSocket.sockets.in(data.gameId).emit('playerJoinedRoom',data);
}
*/