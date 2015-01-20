function UserClient(gameId, mySocketID, role) {
    this.username = username;
    this.mobileDevice = new MobileDevice();
    this.currentPoints = 0;
    this.lives = 3;
    this.gameId = gameId;
    this.mySocketId = mySocketID;
    this.role = role;
}

UserClient.prototype.onCreateClick = function () {
    // console.log('Clicked "Create A Game"');
    //TODO userrole hier herausfinden uns speichern
    IO.socket.emit('createNewGame');
};

/**
 * The Host screen is displayed for the first time.
 * @param data{{ gameId: int, mySocketId: * }}
 */
UserClient.prototype.gameInit = function (data) {
    UserClient.gameId = data.gameId;
    UserClient.mySocketId = data.mySocketId;
    UserClient.myRole = 'Host';

    UserClient.Host.displayScreen();
    // console.log("Game started with ID: " + UserClient.gameId + ' by host: ' + UserClient.mySocketId);
};

/**
 * Show the Host screen containing the game URL and unique game ID
 */
UserClient.prototype.displayScreen = function () {
    // Fill the game screen with the appropriate HTML
    UserClient.$gameArea.html(UserClient.$templateNewGame);

    // Display the URL on screen
    $('#gameURL').text(window.location.href);
    UserClient.doTextFit('#gameURL');

    // Show the gameId / room id on screen
    $('#spanNewGameCode').text(UserClient.gameId);
};

/**
 * Update the Host screen when the first player joins
 * @param data{{playerName: string}}
 */
UserClient.prototype.updateWaitingScreen = function (data) {
    // If this is a restarted game, show the screen.
    if (UserClient.Host.isNewGame) {
        UserClient.Host.displayScreen();
    }
    // Update host screen
    $('#playersWaiting')
        .append('<p/>')
        .text('Player ' + data.playerName + ' joined the game.');

    // Store the new player's data on the Host.
    UserClient.Host.players.push(data);

    // Increment the number of players in the room
    UserClient.Host.numPlayersInRoom += 1;

    // If two players have joined, start the game!
    if (UserClient.Host.numPlayersInRoom === 2) {
        // console.log('Room is full. Almost ready!');

        // Let the server know that two players are present.
        IO.socket.emit('hostRoomFull', UserClient.gameId);
    }
};

/**
 * Show the countdown screen
 */
UserClient.prototype.gameCountdown = function () {
    //TODO hier unser cooler ladebildschirm B-)
    // Prepare the game screen with new HTML
    UserClient.$gameArea.html(UserClient.$hostGame);
    UserClient.doTextFit('#hostWord');

    // Begin the on-screen countdown timer
    var $secondsLeft = $('#hostWord');
    UserClient.countDown($secondsLeft, 5, function () {
        IO.socket.emit('hostCountdownFinished', UserClient.gameId);
    });

    // Display the players' names on screen
    $('#player1Score')
        .find('.playerName')
        .html(UserClient.Host.players[0].playerName);

    $('#player2Score')
        .find('.playerName')
        .html(UserClient.Host.players[1].playerName);

    // Set the Score section on screen to 0 for each player.
    $('#player1Score').find('.score').attr('id', UserClient.Host.players[0].mySocketId);
    $('#player2Score').find('.score').attr('id', UserClient.Host.players[1].mySocketId);
};

/**
 * Check the answer clicked by a player.
 * @param data{{round: *, playerId: *, answer: *, gameId: *}}
 */
UserClient.prototype.checkAnswer = function (data) {
    //TODO postionsdaten auswerten und ggf. brick entfernen (Punkte hochzaehlen...)
    if (data.round === UserClient.currentRound) {

        // Get the player's score
        var $pScore = $('#' + data.playerId);

        // Advance player's score if it is correct
        if (UserClient.Host.currentCorrectAnswer === data.answer) {
            // Add 5 to the player's score
            $pScore.text(+$pScore.text() + 5);

            // Advance the round
            UserClient.currentRound += 1;

            // Prepare data to send to the server
            var data = {
                gameId: UserClient.gameId,
                round: UserClient.currentRound
            }

            // Notify the server to start the next round.
            IO.socket.emit('hostNextRound', data);

        } else {
            // A wrong answer was submitted, so decrement the player's score.
            $pScore.text(+$pScore.text() - 3);
        }
    }
};


