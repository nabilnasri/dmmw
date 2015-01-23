//ausgehende Antwort die vom Server an alle gesendet wird
var socket = io.connect();

function sendReady(){
    socket.emit("gameData");
}

function sendPause(){
    socket.emit("gamePause");
}

function sendKeyMove(direction){
    socket.emit("keyMove", {direction: direction});
}
function sendKeyRelease(direction){
    socket.emit("keyRelease", {direction: direction});
}

function sendMotion(ev) {
    socket.emit('motion', {text: moveIt(ev)});
}

function sendBrickColor(row,col,color){
    socket.emit("brickColor", {row: row, col:col, brickColor:color});
}

//GAME REQUESTS ---

socket.on('connect', function() {
    //CLIENT HAT SICH ERFOLGREICH VERBUNDEN
});

var drawing = null;
socket.on('gameInfo', function (data) {
    initGame(data);
    drawing = Draw.getInstance();
    drawing.setScale();
    drawing.draw();
});

socket.on('gameBalls', function(data){
    updateBalls(data["balls"]);
    drawing.draw();
});

socket.on('gameBricks', function(data){
    updateBricks(data["row"], data["col"]);
});

socket.on('gameMasterBrick', function(data){
    console.log(data["masterBrick"]);
    updateMasterBrick(data["masterBrick"]);
});

socket.on('gameColorPicker', function(data){
    updateColorPicker(data["colorpicker"]);
});

socket.on('gamePaddles', function(data){
    updatePaddles(data["paddles"]);
    drawing.draw();
});

socket.on('playerPoints', function(data){
    updatePoints(data.points, data.player);
});

//--- GAME REQUESTS