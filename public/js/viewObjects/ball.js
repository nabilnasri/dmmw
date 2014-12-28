function Ball(){
    this.radius = 10;
    this.color = null;
}

Ball.prototype.testFunc = function(){
    console.log("Das ist eine Funktion, damit jede Instanz von Ball auf diesselbe Funktion zugreifen kann.");
};


Ball.prototype.setColor = function(color){
    this.color = color;
};
