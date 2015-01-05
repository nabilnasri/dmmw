var socket = io.connect();
//ausgehende Antwort die vom Server an alle gesendet wird
socket.on('chat', function (data) {
    $('#eingabe').text(data.text);
});

//Anfrage die vom Client zum Server geschickt wird
function senden() {
    // Eingabefelder auslesen
    //var name = $('#eingabe').val();
    // Socket senden
    socket.emit('chat', {text: "eicarmaba"});
}

// bei einem Klick
$('#ioTest').click(senden);