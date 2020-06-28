
// ██╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬██
//	BULLET SPAWNER CLASS
//	≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
//	Entity
//	╚ Bullet Spawner
// ██╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬██
BulletSpawner.prototype = new Entity();
function BulletSpawner(game, owner = null, type = "single straight", speed = 4) {
	this.game = game;
	this.type = type;
	this.owner = owner;
	this.speed = speed/4;
}
BulletSpawner.prototype.fire = function(targ_coords) {
	if(this.owner == null) return;
	
	//calculating xy movement for bullet
	targ_coords.x = targ_coords.x - this.owner.x;	targ_coords.y = targ_coords.y - this.owner.y;
	var magic_ratio = this.speed / Math.sqrt((targ_coords.x * targ_coords.x) + (targ_coords.y * targ_coords.y));
	var x_cln = targ_coords.x * magic_ratio;	var y_cln = targ_coords.y * magic_ratio;
	
	switch(this.type) {
		default:
		case "single straight":
			this.game.addBullet(new Bullet(this.game, this.owner, {x:x_cln, y:y_cln}));
			break;
	}
}

/**
  ╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗
  ╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝
 	UTILITY FUNCTIONS, NOT USED BY THIS CLASS IN REGULAR EXECUTION
 */
BulletSpawner.prototype.parseTargetCoords = function(target) {
	return {x:target.x, y:target.y};
}
// ██╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬██









// ██╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬██
//	BULLET CLASS
//	≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
//	Entity
//	╚ Bullet
// ██╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬██
Bullet.prototype = new Entity();
function Bullet(game, owner, bearing, pattern = "straight") {
	this.game = game;
	this.owner = owner;
	this.bearing = bearing;
	this.pattern = pattern;
	this.x = owner.x; this.y = owner.y;
	this.width = 16; this.height = 16;
	this.animation = new Animation(ASSET_MANAGER.getAsset("./img/bullet_temp.png"), 0, 0, this.width, this.height, 1, 1, true, false);
	
}

Bullet.prototype.handleEntityCollision = function(entity) {
	
	if(entity.team == "enemy"){
		if(this.y < entity.y - (entity.height*.66) || this.y > entity.y + (entity.height*1.33)) {}
		else if (this.x < entity.x + (entity.width*.66) || this.x > entity.x + (entity.width*1.33)) {}
		else {
			entity.hit(40);
			this.remove_from_world = true;
		}
	}
	
}

Bullet.prototype.update = function() {
	this.x += this.bearing.x;
	this.y += this.bearing.y;
	if(Math.abs(this.owner.x - this.x) > 2666 || Math.abs(this.owner.y - this.y) > 2666) this.remove_from_world = true;
	if(!this.remove_from_world) 
		for (var i = 0; i < this.game.entities.length; i++) this.handleEntityCollision(this.game.entities[i]);
}

Bullet.prototype.draw = function(ctx) {
	this.animation.drawFrame(this.game.clockTick, ctx, this.x - 8, this.y - 8);
}
// ██╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬██