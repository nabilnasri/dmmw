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
    gamersSocket.on('iAmAlive', iAmAlive);
    gamersSocket.on('gameData', gameDataSocket);
    gamersSocket.on('gamePause', gamePauseSocket);
    gamersSocket.on('brickColor', brickColorSocket);
    gamersSocket.on('powerUpHitted', hittedPowerUp);
};

/** ********************************
 *           HOST EVENTS           *
 * ****************************** **/

/**
 * erstellt ein neues RandomGame
 */
function createNewRandomGame() {
    var playerSocket = this;
    var freeGameId = gm.checkForFreeRooms();
    winston.log('info','free room ' + freeGameId);
    if (freeGameId == null) {
        freeGameId = Math.floor(Math.random() * 90000) + 10000;
        gm.addGame(freeGameId, serverSocket, gamersSocket, false);
    }
    var playerNumber = gm.addUser(freeGameId, playerSocket.id);

    //joint den User in den Roooom!
    playerSocket.join(freeGameId.toString());
    playerSocket.emit('initUser', {
        gameId: freeGameId,
        mySocketId: playerSocket.id,
        playernumber: playerNumber
    });

}

/**
 * erstellt ein neues PrivateGame
 */
function createNewPrivateGame() {
    var playerSocket = this;
    var thisGameId = Math.floor(Math.random() * 90000) + 10000;
    gm.addGame(thisGameId, serverSocket, gamersSocket, true);
    var playerNumber = gm.addUser(thisGameId, playerSocket.id);

    //joint den User in den Roooom!
    if(playerNumber != null){
        playerSocket.join(thisGameId.toString());
        playerSocket.emit('initUser', {
            gameId: thisGameId,
            mySocketId: playerSocket.id,
            playernumber: playerNumber
        });
    }
}

/**
 * fuegt Spieler einem Spiel zu
 */
function playerJoinGame(data) {
    var playerSocket = this;
    var thisGameId = data.gameId;
    if (serverSocket.sockets.adapter.rooms[data.gameId] != undefined) {
        var playerNumber = gm.addUser(thisGameId, playerSocket.id);
        if(playerNumber != null){
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
        }
    } else {
        winston.log('info', 'ups in playerJoinGame(data) in socketActionsServer.js');
        this.emit('ups',{message: "Falsche Game ID eingegeben. Versuchs nochmal :)"} );
    }
}

/**
 * eingegebener Name wird dem User hinzugefuegt
 */
function setUsernameSocket(data) {
    winston.log('info', 'setUsernameSocket: ' + JSON.stringify(data));
    var playerNumber = data.playerNumber;
    gm.setUserInHost(data.gameId, data.username, playerNumber);

    //aktuealisiere den wartescreen des ersten spielers
    if (playerNumber == 1) {
        var sendToThisSocket = gm.getUserSocket(data.gameId, 0);
        if(sendToThisSocket != null){
            serverSocket.sockets.to(sendToThisSocket).emit('playerJoinedRoom', {
                username: data.username,
                playerNumber: playerNumber
            });
        }
    }
}

/**
 * Das Socketobject eines Mobile Devices wird einem User zugewiesen
 */
function setMobileSocket(data) {
    if (serverSocket.sockets.adapter.rooms[data.gameId] != undefined) {
        var playerdata = gm.setMobileSocketId(data.gameId, this.id);
        if(playerdata != null){
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
                if(sendToThisSocket != null) {
                    serverSocket.sockets.to(sendToThisSocket).emit('updateMobileState');
                }
            }
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
/**
 * prueft ob alle Spieler bereit sind
 */
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

/** ********************************
 *           GAME EVENTS           *
 * ****************************** **/
function iAmAlive (data){
    gm.changeCurrentBallState(data.gameId, data.playerNumber);
}

function motionSocket(data) {
    gm.motionGame(data);
}

function gameDataSocket(data) {
    gm.startGame(data.gameId);
}

function gamePauseSocket(data) {
    gm.pauseGame(data);
}

function brickColorSocket(data) {
    gm.brickColorGame(data);
}

function hittedPowerUp(data) {
    gm.powerUpHittedGame(data);
}