//ausgehende Antwort die vom Server an alle gesendet wird
var socket = io.connect();

socket.on('motion', function (data) {
    //setze den text
    //Dmmw.getInstance().motionMove(data.text);
    $('#eingabe').text(data.text);
});





function sendReady(){
    socket.emit("gameData");
}

function sendKeyMove(direction){
    socket.emit("keyMove", {direction: direction});
}
function sendKeyRelease(direction){
    socket.emit("keyRelease", {direction: direction});
}

//Anfrage die vom Client zum Server geschickt wird
function sendMotion(ev) {
    // Socket senden
    socket.emit('motion', {text: moveIt(ev)});
}


/*
GAME REQUESTS
 */
socket.on('connect', function() {
    //socket.emit("gameData");
});

var drawing = null;
socket.on('gameInfo', function (data) {
    var gameInfo = GameInfo.getInstance();
    gameInfo.playingField = data["game"]["playingField"];
    gameInfo.balls = data["game"]["playingField"]["balls"];
    gameInfo.paddles = data["game"]["playingField"]["paddles"];
    gameInfo.bricks = data["game"]["playingField"]["bricks"];
    gameInfo.colorpicker = data["game"]["colorpicker"];
    if(drawing == null){
        drawing = new Drawing(gameInfo);
    }
    drawing.draw();
});

socket.on('gameBalls', function(data){
    var gameInfo = GameInfo.getInstance();
    gameInfo.balls = data["balls"];
    drawing.draw();
});

socket.on('gameBricks', function(data){
    var gameInfo = GameInfo.getInstance();
    gameInfo.bricks[data["row"]][data["col"]] = 0;
});

socket.on('gameColorPicker', function(data){
    var gameInfo = GameInfo.getInstance();
    gameInfo.colorpicker = data["colorpicker"];
});

socket.on('gamePaddles', function(data){
    var gameInfo = GameInfo.getInstance();
    gameInfo.paddles = data["paddles"];
    drawing.draw();
});


/*
END GAME REQUESTS
 */