var GameSetups = {

    /* ********************************** *
     *           SETUP FUNCTIONS          *
     * ********************************** */

    /**
     * This runs when the page initially loads.
     */
    init: function () {
        GameSetups.cacheElements();
        GameSetups.showInitScreen();
        GameSetups.bindEvents();

        // Initialize the fastclick library to minimize the reactiontime of the mobile device
        FastClick.attach(document.body);
    },

    /**
     * Create references to on-screen elements used throughout the game.
     */
    cacheElements: function () {
        GameSetups.$doc = $(document);

        // Templates
        GameSetups.$gameArea = $('#content');
        //TODO laden von unseren templates
        GameSetups.$templateIntroScreen = $('#intro-screen-template').html();
        GameSetups.$templateNewGame = $('#create-game-template').html();
        GameSetups.$templateJoinGame = $('#join-game-template').html();
        GameSetups.$hostGame = $('#host-game-template').html();
    },

    /**
     * Create some click handlers for the various buttons that appear on-screen.
     */
    bindEvents: function () {
        // Host
        GameSetups.$doc.on('click', '#btnCreateGame', User.Host.onCreateClick);

        // Player
        GameSetups.$doc.on('click', '#btnJoinGame', User.Player.onJoinClick);
        GameSetups.$doc.on('click', '#btnStart', User.Player.onPlayerStartClick);
        GameSetups.$doc.on('click', '#btnPlayerRestart', User.Player.onPlayerRestart);
    },

    /* *********************************** *
     *             GAME LOGIC              *
     * *********************************** */

    /**
     * Show the initial dmmw Title Screen
     * (with Start and Join buttons)
     */
    showInitScreen: function () {
        GameSetups.$gameArea.html(User.$templateIntroScreen);
        GameSetups.doTextFit('.title');
    },

    /**
     * Make the text inside the given element as big as possible
     * See: https://github.com/STRML/textFit
     *
     * @param el The parent element of some text
     */
    doTextFit: function (el) {
        textFit(
            $(el)[0],
            {
                alignHoriz: true,
                alignVert: false,
                widthOnly: true,
                reProcess: true,
                maxFontSize: 300
            }
        );
    },

    /* ************************ *
     *       UTILITY CODE       *
     * ************************ */

    /**
     * Display the countdown timer on the Host screen
     *
     * @param $el The container element for the countdown timer
     * @param startTime
     * @param callback The function to call when the timer ends.
     */
    countDown: function ($el, startTime, callback) {

        // Display the starting time on the screen.
        $el.text(startTime);
        GameSetups.doTextFit('#hostWord');

        // console.log('Starting Countdown...');

        // Start a 1 second timer
        var timer = setInterval(countItDown, 1000);

        // Decrement the displayed timer value on each 'tick'
        function countItDown() {
            startTime -= 1
            $el.text(startTime);
            GameSetups.doTextFit('#hostWord');

            if (startTime <= 0) {
                // console.log('Countdown Finished.');

                // Stop the timer and do the callback.
                clearInterval(timer);
                callback();
                return;
            }
        }

    }
};

GameSetups.init();