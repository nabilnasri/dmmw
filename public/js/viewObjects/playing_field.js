function PlayingField(width, height, rows, cols){
    this.FieldWidth = width;
    this.FieldHeight = height;
    this.nRows = rows;
    this.nCols = cols;
    this.color = "#ABB7B7";
    this.ctx = this.Context();
    this.bricks = this.setBricks();
    this.paddleDict = {};
    this.ballDict = {};
    this.rowcolors = ["#9CF", "#9CF", "#C9F", "#C9F", "#F9C", "#F9C", "#FC9", "#FC9", "#CF9", "#CF9"]

}

PlayingField.prototype.initField = function(){
    //ToDo: init the paddles, balls and so on...
}

PlayingField.prototype.getRows = function(){
    return this.nRows;
};

PlayingField.prototype.getCols = function(){
    return this.nCols;
};

PlayingField.prototype.getContext = function(){
    return this.ctx;
};


PlayingField.prototype.setBricks = function(){
    var i, j;
    this.bricks = new Array(this.getRows());
    for (i = 0; i < this.getRows(); i++) {
        this.bricks[i] = new Array(this.getCols());
        for (j = 0; j < this.getCols(); j++) {
            this.bricks[i][j] = 1;
        }
    }
};


PlayingField.prototype.drawBricks = function() {
    var i, j;
    var single_brick = new Brick(60, 20);
    for (i = 0; i < this.getRows(); i++) {
        this.getContext().fillStyle = this.rowcolors[i];
        this.getContext().lineWidth = 2;
        for (j = 0; j < this.getCols(); j++) {
            if (this.bricks[i][j] === 1) {
                rect(
                    (j * (single_brick.BrickWidth + single_brick.BrickPadding)) + single_brick.BrickPadding,
                    (i * (single_brick.BrickHeight + single_brick.BrickPadding)) + single_brick.BrickPadding,
                    single_brick.BrickWidth, single_brick.BrickHeight);
            }
        }
    }
};


PlayingField.prototype.getElement = function(){
    return document.getElementById("playground");
};

PlayingField.prototype.Context = function(){
    return this.getElement().getContext("2d");
};

