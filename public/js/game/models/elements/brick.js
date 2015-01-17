/*
 "Brick-Klasse" - "Model" für die einzelnen Rects.
 */
function Brick(width, height, padding) {
    this.brickWidth = width;
    this.brickHeight = height;
    this.brickPadding = padding;
    this.currentColor = null;
    this.xCoor = 0;
    this.yCoor = 0;
}

function possibleColors(){
    //red/orange/yellow/green/blue
    return ["#F22613", "#D35400", "#F7CA18", "#00B16A", "#4183D7"];
}

Brick.prototype.getPoints = function (){
    return COLOR_POINTS_MAPPER[this.getCurrentColor()];
};

Brick.prototype.getWidth = function () {
    return this.brickWidth;
};

Brick.prototype.getHeight = function () {
    return this.brickHeight;
};

Brick.prototype.getPadding= function () {
    return this.brickPadding;
};

Brick.prototype.getXCoor = function () {
    return this.xCoor;
};

Brick.prototype.getYCoor= function () {
    return this.yCoor;
};

Brick.prototype.getCurrentColor= function () {
    return this.currentColor;
};


