function PlayingField(width, height, rows, cols){
    this.FieldWidth = width;
    this.FieldHeight = height;
    this.nRows = rows;
    this.nCols = cols;
    this.color = "#ABB7B7";
}


PlayingField.prototype.testFunc = function(){
    console.log("Das ist eine Funktion, damit jede Instanz von PlayingField auf diesselbe Funktion zugreifen kann.");
};


PlayingField.prototype.getRows = function(){
    return this.nRows;
};