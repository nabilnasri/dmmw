/**
 * Created by feyza on 26.01.15.
 */

function selectPowerUp(){
    this.powerUpArray = ["doublePoints()", "halfPoints()", "speed()","slowMotion()","plusLife()","freezeOponent()","freezeYourself()"];
}


function doublePoints(brickPoint){
    console.log("ma");
   return brickPoint*2
}

function halfPoints(brickPoint){
    console.log("mo");
    return Math.floor(brickPoint/2);
}

function speed(){
    console.log("mu");
}

function slowMotion(){
    console.log("miii");
}

function plusLife(actLife){
    console.log("muuhh");
    return actLife+=1;
}

function freezeOponent(){ // freeze padle and ball
    console.log("mmmmm");
}

function freezeYourself(){ // freeze padle and ball
    console.log("myxq");
}


