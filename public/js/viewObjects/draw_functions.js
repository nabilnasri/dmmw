function circle(x, y, r) {
    canvas.getContext().beginPath();
    canvas.getContext().arc(x, y, r, 0, Math.PI * 2, true);
    canvas.getContext().closePath();
    canvas.getContext().fill();
}
function rect(x, y, w, h) {
    canvas.getContext().beginPath();
    canvas.getContext().rect(x, y, w, h);
    canvas.getContext().closePath();
    canvas.getContext().fill();
}