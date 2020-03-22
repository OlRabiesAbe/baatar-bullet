Mob.prototype = new Entity();

function Mob(game, x, y, mob_type) {
	this.game = game;
	this.animation = new Animation(ASSET_MANAGER.getAsset("./img/mob_temp.png"), 0, 0, 32, 64, 1, 1, true, false);
	this.x = x; this.y = y;
	this.mob_type = mob_type;
	this.width = 32; this.height = 64;
	
	//suite of variables for horizontal movement		(ALL_CAPS = psuedo constant)
	this.hspeed = 0;
	this.MAX_HSPEED = 8;
	this.HACCEL = 1;
	this.HDECCEL = this.HACCEL;
	
	//suite of variables for the vertical movement		(ALL_CAPS = psuedo constant)
	this.vspeed = 0;
	this.MAX_VSPEED = 8;
	this.VACCEL = 1;
	this.VDECCEL = this.VACCEL;
}

Mob.prototype.update = function() {}

Mob.prototype.draw = function(ctx) {
	this.animation.drawFrame(this.game.clockTick, ctx, this.x - (this.width/2), this.y - this.height);
}