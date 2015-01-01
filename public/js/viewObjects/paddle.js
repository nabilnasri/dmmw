function Paddle(x, color){
    this.PaddleWidth = 100;
    this.PaddleHeight = 20;
    this.xCoor = x;
    this.PaddleColor = color;
}

Paddle.prototype.testFunc = function(){
    console.log("Das ist eine Funktion, damit jede Instanz von Paddle auf diesselbe Funktion zugreifen kann.");
};
