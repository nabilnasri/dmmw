function Ball(height, color, xCoor, yCoor){
    this.canvasHeight = height;
    this.radius = 10;
    this.BallColor = color;
    this.xCoor = xCoor;
    this.yCoor = yCoor;
    this.dx = 1.5;
    this.dy = -4;
}

Ball.prototype.getYCoor = function () {
    return this.yCoor - this.canvasHeight;
};

Ball.prototype.getRadius = function () {
  return this.radius
};

Ball.prototype.getColor = function () {
    return this.BallColor
};