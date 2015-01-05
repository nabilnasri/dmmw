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
            NProgress.done()
        });
    }

    $(document).on("click", '.random-game', function () {
        //refresh_site();
    });

});