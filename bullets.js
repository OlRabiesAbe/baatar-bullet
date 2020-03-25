BulletSpawner.prototype = new Entity();
function BulletSpawner(game, owner = null, type = "single straight") {
	this.game = game;
	this.type = type;
	this.owner = owner;
}
BulletSpawner.prototype.fire = function() {
	if(this.owner == null) return;
	switch(this.type) {
		default:
		case "single straight":
			this.game.addEntity(new Bullet(this.game, this.owner, [2, 0]));
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
	this.x += this.bearing[0];
	this.y += this.bearing[1];
}
Bullet.prototype.draw = function(ctx) {
	this.animation.drawFrame(this.game.clockTick, ctx, this.x - 16, this.y - 16);
}