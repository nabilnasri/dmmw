function handleOrientation(event) {
    var x = event.beta;  // In degree in the range [-180,180]
    var y = event.gamma; // In degree in the range [-90,90]

    console.log(y, " GAMMA");
    console.log(x, "BETA");
}

alert("HU");


window.addEventListener('deviceorientation', handleOrientation, true);