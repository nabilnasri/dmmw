/*
Funktion zeichnet einen Kreis.
Benötigt als erstes Attribut einen Context, um
darin zeichnen zu können.
 */
function circle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

/*
Funktion zeichnet ein Rechteck.
Wird verwendet für Bricks, Paddle.
Benötigt einen Context, um da rein zeichnen zu können.
 */
function rect(ctx, x, y, w, h, color) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.rect(x, y, w, h);
    ctx.closePath();
    ctx.fill();
}

/*
Funktion zeichnet Bricks ins Feld.
 */
function drawBricks(canvas) {
    var i, j;
    var brickPaddingWidth = canvas.getPadding();
    var brickPaddingHeight = canvas.getPadding();
    for (i = 0; i < canvas.getRows(); i++) {
        canvas.getContext().lineWidth = 2;
        for (j = 0; j < canvas.getCols(); j++) {
            if (canvas.bricks[i][j] instanceof Brick) {
                var brick_width = canvas.bricks[i][j].getWidth();
                var brick_height = canvas.bricks[i][j].getHeight();
                var brick_color = canvas.rowcolors[Math.floor(Math.random() * canvas.rowcolors.length)];
                rect(
                    canvas.getContext(),
                    (j * (brickPaddingWidth + brick_width)) + brickPaddingWidth,
                    //devided by 3, because the brick-array takes a third of the playingfield and should start at the first third of it
                    ((canvas.getFieldHeight()-(canvas.getPadding()*2*canvas.getRows()))/2) + (i * (brickPaddingHeight + brick_height)) + brickPaddingHeight,
                    brick_width,
                    brick_height,
                    brick_color
                );
                //console.log("xPOS ", (j * (brickPaddingWidth + brick_width)) + brickPaddingWidth, " yPOS ", (canvas.getFieldHeight()/3) + (i * (brickPaddingHeight + brick_height)) + brickPaddingHeight);
            }
        }
    }
}