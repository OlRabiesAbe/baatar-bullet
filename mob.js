
// ██╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬██
//	MOB CLASS
//	≡≡≡≡≡≡≡≡≡≡≡≡≡≡≡
//	Entity
//	╚ Mob
// ██╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬██
Mob.prototype = new Entity();
/**
 	░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 		┴┬┴┬ Mob's Constructor ┴┬┴┬
	░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 */
function Mob(game, x, y, mob_type) {
	this.game = game;
	//all xy coords are automatically converted to the 64 unit grid
	//the extra adddition is to center baatar on a tile
	// xy: 2,3 = 128,192
	this.x = (x * 64) + 32; this.y = (y + 1) * 64;
	this.width = 32; this.height = 64;
	this.anim_def = new Animation(ASSET_MANAGER.getAsset("./img/mob_temp.png"), 0, 0, 32, 64, 1, 1, true, false);
	this.anim_hurt = new Animation(ASSET_MANAGER.getAsset("./img/mob_temp.png"), 128, 0, 32, 64, 1, 1, true, false);
	this.anim_still = new Animation(ASSET_MANAGER.getAsset("./img/mob_temp.png"), 64, 0, 32, 64, 1, 1, true, false);
	this.mob_type = this.name = mob_type;
	this.team = "enemy";
	this.gun = new BulletSpawner(game, this, speed = 1);
	
	//hyper centralized variable suite so i can make tweaks very easily
	this.MOVE_SPEED = 1/*maxperframe*/;
	this.MOVE_ACCEL = 0.25/*unitsperframe*/;
	this.MAX_HP = 100;
	
	//suite of variables for horizontal movement
	this.hspeed = 0;
	this.MAX_HSPEED = this.MOVE_SPEED; // all actual movements speeds divided by four because of quarter frames
	this.HACCEL = this.MOVE_ACCEL;
	this.HDECCEL = this.HACCEL;
	
	//suite of variables for the vertical movement
	this.vspeed = 0;
	this.MAX_VSPEED = this.MOVE_SPEED;
	this.VACCEL = this.MOVE_ACCEL;
	this.VDECCEL = this.VACCEL;
	
	//suite of variables for hp
	this.hp = this.MAX_HP;
	
	//list of vars for timers used in this mob's behaviors
	//[walk, sit, hurt display]
	this.timer = [400,100,0];
	this.TIMER_INIT = [400,100,45];
}
/**
 	░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 		┴┬┴┬ Mob Update ┴┬┴┬
	░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 		Called once(?) per frame
 */
Mob.prototype.update = function() {
	
	if(this.hp <= 0){
		this.remove_from_world = true;
		console.log(this.name + ", of clan " + this.team + ": of my bones, the hills");
		return;
	}
	
	//analyze call
	var behav_ID = this.analyze();
	
	//behavior switch
	switch (behav_ID) {
		case 1: 
			this.walkTowardsTarget(this.game.baatar); 
			break;
		case 2:
			this.fireBullet(this.game.baatar, this.gun);
			break;
		case 0: 
		default: 
			this.ceaseMovement();
			break;
	}
	
	this.unconditionalOperations();
}

/**
 	░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 		┴┬┴┬ Mob Analyze ┴┬┴┬
	░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 		Basically just a series of if-statements to discern
 		what this mob should be doing this frame.
		Returns an int called a behav_ID that is fed into the behavior switch statement
		in update that resolves it to an appropriate method call.
 */
Mob.prototype.analyze = function() {
	if(this.timer[0] == 0 && this.timer[1] < 20 && this.timer[1]%5 == 0) return 2;
	if(this.game.baatar.hp <= 0 || this.timer[0] == 0) return 0;
	return 1;
}

/**
 	░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 		┴┬┴┬ Walk Towards Target ┴┬┴┬
	░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
		As advertized, it causes this to walk at the passed target.
		Despite the simple goal, this method is ungodly complicated.
 */
