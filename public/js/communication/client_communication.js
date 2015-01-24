/**
 * All the code relevant to Socket.IO is collected in the IO namespace.
 */
var IO = {
    /**
     * This is called when the page is displayed. It connects the Socket.IO client
     * to the Socket.IO server
     */
    init: function () {
        IO.socket = io.connect();
        IO.bindEvents();
        IO.drawing = null;
        IO.user = new Client_User();
    },

    /**
     * While connected, Socket.IO will listen to the following events emitted
     * by the Socket.IO server, then run the appropriate function.
     */
    bindEvents: function () {
        IO.socket.on('connected', IO.onConnected);

        IO.socket.on('newRandomGameCreated', IO.onNewRandomGameCreated);
        IO.socket.on('playerJoinedRoom', IO.playerJoinedRoom);
        IO.socket.on('beginNewGame', IO.beginNewGame);
        IO.socket.on('gameOver', IO.gameOver);
        IO.socket.on('error', IO.error);

        IO.socket.on('gameInfo', IO.gameInfo);
        IO.socket.on('gameBalls', IO.gameBalls);
        IO.socket.on('gameBricks', IO.gameBricks);
        IO.socket.on('gameMasterBrick', IO.gameMasterBricks);
        IO.socket.on('gameColorPicker', IO.gameColorPicker);
        IO.socket.on('gamePaddles', IO.gamePaddles);
        IO.socket.on('playerPoints', IO.playerPoints);
    },

    /**
     * The client is successfully connected!
     */
    onConnected: function () {
        IO.user = new Client_User(IO.socket.io.engine.id);
    },

    /**
     * A new game has been created and a random game ID has been generated.
     * @param data {{ gameId: int, mySocketId: * }}
     */
    onNewRandomGameCreated: function (data) {
        console.log('incoming data in IO.onNewRandomGameCreated: ', data);
        IO.user.gameInit(data);
    },

    /**
     * A player has successfully joined the game.
     * @param data {{playerName: string, gameId: int, mySocketId: int}}
     */
    playerJoinedRoom: function (data) {
        IO.user.updateWaitingScreen(data);
    },

    /**
     * Both players have joined the game.
     * @param data beinhaltet beide Spielernamen dazugehoerige Spielenummern
     */
    beginNewGame: function (data) {
        IO.user.gameCountdown(data);
    },

    /**
     * Let everyone know the game has ended.
     * @param data
     */
    gameOver: function (data) {
        IO.user.endGame(data);
    },

    /**
     * An error has occurred.
     * @param data
     */
    error: function (data) {
        alert(data.message);
    },

    gameInfo: function (data) {
        initGame(data);
        IO.drawing = Draw.getInstance();
        IO.drawing.setScale();
        IO.drawing.draw();
    },

    gameBalls: function (data) {
        updateBalls(data["balls"]);
        IO.drawing.draw();
    },

    gameBricks: function (data) {
        updateBricks(data["row"], data["col"]);
    },


    gameMasterBricks: function (data) {
        updateMasterBrick(data["masterBrick"]);
    },

    gameColorPicker: function (data) {
        updateColorPicker(data["colorpicker"]);
    },

    gamePaddles: function (data) {
        updatePaddles(data["paddles"]);
        IO.drawing.draw();
    },

    playerPoints: function (data) {
        updatePoints(data.points, data.player);
    },


    /** ********************************
     *           SOCKET EMIT           *
     * ****************************** **/

    sendReady: function () {
        IO.socket.emit("gameData");
    },

    sendPause: function () {
        IO.socket.emit("gamePause");
    },

    sendKeyMove: function (direction) {
        IO.socket.emit("keyMove", {direction: direction});
    },

    sendKeyRelease: function (direction) {
        IO.socket.emit("keyRelease", {direction: direction});
    },

    sendMotion: function (ev) {
        IO.socket.emit('motion', {text: moveIt(ev)});
    },

    sendBrickColor: function (row, col, color) {
        IO.socket.emit("brickColor", {row: row, col: col, brickColor: color});
    }
};

IO.init();