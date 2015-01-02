function PlayingField(width, height, rows, cols){
    this.ctx = this.Context();
    this.FieldWidth = width;
    this.FieldHeight = height;
    this.nRows = rows;
    this.nCols = cols;
    this.color = "#232c31";
    this.padding = Math.floor(this.getFieldWidth()/this.getCols()/5);//erklaerung siehe getPadding()
    this.rowHeight = this.getPadding()*2;
    this.colWidth = this.getPadding()*5;
    this.bricks = this.setBricks();
    this.paddles = this.initPaddles();
    this.balls = this.initBalls();
    //orange/blue/pink/green/yellow/orange/blue/pink/green/yellow
    this.rowcolors = ["#ff664a", "#3399ff", "#ff0074", "#00ff66", "#ffff33", "#ff664a", "#3399ff", "#ff0074", "#00ff66", "#ffff33"]
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
    var brickWidth = this.getPadding()*4;
    var brickHeight = this.getPadding();
    console.log("height ", brickHeight, " width ", brickWidth);
    b = new Array(this.getRows());
    for (i = 0; i < this.getRows(); i++) {
        b[i] = new Array(this.getCols());
        for (j = 0; j < this.getCols(); j++) {
            b[i][j] = new Brick(brickWidth, brickHeight);
        }
    }
    return b;
};


PlayingField.prototype.initPaddles = function(){
    var p = {};
    p[0] = new Paddle(this.FieldWidth / 2, "#00ffd4");
    p[1] = new Paddle(this.FieldWidth / 2, "#fe1313");

    return p;
};

PlayingField.prototype.initBalls = function(){
    var b = {};
    b[0] = new Ball(this.getFieldHeight(), "#00ffd4", this.getPaddle(0).xCoor + 10, 500);
    b[1] = new Ball(this.getFieldHeight(), "#fe1313", this.getPaddle(1).xCoor + 10, 500);

    return b;
};

PlayingField.prototype.getElement = function(){
    return document.getElementById("playground");
};

PlayingField.prototype.Context = function(){
    return this.getElement().getContext("2d");
};

PlayingField.prototype.getFieldHeight = function(){
    return this.FieldHeight;
};

PlayingField.prototype.getFieldWidth = function(){
    return this.FieldWidth;
};

PlayingField.prototype.getRowHeight = function(){
    return this.rowHeight;
};

PlayingField.prototype.getColWidth = function(){
    return this.colWidth;
};

/**
 * das padding ist links, recht und unter dem brick.
 * deswegen nehmen wir die gesamte breite des feldes und teilen es durch die anzahl der spalten.
 * danach teilen wir es durch 5.
 * 1 teil fürs linke padding + 3 teile für den brick + 1 teil fürs rechte Padding.
* */
PlayingField.prototype.getPadding = function(){
    return this.padding;
};