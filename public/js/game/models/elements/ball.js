function Ball(color, xCoor, yCoor, player) {
    this.radius = 7;
    this.ballColor = color;
    this.xCoor = xCoor;
    this.yCoor = yCoor;
    this.dx = 1.5;
    this.dy = -4;

    //MUSS WEG
    this.player = player;
    this.score = 0;
}

Ball.prototype.getYCoor = function (canvas) {
    return Math.floor(this.yCoor - (canvas.getFieldHeight() - (canvas.getRowHeight()*canvas.getRows()) / 2));
};

Ball.prototype.getRadius = function () {
    return this.radius;
};

Ball.prototype.getColor = function () {
    return this.ballColor;
};


/*
 BALL LOGIC --START--
 */

Ball.prototype.checkHitBrick = function (canvas) {
    var real_row = ((canvas.getFieldHeight() - ((canvas.getRowHeight() * canvas.getRows()))) / 2) / canvas.getRowHeight();
    var row = Math.floor(this.yCoor / canvas.getRowHeight() - real_row);
    var col = Math.floor(this.xCoor / canvas.getColWidth());
    var wallHeight = canvas.getRows() * canvas.getRowHeight();


    if (
        (
        row < canvas.getRows()
        && this.getYCoor(canvas) <= wallHeight
        && row >= 0
        && col >= 0
        && canvas.getBricks()[row][col] instanceof Brick
        )
        ||
        (!canvas.bricksAvailable() && this.getYCoor(canvas) == canvas.masterBrick.getYCoor() && this.getXCoor() == canvas.masterBrick.getXCoor())
    ){
        if(!canvas.bricksAvailable()){
            console.log("GETROFFFEEEN");
        }
        this.dy = -this.dy; //Ball dotzt zurueck
        var points = canvas.getBricks()[row][col].getPoints();
        var brickHitted = canvas.getBricks()[row][col];
        canvas.countDestroyedBricks+=1;
        fadingOut(canvas.getContext(), brickHitted); //fade out Brick
        canvas.getBricks()[row][col] = 0; //destroy Brick

        //Ab hier muss anders gelöst werden
        this.score+=points;
        if (this.player === "one") {
            document.getElementById("score-one").innerHTML = String(this.score);
            $("#score-add-one").text("+"+points);
            $('#score-add-one').show();
            setPlayerOneHeight();
            setTimeout(function() {
                $('#score-add-one').hide();
                setPlayerOneHeight();
            }, 1000);
        } else if (this.player === "two") {
            document.getElementById("score-two").innerHTML = String(this.score);
            $("#score-add-two").text("+"+points);
            $('#score-add-two').show();
            setTimeout(function() {
                $('#score-add-two').hide();
            }, 1000);
        }
    }

};

Ball.prototype.checkHitRightBorder = function (canvas) {
    if (this.xCoor + this.dx + this.getRadius() > canvas.FieldWidth) {
        this.dx = -this.dx;
    }
};

Ball.prototype.checkHitLeftBorder = function (canvas) {
    if (this.xCoor + this.dx - this.getRadius() < 0) {
        this.dx = -this.dx;
    }
};

Ball.prototype.hitPaddle = function (canvas, p1p) {
    return this.yCoor + this.dy + this.getRadius() > canvas.FieldHeight - p1p.PaddleHeight
};


function fadingOut(ctx,brick){

    var xCorr = brick.getXCoor();
    var yCorr = brick.getYCoor();
    var width = brick.getWidth();
    var height = brick.getHeight();
    var rgb= hexToRgb(brick.getCurrentColor());

    var r = rgb["r"];
    var g = rgb["g"];
    var b = rgb["b"];
    var steps = 10;
    var dr = (255 - r); // steps
    var dg = (255 - g);
    var db = (255 - b);

    var i = 0;
    var interval = setInterval(function() {
        ctx.fillStyle = 'rgb(' + Math.round(r + dr * i) + ','
        + Math.round(g + dg * i) + ','
        + Math.round(b + db * i) + ')';
        ctx.fillRect(xCorr,yCorr,width,height);
        i++;
        if(i === steps) {
            clearInterval(interval);
        }
    }, 20);
}
/*
 BALL LOGIC --END--
 */