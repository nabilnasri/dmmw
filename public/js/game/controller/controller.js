/*
Controller Klasse.
 */

/*
Orientation des Devices
 */
function moveIt(ev) {
    //Aktuelle Orientation
    var orientation = window.orientation;

    if (orientation === 90) {
        return landscape_primary(ev);

    } else if (orientation === -90) {
        return landscape_secondary(ev);

    } else if (orientation === 0) {
        return portrait_primary(ev);
    }
}

/*
Wenn sich das Handy im Landscape(Primary)[Seitlich 90grad nach Links] befindet
 */
function landscape_primary(ev) {
    var acc = ev.accelerationIncludingGravity;

    if (acc.y < -1) {
        return "left";
    } else if (acc.y > 1) {
        return "right";
    } else {
        return "stop";
    }

}

/*
 Wenn sich das Handy im Landscape(Secondary)[Seitlich 90grad nach rechts] befindet
 */
function landscape_secondary(ev) {
    var acc = ev.accelerationIncludingGravity;

    if (acc.y > 1) {
        return "left";
    } else if(acc.y < -1) {
        return "right";
    } else {
        return "stop";
    }

}

/*
 Wenn sich das Handy im Potrait(normal)[0grad] befindet
 */
function portrait_primary(ev) {
    var acc = ev.accelerationIncludingGravity;

    if (acc.x > 1) {
        return "left";
    } else if (acc.x < -1) {
        return "right";
    } else {
        return "stop";
    }

}

window.onload = function(){
    initialise();
};



function initialise(){
    var canvas = document.getElementById("con_canvas");
    canvas.addEventListener("touchstart",doTouchStart,false);
    bla(canvas);
}

function doTouchStart(eve){

    eve.preventDefault();
    var concan_x = event.targetTouches[0].pageX;
    var concan_y = event.targetTouches[0].pageY;
   // alert(concan_x + "x" + concan_y+ "y");
}

function bla(con_canvas){
    if(con_canvas.webkitRequestFullScreen){
        con_canvas.webkitRequestFullScreen();
    }else {
        con_canvas.mozRequestFullScreen();
    }

    con_canvas.height = window.screen.availHeight;
    con_canvas.width = window.screen.availWidth;
}

