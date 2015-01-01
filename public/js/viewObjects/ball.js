function Ball(color, xCoor, yCoor){
    this.radius = 10;
    this.BallColor = color;
    this.xCoor = xCoor;
    this.yCoor = yCoor;
    this.dx = 1.5;
    this.dy = -4;
}


Ball.prototype.getRadius = function () {
  return this.radius
};

Ball.prototype.getColor = function () {
    return this.BallColor
};