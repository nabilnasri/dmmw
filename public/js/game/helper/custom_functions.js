function shiftRight(arr)
{
    var temp = [];
    temp.push(arr[arr.length-1]);
    for (var i = 0; i <= arr.length-2; i++){
        temp.push(arr[i]);
    }
    return temp;
}

function calculateColColors(canvas){
    var colors = possibleColors();
    var areas = Math.floor(canvas.getCols()/4);
    var d = [];
    var counter = 0;
    var coloridx = 0;
    var curColor = colors[coloridx];
    for(var j=0; j<canvas.getCols(); j++){
        d[j] = curColor;
        if(counter % areas == 0){
            coloridx += 1;
            if(coloridx == colors.length){
                coloridx = 0;
            }
            curColor = colors[coloridx];
        }
        counter+=1;
    }
    return d;
}