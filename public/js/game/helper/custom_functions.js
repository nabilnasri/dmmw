/*
Hilfsfunktion um ein Array nach rechts zu shiften
 */
function shiftRight(arr)
{
    var temp = [];
    temp.push(arr[arr.length-1]);
    for (var i = 0; i <= arr.length-2; i++){
        temp.push(arr[i]);
    }
    return temp;
}

/*
Array, das soviele Farben hat wie das Spiel Spalten.
Das zurückgegebene Array wird später geshiftet um den
Schweif zu "animieren"
 */
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

/*
Konvertiert HexFarbe zu RGB
 */
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

