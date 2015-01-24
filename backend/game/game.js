var PlayingField = require("./models/elements/playing_field");
var customFunctions = require("./helper/custom_functions");

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


/*
 Spielinitialisierung. Initialisiert Spielfeld und beinhalten die einzelen Events(motionMove, mouseMove, ..)
 */
function Game(){
    this.playingField = null;
    this.colorpicker = null;
    this.colorcounter = 0;
    this.pause = false;
    this.intervallId = 0;
    this.running = false;

    this.setProperties = function(){
        this.playingField = new PlayingField.PlayingField(1, 5);
        this.colorpicker = customFunctions.calculateColColors(this.playingField);
        this.colorcounter = 0;
    };

    this.init = function() {
        this.setProperties();
    };

    this.redraw = function () {
        this.colorcounter += 20;
        if(this.colorcounter % 60 == 0){
            this.colorpicker = customFunctions.shiftRight(this.colorpicker);
        }
    };
}