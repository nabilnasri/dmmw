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

//Eventlistner wenn man das Gerät bewegt.
window.addEventListener('devicemotion', IO.sendMotion, false);

window.addEventListener('keydown', onKeyDown, false);
window.addEventListener('keyup', onKeyUp, false);



/*
 Static Funktion (ohne prototype)
 */
function onKeyUp(evt) {
    if (evt.keyCode === 39) {
        IO.sendKeyRelease("right");
    } else if (evt.keyCode === 37) {
        IO.sendKeyRelease("left");
    }
}

function onKeyDown(evt) {
    if (evt.keyCode === 39) {
        IO.sendKeyMove("right");
    } else if (evt.keyCode === 37) {
        IO.sendKeyMove("left");
    }
}