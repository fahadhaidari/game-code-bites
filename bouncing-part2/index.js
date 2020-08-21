const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const width = canvas.width = 320;
const height = canvas.height = 480;
const boxWidth = 30;
const boxHeight = 60;
const gravity = 0.7;
const bounceVal = -15;
const quads = [];
const springs = [];

canvas.style.marginTop = window.innerHeight / 2 - height / 2 + "px";

const random = (min, max) => Math.random() * (max - min) + min;

function isHit(o1, o2) {
  if (o1.x + o1.w > o2.x && o1.x < o2.x + o2.w &&
    o1.y + o1.h > o2.y && o1.y < o2.y + o2.h){
      return true;
    }
  return false;
}

function Quad(x, y, w, h, color) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.color = color;
  this.vel = { x: 0, y: 0 };
  quads.push(this);
}

function update() {
  box.vel.y += gravity;
  box.x += box.vel.x;
  box.y += box.vel.y;

  if (box.x + box.w > width || box.x < 0) {
    box.vel.x *= -1;
  }

  springs.forEach(spring => {
    if (isHit(spring, box)) {
      if (box.y < spring.y && box.vel.y > 0) {
        box.y = spring.y - box.h;
        box.vel.y = bounceVal;
      }
    }
  });
}

function render() {
  context.clearRect(0, 0, width, height);

  quads.forEach(q => {
    context.fillStyle = q.color;
    context.fillRect(q.x, q.y, q.w, q.h);
  });
}

function frame() {
  update();
  render();
  requestAnimationFrame(frame);
}

document.body.addEventListener("keydown", ( { keyCode } ) => {
  if (keyCode === 37) {
    box.vel.x = -3;
  } else if (keyCode === 39) {
    box.vel.x = 3;
  }
});

const box = new Quad(100, 100, boxWidth, boxHeight, "#111");
const groundSpring = new Quad(0, height - 25, width, 25, "green");
springs.push(groundSpring);

for (let i = 0; i < 5; i ++) {
  const w = random(boxWidth, boxWidth * 3);
  const h = 20;
  const spring = new Quad(random(0, width - w), height - (i * (h * 5)),
  w, h, "#EEE");
  springs.push(spring);
}

frame();
