exports.Server_User = function Server_User(playerSocketId) {
    this.username = null;
    this.playerSocketId = playerSocketId;
    this.mobileSocketId = null;
    this.currentPoints = 0;
    this.isReady = false;
    this.currentPowerUp = new Array();
};

exports.Server_User.prototype.setUsername = function (username) {
    this.username = username;
};

exports.Server_User.prototype.getUsername = function () {
    return this.username;
};

exports.Server_User.prototype.setMobilerSocketId = function (mobileSocketId) {
    this.mobileSocketId = mobileSocketId;
};

exports.Server_User.prototype.getMobileSocketId = function () {
    return this.mobileSocketId;
};

exports.Server_User.prototype.setPlayerSocketId = function (playerSocketId) {
    this.playerSocketId = playerSocketId;
};

exports.Server_User.prototype.getPlayerSocketId = function () {
    return this.playerSocketId;
};

exports.Server_User.prototype.setRole = function (role) {
    this.role = role;
};

exports.Server_User.prototype.setCurrentPoints = function (currentPoints) {
    this.currentPoints = currentPoints;
};

exports.Server_User.prototype.getCurrentPoints = function () {
    return this.currentPoints;
};

exports.Server_User.prototype.setCurrentPowerUp = function (powerUp) {
    this.currentPowerUp.push(powerUp);
};

exports.Server_User.prototype.getCurrentPowerUp = function () {
    return this.currentPowerUp;
};

exports.Server_User.prototype.removeCurrentPowerUp = function (element) {
    var found = this.currentPowerUp.indexOf(element);

    while (found !== -1) {
        this.currentPowerUp.splice(found, 1);
        found = this.currentPowerUp.indexOf(element);
    }
};

function remove(arr, what) {

}

exports.Server_User.prototype.setIsReady = function (isReady) {
    this.isReady = isReady;
};

exports.Server_User.prototype.getIsReady = function () {
    return this.isReady;
};