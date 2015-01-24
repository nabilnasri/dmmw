var GameSetups = {

    /**
     * This runs when the page initially loads.
     */
    init: function () {
        GameSetups.showInitScreen();
        GameSetups.bindEvents();
    },

    /**
     * Create some click handlers for the various buttons that appear on-screen.
     */
    bindEvents: function () {
        //TODO binding abchecken, aber muss bei jedem Screen neu gemacht werden, deswegen Klasse vielleicht komplett weglassen
        $('.random-game').on('click', Client_User.onClickRandomGame);
        $('.private-game').on('click', Client_User.onClickPrivateGame);
        //$('.start').on('click', Client_User.Host.onCreateClick);
    },

    /**
     * Show the initial dmmw Title Screen
     * (with Start and Join buttons)
     */
    showInitScreen: function () {
        //TODO
        GameSetups.$gameArea.html(Client_User.$templateIntroScreen);
    }

};

GameSetups.init();