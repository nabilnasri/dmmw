function Client_User(socketId) {
    this.mySocketId = socketId;
    this.myLives = 3;
    this.myCurrentPoints = 0;
    this.myUsername;
    this.myGameId;
    this.myRole;
    this.playerNumber;
}

Client_User.prototype.onClickRandomGame = function () {
    // console.log('Clicked "Create A Game"');
    //TODO userrole hier herausfinden uns speichern
    var data = {
        role : "hostOderPlayer"
    };
    IO.socket.emit('createNewRandomGame', data);
};

Client_User.prototype.onClickPrivateGame = function () {
    // console.log('Clicked "Create A Game"');
    //TODO userrole hier herausfinden uns speichern
    IO.socket.emit('createNewPrivateGame');
};

/**
 * The Host screen is displayed for the first time.
 * @param data{{ gameId: int, mySocketId: * }}
 */
Client_User.prototype.gameInit = function (data) {
    Client_User.gameId = data.gameId;
    Client_User.mySocketId = data.mySocketId;
    Client_User.playerNumber = data.playerCounter;
    Client_User.displayScreen(user.myRole);
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
    Client_User.$gameArea.html(Client_User.$templateJoinGame);
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
    Client_User.myRole = 'Player';
    Client_User.myUsername = data.playerName;
};

/**
 *  Click handler for the "Start Again" button that appears
 *  when a game is over.
 */
Client_User.prototype.onPlayerRestart = function () {
    var data = {
        gameId: Client_User.gameId,
        playerName: Client_User.Player.myName
    }
    IO.socket.emit('playerRestart', data);
    Client_User.currentRound = 0;
    $('#gameArea').html("<h3>Waiting on host to start new game.</h3>");
};

/**
 * Display the waiting screen for player 1
 * @param data
 */
Client_User.prototype.updateWaitingScreen = function (data) {
    if (IO.socket.socket.sessionid === data.mySocketId) {
        Client_User.myRole = 'Player';
        Client_User.gameId = data.gameId;
    }
};

/**
 * Show the "Game Over" screen.
 */
Client_User.prototype.endGame = function () {
    //TODO gewinner und verlierer anzeigen.
};