function moveIt(ev) {
    var orion = window.screen.orientation.type;

    if (orion === "landscape-primary") {
        return landscape_primary(ev);

    } else if (orion === "landscape-secondary") {
        return landscape_secondary(ev);

    } else if (orion === "portrait-primary") {
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
