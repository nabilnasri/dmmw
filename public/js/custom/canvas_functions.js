
window.onload = function () {
    setCanvasProperties();
};

initCanvasProperties();


function initCanvasProperties(){
    $("#playground-container").height(window.innerHeight - $("#navbar").height());
    setPlayerOneHeight();
}

function setPlayerOneHeight(){
    $("#player-one").css("margin-top", ($("#playground-container").height() - $("#player-one").height()));
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


function onKeyUp(evt) {
    if (evt.keyCode === 13) {
        sendReady();
    }
    if (evt.keyCode === 80) {
        //$('#playground').css('background-image', 'url(http://p1.pichost.me/640/63/1874845.jpg)');
        sendPause();
    }
    if (evt.keyCode === 39) {
        sendKeyRelease("right");
    } else if (evt.keyCode === 37) {
        sendKeyRelease("left");
    }
}

function onKeyDown(evt) {
    if (evt.keyCode === 39) {
        sendKeyMove("right");
    } else if (evt.keyCode === 37) {
        sendKeyMove("left");
    }
}

window.addEventListener('keydown', onKeyDown, false);
window.addEventListener('keyup', onKeyUp, false);