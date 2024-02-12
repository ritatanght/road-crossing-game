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

  this.isTerminating = false;
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

  // enemy group
  this.enemies = this.add.group({
    key: "enemy",
    repeat: 5,
    setXY: {
      // x & y for the first element
      x: 90,
      y: 100,
      // the separation between the subsequent sprites
      stepX: 80,
      stepY: 20,
    },
  });

  // setting scale for all group elements
  Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.4, -0.4);

  // set flipX and speed, the function will be called for each one of our entity
  Phaser.Actions.Call(
    this.enemies.getChildren(),
    function (enemy) {
      // flip enemy
      enemy.flipX = true;

      // set enemy speed
      let direction = Math.random() < 0.5 ? 1 : -1;
      let speed =
        this.enemyMinSpeed +
        Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
      enemy.speed = direction * speed;
    },
    this // pass in the context of the current scene
  );
};

// update is called up to 60 times/second
gameScene.update = function () {
  // don't execute if we are terminating
  if (this.isTerminating) return;

  // check for active input (left click or touch)
  if (this.input.activePointer.isDown) {
    this.player.x += this.playerSpeed;
  }

  // player overlap treasure check
  let playerRect = this.player.getBounds();
  let goalRect = this.goal.getBounds();

  if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, goalRect)) {
    // end game
    return this.gameOver();
  }

  // get enemies
  let enemies = this.enemies.getChildren();

  for (let i = 0; i < enemies.length; i++) {
    // enemy movement
    enemies[i].y += enemies[i].speed;

    // check we haven't passed min or max Y
    let conditionUp = enemies[i].speed < 0 && enemies[i].y <= this.enemyMinY;
    let conditionDown = enemies[i].speed > 0 && enemies[i].y >= this.enemyMaxY;

    // if we passed the upper or lower limit, reverse
    if (conditionUp || conditionDown) {
      enemies[i].speed *= -1;
    }

    // check enemy overlap
    let enemyRect = enemies[i].getBounds();
    if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)) {
      console.log("Game over!");
      // end game
      return this.gameOver();
    }
  }
};

// add a method to the scene
gameScene.gameOver = function () {
  //initiated game over sequece
  this.isTerminating = true;

  this.cameras.main.shake(500);

  // listen for shake event completion
  this.cameras.main.on(
    "camerashakecomplete",
    function (camera, effect) {
      this.cameras.main.fade(500);
    },
    this
  );

  this.cameras.main.on(
    "camerafadeoutcomplete",
    function (camera, effect) {
      this.scene.restart();
    },
    this
  );

  // restart the scene
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
