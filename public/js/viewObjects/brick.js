function Brick(width, height){
    this.BrickWidth = width;
    this.BrickHeight = height;
}

Brick.prototype.testFunc = function(){
    console.log("Das ist eine Funktion, damit jede Instanz von Brick auf diesselbe Funktion zugreifen kann.");
};

Brick.prototype.getWidth = function(){
    return this.BrickWidth;
};

Brick.prototype.getHeight = function(){
    return this.BrickHeight;
};

Brick.prototype.getHeight = function(){
    return this.BrickHeight;
};


