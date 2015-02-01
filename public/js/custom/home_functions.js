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

    /** ********************************
     *           RANDOM GAME           *
     * ****************************** **/
    $(document).on('click', '.random-game', function () {
        IO.socket.emit('createNewRandomGame');
        refresh_site('enterName');
    });

    /** ********************************
     *          PRIVATE GAME           *
     * ****************************** **/
    $(document).on('click', '.private-game', function () {
        IO.socket.emit('createNewPrivateGame');
        refresh_site('private');
    });

    function redirecttowaiting(site){
        refresh_site(site);
    }
});