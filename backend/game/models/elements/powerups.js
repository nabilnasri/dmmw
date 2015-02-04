module.exports =
{
    randomPowerUp: function randomPowerUp(playerList, playerNumber){
        var powerUpArray = [
            this.doublePoints,
            this.halfPoints,
            this.resizePaddle,
            this.freezeOponent,
            this.freezeYourself
        ];
        var r = Math.floor(Math.random() * 5);
        return powerUpArray[r](playerList, playerNumber);
    },

    doublePoints: function doublePoints(playerList, playerNumber){
        playerList[playerNumber].setCurrentPowerUp("DoublePoints");
        setTimeout(function() {
            playerList[playerNumber].removeCurrentPowerUp("DoublePoints");
        }, 5000);
    },

    resizePaddle: function resizePaddle(playerList, playerNumber){
        playerList[playerNumber].setCurrentPowerUp("ResizePaddle");
        setTimeout(function() {
            playerList[playerNumber].removeCurrentPowerUp("ResizePaddle");
        }, 10000);
    },

    halfPoints: function halfPoints(playerList, playerNumber){
        playerList[playerNumber].setCurrentPowerUp("HalfPoints");
        setTimeout(function() {
            playerList[playerNumber].removeCurrentPowerUp("HalfPoints");
        }, 8000);
    },

    freezeOponent: function freezeOponent(playerList, playerNumber){
        var toFreeze = 0;

        if (playerNumber==1){
            toFreeze = 0;
        }else{
            toFreeze = 1;
        }
        playerList[toFreeze].setCurrentPowerUp("Freeze");

        setTimeout(function() {
            playerList[playerNumber].removeCurrentPowerUp(null);
        }, 5000);
    },

    freezeYourself: function freezeYourself(playerList, playerNumber){
        playerList[playerNumber].setCurrentPowerUp("Freeze");

        setTimeout(function() {
            playerList[playerNumber].removeCurrentPowerUp("Freeze");
        }, 5000);
    }

};
