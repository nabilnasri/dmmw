function Client_User() {
    this.mySocketId = null;
    this.myGameId = null;
    this.myRole = null;
    this.playerNumber = null;
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
 * The player entered their name and gameId (hopefully)
 * and clicked Start.

Client_User.prototype.onPlayerStartClick = function () {
    // collect data to send to the server
    var data = {
        gameId: +($('#inputGameId').val()),
        playerName: $('#inputPlayerName').val() || 'anon'
    };

    // Send the gameId and playerName to the server
    IO.socket.emit('playerJoinGame', data);

    // Set the appropriate properties for the current player.
    this.myRole = 'Player';
    this.myUsername = data.playerName;
};*/

/**
 *  Click handler for the "Start Again" button that appears
 *  when a game is over.

Client_User.prototype.onPlayerRestart = function () {
    var data = {
        gameId: Client_User.gameId,
        playerName: Client_User.Player.myName
    };
    IO.socket.emit('playerRestart', data);
    $('#gameArea').html("<h3>Waiting on host to start new game.</h3>");
};*/

/**
 * Display the waiting screen for player 1
 * @param data

 Client_User.prototype.updateWaitingScreen = function (data) {
    if (IO.socket.socket.sessionid === data.mySocketId) {
        Client_User.myRole = 'Player';
        Client_User.gameId = data.gameId;
    }
};*/

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