var winston = require('winston');

exports.Server_User = function Server_User(playerSocketId) {
    this.username = null;
    this.playerSocketId = playerSocketId;
    this.mobileSocketId = null;
    this.lives = 3;
    this.currentPoints = 0;
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

exports.Server_User.prototype.getLives = function () {
    return this.lives;
};

exports.Server_User.prototype.setCurrentPoints = function (currentPoints) {
    this.currentPoints = currentPoints;
};

exports.Server_User.prototype.getCurrentPoints = function () {
    return this.currentPoints;
};
