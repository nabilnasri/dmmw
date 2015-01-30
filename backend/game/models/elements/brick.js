/*
 "Brick-Klasse" - "Model" für die einzelnen Rects.
 */

settings = require("../../helper/settings");
winston = require("winston");

exports.Brick = function Brick(width, height, padding) {
    this.brickWidth = width;
    this.brickHeight = height;
    this.brickPadding = padding;
    this.currentColor = null;
    this.xCoor = 0;
    this.yCoor = 0;
};

exports.Brick.prototype.getPoints = function () {
    return settings.COLOR_POINTS_MAPPER[this.getCurrentColor()];
};

exports.Brick.prototype.getWidth = function () {
    return this.brickWidth;
};

exports.Brick.prototype.getHeight = function () {
    return this.brickHeight;
};

exports.Brick.prototype.getPadding = function () {
    return this.brickPadding;
};

exports.Brick.prototype.getXCoor = function () {
    return this.xCoor;
};

exports.Brick.prototype.getYCoor = function () {
    return this.yCoor;
};

exports.Brick.prototype.getCurrentColor = function () {
    return this.currentColor;
};
