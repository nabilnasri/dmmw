var winston = require('winston');

exports.Server_User = function Server_User(role, playerSocketId){
    winston.log('info', 'User mit mit role = ' + role + '  und socketId = ' + playerSocketId + ' erstellt');
    this.username = '';
    this.playerSockerId = playerSocketId;
    this.role = role;
    this.lives = 3;
    this.currentPoints = 0;
};

exports.Server_User.prototype.setUsername = function(username){
    this.username = username;
};

exports.Server_User.prototype.getUsername = function(){
    return this.username;
};

exports.Server_User.prototype.setPlayerSocketId = function(playerSocketId){
    this.playerSockerId = playerSocketId;
};

exports.Server_User.prototype.getPlayerSocketId = function(){
    return this.playerSockerId;
};

exports.Server_User.prototype.setRole = function(role){
    this.role = role;
};

exports.Server_User.prototype.getRole = function(){
    return this.role;
};

exports.Server_User.prototype.setLives = function(lives){
    this.lives = lives;
};

exports.Server_User.prototype.getLives = function(){
    return this.lives;
};

exports.Server_User.prototype.setCurrentPoints = function(currentPoints){
    this.currentPoints = currentPoints;
};

exports.Server_User.prototype.getCurrentPoints = function(){
    return this.currentPoints;
};
