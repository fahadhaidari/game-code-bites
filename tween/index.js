const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const width = canvas.width = 320;
const height = canvas.height = 480;
const tweenSpeed = 0.2;
const box = {
  x: 0,
  y: 0,
  w: 20,
  h: 20,
  color: "orange",
  vel: { x: 0, y: 0 },
  tx: width / 2 - 10,
  ty: height / 2 - 10
};

canvas.style.marginTop = window.innerHeight / 2 - height / 2 + "px";

function update() {
  box.vel.x = (box.tx - box.x - box.w / 2) * tweenSpeed;
  box.vel.y = (box.ty - box.y - box.h / 2) * tweenSpeed;
  box.x += box.vel.x;
  box.y += box.vel.y;
}

function render() {
  context.clearRect(0, 0, width, height);
  context.fillStyle = box.color;
  context.strokeStyle = "#222";
  context.lineWidth = 6;
  context.strokeRect(box.x, box.y, box.w, box.h);
  context.fillRect(box.x, box.y, box.w, box.h);
}

function frame() {
  update();
  render();
  requestAnimationFrame(frame);
}

canvas.onmousedown = function( { offsetX, offsetY } ) {
  box.tx = offsetX;
  box.ty = offsetY;
}

frame();
