// the jQuery func findOffset gets the offset.top and offset.left distance between browser's edge and canvas element's edge
jQuery.fn.extend({
    findOffset: function() {
		var offset = $("#gameWorld").offset();
		return offset;
	}
});

// cursor code is suprisingly simple. c̶a̶n̶v̶a̶s ̶j̶s̶u̶t ̶h̶a̶n̶d̶l̶e̶s ̶t̶h̶e ̶m̶o̶u̶s̶e ̶r̶e̶c̶o̶r̶d̶i̶n̶g ̶w̶e̶l̶l forget i said anything
Cursor.prototype = new Entity();

function Cursor(game) {
	this.game = game;
	this.animation = new Animation(ASSET_MANAGER.getAsset("./img/cursor_temp.png"), 0, 0, 16, 16, 1, 1, true, false);
	this.x = 0; this.y = 0;
	
	// default canvas mouse events dont factor in the margin between the canvas and browser window edge,
	// so the reported x y are always off from the actual cursor.
	// this uses a jQuery function to find the gap dimensions and calculates the actual cursor location
	this.page_offset = $(document).findOffset();
}
Cursor.prototype.update = function() {
	
	// gameengine.js finds the user cursor's x y coords
	this.x = this.game.mouse_x;	this.y = this.game.mouse_y;
	// fetching gap between browser & canvas
	this.page_offset = $(document).findOffset();
	
	//math
	this.x = this.x - this.page_offset.left - 8;
	this.y = this.y - this.page_offset.top - 8;
}
Cursor.prototype.draw = function(ctx) {
	this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
}

