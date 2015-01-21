/*
 "Spielklasse" - Beinhaltet ein Singleton eines Spiels, um sie an
 mehreren Stellen des Programms zu nutzten.
 */
exports.Dmmw = (function(){
    var game;

    function createInstance() {
        game = new Game();
        return game;
    }

    //Gibt die Instanz vom Spiel zurück
    return {
        getInstance: function () {
            if (!game) {
                game = createInstance();
            }
            return game;
        }
    };

})();


var PlayingField = require("./models/elements/playing_field");
var customFunctions = require("./helper/custom_functions");

/*
 Spielinitialisierung. Initialisiert Spielfeld und beinhalten die einzelen Events(motionMove, mouseMove, ..)
 */
function Game(){
    this.playingField = null;
    this.intervalId = 0;
    this.canvasMinX = 0;
    this.canvasMaxX = 0;
    this.colorpicker = null;
    this.colorcounter = 0;

    this.setProperties = function(){
        this.playingField = new PlayingField.PlayingField(8, 15);
        this.intervalId = 0;
        this.canvasMinX = 0;
        this.canvasMaxX = 0;
        this.colorpicker = customFunctions.calculateColColors(this.playingField);
        this.colorcounter = 0;
    };

    this.init = function() {
        this.setProperties();
        this.canvasMinX = //$("#playground").offset().left;
        this.canvasMaxX = this.canvasMinX + this.playingField.FieldWidth;
        this.intervalId = 20;//window.setInterval(this.redraw, 20);
        return this.intervalId;
    };

    this.redraw = function () {
        this.colorcounter += 20;
        if(this.colorcounter % 60 == 0){
            this.colorpicker = customFunctions.shiftRight(this.colorpicker);
        }
    };
}