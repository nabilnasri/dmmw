function Client_User() {
    this.mySocketId = null;
    this.myGameId = null;
    this.myRole = null;
    this.playerNumber = null;
    this.allGameIds = null;
}

/**
 * Show the countdown screen
 */
Client_User.prototype.gameCountdown = function () {
    // TODO empfangenen Timerstand einsetzen
};

/**
 * Update playingfield
 */
Client_User.prototype.updateGame = function (data) {
    //TODO postionsdaten auswerten und ggf. brick entfernen (Punkte hochzaehlen...)
};


/**
 * All bricks are killed. End the game.
 * @param data
 */
Client_User.prototype.endGame = function (data) {
    //TODO gewinner ermitteln
};

/**
 * A player hit the 'Start Again' button after the end of a game.
 */
Client_User.prototype.restartGame = function () {
    Client_User.$gameArea.html(Client_User.$templateNewGame);
    $('#spanNewGameCode').text(Client_User.gameId);
};

/**
 * Show the "Game Over" screen.
 */
Client_User.prototype.endGame = function () {
    //TODO gewinner und verlierer anzeigen.
};


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