$(document).ready(function() {
    function refresh_site() {
        NProgress.start();
        $.ajax({
            url: "/game",
            type: 'GET',
            dataType: "html",
            data: {}
        }).done(function (data) {
            var content =  $(data).find('#content').html();
            $("#content").html(content);
            var scripts = $(data).find('#content-scripts').html();
            $('#content-scripts').html(scripts);
            history.pushState(null, null, "/game");
            NProgress.done();
            jQuery(window).trigger('load');
        });
    }

    $(document).on("click", '.random-game', function () {
        var data = {};
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
            data.role = 'player';
        } else {
            data.role = 'host';
        }
        IO.socket.emit('createNewRandomGame', data);
        refresh_site();
    });

});