function Ball(color, xCoor, yCoor, player) {
    this.radius = 3;
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
    return this.yCoor - (canvas.getFieldHeight() - ((canvas.getPadding() * 2 * canvas.getRows()) / 2));
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
    var real_row = Math.floor(((canvas.getFieldHeight() - (((canvas.getPadding() * 2) * canvas.getRows()))) / 2) / (canvas.getPadding() * 2));
    var row = Math.floor((this.yCoor / canvas.rowHeight) - real_row);
    var col = Math.floor(this.xCoor / canvas.colWidth);

    if (
        row < canvas.getRows()
        && this.getYCoor(canvas) <= canvas.getRows() * canvas.getRowHeight()
        && row >= 0
        && col >= 0
        && canvas.getBricks()[row][col] instanceof Brick
    ){
        this.dy = -this.dy; //Ball dotzt zurueck
        canvas.getBricks()[row][col] = 0; //Brick zerstört
        //Ab hier muss anders gelöst werden
        this.score++;
        if (this.player === "one") {
            document.getElementById("score-one").innerHTML = String(this.score);
        } else if (this.player === "two") {
            document.getElementById("score-two").innerHTML = String(this.score);
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