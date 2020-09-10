const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const width = canvas.width = 320;
const height = canvas.height = 480;
const particles = [];
const colors = ["orange", "cyan", "#4488FF", "yellow", "red"];
const particlesNum = 1000;

canvas.style.marginTop = window.innerHeight / 2 - height / 2 + "px";

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.w = Math.random() * 10;
    this.h = this.w;
    this.color = color;
    this.dir = Math.random() * Math.PI * 2;
    this.vel = { x: Math.cos(this.dir), y: Math.sin(this.dir) };
    this.speed = Math.random() * 7;
  }

  render(context) {
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.w, this.h);
  }

  update() {
    this.x += this.vel.x * this.speed;
    this.y += this.vel.y * this.speed;
  }
}

function update() {
  particles.forEach(p => {
    if (p.x < 0 || p.x > width ||
      p.y < 0 || p.y > height) {
        p.x = width / 2;
        p.y = height / 2;
      }
    p.update();
  });
}

function render() {
  context.clearRect(0, 0, width, height);
  particles.forEach(p => {
    p.render(context);
  });
}

function frame() {
  update();
  render();
  requestAnimationFrame(frame);
}

for (let i = 0; i < particlesNum; i ++) {
  const color = colors[ Math.round( Math.random() * colors.length ) ] ;
  particles.push(new Particle(width / 2, height / 2, color));
}

frame();
