var gamehost = require('./GameHoster');
var winston = require('winston');

exports.Gamemanager = function Gamemanager() {
    //dictionary mit allen derzeit laufenden Spielinstanzen
    //gamelist = {(gameid : Gamehoster Instanz)}
    this.gamelist = {};
};

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
exports.Gamemanager.prototype.addUser = function (role, gamersSocket, gameId) {
    this.gamelist[gameId].setUser(role, gamersSocket);
};

/**
 * checke wie viele user im game sind
 * */
exports.Gamemanager.prototype.checkUserAmount = function (gameId) {
    winston.log('info', ['checkUserAmount in: ', gameId, 'actUserAmount: ', this.gamelist[gameId].userAmount()['hostCounter']].join(' '));
    var userAmount = this.gamelist[gameId].userAmount();
    //echte abfrage
    /*if (userAmount['playerCounter'] == 2  && userAmount['hostCounter']){
     return true;
     }else{
     return false;
     }*/

    //echte abfrage
    if (userAmount['hostCounter']) {
        return true;
    } else {
        return false;
    }
};

/**
 * fuegt neue Spieleinstanz in den Gamemanager ein
 * */
exports.Gamemanager.prototype.startGame = function (gameId) {
    //TODO schauen ob ein freier room vorhanden ist, falls randomGame geklickt wurde!
    this.gamelist[gameId].startNewgame();
};