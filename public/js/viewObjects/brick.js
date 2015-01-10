function Brick(width, height, padding) {
    this.brickWidth = width;
    this.brickHeight = height;
    this.brickPadding = padding;
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


