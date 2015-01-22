var gameInfo = GameInfo.getInstance();

function initGame(data){
    gameInfo.playingField = data["game"]["playingField"];
    gameInfo.balls = data["game"]["playingField"]["balls"];
    gameInfo.paddles = data["game"]["playingField"]["paddles"];
    gameInfo.bricks = data["game"]["playingField"]["bricks"];
    gameInfo.colorpicker = data["game"]["colorpicker"];
}

function updateBalls(balls){
    gameInfo.balls = balls;
}

function updatePaddles(paddles){
    gameInfo.paddles = paddles;
}

function updateBricks(row, col){
    var brick = Draw.getInstance().gameInfo.bricks[row][col];
    Draw.getInstance().fadingOut(brick);
    gameInfo.bricks[row][col] = 0;
}

function updateColorPicker(colorpicker){
    gameInfo.colorpicker = colorpicker;
}

function updatePoints(points, player){
    var currentPoints = 0;
    var newPoints = 0;
    if (player === "one") {
        var scoreOne = $("#score-one");
        currentPoints = parseInt(scoreOne.text());
        if(typeof(points) === "number"){
            newPoints = currentPoints + points;
        }
        scoreOne.text(newPoints);
        var scoreOneAdd = $("#score-add-one");
        scoreOneAdd.text("+"+points);
        scoreOneAdd.show();
        setPlayerOneHeight();
        setTimeout(function() {
            $('#score-add-one').hide();
            setPlayerOneHeight();
        }, 1000);
    } else if (player === "two") {
        var scoreTwo = $("#score-two");
        currentPoints = parseInt(scoreTwo.text());
        if(typeof(points) === "number"){
            newPoints = currentPoints + points;
        }
        scoreTwo.text(newPoints);
        var scoreTwoAdd = $("#score-add-two");
        scoreTwoAdd.text("+"+points);
        scoreTwoAdd.show();
        setTimeout(function() {
            $('#score-add-two').hide();
        }, 1000);
    }
}