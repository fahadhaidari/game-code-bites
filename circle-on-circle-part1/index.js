const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const width = canvas.width = 320;
const height = canvas.height = 480;
const circles = [];
const gravity = { x: 0, y: 0 };

canvas.style.marginTop = window.innerHeight / 2 - height / 2 + "px";

function Circle(x, y, r, color) {
  if (!new.target) throw new Error("you must use new");

  this.x = x;
  this.y = y;
  this.r = r;
  this.color = color;
  this.vel = { x: 0, y: 0 };

  circles.push(this);
}

function update() {
  const dx = globe.x - circle.x;
  const dy = globe.y - circle.y;
  const dir = Math.atan2(dy, dx);
  const d = Math.sqrt(dx * dx + dy * dy);
  const radii = globe.r + circle.r;

  if (d < radii) {
    circle.vel.x = 0;
    circle.vel.y = 0;
    const newDir = dir + Math.PI;
    circle.x = globe.x + (radii + 1) * Math.cos(newDir);
    circle.y = globe.y + (radii + 1) * Math.sin(newDir);
  }
  
  gravity.x = Math.cos(dir);
  gravity.y = Math.sin(dir);

  circle.vel.x += gravity.x;
  circle.vel.y += gravity.y;

  circle.x += circle.vel.x;
  circle.y += circle.vel.y;
}

function render() {
  context.clearRect(0, 0, width, height);

  circles.forEach(c => {
    context.beginPath();
    context.fillStyle = c.color;
    context.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    context.fill();
    context.closePath();
  });
}

function frame() {
  update();
  render();
  requestAnimationFrame(frame);
}

const globe = new Circle(150, 350, 100, "blue");
const circle = new Circle(100, 100, 20, "orange");

frame();
