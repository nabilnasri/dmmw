function Brick(width, height, padding) {
    this.brickWidth = width;
    this.brickHeight = height;
    this.brickPadding = padding;
    this.currentColor = null;
}

function possibleColors(){
    //orange/blue/pink/green/yellow
    return ["#ff664a", "#3399ff", "#ff0074", "#00ff66", "#ffff33"];
}

Brick.prototype.getWidth = function () {
    return this.brickWidth;
};

Brick.prototype.getHeight = function () {
    return this.brickHeight;
};

Brick.prototype.getPadding= function () {
    return this.brickPadding;
};

Brick.prototype.getCurrentColor= function () {
    return this.currentColor;
};


