function UserClient(username, playerSockerId, role){
    this.username = username;
    this.playerSockerId = playerSockerId;
    this.role = role;
}

UserClient.prototype.setUsername = function(username){
    this.username = username;
};

UserClient.prototype.getUsername = function(username){
    return this.username;
};

UserClient.prototype.setPlayerSockerId = function(playerSockerId){
    this.playerSockerId = playerSockerId;
};

UserClient.prototype.getPlayerSockerId = function(playerSockerId){
    return this.playerSockerId;
};

UserClient.prototype.setRole = function(role){
    this.role = role;
};

UserClient.prototype.getRole = function(role){
    return this.role;
};