function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/baatar_temp.png");
ASSET_MANAGER.queueDownload("./img/tile_temp.png");
ASSET_MANAGER.queueDownload("./img/mob_temp.png");
ASSET_MANAGER.queueDownload("./img/cursor_temp.png");
ASSET_MANAGER.queueDownload("./img/bullet_temp.png");


ASSET_MANAGER.downloadAll(function () {
    console.log("init phase");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var game = new GameEngine();
	var scene_manager = new SceneManager(game);
	var test_scene = new Scene(game, ctx, "test scene");
	scene_manager.addScene(test_scene);
	
	var tile = new Tile(game, "./img/tile_temp.png", 0, 0, 12, 11);
	test_scene.addTile(tile);
	for(var i = 0; i < 8; i++){
		var tile = new Tile(game, "./img/tile_temp.png", 0, 0, 12 + i, 4);
		test_scene.addTile(tile);
	}
	for(var i = 0; i < 8; i++){
		var tile = new Tile(game, "./img/tile_temp.png", 0, 0, 12 + i, 6);
		test_scene.addTile(tile);
	}
	for(var i = 0; i < 5; i++){
		var tile = new Tile(game, "./img/tile_temp.png", 0, 0, 2, 2 + i);
		test_scene.addTile(tile);
	}
	for(var i = 0; i < 5; i++){
		var tile = new Tile(game, "./img/tile_temp.png", 0, 0, 3 + i, 2);
		test_scene.addTile(tile);
	}
	for(var i = 0; i < 5; i++){
		var tile = new Tile(game, "./img/tile_temp.png", 0, 0, 3 + i, 7);
		test_scene.addTile(tile);
	}
	for(var i = 0; i < 5; i++){
		var tile = new Tile(game, "./img/tile_temp.png", 0, 0, 3 + i, 2);
		test_scene.addTile(tile);
	}
	var mob = new Mob(game, 18, 9, "test");
	test_scene.addEntity(mob);
	var cursor = new Cursor(game);
	test_scene.addHUDElement(cursor);
	var baatar = new Baatar(game, 1, 1, cursor);
	test_scene.addEntity(baatar);
	
	scene_manager.setScene("test scene");
});