function UUUser(username) {
    this.username = username;
    this.mobileDevice = new MobileDevice();
    this.currentPoints = 0;
    this.lives = 3;
}

function GameHost(gameId) {
    this.gameId = gameId;
    this.user = {};
    this.playerCounter = 0;
    this.hostCounter = 0;

};

GameHost.prototype.getGameId = function(){
    return this.gameId;
};

GameHost.prototype.setUser = function (hostOrPlayer, playerSocketId) {
    if (hostOrPlayer === 'host' && hostCounter <= 2) {
        var u = new UserClient ("", playerSocketId, hostOrPlayer);
        this.user.push({hostCounter: u});
        hostcounter  += 1;
    } else if (hostOrPlayer === 'player' && playerCounter <=2) {
        var u = new UserClient ("", playerSocketId, hostOrPlayer);
        this.user.push({playerCounter: u});
        playerCounter += 1;
    } else {
        Console.log("ERROR BEIM USER SETZEN");
    }
};
