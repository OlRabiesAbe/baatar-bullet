// This game shell was happily copied from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function GameEngine() {
    this.baatar = null;
    this.entities = [];
    this.tiles = [];
    this.bullets = [];
    this.hud_elements = [];
    this.all_entities = [];
    this.current_scene = "default";
    this.showOutlines = false;
    this.ctx = null;
    this.click = null;
    this.mouse = null;
    this.wheel = null;
    this.mute = false;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();
    this.timer = new Timer();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    console.log('starting input');
    var that = this;
	this.ctx.canvas.addEventListener("mousemove", function (e) {
		//console.log(e.clientX + " " + e.clientY);
		that.mouse_x = e.clientX;
		that.mouse_y = e.clientY;
	}, false);

    this.ctx.canvas.addEventListener("keydown", function (e) {	
		if (String.fromCharCode(e.which) === 'W') that.w = true;
			if (String.fromCharCode(e.which) === 'D') that.d = true;
			if (String.fromCharCode(e.which) === 'A') that.a = true;
			if (String.fromCharCode(e.which) === 'S') that.s = true;
			if (String.fromCharCode(e.which) === ' ') that.space = true;
			
			e.preventDefault();
    }, false);
	this.ctx.canvas.addEventListener("click", function (e) {
		that.click = true;
		that.mouseTimer = 0;
	}, false);
	this.ctx.canvas.addEventListener("keyup", function(e) {
		if (String.fromCharCode(e.which) === 'W') that.w = false;
		if (String.fromCharCode(e.which) === 'D') that.d = false;
		if (String.fromCharCode(e.which) === 'A') that.a = false;
		if (String.fromCharCode(e.which) === 'S') that.s = false;
		if (String.fromCharCode(e.which) === ' ') that.space = false;
		check = false;
	}, false);
}

GameEngine.prototype.addEntity = function (entity) {
    console.log(' : the game engine itself added an entity');
	this.entities.push(entity);
    this.all_entities.push(entity);
}
GameEngine.prototype.addTile = function (entity) {
    console.log(' : the game engine itself added a tile');
	this.tiles.push(entity);
    this.all_entities.push(entity);
}
GameEngine.prototype.addHUDElement = function (entity) {
    console.log(' : the game engine itself added a hud element');
	this.hud_elements.push(entity);
    this.all_entities.push(entity);
}
GameEngine.prototype.addBullet = function (entity) {
    console.log(' : the game engine itself added a bullet');
	this.bullets.push(entity);
    this.all_entities.push(entity);
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
	for (var i = 0; i < this.tiles.length; i++) {
        this.tiles[i].draw(this.ctx);
    }
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
	for (var i = 0; i < this.bullets.length; i++) {
        this.bullets[i].draw(this.ctx);
    }
	for (var i = 0; i < this.hud_elements.length; i++) {
        this.hud_elements[i].draw(this.ctx);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
	//handling mouseclicks
	this.mouseTimer += this.clockTick;
	if (this.click && this.mouseTimer >= 0.05) {
		this.click = false;
		this.mouseTimer = 0;
	}
	
	//updating -everything-
    for (var i = 0; i < this.entities.length; i++) {
        var entity = this.entities[i];
        if (!entity.remove_from_world) {
            entity.update();
        }
    }
	var non_bullets = []; //array of bullets to be deleted
	for (var i = 0; i < this.bullets.length; i++) {
        var entity = this.bullets[i];
        if (!entity.remove_from_world) {
            entity.update();
        } else non_bullets.push(i);
    }
	for(var i = 0; i < non_bullets.length; i++) { //splicing out relevant bullets
		this.bullets.splice(non_bullets[i], ++non_bullets[i]);
	}
	for (var i = 0; i < this.tiles.length; i++) {
        var entity = this.tiles[i];
        if (!entity.remove_from_world) {
            entity.update();
        }
    }
	for (var i = 0; i < this.hud_elements.length; i++) {
        var entity = this.hud_elements[i];
        if (!entity.remove_from_world) {
            entity.update();
        }
    }
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
	//four sub frames between each actual frame
	//helps w/ collision caculation
	for(var i = 0; i < 4; ++i) this.update();
    this.draw();
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.remove_from_world = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    return offscreenCanvas;
}
