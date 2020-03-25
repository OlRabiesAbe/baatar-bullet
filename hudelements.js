// cursor code is suprisingly simple. canvas jsut handles the mouse recording well.
Cursor.prototype = new Entity();
function Cursor(game) {
	this.game = game;
	this.animation = new Animation(ASSET_MANAGER.getAsset("./img/cursor_temp.png"), 0, 0, 16, 16, 1, 1, true, false);
	this.x = 0; this.y = 0;
}
Cursor.prototype.update = function() {
	this.x = this.game.mouse_x;	this.y = this.game.mouse_y;
}
Cursor.prototype.draw = function(ctx) {
	this.animation.drawFrame(this.game.clockTick, ctx, this.x - 16, this.y - 16);
}
