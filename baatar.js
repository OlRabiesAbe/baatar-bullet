// ╬==╬==╬==╬==¤==╬==╬==╬==╬==¤==╬==╬==╬==╬==¤==╬==╬==╬==╬==¤==╬==╬==╬==╬==¤==╬==╬==╬==╬==¤==╬==╬==╬==╬==¤==╬==╬==╬==╬==¤==╬==╬==╬==╬==¤==╬==╬==╬==╬==¤==╬==╬
// BAATAR CLASS
//	≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
//	Entity
//	╚ Baatar
// <>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>
Baatar.prototype = new Entity();
Baatar.prototype.constructor = Baatar;
function Baatar(game, x = 2, y = 2, cursor = null) {
	this.game = game;
	//all xy coords are automatically converted to the 64 unit grid
	//the extra adddition is to center baatar on a tile
	// xy: 2,3 = 128,192
	this.x = (x * 64) + 32; this.y = (y + 1) * 64;
	this.cursor = cursor;
	this.width = 32; this.height = 64;
	this.name = this.team = "baatar";
	this.animation = new Animation(ASSET_MANAGER.getAsset("./img/baatar_temp.png"), 0, 0, this.width, this.height, 1, 1, true, false);
	this.gun = new BulletSpawner(game, this, "titledrop", 32);
	
	//hyper centralized variable suite so i can make tweaks very easily
	this.MOVE_SPEED = 2/*maxperframe*/;
	this.MOVE_ACCEL = 0.25/*unitsperframe*/;
	this.MAX_HP = 200;
	this.TIME_BETWEEN_SHOTS = 32/*frames*/;
	
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
	
	//suite of variables for hp
	this.hp = this.MAX_HP;
	
	//suite of variables for shooting my BulletSpawner
	this.shoot_timer = this.TIME_BETWEEN_SHOTS; //times four because quarter frames
}

Baatar.prototype.update = function() {
	
	if(this.game.f) {
		this.hp -= 25;
		this.game.f = false;
	}
	
	if(this.hp <= 0){
		this.remove_from_world == true;
		return;
	}
	
	this.horizontal = (this.game.d || this.game.a);
	this.vertical = (this.game.w || this.game.s);
	
	//this code changes max speeds to fix the thing where up and right = faster than up or right
	// (there has to be a better way to do this?)
	// update: tried to improve by checking if its already right before assigning
	if(this.horizontal && this.vertical && this.MAX_HSPEED != this.MOVE_SPEED * 0.707) {
		this.MAX_HSPEED = this.MOVE_SPEED * 0.707;	// 0.707^2 + 0.707^2 = 1^2
		this.MAX_VSPEED = this.MOVE_SPEED * 0.707;
		this.HACCEL = this.MOVE_ACCEL * 0.707;
		this.VACCEL = this.MOVE_ACCEL * 0.707;
	} else if (this.MAX_HSPEED != this.MOVE_SPEED) {
		this.MAX_HSPEED = this.MOVE_SPEED;
		this.MAX_VSPEED = this.MOVE_SPEED;
		this.HACCEL = this.MOVE_ACCEL;
		this.VACCEL = this.MOVE_ACCEL;
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
	
	//checking for gunfire from player, handling shoot_timer
	if(this.game.click && this.shoot_timer == this.TIME_BETWEEN_SHOTS) {
		this.cursor.update();
		this.gun.fire( {x: this.cursor.x + (this.cursor.width/2), y: this.cursor.y + (this.cursor.height/2)} );
		this.shoot_timer = 0;
	} else if(this.shoot_timer != this.TIME_BETWEEN_SHOTS) this.shoot_timer++;
}

Baatar.prototype.draw = function(ctx) {
	this.animation.drawFrame(this.game.clockTick, ctx, this.x - (this.width/2), this.y - this.height);
}

Baatar.prototype.hit = function(damage) {
	this.hp -= damage;
	if(this.hp > this.MAX_HP) this.hp = this.MAX_HP;
}
// <>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>
// <>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>==<<>>==<>==<>
