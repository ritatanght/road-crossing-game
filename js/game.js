// create a new scene - where all the actions take place
let gameScene = new Phaser.Scene("Game");

// initiate scene parameters
gameScene.init = function () {
  this.playerSpeed = 3;

  this.enemyMinSpeed = 1;
  this.enemyMaxSpeed = 4;
  // enemy boundaries
  this.enemyMinY = 80;
  this.enemyMaxY = 280;
};

// load assets
gameScene.preload = function () {
  // load.image(name, path)
  this.load.image("background", "assets/background.png");
  this.load.image("player", "assets/player.png");
  this.load.image("enemy", "assets/dragon.png");
  this.load.image("goal", "assets/treasure.png");
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

  // player
  this.player = this.add.sprite(50, gameH / 2, "player");
  this.player.setScale(0.5);

  // goal
  this.goal = this.add.sprite(gameW - 80, gameH / 2, "goal");
  this.goal.setScale(0.6);

  // enemy
  this.enemy = this.add.sprite(120, gameH / 2, "enemy");
  this.enemy.flipX = true;
  this.enemy.setScale(0.6);

  // set enemy speed
  let direction = Math.random() < 0.5 ? 1 : -1;
  let speed =
    this.enemyMinSpeed +
    Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
  this.enemy.speed = direction * speed;
  console.log(speed);
};

// update is called up to 60 times/second
gameScene.update = function () {
  // check for active input (left click or touch)
  if (this.input.activePointer.isDown) {
    this.player.x += this.playerSpeed;
  }

  // player overlap treasure check
  let playerRect = this.player.getBounds();
  let goalRect = this.goal.getBounds();

  if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, goalRect)) {
    // restart the scene
    this.scene.restart();
    return;
  }

  // enemy movement
  this.enemy.y += this.enemy.speed;
  // check we haven't passed min or max Y
  let conditionUp = this.enemy.speed < 0 && this.enemy.y <= this.enemyMinY;
  let conditionDown = this.enemy.speed > 0 && this.enemy.y >= this.enemyMaxY;

  // if we passed the upper or lower limit, reverse
  if (conditionUp || conditionDown) {
    this.enemy.speed *= -1;
  }
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
