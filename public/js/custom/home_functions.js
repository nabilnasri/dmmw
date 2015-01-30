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

    $(document).on('click', '.random-game', function () {
        var data = {};
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            data.role = 'player';
        } else {
            data.role = 'host';
        }
        console.log("CREATE RANDOM GAME");
        IO.socket.emit('createNewRandomGame', data);
        refresh_site('game');
    });

    $(document).on('click', '.private-game', function () {
        refresh_site('private');
    });
});