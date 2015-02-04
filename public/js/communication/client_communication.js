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
    },

    /**
     * While connected, Socket.IO will listen to the following events emitted
     * by the Socket.IO server, then run the appropriate function.
     */
    bindEvents: function () {
        IO.socket.on('connected', IO.onConnected);

        IO.socket.on('initUser', IO.initUser);
        IO.socket.on('allGameIds', IO.allGameIds);
        IO.socket.on('playerJoinedRoom', IO.playerJoinedRoom);
        IO.socket.on('setUserData', IO.setUserData);
        IO.socket.on('mobiledeviceConnected', IO.mobiledeviceConnected);
        IO.socket.on('updateMobileState', IO.updateMobileState);
        IO.socket.on('setAllUserWaitingscreen', IO.setAllUserWaitingscreen);
        IO.socket.on('setAllUserGamingscreen', IO.setAllUserGamingscreen);
        IO.socket.on('playerPressedReady', IO.playerPressedReady);
        IO.socket.on('allPlayersAreReady', IO.allPlayersAreReady);
        IO.socket.on('beginNewGame', IO.beginNewGame);
        IO.socket.on('ups', IO.error);

        IO.socket.on('gameOver', IO.gameOver);
        IO.socket.on('ballWasOutside', IO.ballWasOutside);
        IO.socket.on('gameInfo', IO.gameInfo);
        IO.socket.on('gameBalls', IO.gameBalls);
        IO.socket.on('gameBricks', IO.gameBricks);
        IO.socket.on('gameMasterBrick', IO.gameMasterBricks);
        IO.socket.on('gameColorPicker', IO.gameColorPicker);
        IO.socket.on('gamePaddles', IO.gamePaddles);
        IO.socket.on('playerPoints', IO.playerPoints);
        IO.socket.on('unlockedPowerUp', IO.unlockPowerUp);
    },

    /**
     * Client ist erfolgreich verbunden
     */
    onConnected: function () {
        console.log('onConnected');
        IO.user = new Client_User();
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            IO.user.setRole('player');
        } else {
            IO.user.setRole('host');
        }
    },

    /**
     * Ein neues Spiel mit einer zufaelligen ID wird erstellt.
     */
    initUser: function (data) {
        console.log('INIT USER ' + JSON.stringify(data));
        IO.user.setGameId(data.gameId);
        IO.user.setSocketId(data.mySocketId);
        IO.user.setPlayerNumber(data.playernumber);
        if ('goToGame' in data) {
            refresh_site('registratephone');
        }
    },

    /**
     * Spieler ist erfolgreich einem Spiel beigetreten.
     */
    playerJoinedRoom: function (data) {
        document.getElementById('name' + data.playerNumber).innerHTML = data.username;
    },

    /**
     * Spieler ist erfolgreich einem Spiel beigetreten.
     */
    allGameIds: function (data) {
        IO.user.setAllGameIds(data.allIds);
    },


    /**
     * Mobile Device ist verbunden
     */
    mobiledeviceConnected: function (data) {
        IO.user.setUsername(data.username);
        IO.user.setPlayerNumber((data.playerNumber));
        $("#enter-room-container").hide();
        $("#back-to-life-container").show();
    },

    /**
     * Ball ist ausserhalb des Spielfelds
     */
    ballWasOutside: function (data){
        IO.socket.emit('iAmAlive', {gameId: IO.user.getGameId(), playerNumber: IO.user.getPlayerNumber()});
        if(data.ballstate){
            $("#con_canvas").hide();
            $("#back-to-life-container").show();
        }else{
            $("#back-to-life-container").hide();
            $("#con_canvas").show();
        }
    },

    /**
     * Updatet mobile Device Status
     */
    updateMobileState: function () {
        refresh_site('waitingScreen');
    },

    /**
     * Alle Spieler im Wartemodus
     */
    setAllUserWaitingscreen: function (data) {
        var userList = JSON.parse(data.users);
        for (var i = 0; i < userList.length; i++) {
            document.getElementById('name' + i).innerHTML = userList[i].username;
            if (userList[i].mobileSocketId != null) {
                document.getElementById('device' + i).style.opacity = 1.0;
            }
            if (userList[i].isReady == true) {
                document.getElementById('isReady' + i).classList.remove('glyphicon-remove');
                document.getElementById('isReady' + i).classList.add('glyphicon-ok');
                document.getElementById('isReady' + i).style.opacity = 1.0;
                if (userList[i].playerSocketId == IO.user.mySocketId) {
                    document.getElementById('ready').disabled = true;
                }
            }
        }
    },

    /**
     * Alle Spieler sehen das Gamingscreen
     */
    setAllUserGamingscreen: function (data) {
        var userList = JSON.parse(data.users);
        for (var i = 0; i < userList.length; i++) {
            document.getElementById('name' + i).innerHTML = userList[i].username;
        }
    },

    /**
     * Spieler hat den Ready Button gedrueckt
     */
    playerPressedReady: function (data) {
        var playerNumber = data.playerNumber;
        document.getElementById('isReady' + playerNumber).classList.remove('glyphicon-remove');
        document.getElementById('isReady' + playerNumber).classList.add('glyphicon-ok');
        document.getElementById('isReady' + playerNumber).style.opacity = 1.0;
        if (IO.user.getPlayerNumber() == playerNumber) {
            document.getElementById('ready').disabled = true;
        }
    },

    /**
     * Alle Spieler sind nun Bereit
     */
    allPlayersAreReady: function () {
        refresh_site('game');
    },

    /**
     * Beide Spieler sind dem Spiel beigetreten
     * @param data beinhaltet beide Spielernamen dazugehoerige Spielenummern
     */
    beginNewGame: function (data) {
        IO.user.gameCountdown(data);
    },

    /**
     * Jeder bekommt mit das, dass Spiel zu Ende ist
     */
    gameOver: function (data) {
        IO.user.endGame(data);
    },

    /**
     * Ein Fehler ist aufgetreten
     */
    error: function (data) {
        alert(data.message);
    },


    /** ********************************
     *           GAME EVENTS           *
     * ****************************** **/

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

    unlockPowerUp: function (data) {
        navigator.vibrate(1000);
        canvasApp();
    },


    /** ********************************
     *           SOCKET EMIT           *
     * ****************************** **/

    sendReady: function () {
        IO.socket.emit("gameData", {gameId: IO.user.getGameId()});
    },

    sendPause: function () {
        IO.socket.emit("gamePause", {gameId: IO.user.getGameId()});
    },

    sendMotion: function (orientationtext) {
        if(IO.user.getGameId()){
            if(IO.user.lastMotion != orientationtext){
                IO.user.lastMotion = orientationtext;
                IO.socket.emit('motion', {text: orientationtext, gameId: IO.user.getGameId(), playerNumber: IO.user.playerNumber});
            }
        }
    },

    sendBrickColor: function (row, col, color) {
        IO.socket.emit("brickColor", {row: row, col: col, brickColor: color, gameId: IO.user.getGameId()});
    },

    sendPowerUpHitted: function(){
        IO.socket.emit("powerUpHitted", {gameId: IO.user.getGameId(), playerNumber: IO.user.playerNumber});
    }


};

IO.init();