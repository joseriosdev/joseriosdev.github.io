/*special thanks to Brad Traversy*/
let canvas = document.getElementById("drawception");
let ctx = canvas.getContext("2d");
const INCREASE_BTN = document.getElementById("increase");
const DECREASE_BTN = document.getElementById("decrease");
const CLEAR_BTN = document.getElementById("clear");
const COLOR_BTN = document.getElementById("color");
const SIZE_EL = document.getElementById("size");

let painting = false;
let size = 5;
let color = "black";
let x, y;

// Color change input
COLOR_BTN.addEventListener('change', (evt) => color = evt.target.value);
// Evts that allows you to draw
canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', drawing);

function startPosition(evt) {
  painting = true;
  x = evt.offsetX;
  y = evt.offsetY;
  drawCircle(x,y);
}

function endPosition() {
  painting = false;
  x, y = undefined;
}

function drawCircle(x, y) {
  ctx.beginPath();
  ctx.arc(x,y, size, 0, Math.PI*2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawLine(x1, x2, y1, y2) {
  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = size*2;
  ctx.stroke();
}

function drawing(evt) {
  if(painting) {
    const X2 = evt.offsetX;
    const Y2 = evt.offsetY;

    drawCircle(X2, Y2);
    drawLine(x,X2, y,Y2);
    x = X2;
    y = Y2;
  }
}

function sizeBrushUpdate() {
  SIZE_EL.innerText = size;
}

// Canvas inputs

CLEAR_BTN.addEventListener("click", (evt) => ctx.clearRect(0,0, canvas.width, canvas.height))

INCREASE_BTN.addEventListener("click", () => {
  size += 5;

  if(size > 40) {
    size = 40;
  }
  sizeBrushUpdate();
});

DECREASE_BTN.addEventListener("click", () => {
  size -= 5;

  if(size < 5) {
    size = 5;
  }
  sizeBrushUpdate();
});