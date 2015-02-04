var canvas;
var ctx;

window.onload = function () {
    canvas = document.getElementById("con_canvas");
    canvas.addEventListener("touchstart", doTouchStart, false);
    ctx = canvas.getContext("2d");

    initialise();
};

window.addEventListener('devicemotion', moveIt, false);
window.addEventListener("resize", adaptToResize, false);

function initialise() {
    $("body").css("overflow", "hidden");
    setControllerCanvasSize();
    customArea();
    randomPUps();
}


function customArea() {
    var height = window.innerHeight;
    var width = window.innerWidth;
    var xCA = 0;
    var yCA = 0;
    var color = "#F27935";
    rect(ctx, xCA, yCA, width, height * 0.10, color);
    ctx.fillStyle = "black";
    ctx.font = "bold 20px Calibri";
    ctx.fillText(IO.user.username, width * 0.1, height * 0.065);
    ctx.fillStyle = "black";
    ctx.font = "bold 20px Calibri";
    ctx.fillText(IO.user.getCurrentPoints() + " Points", width * 0.5, height * 0.065);
}

var deletePowerUp = false;
var displayWidth;
var displayHeight;
var numParticles;
var particleList = {};
var px;
var py;
function canvasApp() {
    var timer;
    var p;
    var initVelMax;
    var maxVelComp;
    var randAccel;
    var particleRad;
    var maxParticleRad;
    var minParticleRad;

    init();

    function init() {

        numParticles = 1; // Menge der PowerUps
        maxParticleRad = 32;
        minParticleRad = 28;
        particleRad = 15; // Groesse der PowerUps

        initVelMax = 5;
        maxVelComp = 10.5;
        randAccel = 0.5; //Bescheunigungsfaktor

        createParticles();
        ctx.fillStyle = "#000000";
        ctx.fillRect(displayHeight * 0.1, displayHeight, displayWidth, displayHeight * 0.9);//poweruparea
        timer = setInterval(onTimer, 1000 / 40); //aktualisierungZeit
    }

    /**
     * erstellt neue "Partikel"
     */
    function createParticles() {
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
            g = Math.floor(minRGB + Math.random() * (maxRGB - minRGB));
            b = Math.floor(minRGB + Math.random() * (maxRGB - minRGB));
            color = "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
            var newParticle = {
                x: Math.random() * displayWidth,
                y: Math.random() * displayHeight,
                velX: vMag * Math.cos(vAngle),
                velY: vMag * Math.sin(vAngle),
                rad: minParticleRad + Math.random() * (maxParticleRad - minParticleRad),
                color: color
            };
            particleList[getNextId()] = newParticle;
        }
    }

    /**
     * Wird in einem Zeitintervall aufgerufen, damit sich die "Partikel bewegen.
     */
    function onTimer() {// bewegung des powerUps
        ctx.fillStyle = "rgba(0,0,0,0.04)";
        ctx.fillRect(0, displayHeight * 0.1, displayWidth, displayHeight * 0.9); //

        var c = 0;
        p = particleList[c];
        while (p != null) {
            p.velX += (1 - 2 * Math.random()) * randAccel;
            p.velY += (1 - 2 * Math.random()) * randAccel;

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

            if (p.x > displayWidth - p.rad) {
                p.x = displayWidth - p.rad;
                p.velX *= -1;
            }
            if (p.x < p.rad) {
                p.x = p.rad;
                p.velX *= -1;
            }
            if (p.y > displayHeight - p.rad) {
                p.y = displayHeight - p.rad;
                p.velY *= -1;
            }

            if (p.y < displayHeight * 0.1 + p.rad) {
                p.y = displayHeight * 0.1 + p.rad;
                p.velY *= -1;
            }
            if (p.y < p.rad) {
                p.y = p.rad;
                p.velY *= -1;
            }

            if (deletePowerUp) {
                deletePowerUp = false;
                ctx.clear();
                c = 0;
                p = particleList[0];
            } else {
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.rad, 0, 2 * Math.PI, false);
                ctx.closePath();
                ctx.fill();
                px = p.x;
                py = p.y;
                c+=1;
                p = particleList[c];
            }
        }
    }
}
function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function getNextId(){
    if (isEmpty(particleList)){
        return 0;
    }
    var particle_ids = Object.keys(particleList);
    return Math.max.apply( Math, particle_ids) + 1;
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

function setControllerCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    displayWidth = canvas.width;
    displayHeight = canvas.height;
}

function doTouchStart(eve) {
    eve.preventDefault();
    var concan_x = event.targetTouches[0].pageX;
    var concan_y = event.targetTouches[0].pageY;
    hitPowerUp(px, py, concan_x, concan_y);
}
/**
 * prueft ob PowerUp getroffen wurde
 */
function hitPowerUp(px, py, concan_x, concan_y) {
    px = Math.ceil(px);
    py = Math.ceil(py);
    concan_x = Math.ceil(concan_x);
    concan_y = Math.ceil(concan_y);

    if (( concan_x <= px + 50 && concan_x >= px - 50 ) && ( concan_y <= py + 50 && concan_y >= py - 50 )) {
        for(var i=0; i<Object.keys(particleList).length; i++){
            if(Math.ceil(particleList[i].x) == px && Math.ceil(particleList[i].y) == py){
                IO.sendPowerUpHitted();
                delete particleList[i];
                break;
            }
        }
        deletePowerUp = true;
    }
}

/** ********************************
 *          MOTION FUNCS           *
 * ****************************** **/
function moveIt(ev) {
    var orientation = window.orientation;
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;

    if (isAndroid) {
        if(IO.user.getGameId()){
            if (orientation === 90) {
                return landscape_primary(ev);
            }
            if (orientation === -90) {
                return landscape_secondary(ev);
            }
            if (orientation === 0) {
                return portrait_primary(ev);
            }
        }
    }else{
        if(IO.user.getGameId()){
            if (orientation === -90) {
                return landscape_primary(ev);
            }
            if (orientation === 90) {
                return landscape_secondary(ev);
            }
            if (orientation === 0) {
                return portrait_primary(ev);
            }
        }
    }
}

/**
 * Wenn sich das Handy im Landscape(Primary)[Seitlich 90grad nach Links] befindet
 */
function landscape_primary(ev) {
    var acc = ev.accelerationIncludingGravity;
    if (acc.y < -1) {
        IO.sendMotion('left');
    } else if (acc.y > 1) {
        IO.sendMotion('right');
    } else {
        IO.sendMotion('stop');
    }
}
/**
 * Wenn sich das Handy im Landscape(Secondary)[Seitlich 90grad nach rechts] befindet
 */
function landscape_secondary(ev) {
    var acc = ev.accelerationIncludingGravity;
    if (acc.y > 1) {
        IO.sendMotion('left');
    } else if (acc.y < -1) {
        IO.sendMotion('right');
    } else {
        IO.sendMotion('stop');
    }

}
/**
 *  Wenn sich das Handy im Potrait(normal)[0grad] befindet
 */
function portrait_primary(ev) {
    var acc = ev.accelerationIncludingGravity;
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    if (isAndroid) {
        if (acc.x > 1) {
            IO.sendMotion('left');
        } else if (acc.x < -1) {
            IO.sendMotion('right');
        } else {
            IO.sendMotion('stop');
        }
    }else{
        if (acc.x > 1) {
            IO.sendMotion('right');
        } else if (acc.x < -1) {
            IO.sendMotion('left');
        } else {
            IO.sendMotion('stop');
        }
    }
}