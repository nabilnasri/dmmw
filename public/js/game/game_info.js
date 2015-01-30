GameInfo = (function () {
    var game_info;

    function createInstance() {
        game_info = new DrawInformation();
        return game_info;
    }

    //Gibt die Instanz vom Spiel zurück
    return {
        getInstance: function () {
            if (!game_info) {
                game_info = createInstance();
            }
            return game_info;
        }
    };

})();

function DrawInformation() {
    this.playingField = null;
    this.balls = null;
    this.paddles = null;
    this.bricks = null;
    this.masterBrick = null;
    this.bricksAvailable = true;
    this.colorpicker = null;
}