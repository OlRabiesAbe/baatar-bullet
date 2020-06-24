// SceneManger contains a map of level names => levels, and can load them into the game on command
function SceneManager(game) {
	this.game = game;
	this.scenes = new Map();
}
// add a scene to the map
// the scene is initialized seperately, added to the manager through this, then set to the active scene through setScene(scene_name)
SceneManager.prototype.addScene = function(scene) {
	this.scenes.set(scene.scene_name, scene);
}
// load a specific scene into the game
// param is the name of the scene (assigned at the scene's initialization)
// the func just handles the rest
SceneManager.prototype.setScene = function(scene_name) {
	var scene = this.scenes.get(scene_name);
	this.game.entities = scene.entities;
	this.game.floor_tiles = scene.floor_tiles;
	this.game.tiles = scene.tiles;
	this.game.roof_tiles = scene.roof_tiles;
	this.game.hud_elements = scene.hud_elements;
	this.game.all_entities = scene.all_entities;
	this.game.current_scene = scene_name;
	//console.log(scene_name + " successfully loaded");
	for(var i = 0; i < scene.entities.length; i++) {
		if (scene.entities[i] instanceof Baatar) this.game.baatar = scene.entities[i];
	}
	this.game.init(scene.ctx);
	this.game.start();
}


// a scene is more or less just a list of objects that comprise a level
// objects can be added through parameters or manually via below functions
// Scene(game, ctx, name for the scene, reference to the baatar)
function Scene(game, ctx, scene_name, baatar, entities = [], floor_tiles = [], tiles = [], roof_tiles = [], hud_elements = [], all_entities = []) {
	this.game = game;
	this.ctx = ctx;
	this.scene_name = scene_name;
	this.entities = entities;
	this.floor_tiles = floor_tiles;
	this.tiles = tiles;
	this.roof_tiles = roof_tiles;
	this.hud_elements = hud_elements;
	this.all_entities = all_entities;
}

//the expected way to init a scene is by adding entity by entity.
//entities are added in the form of addEntity(theEntityItself, whatTypeItIs)
//currently valid types are entity tile floor roof & hud
Scene.prototype.addEntity = function (entity, string) {
    //console.log(this.scene_name + " : " + ' attempting to add a(n) ' + string + ' entity');
	switch(string) {
		case "entity":
			this.entities.push(entity);
			this.all_entities.push(entity);
			break;
		case "tile":
			this.tiles.push(entity);
			this.all_entities.push(entity);
			break;
		case "floor":
			this.floor_tiles.push(entity);
			this.all_entities.push(entity);
			break;
		case "roof":
			this.roof_tiles.push(entity);
			this.all_entities.push(entity);
			break;
		case "hud":
			this.hud_elements.push(entity);
			this.all_entities.push(entity);
			break;
		default: console.log(this.scene_name + " : type invalid")
	}
	
}
