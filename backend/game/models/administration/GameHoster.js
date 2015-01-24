var user = require('./Server_User');

exports.GameHoster = function GameHost(gameId) {
    this.gameId = gameId;
    this.userList = {};
    this.playerCounter = 1;
    this.hostCounter = 1;
    //TODO gameinstanz initialisieren
};

/**
 * gibt game id zurueck
 * */
exports.GameHoster.prototype.getGameId = function(){
    return this.gameId;
};


/**
 * setzt neuen user im GameHoster und gibt die Spielernummern zurueck um auf der Client Seite
 * Punktezahl etc. richtig zu setzen
 * */
exports.GameHoster.prototype.setUser = function (role, playerSocketId) {
    if (role === 'host' && this.hostCounter <= 2) {
        var u = user.Server_User("", playerSocketId, role);
        this.userList.push({hostCounter: u});
        this.hostcounter  += 1;
    } else if (role === 'player' && this.playerCounter <=2) {
        var u = user.Server_User("", playerSocketId, role);
        this.userList.push({playerCounter: u});
        this.playerCounter += 1;
    } else {
        Console.log("ERROR BEIM USER SETZEN");
        return -1;
    }

    return this.userList;
};