Mob.prototype.walkTowardsTarget = function(target) {
	//RESOLVE CURRENT MAX SPEEDS
	// this code changes max speeds to fix the thing where up and right = faster than up or right
	// (there has to be a better way to do this?)
	// update: tried to improve by checking if its already right before assigning
	if(Math.abs(target.x - this.x) > 4 && Math.abs(target.y - this.y) > 4 && this.MAX_HSPEED != this.MOVE_SPEED * 0.707) {
		this.MAX_HSPEED = this.MOVE_SPEED * 0.707;	// 0.707^2 + 0.707^2 = 1^2
		this.MAX_VSPEED = this.MOVE_SPEED * 0.707;
		this.HACCEL = this.MOVE_ACCEL * 0.707;
		this.VACCEL = this.MOVE_ACCEL * 0.707;
	} else if(this.MAX_HSPEED != this.MOVE_SPEED) {
		this.MAX_HSPEED = this.MOVE_SPEED;
		this.MAX_VSPEED = this.MOVE_SPEED;
		this.HACCEL = this.MOVE_ACCEL;
		this.VACCEL = this.MOVE_ACCEL;
	}
	this.HDECCEL = this.HACCEL;
	this.VDECCEL = this.VACCEL;
	
	//RESOLVE DESIRED DIRECTION OF MOVEMENT
	// -> CALCULATE ACCELERATION AND APPLY TO SPEED
	if(Math.abs(target.x - this.x) > 4) {
		//sanitizing input (why is no press = undefined?  not false?)
		this.d = target.x > this.x;
		this.a = target.x < this.x;
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
	
	//RESOLVE DESIRED DIRECTION OF MOVEMENT
	// -> CALCULATE ACCELERATION AND APPLY TO SPEED
	if(Math.abs(target.y - this.y) > 4) {
		//sanitizing input (why is no press = undefined?  not false?)
		this.s = target.y > this.y;
		this.w = target.y < this.y;
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

/**
 	░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
		┴┬┴┬ Fire Bullet ┴┬┴┬
	░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 		Can be called by update's behavior switch in case 2,
		just shoots at the passed target with the passed bulletspawner.
		Is only a method for code niceness purposes, as it's a single line function.
 */
Mob.prototype.fireBullet = function(target, gun) {
	gun.fire(gun.parseTargetCoords(target));
}

/**
 	░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 		┴┬┴┬ Cease Movement ┴┬┴┬
	░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
		This is the behavior switch's case 0 and default.
		Simply handles natural deeceleration and does nothing else.
 */
Mob.prototype.ceaseMovement = function() {
	// ISSUE: should this resetting happen every ceaseMovement?
	this.MAX_HSPEED = this.MOVE_SPEED;
	this.MAX_VSPEED = this.MOVE_SPEED;
	this.HACCEL = this.MOVE_ACCEL;
	this.VACCEL = this.MOVE_ACCEL;
	this.HDECCEL = this.HACCEL;
	this.VDECCEL = this.VACCEL;
	this.w = this.a = this.s = this.d = false;
	this.hspeed -= Math.sign(this.hspeed) * this.HDECCEL;
	if(Math.abs(this.hspeed) < this.HDECCEL) 
		this.hspeed = 0;
	this.vspeed -= Math.sign(this.vspeed) * this.VDECCEL;
	if(Math.abs(this.vspeed) < this.VDECCEL) 
		this.vspeed = 0;
}

/**
 	░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 		┴┬┴┬ Mob's Unconditional Operations ┴┬┴┬
	░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
		This func is called once at the end of every update call.
		Does things like enforcing this mob's speedlimits and reseting
		timers.
 */
Mob.prototype.unconditionalOperations = function() {
	//BOUND TOP SPEED, APPLY SPEED TO POSITION
	if(Math.abs(this.hspeed) > this.MAX_HSPEED) 
		this.hspeed = this.MAX_HSPEED * Math.sign(this.hspeed);
	this.x += this.hspeed;
	if(Math.abs(this.vspeed) > this.MAX_VSPEED) 
		this.vspeed = this.MAX_VSPEED * Math.sign(this.vspeed);
	this.y += this.vspeed;
	
	//timer setting
	if(this.timer[0] == 0 && this.timer[1] == 0) {
		this.timer[0] = this.TIMER_INIT[0];
		this.timer[1] = this.TIMER_INIT[1];
	}
	if(this.timer[0] == 0) this.timer[1]--;
	else this.timer[0]--;
	if(this.timer[2] > 0) this.timer[2]--;
}

/**
 	░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 		┴┬┴┬ Hit ┴┬┴┬
	░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
		Causes this to lose hp and sets a timer 
		to display a hurt animation.
 */
Mob.prototype.hit = function(damage) {
	this.hp -= damage;
	this.timer[2] = this.TIMER_INIT[2];
	//console.log(this.name + ", of clan " + this.team + ": ow, on a scale of 0 to " + this.MAX_HP + " that hurt about a " + damage);
}

/**
 	░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 		┴┬┴┬ Draw ┴┬┴┬
	░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
		It's Mob's draw.
 */
Mob.prototype.draw = function(ctx) {
	if(this.timer[2] != 0) this.anim_hurt.drawFrame(this.game.clockTick, ctx, this.x - (this.width/2), this.y - this.height);
	else if(this.timer[0] == 0) this.anim_still.drawFrame(this.game.clockTick, ctx, this.x - (this.width/2), this.y - this.height);
	else this.anim_def.drawFrame(this.game.clockTick, ctx, this.x - (this.width/2), this.y - this.height);
}


/**
  ╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗╔╗
  ╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝╚╝
 	UTILITY FUNCTIONS, NOT USED BY THIS CLASS IN REGULAR EXECUTION
*/

/**
 	░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
 		┴┬┴┬ Set Free XY ┴┬┴┬
	░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
		Allows the dev to give a Mob an XY not a multiple of 64.
 */
Mob.prototype.setFreeXY = function(x, y) {
	this.x = x; this.y = y;
}
// ██╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬==╬==╬==■==╬==╬██