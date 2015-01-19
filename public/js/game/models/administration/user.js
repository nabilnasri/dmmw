function UUUser(username) {
    this.username = username;
    this.mobileDevice = new MobileDevice();
    this.currentPoints = 0;
    this.lives = 3;
}

/**
 * A User can have two roles
 * One is "host". This role represents the big screen.
 * The other one is "player", which represent our controller on the mobile device.
 *
 * A User get role, when he press the "create" or "join" button.
 *
 * */

var User = {

    /**
     * Keep track of the gameId, which is identical to the ID
     * of the Socket.IO Room used for the players and host to communicate
     */
    gameId: 0,

    /**
     * This is used to differentiate between 'Host' and 'Player' browsers.
     */
    myRole: '',   // 'Player' or 'Host'

    /**
     * The Socket.IO socket object identifier. This is unique for
     * each player and host. It is generated when the browser initially
     * connects to the server when the page loads for the first time.
     */
    mySocketId: '',

    /**
     * Identifies the current round. Starts at 0 because it corresponds
     * to the array of word data stored on the server.
     */
    currentRound: 0,


    /* **************************** *
     *         HOST CODE            *
     * **************************** */
    Host: {

        /**
         * Contains references to player data
         */
        players: [],

        /**
         * Flag to indicate if a new game is starting.
         * This is used after the first game ends, and players initiate a new game
         * without refreshing the browser windows.
         */
        isNewGame: false,

        /**
         * Keep track of the number of players that have joined the game.
         */
        numPlayersInRoom: 0,

        /**
         * A reference to the correct answer for the current round.
         */
        currentCorrectAnswer: '',

        /**
         * Handler for the "Start" button on the Title Screen.
         */
        onCreateClick: function () {
            // console.log('Clicked "Create A Game"');
            IO.socket.emit('hostCreateNewGame');
        },

        /**
         * The Host screen is displayed for the first time.
         * @param data{{ gameId: int, mySocketId: * }}
         */
        gameInit: function (data) {
            User.gameId = data.gameId;
            User.mySocketId = data.mySocketId;
            User.myRole = 'Host';
            User.Host.numPlayersInRoom = 0;

            User.Host.displayNewGameScreen();
            // console.log("Game started with ID: " + User.gameId + ' by host: ' + User.mySocketId);
        },

        /**
         * Show the Host screen containing the game URL and unique game ID
         */
        displayNewGameScreen: function () {
            // Fill the game screen with the appropriate HTML
            User.$gameArea.html(User.$templateNewGame);

            // Display the URL on screen
            $('#gameURL').text(window.location.href);
            User.doTextFit('#gameURL');

            // Show the gameId / room id on screen
            $('#spanNewGameCode').text(User.gameId);
        },

        /**
         * Update the Host screen when the first player joins
         * @param data{{playerName: string}}
         */
        updateWaitingScreen: function (data) {
            // If this is a restarted game, show the screen.
            if (User.Host.isNewGame) {
                User.Host.displayNewGameScreen();
            }
            // Update host screen
            $('#playersWaiting')
                .append('<p/>')
                .text('Player ' + data.playerName + ' joined the game.');

            // Store the new player's data on the Host.
            User.Host.players.push(data);

            // Increment the number of players in the room
            User.Host.numPlayersInRoom += 1;

            // If two players have joined, start the game!
            if (User.Host.numPlayersInRoom === 2) {
                // console.log('Room is full. Almost ready!');

                // Let the server know that two players are present.
                IO.socket.emit('hostRoomFull', User.gameId);
            }
        },

        /**
         * Show the countdown screen
         */
        gameCountdown: function () {
            //TODO hier unser cooler ladebildschirm B-)
            // Prepare the game screen with new HTML
            User.$gameArea.html(User.$hostGame);
            User.doTextFit('#hostWord');

            // Begin the on-screen countdown timer
            var $secondsLeft = $('#hostWord');
            User.countDown($secondsLeft, 5, function () {
                IO.socket.emit('hostCountdownFinished', User.gameId);
            });

            // Display the players' names on screen
            $('#player1Score')
                .find('.playerName')
                .html(User.Host.players[0].playerName);

            $('#player2Score')
                .find('.playerName')
                .html(User.Host.players[1].playerName);

            // Set the Score section on screen to 0 for each player.
            $('#player1Score').find('.score').attr('id', User.Host.players[0].mySocketId);
            $('#player2Score').find('.score').attr('id', User.Host.players[1].mySocketId);
        },

        /**
         * Show the word for the current round on screen.
         * @param data{{round: *, word: *, answer: *, list: Array}}

        newWord: function (data) {
            // Insert the new word into the DOM
            $('#hostWord').text(data.word);
            User.doTextFit('#hostWord');

            // Update the data for the current round
            User.Host.currentCorrectAnswer = data.answer;
            User.Host.currentRound = data.round;
        },*/

        /**
         * Check the answer clicked by a player.
         * @param data{{round: *, playerId: *, answer: *, gameId: *}}
         */
        checkAnswer: function (data) {
            //TODO postionsdaten auswerten und ggf. brick entfernen (Punkte hochzaehlen...)
            //TODO uberpruefung ob brings noch vorhanden sind, falls nicht -> emit('endGame'
            // Verify that the answer clicked is from the current round.
            // This prevents a 'late entry' from a player whos screen has not
            // yet updated to the current round.
            if (data.round === User.currentRound) {

                // Get the player's score
                var $pScore = $('#' + data.playerId);

                // Advance player's score if it is correct
                if (User.Host.currentCorrectAnswer === data.answer) {
                    // Add 5 to the player's score
                    $pScore.text(+$pScore.text() + 5);

                    // Advance the round
                    User.currentRound += 1;

                    // Prepare data to send to the server
                    var data = {
                        gameId: User.gameId,
                        round: User.currentRound
                    }

                    // Notify the server to start the next round.
                    IO.socket.emit('hostNextRound', data);

                } else {
                    // A wrong answer was submitted, so decrement the player's score.
                    $pScore.text(+$pScore.text() - 3);
                }
            }
        },


        /**
         * All 10 rounds have played out. End the game.
         * @param data
         */
        endGame: function (data) {
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
            User.doTextFit('#hostWord');

            // Reset game data
            User.Host.numPlayersInRoom = 0;
            User.Host.isNewGame = true;
        },

        /**
         * A player hit the 'Start Again' button after the end of a game.
         */
        restartGame: function () {
            User.$gameArea.html(User.$templateNewGame);
            $('#spanNewGameCode').text(User.gameId);
        }
    },


    /* **************************** *
     *        PLAYER CODE           *
     * ******************************/

    Player: {

        /**
         * A reference to the socket ID of the Host
         */
        hostSocketId: '',

        /**
         * The player's name entered on the 'Join' screen.
         */
        myName: '',

        /**
         * Click handler for the 'JOIN' button
         */
        onJoinClick: function () {
            // console.log('Clicked "Join A Game"');

            // Display the Join Game HTML on the player's screen.
            User.$gameArea.html(User.$templateJoinGame);
        },

        /**
         * The player entered their name and gameId (hopefully)
         * and clicked Start.
         */
        onPlayerStartClick: function () {
            // console.log('Player clicked "Start"');

            // collect data to send to the server
            var data = {
                gameId: +($('#inputGameId').val()),
                playerName: $('#inputPlayerName').val() || 'anon'
            };

            // Send the gameId and playerName to the server
            IO.socket.emit('playerJoinGame', data);

            // Set the appropriate properties for the current player.
            User.myRole = 'Player';
            User.Player.myName = data.playerName;
        },

        /**
         *  Click handler for the Player hitting a word in the word list.
         */
        onPlayerAnswerClick: function () {
            // console.log('Clicked Answer Button');
            var $btn = $(this);      // the tapped button
            var answer = $btn.val(); // The tapped word

            // Send the player info and tapped word to the server so
            // the host can check the answer.
            var data = {
                gameId: User.gameId,
                playerId: User.mySocketId,
                answer: answer,
                round: User.currentRound
            }
            IO.socket.emit('playerAnswer', data);
        },

        /**
         *  Click handler for the "Start Again" button that appears
         *  when a game is over.
         */
        onPlayerRestart: function () {
            var data = {
                gameId: User.gameId,
                playerName: User.Player.myName
            }
            IO.socket.emit('playerRestart', data);
            User.currentRound = 0;
            $('#gameArea').html("<h3>Waiting on host to start new game.</h3>");
        },

        /**
         * Display the waiting screen for player 1
         * @param data
         */
        updateWaitingScreen: function (data) {
            if (IO.socket.socket.sessionid === data.mySocketId) {
                User.myRole = 'Player';
                User.gameId = data.gameId;

                $('#playerWaitingMessage')
                    .append('<p/>')
                    .text('Joined Game ' + data.gameId + '. Please wait for game to begin.');
            }
        },

        /**
         * Display 'Get Ready' while the countdown timer ticks down.
         * @param hostData
         */
        gameCountdown: function (hostData) {
            User.Player.hostSocketId = hostData.mySocketId;
            $('#gameArea')
                .html('<div class="gameOver">Get Ready!</div>');
        },

        /**
         * Show the list of words for the current round.
         * @param data{{round: *, word: *, answer: *, list: Array}}
         */
        newWord: function (data) {
            //TODO hier permanent die Controller-View setzen
            // Create an unordered list element
            var $list = $('<ul/>').attr('id', 'ulAnswers');

            // Insert a list item for each word in the word list
            // received from the server.
            $.each(data.list, function () {
                $list                                //  <ul> </ul>
                    .append($('<li/>')              //  <ul> <li> </li> </ul>
                        .append($('<button/>')      //  <ul> <li> <button> </button> </li> </ul>
                            .addClass('btnAnswer')   //  <ul> <li> <button class='btnAnswer'> </button> </li> </ul>
                            .addClass('btn')         //  <ul> <li> <button class='btnAnswer'> </button> </li> </ul>
                            .val(this)               //  <ul> <li> <button class='btnAnswer' value='word'> </button> </li> </ul>
                            .html(this)              //  <ul> <li> <button class='btnAnswer' value='word'>word</button> </li> </ul>
                    )
                )
            });

            // Insert the list onto the screen.
            $('#gameArea').html($list);
        },

        /**
         * Show the "Game Over" screen.
         */
        endGame: function () {
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
        }
    }
};