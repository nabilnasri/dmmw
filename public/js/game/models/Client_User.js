function Client_User() {
    this.mySocketId = null;
    this.myLives = 3;
    this.myCurrentPoints = 0;
    this.myUsername = null;
    this.myGameId = null;
    this.myRole = null;
    this.playerNumber = null;
}

/**
 * The Host screen is displayed for the first time.
 * @param data{{ gameId: String, mySocketId: String, playerNumber: int, role: String }}
 */
Client_User.prototype.gameInit = function () {
    this.displayScreen();
};

/**
 * Show the Host screen containing the game URL and unique game ID
 */
Client_User.prototype.displayScreen = function () {
    // TODO screen mit einzugebender gameId anzeigen
    // TODO passenden Wartescreen laden
};

/**
 * Update the Host screen when the first player joins
 */
Client_User.prototype.updateWaitingScreen = function (data) {
    //TODO hier unseren warteScreen einbauen
    // If this is a restarted game, show the screen.
};

/**
 * Show the countdown screen
 */
Client_User.prototype.gameCountdown = function () {

    // Display the players' names on screen
    $('#player1Score')
        .find('.playerName')
        //.html(data.player1.name);
        .html();

    $('#player2Score')
        .find('.playerName')
        //.html(data.player2.name);
        .html();

    // Set the Score section on screen to 0 for each player.
    $('#player1Score').find('.score').attr('id', Client_User.Host.players[0].mySocketId);
    $('#player2Score').find('.score').attr('id', Client_User.Host.players[1].mySocketId);

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

Client_User.prototype.onJoinClick = function () {
    // console.log('Clicked "Join A Game"');

    // Display the Join Game HTML on the player's screen.
    this.$gameArea.html(Client_User.$templateJoinGame);
};

/**
 * The player entered their name and gameId (hopefully)
 * and clicked Start.
 */
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
};

/**
 *  Click handler for the "Start Again" button that appears
 *  when a game is over.
 */
Client_User.prototype.onPlayerRestart = function () {
    var data = {
        gameId: Client_User.gameId,
        playerName: Client_User.Player.myName
    };
    IO.socket.emit('playerRestart', data);
    $('#gameArea').html("<h3>Waiting on host to start new game.</h3>");
};

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

Client_User.prototype.getLives = function () {
    return this.myLives;
};

Client_User.prototype.setLives = function (lives) {
    this.myLives = lives;
};

Client_User.prototype.getCurrentsPoint = function () {
    return this.myCurrentPoints;
};

Client_User.prototype.setCurrentsPoint = function (points) {
    this.myCurrentPoints = points;
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

Client_User.prototype.getPlayerNumner = function () {
    return this.playerNumber;
};

Client_User.prototype.setPlayerNumber = function (playerNumber) {
    this.playerNumber = playerNumber;
};