// SceneManger contains a map of level names => levels, and can load them into the game on command
function SceneManager(game) {
	this.game = game;
	this.scenes = new Map();
}
// add a scene to the map
SceneManager.prototype.addScene = function(scene) {
	this.scenes.set(scene.scene_name, scene);
}
// load a specific scene into the game
SceneManager.prototype.setScene = function(scene_name) {
	var scene = this.scenes.get(scene_name);
	this.game.entities = scene.entities;
	this.game.tiles = scene.tiles;
	this.game.all_entities = scene.all_entities;
	this.game.current_scene = scene_name;
	console.log(scene_name + " successfully loaded");
	for(var i = 0; i < scene.entities.length; i++) {
		if (scene.entities[i] instanceof Baatar) this.game.baatar = scene.entities[i];
	}
	this.game.init(scene.ctx);
	this.game.start();
}


// a scene is more or less just a list of objects that comprise a level
// objects can be added through parameters or manually via below functions
function Scene(game, ctx, scene_name, baatar, entities = [], tiles = [], all_entities = []) {
	this.game = game;
	this.ctx = ctx;
	this.scene_name = scene_name;
	this.entities = entities;
	this.tiles = tiles;
	this.all_entities = all_entities;
}

Scene.prototype.addEntity = function (entity) {
    console.log(" : " + this.scene_name + ' added an entity');
	this.entities.push(entity);
    this.all_entities.push(entity);
}
Scene.prototype.addTile = function (entity) {
    console.log(" : " + this.scene_name + ' added a tile');
	this.tiles.push(entity);
    this.all_entities.push(entity);
}