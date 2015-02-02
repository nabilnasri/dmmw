var canvas;
var ctx;

window.onload = function(){
    canvas = document.getElementById("con_canvas");
    canvas.addEventListener("touchstart",doTouchStart,false);
    ctx = canvas.getContext("2d");

    initialise();
};

//window.addEventListener('devicemotion', sendMotion, false);
window.addEventListener("resize", adaptToResize, false);
//window.addEventListener('keydown', onKeyDown, false);
//window.addEventListener('keyup', onKeyUp, false);

function initialise(){
    $("body").css("overflow", "hidden");
    setControllerCanvasSize();
    customArea();
    randomPUps();
    canvasApp();
}



function customArea(){
    var height = window.innerHeight;
    var width = window.innerWidth;
    var xCA = 0;
    var yCA = 0;
    var color = "#F27935";
    rect(ctx, xCA , yCA , width, height*0.10, color);
    ctx.fillStyle = "black";
    ctx.font = "bold 20px Calibri";
    ctx.fillText("USERNAME", width*0.1, height*0.065);
    ctx.fillStyle = "black";
    ctx.font = "bold 20px Calibri";
    ctx.fillText("O Points", width*0.5, height*0.065);
    ctx.fillStyle = "black";
    ctx.font = "bold 20px Calibri";
    ctx.fillText("3", width*0.8, height*0.065);
}



var deletePowerUp = false;
var displayWidth;
var displayHeight;
function canvasApp() {
    var particleList;
    var numParticles;
    var timer;
    var p;
    var initVelMax;
    var maxVelComp;
    var randAccel;
    var particleRad;
    var maxParticleRad;
    var minParticleRad;
    var px;
    var py;

    init();

    function init() {

        numParticles = 1; // kann man nutzen als Menge der PowerUps
        maxParticleRad = 32;
        minParticleRad = 28;
        particleRad = 15; // größe der PowerUps

        initVelMax = 10.5;
        maxVelComp = 20.5;
        randAccel = 2.5; //bescheunigungsfaktor

        particleList = {}; // powerUpListe
        createParticles();

        ctx.fillStyle = "#000000";  // muss unser window sein
        ctx.fillRect(displayHeight*0.1, displayHeight, displayWidth, displayHeight*0.9); // unsere window daten //poweruparea
        timer = setInterval(onTimer, 1000 / 40); // aktualisierungZeit
    }

    function createParticles() { // create PowerUps
        var angle;
        var vAngle;
        var vMag;
        var r, g, b;
        var minRGB = 16;
        var maxRGB = 255;
        var alpha = 1;
        var color;
        for (var i = 0; i < numParticles; i++) {
            angle = Math.random() * 2 * Math.PI;
            vAngle = Math.random() * 2 * Math.PI;
            vMag = initVelMax * (0.6 + 0.4 * Math.random());
            r = Math.floor(minRGB + Math.random() * (maxRGB - minRGB)); //aussehen
            g = Math.floor(minRGB + Math.random() * (maxRGB - minRGB)); //"
            b = Math.floor(minRGB + Math.random() * (maxRGB - minRGB));	// "
            color = "rgba(" + r + "," + g + "," + b + "," + alpha + ")"; //"
            var newParticle = {
                x: Math.random() * displayWidth,
                y: Math.random() * displayHeight,
                velX: vMag * Math.cos(vAngle),
                velY: vMag * Math.sin(vAngle),
                rad: minParticleRad + Math.random() * (maxParticleRad - minParticleRad),
                color: color
            };
            if (i > 0) {
                newParticle.next = particleList.first;
            }
            particleList.first = newParticle;
        }
    }

    function onTimer() {  // bewegung des powerUps

        //fading. This won't work very well in Chrome, IE, and Firefox - gray trails will be left behind.
        ctx.fillStyle = "rgba(0,0,0,0.04)";
        ctx.fillRect(0, displayHeight*0.1, displayWidth, displayHeight*0.9); //

        //update and draw particles
        p = particleList.first;
        while (p != null) {

            //random accleration
            p.velX += (1 - 2 * Math.random()) * randAccel;
            p.velY += (1 - 2 * Math.random()) * randAccel;

            //don't let velocity get too large
            if (p.velX > maxVelComp) {
                p.velX = maxVelComp;
            }
            else if (p.velX < -maxVelComp) {
                p.velX += -maxVelComp;
            }
            if (p.velY > maxVelComp) {
                p.velY = maxVelComp;
            }
            else if (p.velY < -maxVelComp) {
                p.velY += -maxVelComp;
            }

            p.x += p.velX;
            p.y += p.velY;

            //boundary
            if (p.x > displayWidth - p.rad) {
                p.x = displayWidth - p.rad;
                p.velX *= -1;
            }
            if (p.x < p.rad) {
                p.x = p.rad;
                p.velX *= -1;
            }
            if (p.y > displayHeight - p.rad ) {
                p.y = displayHeight - p.rad;
                p.velY *= -1;
            }

            if (p.y < displayHeight*0.1 + p.rad ) {
                p.y = displayHeight*0.1 + p.rad;
                p.velY *= -1;
            }
            if (p.y < p.rad) {
                p.y = p.rad;
                p.velY *= -1;
            }

            if (deletePowerUp){

                particleList = {};
                deletePowerUp = false;
                ctx.clear();


            }else {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.rad, 0, 2 * Math.PI, false);
                ctx.closePath();
                ctx.fill();
                px = p.x;
                py = p.y;
                //advance
                p = p.next;
            }

        }
    }
}


function adaptToResize() {
    setControllerCanvasSize();
    customArea();
}


function rect(ctx, x, y, w, h, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}


function setControllerCanvasSize(){
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    displayWidth = canvas.width;
    displayHeight = canvas.height;
}



function randomPUps(){

    var r =Math.floor(Math.random() * 7);
    var randomUp = new selectPowerUp();

    randomUp.powerUpArray[r];
}


function doTouchStart(eve) {
    eve.preventDefault();
    var concan_x = event.targetTouches[0].pageX;
    var concan_y = event.targetTouches[0].pageY;

    hitPowerUp(px, py,concan_x,concan_y);
}

function hitPowerUp(px,py,concan_x,concan_y) {

    px = Math.ceil(px);
    py = Math.ceil(py);
    concan_x = Math.ceil(concan_x);
    concan_y = Math.ceil(concan_y);

    if(( concan_x <= px+50 && concan_x>= px-50 ) && ( concan_y <= py+50 && concan_y>= py-50 )){
        //randomPUps();
        deletePowerUp = true;
    }
}



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