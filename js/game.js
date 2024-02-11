// 1. create a new scene - where all the actions take place
let gameScene = new Phaser.Scene("Game");

// 2. set the config of the game
let config = {
  // how will phaser render this game: WebGL, CanvasAPI
  type: Phaser.AUTO, // Phaser will use WebGL if available, if not will use Canvas
  width: 640,
  height: 360,
  scene: gameScene,
};

// 3. create a new game, pass the config
let game = new Phaser.Game(config);
