var gamehost = require('./GameHoster');
var winston = require('winston');

exports.Gamemanager = function Gamemanager() {
    //dictionary mit allen derzeit laufenden Spielinstanzen
    //gamelist = {(gameid : Gamehoster Instanz)}
    this.gamelist ={};
};

/**
 * fuegt neue Spieleinstanz in den Gamemanager ein
 * */
exports.Gamemanager.prototype.addGame = function(gameId, serverSocket){
    //TODO schauen ob ein freier room vorhanden ist, falls randomGame geklickt wurde!
    winston.log('info','GameManager addUser: ' +  gameId);
    this.gamelist[gameId] = new gamehost.GameHoster(gameId, serverSocket);
};

/**
 * setzt neuen user im jeweiligen GamehHost und gibt die Spielernummer zurueck um auf der Client Seite
 * Punktezahl etc. richtig zu setzen
 * */
exports.Gamemanager.prototype.addUser = function(role, playerSocketId, gameId){
    winston.log('info','gamelistKeys: ' + Object.keys(this.gamelist));
    return this.gamelist[gameId].setUser(role, playerSocketId);
};