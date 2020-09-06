const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const width = canvas.width = 320;
const height = canvas.height = 480;
const gravity = 0.4;
const mouse = { x: 0, y: 0 };
const p1 = { x: 0, y: 0 };
const friction = 0.99;

let isMouseDown = false;

canvas.style.marginTop = window.innerHeight / 2
  - height / 2 + "px";

function drawLine(x1, y1, x2, y2) {
  context.beginPath();
  context.strokeStyle = "#888";
  context.lineWidth = 3;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}
function Circle(x, y, r, color) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.color = color;

  this.vel = { x: 0, y: 0 };
}

function reset() {
  circle.vel.x = 0;
  circle.vel.y = 0;
  isMouseDown = false;
}

function push() {
  if (circle.x - circle.r < 0) {
    circle.x = circle.r + 3;
    reset();
  }
  if (circle.x + circle.r > width) {
    circle.x = width - circle.r - 3;
    reset();
  }
  if (circle.y - circle.r < 0) {
    circle.y = circle.r + 3;
    reset();
  }
  if (circle.y + circle.r > height) {
    circle.y = height - circle.r - 3;
    reset();
  }
}

function update() {
  if (circle.x - circle.r < 0 || circle.x + circle.r > width) {
    circle.vel.x *= -1;
  }
  if (circle.y - circle.r < 0 || circle.y + circle.r > height) {
    circle.vel.y *= -1;
  }
  if (height - circle.y - circle.r * 2 < - circle.r) {
    circle.y = height - circle.r;
  }

  if (isMouseDown) {
    const dx = mouse.x - p1.x;
    const dy = mouse.y - p1.y;
    const dir = Math.atan2(dy, dx);
    const d = Math.sqrt(dx * dx + dy * dy);

    circle.vel.x = -Math.cos(dir) * (d * 0.1);
    circle.vel.y = -Math.sin(dir) * (d * 0.1);
  } else {
    circle.vel.x *= friction;
    circle.vel.y *= friction;
    circle.vel.y += gravity;
    circle.x += circle.vel.x;
    circle.y += circle.vel.y;
  }
}

function render() {
  context.clearRect(0, 0, width, height);

  context.beginPath();
  context.lineWidth = 5;
  context.strokeStyle = "#111";
  context.fillStyle = circle.color;
  context.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
  context.stroke();
  context.fill();
  context.closePath();

  if (isMouseDown) {
    const dir = Math.atan2(p1.y - mouse.y, p1.x - mouse.x);
    const cos = Math.cos(dir);
    const sin = Math.sin(dir);
    let newX = p1.x + (-sin * circle.r);
    let newY = p1.y + (cos * circle.r);
    drawLine(newX, newY, mouse.x, mouse.y);
    newX = p1.x + (sin * circle.r);
    newY = p1.y + (-cos * circle.r);
    drawLine(newX, newY, mouse.x, mouse.y);
  }
}

function frame() {
  update();
  render();
  requestAnimationFrame(frame);
}

canvas.onmousedown = function( { offsetX, offsetY } ) {
  isMouseDown = true;
  p1.x = offsetX;
  p1.y = offsetY;
  circle.x = offsetX;
  circle.y = offsetY;
}

document.onmouseup = function( { offsetX, offsetY } ) {
  isMouseDown = false;
  mouse.x = offsetX;
  mouse.y = offsetY;
}

canvas.onmousemove = function( { offsetX, offsetY } ) {
  mouse.x = offsetX;
  mouse.y = offsetY;

  if (isMouseDown) {
    circle.x = offsetX;
    circle.y = offsetY;

    push();
  }
}

const circle = new Circle(width / 2, height / 2, 15, "#FF8844");

frame();
