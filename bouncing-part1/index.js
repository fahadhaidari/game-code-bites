const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const width = canvas.width = 320;
const height = canvas.height = 480;
const boxWidth = 30;
const boxHeight = 60;
const gravity = 0.7;

canvas.style.marginTop = window.innerHeight / 2 - height / 2 + "px";

const box = {
  x: width / 2 - boxWidth / 2,
  y: height / 2 - boxHeight / 2,
  w: boxWidth,
  h: boxHeight,
  vel: { x: 0, y: 0 },
  color: "orange"
};

function frame() {
  context.clearRect(0, 0, width, height);
  box.vel.y += gravity;
  box.x += box.vel.x;
  box.y += box.vel.y;

  if (box.x + box.w > width || box.x < 0) {
    box.vel.x *= -1;
  }

  if (box.y + box.h > height) {
    box.y = height - box.h;
    box.vel.y *= -1;
  }

  context.fillStyle = box.color;
  context.fillRect(box.x, box.y, box.w, box.h);

  requestAnimationFrame(frame);
}

document.body.addEventListener("keydown", ( { keyCode } ) => {
  if (keyCode === 37) {
    box.vel.x = -3;
  } else if (keyCode === 39) {
    box.vel.x = 3;
  }
});

frame();
