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
window.addEventListener('devicemotion', sendMotion, false);


function mouseMove(evt) {
    /*
    if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
        playingField.getPaddle(0).xCoor = Math.max(evt.pageX - canvasMinX - (playingField.getPaddle(0).PaddleWidth / 2), 0);
        playingField.getPaddle(1).xCoor = Math.max(evt.pageX - canvasMinX - (playingField.getPaddle(1).PaddleWidth / 2), 0);
        playingField.getPaddle(0).xCoor = Math.min(playingField.FieldWidth - playingField.getPaddle(0).PaddleWidth, playingField.getPaddle(0).xCoor);
        playingField.getPaddle(1).xCoor = Math.min(playingField.FieldWidth - playingField.getPaddle(1).PaddleWidth, playingField.getPaddle(0).xCoor);
    }
     */
}

function motionMove(direction) {
    if (direction == "right") {
        playingField.getPaddle(0).xCoor += 20;
    } else if (direction == "left") {
        playingField.getPaddle(0).xCoor -= 20;
    }
};

$(document).mousemove(mouseMove);
