class Tile extends Entity {
	constructor(game, img, imgX, imgY, x, y) {
		//all xy coords are automatically converted to the 64 unit grid
		// xy: 2,3 = 128,192
		super(game, x * 64, y * 64)
		this.width = 64; this.height = 64; 
		this.animation = new Animation(ASSET_MANAGER.getAsset(img), imgX, imgY, this.width, this.height, 1, 1, true, false);
		
		//collision specifics suite
		this.HORZ_COLL_RADIUS = 16; //how far a tile's hitbox extends out to the left and right
		this.VERT_COLL_RADIUS = 32; //'' how far a tile's vertical hitboxes into the tile
		this.ARB_HITBOX_BUFFER = 3; // pointless variable describing the buffer between different collision hitboxes, so they dont overlap
									// i cant think of a better way to decribe it
	}

	handleEntityCollision(entity) {
		
		//checking if the entity is colliding with this tile. last else = a collision is indeed occuring
		/*if(entity.y < this.y - this.VERT_UPPER_COLL_RADIUS || entity.y - entity.height > this.y + this.height + this.VERT_UPPER_COLL_RADIUS) {}
		else if (entity.x + (entity.width/2)+1 < this.x - this.HORZ_COLL_RADIUS || entity.x - (entity.width/2)-1 > this.x + this.width + this.HORZ_COLL_RADIUS) {}
		
		else*/ { //a collision has occured, displace entity out of tile
			//a tile's left/right colliders extends HCR units into and out of the tile
					// ~+LEFT CASE+~
			if(entity.x + (entity.width/2) > this.x && entity.x + (entity.width/2) < this.x + this.HORZ_COLL_RADIUS 
							&& entity.y > this.y + this.ARB_HITBOX_BUFFER && entity.y - entity.height < this.y + this.height - this.ARB_HITBOX_BUFFER) {
				entity.x = this.x - (entity.width/2);
				entity.hspeed = 0;
			}
					// ~+RIGHT CASE+~
			if(entity.x - (entity.width/2) < this.x + this.width && entity.x - (entity.width/2) > this.x + this.width - this.HORZ_COLL_RADIUS 
							&& entity.y > this.y + this.ARB_HITBOX_BUFFER && entity.y - entity.height < this.y + this.height - this.ARB_HITBOX_BUFFER) {
				entity.x = this.x + this.width + (entity.width/2);
				entity.hspeed = 0;
			}
					// ~+TOP CASE+~
			if(entity.y > this.y && entity.y < this.y + this.VERT_COLL_RADIUS 
							&& entity.x + (entity.width/2) > this.x + this.ARB_HITBOX_BUFFER && entity.x - (entity.width/2) < this.x + this.width - this.ARB_HITBOX_BUFFER) {
				entity.y = this.y;
				entity.vspeed = 0;
			}
					// ~+BOTTOM CASE+~
			if(entity.y - entity.height < this.y + this.height && entity.y - entity.height > this.y + this.height - this.VERT_COLL_RADIUS 
							&& entity.x + (entity.width/2) > this.x + this.ARB_HITBOX_BUFFER && entity.x - (entity.width/2) < this.x + this.width - this.ARB_HITBOX_BUFFER) {
				entity.y = this.y + this.height + entity.height;
				entity.vspeed = 0;
			}
		}
	}

	handleBulletCollision(entity) {
		
		if(entity.y < this.y || entity.y > this.y + this.height) {}
		else if (entity.x < this.x || entity.x > this.x + this.width) {}
		else entity.remove_from_world = true;
		
	}

	update(ctx) { //handle collision on all entities
		for (var i = 0; i < this.game.entities.length; i++) this.handleEntityCollision(this.game.entities[i]);
		for (var i = 0; i < this.game.bullets.length; i++) this.handleBulletCollision(this.game.bullets[i]);
	}

	draw(ctx) {this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);}

	// setter func to move a [whatever this is] off the grid
	setFreeXY(x, y) {
		this.x = x; this.y = y;
	}
}

