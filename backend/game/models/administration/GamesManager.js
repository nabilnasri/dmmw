var gamehost = require('./GameHoster');
var winston = require('winston');

exports.Gamemanager = function Gamemanager() {
    //dictionary mit allen derzeit laufenden Spielinstanzen
    //gamelist = {(gameid : Gamehoster Instanz)}
    this.gamelist = {};
};

/** ********************************
 *         INIT GAME ACTIONS       *
 * ****************************** **/
/**
 * sucht nach freier random spielInstanz
 * */
exports.Gamemanager.prototype.checkForFreeRooms = function () {
    for (var key in this.gamelist) {
        winston.log('info', 'getIsPrivate ' + this.gamelist[key].getIsPrivate());
        if (!this.gamelist[key].getIsPrivate()) {
            winston.log('info', 'checkForFreeRooms key ' + key);
            if (this.gamelist[key].getUserAmount() < 2) {
                return key;
            }
        }
    }
    return null;
};

 /**
 * fuegt neue Spieleinstanz in den Gamemanager ein
 * */
exports.Gamemanager.prototype.addGame = function (gameId, serverSocket, gamerSocket, isPrivate) {
    if(gameId != null && serverSocket != undefined && gamerSocket != undefined  && isPrivate != undefined) {
        this.gamelist[gameId] = new gamehost.GameHoster(gameId, serverSocket, isPrivate);
    }
};

/**
 * setzt neuen user im jeweiligen GamehHost und gibt die Spielernummer zurueck um auf der Client Seite
 * Punktezahl etc. richtig zu setzen
 * */
exports.Gamemanager.prototype.addUser = function (gameId, gamersSocket) {
    if(this.gamelist[gameId] != undefined) {
        return this.gamelist[gameId].setUser(gamersSocket);
    }
    return null;
};

/**
 * setzt weitere daten im user
 * */
exports.Gamemanager.prototype.setUserInHost = function (gameId, username, playerNumber) {
    if(this.gamelist[gameId] != undefined) {
        return this.gamelist[gameId].setUserDataInUser(username, playerNumber);
    }
    return null;
};

/**
 * setzt socket von Mobiledevice im usrer
 * */
exports.Gamemanager.prototype.setMobileSocketId = function (gameId, mobileSocketId) {
    if(this.gamelist[gameId] != undefined) {
        return this.gamelist[gameId].setMobileSocketInUser(mobileSocketId);
    }
    return null;
};

/**
 * gib socket eines spielers zurueck
 * */
exports.Gamemanager.prototype.getUserSocket = function (gameId, playernumber) {
    if(this.gamelist[gameId] != undefined) {
        return this.gamelist[gameId].getUserSocketId(playernumber);
    }
    return null;
};

/**
 * gib alle spieler dieses Gamehosters zurueck
 * */
exports.Gamemanager.prototype.getAllUsers = function (gameId) {
    if(this.gamelist[gameId] != undefined) {
        return this.gamelist[gameId].getPlayerList();
    }
    return null;
};

/**
 * gib alle privaten gameIds zurück die noch frei sind
 * */
exports.Gamemanager.prototype.getAllPrivateGameIds = function () {
    var list = [];
    for (var key in this.gamelist) {
        if (this.gamelist[key].getIsPrivate()) {
            if (this.gamelist[key].getUserAmount() < 2) {
                list.push(key);
            }
        }
    }
    return list;
};

exports.Gamemanager.prototype.checkIfPlayersReady = function (gameId, playerNumber){
    if(this.gamelist[gameId] != undefined) {
        return this.gamelist[gameId].arePlayersReady(playerNumber);
    }
    return null;
};


/*exports.GameHoster.prototype.checkThisId = function(gameId){
    return gameId in this.gamelist;
};*/


/** ********************************
 *           PLAY ACTIONS          *
 * ****************************** **/
/**
 * fuer die Steuerung mit dem mobile Device
 * */
exports.Gamemanager.prototype.motionGame = function (data) {
    if(data.gameId && this.gamelist[data.gameId] != undefined){
        this.gamelist[data.gameId].motion(data);
    }
};


exports.Gamemanager.prototype.changeCurrentBallState = function (gameId, playerNumber) {
    winston.log('info', ['changeCurrentBallState', gameId, playerNumber].join(' '));
    if(this.gamelist[gameId] != undefined){
        this.gamelist[gameId].changeBallState(playerNumber);
    }
};

/**
 * fuegt neue Spieleinstanz in den Gamemanager ein
 * */
exports.Gamemanager.prototype.startGame = function (gameId) {
    if(this.gamelist[gameId] != undefined) {
        this.gamelist[gameId].gameData();
    }
};

/**
 * pausiere Spielinstanz
 * */
exports.Gamemanager.prototype.pauseGame = function (data) {
    if(this.gamelist[data.gameId] != undefined) {
        this.gamelist[data.gameId].gamePause();
    }
};

/**
 * sendet Farbe der Bricks
 * */
exports.Gamemanager.prototype.brickColorGame = function (data) {
    if(this.gamelist[data.gameId] != undefined) {
        this.gamelist[data.gameId].brickColor(data);
    }
};