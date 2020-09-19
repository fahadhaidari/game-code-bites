const Game = (function() {
  const KEY_MAP = Object.freeze({
    JUMP: 32,
    LEFT: 37,
    RIGHT: 39
  });
  const clouds = [];
  const particles = [];
  const colors = [];

  let canvas = null;
  let context = null;
  let hero = null;
  let isLeft = false;
  let isRight = false;
  let canJump = false;
  let gravity = 0.7;
  let maxYvel = 15;

  const random = (min, max) => Math.random() * (max - min) + min;

  for (let i = 0; i <= 9; i ++) {
    colors.push("#"+""+i+i+i+i+i+i);
  }

  const createParticles = function(n) {
    const size = random(10, 15);

    for (let i = 0; i < n; i ++) {
      particles.push({
        x: 0,
        y: 0,
        w: size,
        h: size,
        alpha: 1,
        alphaDec: random(0.01, 0.07),
        speed: -random(1, 5),
        color: colors [ parseInt(random(0, colors.length)) ]
      })
    }
  };

  function Cloud(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    clouds.push(this);
  }

  const isHit = function(o1, o2) {
    if (o1.x < o2.x + o2.w && o1.x + o1.w > o2.x &&
      o1.y < o2.y + o2.h && o1.y + o1.h > o2.y) {
        return true;
      }

    return false;
  };

  const renderQuad = function(x, y, w, h, color, alpha = 1, withStroke = true) {
    context.beginPath();
    context.fillStyle = color;
    context.strokeStyle = "#333";
    context.lineWidth = 5;
    context.globalAlpha = alpha;
    if (withStroke) {
      context.strokeRect(x, y, w, h);
    }
    context.fillRect(x, y, w, h);
    context.closePath();
  };

  const onKeyDown = function( { keyCode } ) {
    if (keyCode === KEY_MAP.LEFT) {
      isLeft = true;
    } else if (keyCode === KEY_MAP.RIGHT) {
      isRight = true;
    } else if (keyCode === KEY_MAP.JUMP &&  canJump) {
      hero.vel.y = -12;
      canJump = false;
    }
  };

  const onKeyUp = function( { keyCode } ) {
    if (keyCode === KEY_MAP.LEFT) {
      isLeft = false;
    } else if (keyCode === KEY_MAP.RIGHT) {
      isRight = false;
    }
  };

  const attachKeyboardListeners = function() {
    document.body.addEventListener("keydown", onKeyDown);
    document.body.addEventListener("keyup", onKeyUp);
  };

  const render = function() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    clouds.forEach(c => {
      renderQuad(c.x, c.y, c.w, c.h, c.color);
    });

    if (!hero.noImage) {
      context.drawImage(hero.img, hero.x, hero.y, hero.w, hero.h);
    } else {
      renderQuad(hero.x, hero.y, hero.w, hero.h, hero.color);
    }

    particles.forEach(p => {
      renderQuad(p.x, p.y, p.w, p.h, p.color, p.alpha, false);
    });
  };

  const update = function() {
    hero.vel.y += gravity;

    if (hero.vel.y > maxYvel) {
      hero.vel.y = maxYvel;
    }

    hero.x += hero.vel.x;
    hero.y += hero.vel.y;

    if (isLeft) {
      hero.vel.x = -5;
    } else if (isRight) {
      hero.vel.x = 5;
    } else {
      hero.vel.x = 0;
    }

    if (hero.x < 0) {
      hero.x = 0;
    } else if (hero.x + hero.w > canvas.width) {
      hero.x = canvas.width - hero.w;
    }

    if (hero.y + hero.vel.y < 0) {
      hero.y = 0;
      hero.vel.y = 1;
    }

    clouds.forEach(c => {
      if (isHit(c, hero) && hero.y + hero.h * 0.5 < c.y &&
          hero.vel.y > 0) {
        hero.y = c.y - hero.h;
        hero.vel.y = 0;
        canJump = true;
      }
    });

    particles.forEach(p => {
      p.y += p.speed;
      p.alpha -= p.alphaDec;

      if (p.alpha < 0) {
        p.alpha = 1;
        p.alphaDec = random(0.01, 0.09);
        p.x = random(hero.x, (hero.x + hero.w) - p.w);
        p.y = hero.y - p.h;
        p.speed = -random(1, 4);
      }
    });
  };

  const frame = function() {
    render();
    update();
    requestAnimationFrame(frame);
  };

  return {
    init: function(w, h, color) {
      canvas = document.createElement("canvas");
      context = canvas.getContext("2d");
      canvas.width = w;
      canvas.height = h;
      canvas.style.background = color;
      canvas.style.marginLeft = window.innerWidth / 2 - w / 2 + "px";
      canvas.style.marginTop = window.innerHeight / 2 - h / 2 + "px";

      document.body.appendChild(canvas);

      attachKeyboardListeners();
    },
    addHero: function(_hero) {
      if (_hero.imgSrc) {
        _hero.img = new Image();
        _hero.img.src = _hero.imgSrc;
        _hero.noImage = false;

        _hero.img.onload = function() {
          _hero.w = _hero.img.width * 0.7;
          _hero.h = _hero.img.height * 0.7;
        }
      } else {
        _hero.w = 20;
        _hero.h = 30;
        _hero.color = "#333";
        _hero.noImage = true;
      }
      _hero.vel = { x: 0, y: 0 };
      hero = _hero;
    },
    addCloud: function(x, y, w, h, color) {
      const cloud = new Cloud(x, y, w, h, color);
    },
    world: {
      w: () => canvas.width,
      h: () => canvas.height
    },
    start: function () {
      frame();
    },
    enableParticles: function(n) {
      createParticles(n);
    }
  }
})();