/**
 * All 10 rounds have played out. End the game.
 * @param data
 */
UserClient.prototype.endGame = function (data) {
    // Get the data for player 1 from the host screen
    var $p1 = $('#player1Score');
    var p1Score = +$p1.find('.score').text();
    var p1Name = $p1.find('.playerName').text();

    // Get the data for player 2 from the host screen
    var $p2 = $('#player2Score');
    var p2Score = +$p2.find('.score').text();
    var p2Name = $p2.find('.playerName').text();

    // Find the winner based on the scores
    var winner = (p1Score < p2Score) ? p2Name : p1Name;
    var tie = (p1Score === p2Score);

    // Display the winner (or tie game message)
    if (tie) {
        $('#hostWord').text("It's a Tie!");
    } else {
        $('#hostWord').text(winner + ' Wins!!');
    }
    UserClient.doTextFit('#hostWord');

    // Reset game data
    UserClient.Host.numPlayersInRoom = 0;
    UserClient.Host.isNewGame = true;
};

/**
 * A player hit the 'Start Again' button after the end of a game.
 */
UserClient.prototype.restartGame = function () {
    UserClient.$gameArea.html(UserClient.$templateNewGame);
    $('#spanNewGameCode').text(UserClient.gameId);
};

UserClient.prototype.onJoinClick = function () {
    // console.log('Clicked "Join A Game"');

    // Display the Join Game HTML on the player's screen.
    UserClient.$gameArea.html(UserClient.$templateJoinGame);
};

/**
 * The player entered their name and gameId (hopefully)
 * and clicked Start.
 */
UserClient.prototype.onPlayerStartClick = function () {
    // console.log('Player clicked "Start"');

    // collect data to send to the server
    var data = {
        gameId: +($('#inputGameId').val()),
        playerName: $('#inputPlayerName').val() || 'anon'
    };

    // Send the gameId and playerName to the server
    IO.socket.emit('playerJoinGame', data);

    // Set the appropriate properties for the current player.
    UserClient.myRole = 'Player';
    UserClient.Player.myName = data.playerName;
};

/**
 *  Click handler for the "Start Again" button that appears
 *  when a game is over.
 */
UserClient.prototype.onPlayerRestart = function () {
    var data = {
        gameId: UserClient.gameId,
        playerName: UserClient.Player.myName
    }
    IO.socket.emit('playerRestart', data);
    UserClient.currentRound = 0;
    $('#gameArea').html("<h3>Waiting on host to start new game.</h3>");
};

/**
 * Display the waiting screen for player 1
 * @param data
 */
UserClient.prototype.updateWaitingScreen = function (data) {
    if (IO.socket.socket.sessionid === data.mySocketId) {
        UserClient.myRole = 'Player';
        UserClient.gameId = data.gameId;

        $('#playerWaitingMessage')
            .append('<p/>')
            .text('Joined Game ' + data.gameId + '. Please wait for game to begin.');
    }
};

/**
 * Display 'Get Ready' while the countdown timer ticks down.
 * @param hostData
 */
UserClient.prototype.gameCountdown = function (hostData) {
    UserClient.Player.hostSocketId = hostData.mySocketId;
    $('#gameArea')
        .html('<div class="gameOver">Get Ready!</div>');
};

/**
 * Show the "Game Over" screen.
 */
UserClient.prototype.endGame = function () {
    //TODO gewinner und verlierer anzeigen.
    $('#gameArea')
        .html('<div class="gameOver">Game Over!</div>')
        .append(
        // Create a button to start a new game.
        $('<button>Start Again</button>')
            .attr('id', 'btnPlayerRestart')
            .addClass('btn')
            .addClass('btnGameOver')
    );
};