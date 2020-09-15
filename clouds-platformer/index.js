Game.init(320, 480, "#EEE");
Game.addHero( { x: 100, y: 200, imgSrc: "hero.png" } );
Game.addCloud(200, 210, 80, 10, "cyan");
Game.addCloud(30, 380, 40, 10, "orange");
Game.addCloud(200, 340, 20, 10, "green");
Game.addCloud(100, 310, 60, 10, "red");
Game.addCloud(80, 110, 30, 10, "#4488FF");
Game.addCloud(0, Game.world.h() - 20, Game.world.w(), 20, "teal");
Game.start();
