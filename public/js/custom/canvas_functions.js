function fullscreen() {
    var canvas = document.getElementById('playground');
    if (canvas.webkitRequestFullScreen) {
        canvas.webkitRequestFullScreen();

    } else {
        canvas.mozRequestFullScreen();
    }
    canvas.height = window.screen.availHeight;
    canvas.width = window.screen.availWidth * (2 / 3);
}

document.getElementById('fullscreen').addEventListener("click", fullscreen);
initCanvasProperties();

window.onload = function () {
    setCanvasProperties();
};
$(document).keyup(onKeyUp);


function initCanvasProperties(){
    $("#playground-container").height(600);
    setPlayerOneHeight();
}

function setPlayerOneHeight(){
    $("#player-one").css("margin-top", ($("#playground-container").height() - $("#player-one").height()));
}

function onKeyUp(evt) {
    if (evt.keyCode === 32) {
        sendReady();
    }
}



function setCanvasProperties(){
    var pg = $("#playground");
    var pg_parent = pg.parent();
    var canvas = document.getElementsByTagName('canvas')[0];
    canvas.width  = pg_parent.width();
    canvas.height = pg_parent.height();
}


/*
Ajax Request (zurück zu Home)
 */
function refresh_site() {
    NProgress.start();
    $.ajax({
        url: "/",
        type: 'GET',
        dataType: "html",
        data: {}
    }).done(function (data) {
        var content =  $(data).find('#content').html();
        $("#content").html(content);
        var scripts = $(data).find('#content-scripts').html();
        $('#content-scripts').html(scripts);
        history.pushState(null, null, "/");
        NProgress.done();
    });
}

$("#backtohome").click(function(){
    refresh_site();
});

