/*
"Ball-Klasse" - Hier wird die Bewegung festgelegt. Und die Logik, wo auch immer der Ball hin dotzt.
 */
exports.Ball = function Ball(color, xCoor, yCoor, player) {
    this.radius = 7;
    this.ballColor = color;
    this.xCoor = xCoor;
    this.yCoor = yCoor;
    this.dx = 1.5;
    this.dy = -4;

    //MUSS WEG
    this.player = player;
    this.score = 0;
};
var winston = require('winston');

/*
 BALL LOGIC --START--
 */
exports.Ball.prototype.checkHitBrick = function (canvas) {
    var real_row = ((canvas.getFieldHeight() - ((canvas.getRowHeight() * canvas.getRows()))) / 2) / canvas.getRowHeight();
    var row = Math.floor(this.yCoor / canvas.getRowHeight() - real_row);
    var col = Math.floor(this.xCoor / canvas.getColWidth());
    var wallHeight = canvas.getRows() * canvas.getRowHeight();


    if (
        (
        row < canvas.getRows()
        && this.getYCoor(canvas) <= wallHeight
        && row >= 0
        && col >= 0
        && canvas.getBricks()[row][col] != 0
        )
        ||
        (!canvas.bricksAvailable() && this.getYCoor(canvas) == canvas.masterBrick.getYCoor() && this.getXCoor() == canvas.masterBrick.getXCoor())
    ){
        winston.log("info", "GETROFFEN");
        this.dy = -this.dy; //Ball dotzt zurueck
        var points = canvas.getBricks()[row][col].getPoints();
        var brickHitted = canvas.getBricks()[row][col];
        canvas.countDestroyedBricks+=1;
        //fadingOut(canvas.getContext(), brickHitted); //fade out Brick
        canvas.getBricks()[row][col] = 0; //destroy Brick

        //Ab hier muss anders gelöst werden!!
        this.score+=points;
        /*


        if (this.player === "one") {
            document.getElementById("score-one").innerHTML = String(this.score);
            $("#score-add-one").text("+"+points);
            $('#score-add-one').show();
            setPlayerOneHeight();
            setTimeout(function() {
                $('#score-add-one').hide();
                setPlayerOneHeight();
            }, 1000);
        } else if (this.player === "two") {
            document.getElementById("score-two").innerHTML = String(this.score);
            $("#score-add-two").text("+"+points);
            $('#score-add-two').show();
            setTimeout(function() {
                $('#score-add-two').hide();
            }, 1000);
        }
         */
    }

};

exports.Ball.prototype.checkHitRightBorder = function (canvas) {
    if (this.xCoor + this.dx + this.getRadius() > canvas.FieldWidth) {
        this.dx = -this.dx;
    }
};

exports.Ball.prototype.checkHitLeftBorder = function () {
    if (this.xCoor + this.dx - this.getRadius() < 0) {
        this.dx = -this.dx;
    }
};

exports.Ball.prototype.checkHitTopBorder = function () {
    if (this.yCoor + this.dy - this.getRadius() < 0) {
        this.dy = -this.dy;
    }
};

exports.Ball.prototype.checkHitBottomBorder = function (canvas) {
    if (this.yCoor + this.dy + this.getRadius() > canvas.FieldHeight) {
        this.dy = -this.dy;
    }
};

exports.Ball.prototype.checkHitPaddle = function (canvas, player_paddle, player) {
    if(player===1){
        if(this.yCoor + this.dy + this.getRadius() > canvas.FieldHeight - player_paddle.PaddleHeight){
            this.afterHittingPaddle(player_paddle);
        }
    }else{
        if(this.yCoor + this.dy + this.getRadius() < player_paddle.PaddleHeight + this.getRadius() - this.dy){
            this.afterHittingPaddle(player_paddle);
        }
    }
};

exports.Ball.prototype.afterHittingPaddle = function(player_paddle){
    if (this.xCoor > player_paddle.xCoor && this.xCoor < player_paddle.xCoor + player_paddle.PaddleWidth) {
        //BALL trifft PADDLE
        this.dx = 8 * ((this.xCoor - (player_paddle.xCoor + player_paddle.PaddleWidth / 2)) / player_paddle.PaddleWidth);
        this.dy = -this.dy; //SOLL zurück dotzen
    }
};

exports.Ball.prototype.checkOutside = function (canvas, player) {
    if(player===1){
        if (this.yCoor + this.dy + this.getRadius() > canvas.FieldHeight) {
            //BALL IST DRAUßEn / UNTERER RAND
            //window.clearInterval(intervalId);
           // canvas.getContext().fillStyle = "#ddd";
           // canvas.getContext().fillText("FAIL", canvas.FieldWidth / 2, 505);
        }
    }else{
        if (this.yCoor + this.dy - this.getRadius() < 0) {
            //BALL IST DRAUßEn / OBERER RAND
            //window.clearInterval(intervalId);
            //canvas.getContext().fillStyle = "#ddd";
            //canvas.getContext().fillText("FAIL", canvas.FieldWidth / 2, 505);
        }
    }
};
/*
 BALL LOGIC --END--
 */


exports.Ball.prototype.getYCoor = function (canvas) {
    return Math.floor(this.yCoor - (canvas.getFieldHeight() - (canvas.getRowHeight()*canvas.getRows()) / 2));
};

exports.Ball.prototype.getRadius = function () {
    return this.radius;
};

exports.Ball.prototype.getColor = function () {
    return this.ballColor;
};