class HalfTile extends Tile {
	constructor(game, img, imgX, imgY, x, y) {
		//all xy coords are automatically converted to the 64 unit grid
		// xy: 2,3 = 128,192
		super(game, x * 64, y * 64)
		this.width = 64; this.height = 64; 
		this.animation = new Animation(ASSET_MANAGER.getAsset(img), imgX, imgY, this.width, this.height, 1, 1, true, false);
		
		//collision specifics suite
		this.HORZ_COLL_RADIUS = 16; //how far a tile's hitbox extends out to the left and right
		this.VERT_LOWER_COLL_RADIUS = 32; //'' how far a tile's vertical hitboxes extend down
		this.VERT_UPPER_COLL_RADIUS = 8; // how far a tile's vertical hitboxes extend up
		this.ARB_HITBOX_BUFFER = 8; // pointless variable describing the buffer between different collision hitboxes, so they dont overlap
									// i cant think of a better way to decribe it
	}

	handleEntityCollision(entity) {
		
		//checking if the entity is colliding with this tile. last else = a collision is indeed occuring
		if(entity.y < this.y - this.VERT_LOWER_COLL_RADIUS || entity.y - (entity.width/2) > this.y + this.height + this.VERT_LOWER_COLL_RADIUS) {}
		else if (entity.x + entity.width < this.x - this.HORZ_COLL_RADIUS || entity.x > this.x + this.width + this.HORZ_COLL_RADIUS) {}
		
		else { //a collision has occured, displace entity out of tile
		
			//a tile's left/right colliders extends HCR units into and out of the tile
					// ~+LEFT CASE+~
			if(entity.x > this.x - this.HORZ_COLL_RADIUS && entity.x < this.x + this.HORZ_COLL_RADIUS 
							&& entity.y > this.y + this.ARB_HITBOX_BUFFER && entity.y < this.y + this.height) {
				entity.x = this.x - this.HORZ_COLL_RADIUS;
				entity.hspeed = 0;
			}
					// ~+RIGHT CASE+~
			if(entity.x < this.x + this.width + this.HORZ_COLL_RADIUS && entity.x > this.x + this.width - this.HORZ_COLL_RADIUS 
							&& entity.y > this.y + this.ARB_HITBOX_BUFFER && entity.y < this.y + this.height) {
				entity.x = this.x + this.width + this.HORZ_COLL_RADIUS;
				entity.hspeed = 0;
			}
					// ~+TOP CASE+~
			if(entity.y > this.y - this.VERT_UPPER_COLL_RADIUS && entity.y < this.y + this.VERT_LOWER_COLL_RADIUS 
							&& entity.x + (entity.width/2) > this.x + this.ARB_HITBOX_BUFFER && entity.x - (entity.width/2) < this.x + this.width - this.ARB_HITBOX_BUFFER) {
				entity.y = this.y - this.VERT_UPPER_COLL_RADIUS;
				entity.vspeed = 0;
			}
					// ~+BOTTOM CASE+~
			if(entity.y > this.y + this.height - this.VERT_LOWER_COLL_RADIUS && entity.y < this.y + this.height + this.VERT_LOWER_COLL_RADIUS
							&& entity.x + (entity.width/2) > this.x + this.ARB_HITBOX_BUFFER && entity.x - (entity.width/2) < this.x + this.width - this.ARB_HITBOX_BUFFER) {
				entity.y = this.y + this.height + this.VERT_LOWER_COLL_RADIUS;
				entity.vspeed = 0;
			}
		}
	}

	handleBulletCollision(entity) {
		
		if(entity.y < this.y || entity.y > this.y + (this.height/2)) {}
		else if (entity.x < this.x || entity.x > this.x + this.width) {}
		else entity.remove_from_world = true;
		
	}

	update(ctx) { //handle collision on all entities
		for (var i = 0; i < this.game.entities.length; i++) this.handleEntityCollision(this.game.entities[i]);
		for (var i = 0; i < this.game.bullets.length; i++) this.handleBulletCollision(this.game.bullets[i]);
	}

	draw(ctx) {this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);}

	// setter func to move a [whatever this is] off the grid
	setFreeXY(x, y) {
		this.x = x; this.y = y;
	}
}