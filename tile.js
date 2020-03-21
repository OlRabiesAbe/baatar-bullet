Tile.prototype = new Entity();
Tile.prototype.constructor = Tile;

function Tile(game, img, imgX, imgY, x, y) {
	this.game = game;
	this.x = x; this.y = y;
	this.width = 64; this.height = 64; 
	this.animation = new Animation(ASSET_MANAGER.getAsset(img), imgX, imgY, 64, 64, 1, 1, true, false);
	
	//collision specifics suite
	this.HORZ_COLL_RADIUS = 16; //how far a tile's hitbox extends out to the left and right
	this.VERT_COLL_RADIUS = 32; //'' up and down
}

Tile.prototype.handleCollision = function(entity) {
	
	//checking if the entity is colliding with this tile. last else = a collision is indeed occuring
	if(entity.y < this.y - this.VERT_COLL_RADIUS || entity.y - (entity.width/2) > this.y + this.height + this.VERT_COLL_RADIUS) {}
	else if (entity.x + entity.width < this.x - this.HORZ_COLL_RADIUS || entity.x > this.x + this.width + this.HORZ_COLL_RADIUS) {}
	
	else { //a collision has occured, displace entity out of tile
	
		//a tile's left/right colliders extends HCR units into and out of the tile
				// ~+LEFT CASE+~
		if(entity.x > this.x - this.HORZ_COLL_RADIUS && entity.x < this.x + this.HORZ_COLL_RADIUS 
						&& entity.y > this.y && entity.y < this.y + this.height) {
			entity.x = this.x - this.HORZ_COLL_RADIUS;
			entity.hspeed = 0;
		}
				// ~+RIGHT CASE+~
		if(entity.x < this.x + this.width + this.HORZ_COLL_RADIUS && entity.x > this.x + this.width - this.HORZ_COLL_RADIUS 
						&& entity.y > this.y && entity.y < this.y + this.height) {
			entity.x = this.x + this.width + this.HORZ_COLL_RADIUS;
			entity.hspeed = 0;
		}
				// ~+TOP CASE+~
		if(entity.y > this.y  && entity.y < this.y + this.VERT_COLL_RADIUS 
						&& entity.x + (entity.width/2) > this.x && entity.x - (entity.width/2) < this.x + this.width) {
			entity.y = this.y;
			entity.vspeed = 0;
		}
				// ~+BOTTOM CASE+~
		if(entity.y > this.y + this.height - this.VERT_COLL_RADIUS && entity.y < this.y + this.height + this.VERT_COLL_RADIUS
						&& entity.x + (entity.width/2) > this.x && entity.x - (entity.width/2) < this.x + this.width) {
			entity.y = this.y + this.height + this.VERT_COLL_RADIUS;
			entity.vspeed = 0;
		} else {
			console.log("clause 1: " + (entity.y - (entity.height/2) > this.y + this.height - this.VERT_COLL_RADIUS));
			console.log("clause 2: " + (entity.y - (entity.height/2) < this.y + this.height));
			console.log("clause 3: " + (entity.x + (entity.width/2) > this.x));
			console.log("clause 4: " + (entity.x - (entity.width/2) < this.x + this.width));
			console.log("===========================");
		}
	}
}

Tile.prototype.update = function(ctx) { //handle collision on all entities
	for (var i = 0; i < this.game.entities.length; i++) this.handleCollision(this.game.entities[i]);
}

Tile.prototype.draw = function(ctx) {this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 1);}