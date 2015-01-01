function PlayingField(width, height, rows, cols){
    this.ctx = this.Context();
    this.FieldWidth = width;
    this.FieldHeight = height;
    this.nRows = rows;
    this.nCols = cols;
    this.rowHeight = 40;
    this.colWidth = 80;
    this.color = "#678";
    this.bricks = this.setBricks();
    this.paddles = this.initPaddles();
    this.balls = this.initBalls();
    this.rowcolors = ["#9CF", "#9CF", "#C9F", "#C9F", "#F9C", "#F9C", "#FC9", "#FC9", "#CF9", "#CF9"]
}

PlayingField.prototype.initField = function(){
    //ToDo: init the bricks, paddles, balls and so on...
};

PlayingField.prototype.getRows = function(){
    return this.nRows;
};

PlayingField.prototype.getCols = function(){
    return this.nCols;
};

PlayingField.prototype.getContext = function(){
    return this.ctx;
};

PlayingField.prototype.getBricks = function(){
    return this.bricks;
};

PlayingField.prototype.getPaddle = function(paddle_id){
    return this.paddles[paddle_id];
};

PlayingField.prototype.getBall = function(ball_id){
    return this.balls[ball_id];
};


PlayingField.prototype.setBricks = function(){
    var i, j;
    var b;
    b = new Array(this.getRows());
    for (i = 0; i < this.getRows(); i++) {
        b[i] = new Array(this.getCols());
        for (j = 0; j < this.getCols(); j++) {
            b[i][j] = new Brick(60, 20);
        }
    }
    return b;
};


PlayingField.prototype.initPaddles = function(){
    var p = {};
    p[0] = new Paddle(this.FieldWidth / 2, "#4183D7");
    p[1] = new Paddle(this.FieldWidth / 2, "#BE90D4");

    return p;
};

PlayingField.prototype.initBalls = function(){
    var b = {};
    b[0] = new Ball("#BE90D4", this.getPaddle(0).xCoor + 10, 500);
    b[1] = new Ball("#4183D7", this.getPaddle(1).xCoor + 10, 500);

    return b;
};





PlayingField.prototype.getElement = function(){
    return document.getElementById("playground");
};

PlayingField.prototype.Context = function(){
    return this.getElement().getContext("2d");
};

