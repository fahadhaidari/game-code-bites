const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const width = canvas.width = 320;
const height = canvas.height = 480;
const circles = [];
const gravity = { x: 0, y: 0 };
const lineWidth = 6;
const jumpForce = 15;
let isRight = false;
let isLeft = false;
let canJump = true;

canvas.style.marginTop = window.innerHeight / 2 - height / 2 + "px";

function Circle(x, y, r, color) {
  if (!new.target) throw new Error("you must use the new keyword");

  this.x = x;
  this.y = y;
  this.r = r;
  this.color = color;
  this.vel = { x: 0, y: 0 };
  this.dir = 0;

  circles.push(this);
}

function separate(c1, c2, d) {
  const newDir = c1.dir + Math.PI;
  c1.x = c2.x + d * Math.cos(newDir);
  c1.y = c2.y + d * Math.sin(newDir);
}

const getMag = (x, y) => Math.sqrt(x * x + y * y);

function update() {
  const dx = globe.x - circle.x;
  const dy = globe.y - circle.y;
  const dir = Math.atan2(dy, dx);
  const d = getMag(dx, dy);
  const radii = globe.r + circle.r;

  circle.dir = dir;

  if (isRight && canJump) {
    circle.dir += 0.1;
    separate(circle, globe, radii);
  } else if (isLeft && canJump) {
    circle.dir -= 0.1;
    separate(circle, globe, radii);
  }

  if (circle.x - circle.r < 0 || circle.x + circle.r > width) {
    circle.vel.x *= -1;
  }

  if (circle.y - circle.r < 0 || circle.y + circle.r > height) {
    circle.vel.y *= -1;
  }

  gravity.x = Math.cos(dir) * 0.8;
  gravity.y = Math.sin(dir) * 0.8;

  circle.vel.x += gravity.x;
  circle.vel.y += gravity.y;

  circle.x += circle.vel.x;
  circle.y += circle.vel.y;

  const velMag = getMag(circle.vel.x, circle.vel.y);

  if (d - velMag < radii) {
    circle.vel.x = 0;
    circle.vel.y = 0;
    const newDir = dir + Math.PI;
    separate(circle, globe, radii + 1);
    canJump = true;
  }
}

function render() {
  context.clearRect(0, 0, width, height);

  circles.forEach(c => {
    context.beginPath();
    context.fillStyle = c.color;
    context.lineWidth = lineWidth;
    context.strokeStyle = "#111";
    context.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    context.stroke();
    context.fill();
    context.closePath();
  });
}

function frame() {
  update();
  render();
  requestAnimationFrame(frame);
}

document.body.onkeydown = function( { keyCode  } ) {
  if (keyCode === 32 && canJump) {
    separate(circle, globe, globe.r + circle.r + jumpForce);
    const newDir = circle.dir + Math.PI;
    circle.vel.x = Math.cos(newDir) * jumpForce;
    circle.vel.y = Math.sin(newDir) * jumpForce;
    canJump = false;
  } if (keyCode === 39) {
    isRight = true;
  } else if (keyCode === 37) {
    isLeft = true;
  }
}

document.body.onkeyup = function( { keyCode  } ) {
  if (keyCode === 39) {
    isRight = false;
  } else if (keyCode === 37) {
    isLeft = false;
  }
}

const globe = new Circle(width / 2, height * 0.60, 60, "teal");
const circle = new Circle(10, 100, 10, "orange");

frame();
