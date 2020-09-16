const Game = (function() {
  const KEY_MAP = Object.freeze({
    JUMP: 32,
    LEFT: 37,
    RIGHT: 39
  });
  const clouds = [];

  let canvas = null;
  let context = null;
  let hero = null;
  let isLeft = false;
  let isRight = false;
  let canJump = false;
  let gravity = 0.7;
  let maxYvel = 15;

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

  const renderQuad = function(x, y, w, h, color) {
    context.beginPath();
    context.fillStyle = color;
    context.strokeStyle = "#DDD";
    context.lineWidth = 3;
    context.strokeRect(x, y, w, h);
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
    addHero(_hero) {
      if (_hero.imgSrc) {
        _hero.img = new Image();
        _hero.img.src = _hero.imgSrc;
        _hero.noImage = false;
        _hero.w = _hero.img.width * 0.7;
        _hero.h = _hero.img.height * 0.7;
      } else {
        _hero.w = 20;
        _hero.h = 30;
        _hero.color = "#333";
        _hero.noImage = true;
      }
      _hero.vel = { x: 0, y: 0 };
      hero = _hero;
    },
    addCloud(x, y, w, h, color) {
      const cloud = new Cloud(x, y, w, h, color);
    },
    world: {
      w: () => canvas.width,
      h: () => canvas.height
    },
    start() {
      frame();
    }
  }
})();
