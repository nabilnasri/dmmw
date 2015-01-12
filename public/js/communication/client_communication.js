//ausgehende Antwort die vom Server an alle gesendet wird
var socket = io.connect();
socket.on('motion', function (data) {
    //setze den text
    $('#eingabe').text(data.text);
});

//Anfrage die vom Client zum Server geschickt wird
function sendMotion(ev) {
    // Socket senden
    socket.emit('motion', {text: moveIt(ev)});
}

// bei einem Klick
//$('#ioTest').click(sendMotion);