function Client_User() {
    this.mySocketId = null;
    this.myGameId = null;
    this.myRole = null;
    this.playerNumber = null;
    this.allGameIds = null;
    this.isInGame = false;
    this.currentPoints = 0;
    this.lastMotion = "stop";
}

/** *********************
 *    GETTER / SETTER   *
 * ******************* **/

Client_User.prototype.getSocketId = function () {
    return this.mySocketId;
};

Client_User.prototype.setSocketId = function (socketId) {
    this.mySocketId = socketId;
};

Client_User.prototype.getUsername = function () {
    return this.myUsername;
};

Client_User.prototype.setUsername = function (username) {
    this.myUsername = username;
};

Client_User.prototype.getGameId = function () {
    return this.myGameId;
};

Client_User.prototype.setGameId = function (gameId) {
    this.myGameId = gameId;
};

Client_User.prototype.getRole = function () {
    return this.myRole;
};

Client_User.prototype.setRole = function (role) {
    this.myRole = role;
};

Client_User.prototype.getPlayerNumber = function () {
    return this.playerNumber;
};

Client_User.prototype.setPlayerNumber = function (playerNumber) {
    this.playerNumber = playerNumber;
};

Client_User.prototype.getAllGameIds = function () {
    return this.allGameIds;
};

Client_User.prototype.setAllGameIds = function (allGameIds) {
    this.allGameIds = allGameIds;
};

Client_User.prototype.getCurrentPoints = function () {
    return this.currentPoints;
};

Client_User.prototype.setCurrentPoints = function (points) {
    this.currentPoints = points;
};