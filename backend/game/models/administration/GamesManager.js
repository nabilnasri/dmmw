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
 * fuegt neue Spieleinstanz in den Gamemanager ein
 * */
exports.Gamemanager.prototype.addGame = function (gameId, serverSocket, gamerSocket) {
    //TODO schauen ob ein freier room vorhanden ist, falls randomGame geklickt wurde!
    this.gamelist[gameId] = new gamehost.GameHoster(gameId, serverSocket, gamerSocket);
};

/**
 * setzt neuen user im jeweiligen GamehHost und gibt die Spielernummer zurueck um auf der Client Seite
 * Punktezahl etc. richtig zu setzen
 * */
exports.Gamemanager.prototype.addUser = function (gameId, gamersSocket, username) {
    return this.gamelist[gameId].setUser(gamersSocket, username);
};

/**
 * checke wie viele user im game sind
 * */
exports.Gamemanager.prototype.checkUserAmount = function (gameId) {
    var userAmount = this.gamelist[gameId].getUserAmount();
    //echte abfrage
    /*if (getUserAmount['playerCounter'] == 2  && getUserAmount['hostCounter']){
     return true;
     }else{
     return false;
     }*/

    //test abfrage ohnne playerCounter(fuer mobile devices)
    return userAmount['hostCounter'] == 2;
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