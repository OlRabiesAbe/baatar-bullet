Mob.prototype = new Entity();

function Mob(game, x, y, mob_type) {
	this.game = game;
	//all xy coords are automatically converted to the 64 unit grid
	//the extra adddition is to center baatar on a tile
	// xy: 2,3 = 128,192
	this.x = (x * 64) + 32; this.y = (y + 1) * 64;
	this.width = 32; this.height = 64;
	this.animation = new Animation(ASSET_MANAGER.getAsset("./img/mob_temp.png"), 0, 0, 32, 64, 1, 1, true, false);
	this.mob_type = mob_type;
	this.aggroed = true;
	
	//hyper centralized variable suite so i can make tweaks very easily
	this.MOVE_SPEED = 4/*maxperframe*/;
	this.MOVE_ACCEL = 1/*unitsperframe*/;
	
	//suite of variables for horizontal movement
	this.hspeed = 0;
	this.MAX_HSPEED = this.MOVE_SPEED;
	this.HACCEL = this.MOVE_ACCEL;
	this.HDECCEL = this.HACCEL;
	
	//suite of variables for the vertical movement
	this.vspeed = 0;
	this.MAX_VSPEED = this.MOVE_SPEED;
	this.VACCEL = this.MOVE_ACCEL;
	this.VDECCEL = this.VACCEL;
}

Mob.prototype.update = function() {
	
	if(this.aggroed) {
		
		//this code changes max speeds to fix the thing where up and right = faster than up or right
		// (there has to be a better way to do this?)
		if(Math.abs(this.game.baatar.x - this.x) > 4 && Math.abs(this.game.baatar.y - this.y) > 4) {
			this.MAX_HSPEED = this.MOVE_SPEED * 0.707;	// 0.707^2 + 0.707^2 = 1^2
			this.MAX_VSPEED = this.MOVE_SPEED * 0.707;
			this.HACCEL = this.MOVE_ACCEL * 0.707;
			this.VACCEL = this.MOVE_ACCEL * 0.707;
		} else {
			this.MAX_HSPEED = this.MOVE_SPEED;
			this.MAX_VSPEED = this.MOVE_SPEED;
			this.HACCEL = this.MOVE_ACCEL;
			this.VACCEL = this.MOVE_ACCEL;
		}
		this.HDECCEL = this.HACCEL;
		this.VDECCEL = this.VACCEL;
		
		if(Math.abs(this.game.baatar.x - this.x) > 4) {
			//sanitizing input (why is no press = undefined?  not false?)
			this.d = this.game.baatar.x > this.x;
			this.a = this.game.baatar.x < this.x;
			//add or subtract from hspeed depending on right/left
			this.hspeed += ((+this.d * this.HACCEL) - (+this.a * this.HACCEL));
		} else if(Math.abs(this.hspeed) < this.HDECCEL) {
			//if hspeed is < HDECCEL, we dont want to subtract from it,
			//cause that would mean slight backwards acceleration from decceleration, which is jank.
			this.hspeed = 0;
		} else if(this.hspeed != 0) {
			//subtracts decceleration from hspeed if hspeed positive, else adds it.
			this.hspeed -= (+this.d * this.HDECCEL) - (+this.a * this.HDECCEL);
		}
		
		if(Math.abs(this.game.baatar.y - this.y) > 4) {
			//sanitizing input (why is no press = undefined?  not false?)
			this.s = this.game.baatar.y > this.y;
			this.w = this.game.baatar.y < this.y;
			//add or subtract from hspeed depending on right/left
			this.vspeed += ((+this.s * this.VACCEL) - (+this.w * this.VACCEL));
		} else if(Math.abs(this.vspeed) < this.VDECCEL) {
			//if hspeed is < HDECCEL, we dont want to subtract from it,
			//cause that would mean slight backwards acceleration from decceleration, which is jank.
			this.vspeed = 0;
		} else if(this.vspeed != 0) {
			//subtracts decceleration from hspeed if hspeed positive, else adds it.
			this.vspeed -= (+this.s * this.VDECCEL) - (+this.w * this.VDECCEL);
		}
	}
	//handling top speed
	if(Math.abs(this.hspeed) > this.MAX_HSPEED) 
		this.hspeed = this.MAX_HSPEED * Math.sign(this.hspeed);
	this.x += this.hspeed;
	if(Math.abs(this.vspeed) > this.MAX_VSPEED) 
		this.vspeed = this.MAX_VSPEED * Math.sign(this.vspeed);
	this.y += this.vspeed;
}

Mob.prototype.draw = function(ctx) {
	this.animation.drawFrame(this.game.clockTick, ctx, this.x - (this.width/2), this.y - this.height);
}

// setter func to move a [whatever this is] off the grid
Mob.prototype.setFreeXY = function(x, y) {
	this.x = x; this.y = y;
}
