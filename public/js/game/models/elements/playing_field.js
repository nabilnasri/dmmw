function PlayingField(rows, cols) {
    this.ctx = this.Context();
    this.FieldWidth = document.getElementsByTagName('canvas')[0].width;
    this.FieldHeight = document.getElementsByTagName('canvas')[0].height;
    this.nRows = rows;
    this.nCols = cols;
    this.color = "#2f241e";
    this.rowHeight = 0; //Wird in setBricks überschrieben
    this.colWidth = 0; //Wird in setBricks überschrieben
    this.bricks = this.setBricks();
    this.paddles = this.initPaddles();
    this.balls = this.initBalls();
}

PlayingField.prototype.initField = function () {
    //ToDo: init the bricks, paddles, balls and so on...
};

PlayingField.prototype.getRows = function () {
    return this.nRows;
};

PlayingField.prototype.getCols = function () {
    return this.nCols;
};

PlayingField.prototype.getContext = function () {
    return this.ctx;
};

PlayingField.prototype.getBricks = function () {
    return this.bricks;
};

PlayingField.prototype.getPaddle = function (paddle_id) {
    return this.paddles[paddle_id];
};

PlayingField.prototype.getBall = function (ball_id) {
    return this.balls[ball_id];
};


PlayingField.prototype.setBricks = function () {
    var i, j;
    var b;
    var brickWidthNoPadding = this.getFieldWidth() / this.getCols();
    var brickPadding = brickWidthNoPadding/6;
    var brickWidth = brickWidthNoPadding - brickPadding;
    //NACHTRÄGLICH: Um den rechten Abstand beim letzten Brick entgegen zu kommen
    brickPadding = brickPadding + (brickPadding/this.getCols());
    var brickHeight = brickWidth / 3;
    b = new Array(this.getRows());
    for (i = 0; i < this.getRows(); i++) {
        b[i] = new Array(this.getCols());
        for (j = 0; j < this.getCols(); j++) {
            b[i][j] = new Brick(brickWidth, brickHeight, brickPadding);
        }
    }

    this.rowHeight = brickHeight + brickPadding;
    this.colWidth = brickWidth + brickPadding;

    return b;
};


PlayingField.prototype.initPaddles = function () {
    var p = {};
    p[0] = new Paddle(this.FieldWidth / 2, "#009a80");
    p[1] = new Paddle(this.FieldWidth / 2, "#fe5332");

    return p;
};

PlayingField.prototype.initBalls = function () {
    var b = {};
    b[0] = new Ball("#009a80", this.getPaddle(0).xCoor + 10, 500, "one");
    b[1] = new Ball("#fe5332", this.getPaddle(1).xCoor + 10, 200, "two");

    return b;
};

PlayingField.prototype.getElement = function () {
    return document.getElementById("playground");
};

PlayingField.prototype.Context = function () {
    return this.getElement().getContext("2d");
};

PlayingField.prototype.getFieldHeight = function () {
    return this.FieldHeight;
};

PlayingField.prototype.getFieldWidth = function () {
    return this.FieldWidth;
};

PlayingField.prototype.getRowHeight = function () {
    return this.rowHeight;
};

PlayingField.prototype.getColWidth = function () {
    return this.colWidth;
};