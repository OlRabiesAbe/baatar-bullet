Baatar.prototype = new Entity();

function Baatar(game, x = 2, y = 2) {
	this.game = game;
	this.animation = new Animation(ASSET_MANAGER.getAsset("./img/baatar_temp.png"), 0, 0, 32, 64, 1, 1, true, false);
	this.x = (x * 64) + 32; this.y = (y + 1) * 64;
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
	
	this.gun = new BulletSpawner(game, this);
}

Baatar.prototype.update = function() {
	this.horizontal = (this.game.d || this.game.a);
	this.vertical = (this.game.w || this.game.s);
	
	//this code changes max speeds to fix the thing where up and right = faster than up or right
	// (there has to be a better way to do this?)
	if(this.horizontal && this.vertical) {
		this.MAX_HSPEED =  8 * 0.707;	// 0.707^2 + 0.707^2 = 1^2
		this.MAX_VSPEED =  8 * 0.707;
		this.HACCEL = 0.707;
		this.VACCEL = 0.707;
	} else {
		this.MAX_HSPEED =  8;
		this.MAX_VSPEED =  8;
		this.HACCEL = 1;
		this.VACCEL = 1;
	}
	this.HDECCEL = this.HACCEL;
	this.VDECCEL = this.VACCEL;
	
	if(this.horizontal) {
		//sanitizing input (why is no press = undefined?  not false?)
		this.d = isNaN(this.game.d) ? false : this.game.d;
		this.a = isNaN(this.game.a) ? false : this.game.a;
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
	//handling top speed
	if(Math.abs(this.hspeed) > this.MAX_HSPEED) 
		this.hspeed = this.MAX_HSPEED * Math.sign(this.hspeed);
	this.x += this.hspeed;
	
	if(this.vertical) {
		//sanitizing input (why is no press = undefined?  not false?)
		this.s = isNaN(this.game.s) ? false : this.game.s;
		this.w = isNaN(this.game.w) ? false : this.game.w;
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
	//handling top speed
	if(Math.abs(this.vspeed) > this.MAX_VSPEED) 
		this.vspeed = this.MAX_VSPEED * Math.sign(this.vspeed);
	this.y += this.vspeed;
	
	if(this.game.click) this.gun.fire();
}

Baatar.prototype.draw = function(ctx) {
	this.animation.drawFrame(this.game.clockTick, ctx, this.x - (this.width/2), this.y - this.height);
}