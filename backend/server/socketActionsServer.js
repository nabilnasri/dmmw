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
    gamersSocket.on('setUsername', setUsernameSocket);
    gamersSocket.on('setMobileSocket', setMobileSocket);
    gamersSocket.on('playerJoinGame', playerJoinGame);
    gamersSocket.on('playerIsReady', playerIsReady);

    gamersSocket.on('getAllUsers', getAllUsers);
    gamersSocket.on('getAllGameIDs', getAllGameIDs);

    // Game Events
    gamersSocket.on('motion', motionSocket);
    gamersSocket.on('gameData', gameDataSocket);
    gamersSocket.on('gamePause', gamePauseSocket);
    gamersSocket.on('keyMove', keyMoveSocket);
    gamersSocket.on('keyRelease', keyReleaseSocket);
    gamersSocket.on('brickColor', brickColorSocket);
};

/** ********************************
 *           HOST EVENTS           *
 * ****************************** **/

function createNewRandomGame() {
    var playerSocket = this;
    var freeGameId = gm.checkForFreeRooms();
    winston.log('info','free room ' + freeGameId);
    if (freeGameId == null) {
        //var freeGameId = Math.floor(Math.random() * 90000) + 10000;
        var freeGameId = Math.floor(Math.random() * 90) + 10;
        gm.addGame(freeGameId, serverSocket, gamersSocket, false);
    }
    var playerNumber = gm.addUser(freeGameId, playerSocket.id);

    //joint den User in den Loooom!
    playerSocket.join(freeGameId.toString());
    playerSocket.emit('initUser', {
        gameId: freeGameId,
        mySocketId: playerSocket.id,
        playernumber: playerNumber
    });

}

function createNewPrivateGame() {
    var playerSocket = this;
    //var thisGameId = Math.floor(Math.random() * 90000) + 10000;
    var thisGameId = Math.floor(Math.random() * 90) + 10;
    gm.addGame(thisGameId, serverSocket, gamersSocket, true);
    var playerNumber = gm.addUser(thisGameId, playerSocket.id);

    //joint den User in den Loooom!
    playerSocket.join(thisGameId.toString());
    playerSocket.emit('initUser', {
        gameId: thisGameId,
        mySocketId: playerSocket.id,
        playernumber: playerNumber
    });
}

function playerJoinGame(data) {
    var playerSocket = this;
    var thisGameId = data.gameId;
    if (serverSocket.sockets.adapter.rooms[data.gameId] != undefined) {
        var playerNumber = gm.addUser(thisGameId, playerSocket.id);
        gm.setUserInHost(data.gameId, data.username, playerNumber);
        //teile dem wartenden mit, das ein user dazugekommen ist
        serverSocket.sockets.in(data.gameId).emit('playerJoinedRoom', {
            username: data.username,
            playerNumber: playerNumber
        });
        //fuege nun den neuen nutzer zum room
        playerSocket.join(thisGameId);
        //schicke dem client vom user alle noetigen infomationen von sich slebst
        playerSocket.emit('initUser', {
            gameId: thisGameId,
            mySocketId: playerSocket.id,
            playernumber: playerNumber,
            goToGame: 'yesPlease'
        });
    } else {
        winston.log('info', 'ups in playerJoinGame(data) in socketActionsServer.js');
        this.emit('ups',{message: "Falsche Game ID eingegeben. Versuchs nochmal :)"} );
    }
}


function setUsernameSocket(data) {
    winston.log('info', 'setUsernameSocket: ' + JSON.stringify(data));
    var playerNumber = data.playerNumber;
    gm.setUserInHost(data.gameId, data.username, playerNumber);

    //aktuealisiere den wartescreen des ersten spielers
    if (playerNumber == 1) {
        var sendToThisSocket = gm.getUserSocket(data.gameId, 0);
        serverSocket.sockets.to(sendToThisSocket).emit('playerJoinedRoom', {
            username: data.username,
            playerNumber: playerNumber
        });
    }
}

function setMobileSocket(data) {
    if (serverSocket.sockets.adapter.rooms[data.gameId] != undefined) {
        var playerdata = gm.setMobileSocketId(data.gameId, this.id);
        //fuege nun den neuen nutzer zum room
        //this.join(data.gameId);
        //schicke userdaten an das mobile device
        this.emit('mobiledeviceConnected', {
            playerNumber: playerdata.playerNumber,
            username: playerdata.username
        });
        //sende an der dazugehoerigen Desktop, das er weiter gehen kann!
        var sendToThisSocket = gm.getUserSocket(data.gameId, playerdata.playerNumber);
        if (sendToThisSocket != null) {
            serverSocket.sockets.to(sendToThisSocket).emit('updateMobileState');
        }
        if (gm.getAllUsers(data.gameId).length == 2){
            sendToThisSocket = gm.getUserSocket(data.gameId, 0);
            /*
            Todo: Updatemobilestate fragt auf der Client-Seite nach der Userlist - kein passender Name. Anfrage auch hier ändern
             */
            serverSocket.sockets.to(sendToThisSocket).emit('updateMobileState');
        }
    } else {
        winston.log('ups', 'ups in setMobileSocket(data) in socketActionsServer.js');
        this.emit('ups',{message: "Falsche Game ID eingegeben. Versuchs nochmal :)"} );
    }
}

function getAllUsers(data){
    winston.log('info', 'getAllUsers ' + JSON.stringify(gm.getAllUsers(data.gameId)));
    this.emit(data.destination, {users: JSON.stringify(gm.getAllUsers(data.gameId))});
}

function playerIsReady(data){
    var gameId = data.gameId;
    winston.log('info', 'playerIsReady ' + JSON.stringify((data)));
    serverSocket.sockets.in(gameId).emit('playerPressedReady', {
        playerNumber: data.playerNumber
    });
    if(gm.checkIfPlayersReady(gameId, data.playerNumber) == true){
        winston.log('info', 'playerIsReady(data) sagt -> alle sind ready');
        serverSocket.sockets.in(gameId).emit('allPlayersAreReady');
    }
}

function getAllGameIDs(){
    this.emit('allGameIds', {allIds: gm.getAllPrivateGameIds()});
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