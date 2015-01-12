//ausgehende Antwort die vom Server an alle gesendet wird
var socket = io.connect();
socket.on('motion', function (data) {
    //setze den text
    $('#eingabe').text(data.text);
});

//Anfrage die vom Client zum Server geschickt wird
function senden() {
    // Eingabefelder auslesen
    //var name = $('#eingabe').val();
    // Socket senden
    socket.emit('chat', {text: "eicaramba"});
}

// bei einem Klick
$('#ioTest').click(senden);