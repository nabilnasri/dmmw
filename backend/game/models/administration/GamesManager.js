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
        if (!this.gamelist[key].getIsPrivate()) {
            if (!this.gamelist[key].getUserAmount() < 2) {
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
    this.gamelist[gameId] = new gamehost.GameHoster(gameId, serverSocket, gamerSocket, isPrivate);
};

/**
 * setzt neuen user im jeweiligen GamehHost und gibt die Spielernummer zurueck um auf der Client Seite
 * Punktezahl etc. richtig zu setzen
 * */
exports.Gamemanager.prototype.addUser = function (gameId, gamersSocket) {
    return this.gamelist[gameId].setUser(gamersSocket);
};

/**
 * setzt weitere daten im user
 * */
exports.Gamemanager.prototype.setUserInHost = function (gameId, username, playerNumber) {
    return this.gamelist[gameId].setUserDataInUser(username, playerNumber);
};

/**
 * setzt socket von Mobiledevice im usrer
 * */
exports.Gamemanager.prototype.setMobileSocketId = function (gameId, mobileSocketId) {
    return this.gamelist[gameId].setMobileSocketInUser(mobileSocketId);
};

/**
 * gib socket eines spielers zurueck
 * */
exports.Gamemanager.prototype.getUserSocket = function (gameId, playernumber) {
    return this.gamelist[gameId].getUserSocketId(playernumber);
};

/**
 * gib alle spieler dieses Gamehosters zurueck
 * */
exports.Gamemanager.prototype.getAllUsers = function (gameId) {
    return this.gamelist[gameId].getPlayerList();
};


/** ********************************
 *           PLAY ACTIONS          *
 * ****************************** **/
/**
 * fuer die Steuerung mit dem mobile Device
 * */
exports.Gamemanager.prototype.motionGame = function (data) {
    this.gamelist[data.gameId].motion(data);
};

/**
 * fuegt neue Spieleinstanz in den Gamemanager ein
 * */
exports.Gamemanager.prototype.startGame = function (gameId) {
    //TODO schauen ob ein freier room vorhanden ist, falls randomGame geklickt wurde!
    this.gamelist[gameId].gameData();
};

/**
 * pausiere Spielinstanz
 * */
exports.Gamemanager.prototype.pauseGame = function (data) {
    this.gamelist[data.gameId].gamePause();
};

/**
 * beim druecken der Pfeiltaste auf der Tastatur
 * */
exports.Gamemanager.prototype.keyMoveGame = function (data) {
    this.gamelist[data.gameId].keyMove(data);
};

/**
 * beim loslassen der Pfeiltaste auf der Tastatur
 * */
exports.Gamemanager.prototype.keyReleaseGame = function (data) {
    this.gamelist[data.gameId].keyRelease(data);
};

/**
 * sendet Farbe der Bricks
 * */
exports.Gamemanager.prototype.brickColorGame = function (data) {
    this.gamelist[data.gameId].brickColor(data);
};