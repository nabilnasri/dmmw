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

    if (
        row < canvas.getRows()
        && this.getYCoor(canvas) <= canvas.getRows() * canvas.getRowHeight()
        && row >= 0
        && col >= 0
        && canvas.getBricks()[row][col] instanceof Brick
    ){
        this.dy = -this.dy; //Ball dotzt zurueck
        var points = canvas.getBricks()[row][col].getPoints();
        canvas.getBricks()[row][col] = 0; //Brick zerstört
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


/*
 BALL LOGIC --END--
 */