// create a new scene - where all the actions take place
let gameScene = new Phaser.Scene("Game");

// load assets
gameScene.preload = function () {
  // load.image(name, path)
  this.load.image("background", "assets/background.png");
  this.load.image("player", "assets/player.png");
};

// called once after the preload ends
gameScene.create = function () {
  let bg = this.add.sprite(0, 0, "background"); // this has to match the name in preload above
  // 1st method: change the origin to to the top-left corner instead of the default 'center'
  // bg.setOrigin(0, 0);

  // 2nd method: place sprite in the center
  // get width and height from system config
  let gameW = this.sys.game.config.width;
  let gameH = this.sys.game.config.height;
  bg.setPosition(gameW / 2, gameH / 2);
};

// set the config of the game
let config = {
  // how will phaser render this game: WebGL, CanvasAPI
  type: Phaser.AUTO, // Phaser will use WebGL if available, if not will use Canvas
  width: 640,
  height: 360,
  scene: gameScene,
};

// create a new game, pass the config
let game = new Phaser.Game(config);
