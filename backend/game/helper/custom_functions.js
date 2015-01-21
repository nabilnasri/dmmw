module.exports =
{
    /*
     Hilfsfunktion um ein Array nach rechts zu shiften
     */
    shiftRight: function shiftRight(arr){
        var temp = [];
        temp.push(arr[arr.length - 1]);
        for (var i = 0; i <= arr.length - 2; i++) {
            temp.push(arr[i]);
        }
        return temp;
    },

    /*
     Array, das soviele Farben hat wie das Spiel Spalten.
     Das zurückgegebene Array wird später geshiftet um den
     Schweif zu "animieren"
     */
    calculateColColors: function calculateColColors(canvas) {
        var colors = this.possibleColors();
        var areas = Math.floor(canvas.getCols() / 4);
        var d = [];
        var counter = 0;
        var coloridx = 0;
        var curColor = colors[coloridx];
        for (var j = 0; j < canvas.getCols(); j++) {
            d[j] = curColor;
            if (counter % areas == 0) {
                coloridx += 1;
                if (coloridx == colors.length) {
                    coloridx = 0;
                }
                curColor = colors[coloridx];
            }
            counter += 1;
        }
        return d;
    },

    possibleColors: function possibleColors(){
    //red/orange/yellow/green/blue
        return ["#F22613", "#D35400", "#F7CA18", "#00B16A", "#4183D7"];
    },

    /*
     Konvertiert HexFarbe zu RGB
     */
    hexToRgb: function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

};
