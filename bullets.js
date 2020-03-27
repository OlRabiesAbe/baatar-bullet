BulletSpawner.prototype = new Entity();

function BulletSpawner(game, owner = null, type = "single straight", speed = 4) {
	this.game = game;
	this.type = type;
	this.owner = owner;
	this.speed = speed;
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


Bullet.prototype = new Entity();
function Bullet(game, owner, bearing, pattern = "straight") {
	this.game = game;
	this.owner = owner;
	this.bearing = bearing;
	this.pattern = pattern;
	this.animation = new Animation(ASSET_MANAGER.getAsset("./img/bullet_temp.png"), 0, 0, 16, 16, 1, 1, true, false);
	this.x = owner.x; this.y = owner.y;
}
Bullet.prototype.update = function() {
	this.x += this.bearing.x;
	this.y += this.bearing.y;
	if(Math.abs(this.owner.x - this.x) > 2666 || Math.abs(this.owner.y - this.y) > 2666) this.remove_from_world = true;
}
Bullet.prototype.draw = function(ctx) {
	this.animation.drawFrame(this.game.clockTick, ctx, this.x - 8, this.y - 8);
}