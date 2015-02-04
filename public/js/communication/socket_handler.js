var gameInfo = GameInfo.getInstance();
/**
 * initalisiert das Spiel
 */
function initGame(data) {
    if(data.game){
        gameInfo.playingField = data.game.playingField;
        gameInfo.balls = data.game.playingField.balls;
        gameInfo.paddles = data.game.playingField.paddles;
        gameInfo.bricks = data.game.playingField.bricks;
        gameInfo.colorpicker = data.game.colorpicker;
    }
}
/**
 * Updatet die Ball-Informationen
 */
function updateBalls(balls) {
    gameInfo.balls = balls;
}
/**
 * Updatet die Paddle-Informationen
 */
function updatePaddles(paddles) {
    gameInfo.paddles = paddles;
}
/**
 * Updatet die Brick-Informationen
 */
function updateBricks(row, col) {
    var brick = Draw.getInstance().gameInfo.bricks[row][col];
    Draw.getInstance().fadingOut(brick);
    gameInfo.bricks[row][col] = 0;
}

/**
 * Updatet die MasterBrick-Informationen
 */
function updateMasterBrick(masterBrick) {
    gameInfo.bricksAvailable = false;
    gameInfo.masterBrick = masterBrick;
}

/**
 * Updatet die Farb-Informationen
 */
function updateColorPicker(colorpicker) {
    gameInfo.colorpicker = colorpicker;
}

/**
 * Updatet die Punkte-Informationen
 */
function updatePoints(points, player) {
    var currentPoints = 0;
    var newPoints = 0;
    if (player === "one") {
        var scoreOne = $("#score0");
        currentPoints = parseInt(scoreOne.text());
        if (typeof(points) === "number") {
            newPoints = currentPoints + points;
        }
        scoreOne.text(newPoints);
        var scoreOneAdd = $("#score-add0");
        scoreOneAdd.text("+" + points);
        scoreOneAdd.show();
        setPlayerOneHeight();
        setTimeout(function () {
            $('#score-add0').hide();
            setPlayerOneHeight();
        }, 1000);
        IO.user.setCurrentPoints(newPoints);
    } else if (player === "two") {
        var scoreTwo = $("#score1");
        currentPoints = parseInt(scoreTwo.text());
        if (typeof(points) === "number") {
            newPoints = currentPoints + points;
        }
        scoreTwo.text(newPoints);
        var scoreTwoAdd = $("#score-add1");
        scoreTwoAdd.text("+" + points);
        scoreTwoAdd.show();
        setTimeout(function () {
            $('#score-add1').hide();
        }, 1000);
        IO.user.setCurrentPoints(newPoints);
    }
}