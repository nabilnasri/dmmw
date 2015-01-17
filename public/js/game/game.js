/*
"Spielklasse" - Beinhaltet ein Singleton eines Spiels, um sie an
mehreren Stellen des Programms zu nutzten.
 */
var Dmmw = (function(){
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
    var playingField = null;
    var intervalId = 0;
    var canvasMinX = 0;
    var canvasMaxX = 0;
    var colorpicker = null;
    var colorcounter = 0;

    this.setProperties = function(){
        playingField = new PlayingField(1, 5);
        intervalId = 0;
        canvasMinX = 0;
        canvasMaxX = 0;
        colorpicker = calculateColColors(playingField);
        colorcounter = 0;
    };

    this.init = function() {
        this.setProperties();
        canvasMinX = $("#playground").offset().left;
        canvasMaxX = canvasMinX + playingField.FieldWidth;
        intervalId = window.setInterval(this.redraw, 20);
        return intervalId;
    };

    this.redraw = function () {
        colorcounter += 20;
        if(colorcounter % 60 == 0){
            colorpicker = shiftRight(colorpicker);
        }
        draw(playingField, intervalId, colorpicker);
    };

    this.mouseMove = function(evt) {
        if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
            playingField.getPaddle(0).xCoor = Math.max(evt.pageX - canvasMinX - (playingField.getPaddle(0).PaddleWidth / 2), 0);
            playingField.getPaddle(1).xCoor = Math.max(evt.pageX - canvasMinX - (playingField.getPaddle(1).PaddleWidth / 2), 0);
            playingField.getPaddle(0).xCoor = Math.min(playingField.FieldWidth - playingField.getPaddle(0).PaddleWidth, playingField.getPaddle(0).xCoor);
            playingField.getPaddle(1).xCoor = Math.min(playingField.FieldWidth - playingField.getPaddle(1).PaddleWidth, playingField.getPaddle(0).xCoor);
        }
    };

    this.motionMove = function(direction) {
        if (direction == "right") {
            playingField.getPaddle(0).xCoor += 20;
        } else if (direction == "left") {
            playingField.getPaddle(0).xCoor -= 20;
        }
    };

    $(document).mousemove(this.mouseMove);
}