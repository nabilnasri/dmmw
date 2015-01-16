function moveIt(ev) {
    var orion = window.orientation;
    console.log(orion, " asdas");

    if (orion === 90) {
        return landscape_primary(ev);

    } else if (orion === -90) {
        return landscape_secondary(ev);

    } else if (orion === 0) {
        return portrait_primary(ev);
    }
}

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

window.addEventListener('devicemotion', sendMotion, false);
