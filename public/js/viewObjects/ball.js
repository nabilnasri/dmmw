function Ball(canvas, color, xCoor, yCoor){
    this.canvas = canvas;
    this.radius = 10;
    this.ballColor = color;
    this.xCoor = xCoor;
    this.yCoor = yCoor;
    this.dx = 1.5;
    this.dy = -4;
}

Ball.prototype.getYCoor = function () {
    return this.yCoor - ((this.canvas.getFieldHeight()-(this.canvas.getPadding()*2*this.canvas.getRows()))/2);
};

Ball.prototype.getRadius = function () {
  return this.radius;
};

Ball.prototype.getColor = function () {
    return this.ballColor;
};