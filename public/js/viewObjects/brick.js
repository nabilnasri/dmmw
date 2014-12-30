function Brick(width, height){
    this.BrickWidth = width;
    this.BrickHeight = height;
    this.BrickPadding = 20;
}

Brick.prototype.testFunc = function(){
    console.log("Das ist eine Funktion, damit jede Instanz von Brick auf diesselbe Funktion zugreifen kann.");
};