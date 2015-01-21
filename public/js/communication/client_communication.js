//ausgehende Antwort die vom Server an alle gesendet wird
var socket = io.connect();

socket.on('motion', function (data) {
    //setze den text
    //Dmmw.getInstance().motionMove(data.text);
    $('#eingabe').text(data.text);
});





//Anfrage die vom Client zum Server geschickt wird
function sendMotion(ev) {
    // Socket senden
    socket.emit('motion', {text: moveIt(ev)});
}

function sendReady(){
    socket.emit("gameData");
}

/*
GAME REQUESTS
 */
socket.on('connect', function() {
    //socket.emit("gameData");
});

socket.on('gameInfo', function (data) {
    //console.log(data["game"]["playingField"]["balls"]);
    playingField = data["game"]["playingField"];
    balls = data["game"]["playingField"]["balls"];
    paddles = data["game"]["playingField"]["paddles"];
    bricks = data["game"]["playingField"]["bricks"];
    colorpicker = data["game"]["colorpicker"];
    draw();
});
/*
END GAME REQUESTS
 */