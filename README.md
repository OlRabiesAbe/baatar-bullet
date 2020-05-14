# baatar-bullet
repo for a tentatively titled bullet hell shooter about a mongolian batter

[DESIGN DOCUMENT]
Introduction:
	As a way to spend this spring/Covid break dong something productive I’ll develop and release a game. The project will be worked on primarily during this break but it’s conceivable that work will continue into the next quarter, it is imperative that this project be finished. The game will be developed with Javascript’s canvas.

Overview:
	The game in question will be a top-down/pseudo-isometric bullet-hell shooter with stylized pixel art, and some inspiration taken from Hotline Miami in addition to traditional bullet-hells. The game will feature cut-scenes, combat with a varied move-set, a characterized protagonist, multiple other named characters, a generally humorous tone with some horror undertones. The game will feature  passwords in lieu of saving. Dialog will be in intentionally stilted English to emphasize foreignness of the locale.

Required Assets:

	-Characters: the game will feature named characters, who will all require both a game-world animated sprite and conversation portraits.
	
	-Enemies: the game will feature enemies that will have game-world sprites animated for movement, attacking, and death.
	
	-Levels: each level will either require a single image or tile based geometry.
	
	-Hud/Ui: the Hud, Ui, and menu will require art and animated buttons.

Gameplay, and What It Will Require:
	Gameplay will feature fast paced bullet-hell shooter action. Basic gameplay loop will be as follows: receive info about area boss and area from sidekick char, fight of generic grunts through level, confront then fight area boss.
	This will require the following systems:
	
	-a scene manager
	
	-dialog manager
	
	-hud manager
	
	-top-down omnidirectional camera
	
	-four-way momentous movement
	
	-enemy ai (can prolly get away w it being basic)
	
	-wall collision, applicable to Baatar and enemies
	
	-robust bullet spawning tech, applicable to Baatar and enemies
	
	-hp system, applicable to Baatar and enemies
	
	-hit detection, applicable to Baatar and enemies

Protagonist’s powers:
	Baatar will be able to do the following:
	
	-fire bullets in a pattern
	
	-swing his baseball bat to deflect bullets
	
	-pick up power-ups to change his bullet’s patterns

Story(?):
	The protagonist of the game will be a 20s-ish baseball batter crossed with a Mongol with an oversized baseball for a head. This protagonist, Baatar, is a Mongolian national who is a talented baseball player. One day, walking the streets of Ulaanbaatar, a stranger named Ciggie whose head is an oversized cigarette quickly took a liking to Baatar and explained that for him to pursue baseball stardom he’ll have to defeat a number of similarly caricatured bobble-head types. So begins Baatar’s quest.

Art Design:
	It will be pixel art. It should be goofy and a bit serious at the same time.

OST:
	Due to a total absence of musical talent/skill, music will be entirely ripped from soundtracks I like. This game will not be sold, so no matter.
	Sound effects will either be recorded via my microphone and edited in Audacity, or ripped from the internet/other games.

Plan as it stands:
	-5/14/20: fully implement roof and floor tiles
	-5/15/20: teach enemies to shoot you
	-5/16/20: implement a tile array that functions with gameengine and scenemanager
	-5/17/20: 
	-5/18/20: research the prospect of full-screening the game, or else implement camera
	-5/19/20: create new PAIS
