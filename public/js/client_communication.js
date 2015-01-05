var socket = io.connect();
//ausgehende Antwort die vom Server an alle gesendet wird
socket.on('chat', function (data) {
    var zeit = new Date(data.zeit);
    $('#content').append(
        $('<li></li>').append(
            // Uhrzeit
            $('<span>').text('[' +
                (zeit.getHours() < 10 ? '0' + zeit.getHours() : zeit.getHours())
                + ':' +
                (zeit.getMinutes() < 10 ? '0' + zeit.getMinutes() : zeit.getMinutes())
                + '] '
            ),
            // Name
            $('<b>').text(typeof(data.name) != 'undefined' ? data.name + ': ' : ''),
            // Text
            $('<span>').text(data.text))
    );
    // nach unten scrollen
    $('body').scrollTop($('body')[0].scrollHeight);
});

//Anfrage die vom Client zum Server geschickt wird
function senden() {
    // Eingabefelder auslesen
    var name = $('#name').val();
    var text = $('#text').val();
    // Socket senden
    socket.emit('chat', {name: name, text: text});
    // Text-Eingabe leeren
    $('#text').val('');
}

// bei einem Klick
$('#senden').click(senden);
// oder mit der Enter-Taste
$('#text').keypress(function (e) {
    if (e.which == 13) {
        senden();
    }
});