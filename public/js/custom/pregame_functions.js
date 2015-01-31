$(document).ready(function () {
    function refresh_site(page) {
        NProgress.start();
        $.ajax({
            url: '/' + page,
            type: 'GET',
            dataType: "html",
            data: {}
        }).done(function (data) {
            var content = $(data).find('#content').html();
            $("#content").html(content);
            var scripts = $(data).find('#content-scripts').html();
            $('#content-scripts').html(scripts);
            history.pushState(null, null, '/' + page);
            NProgress.done();
            jQuery(window).trigger('load');
        });
    }

    $(document).on('click', '.join-private', function () {
        refresh_site('enterInfos');
    });

    $(document).on('click', '.create-private', function () {
        refresh_site('enterName');
    });

    $(document).on('click', '#username-enter', function () {
        IO.socket.emit('setUsername', {username: $('#username').val(), playerNumber: IO.user.getPlayerNumber(), gameId: IO.user.getGameId()});
        refresh_site('registratephone');
    });

    $(document).on('click', '#mobile-id-enter', function () {
        var gameId = $('#gameid-mobile').val();
        IO.user.setGameId(gameId);
        var data = {
            gameID: gameId
        };
        refresh_site('gamescreen', data);
    });

    $(document).on('click', '#start-random-game', function () {
        console.log("RAAANDOM");
        var username = $('#username').val();
        var data = {
            username: $('#username').val()
        };

        IO.user.setUsername(username);
        IO.socket.emit('createNewRandomGame', data);

        refresh_site('waitingScreen');
    });

    $(document).on('click', '#connect-to-room', function () {
        var data = {
            gameId: $('#gameId').val(),
            username: $('#username').val()
        };

        IO.socket.emit('playerJoinGame', data);

        refresh_site('waitingScreen');
    });

});