let dKeyPressed = false;
let aKeyPressed = false;
let spaceKeyPressed = false;

let isDead = false;

let keyPressed = {};

let PlayerController = function(speed=10, jumpStrength=10, fallLimit=2) {
    this.speed = speed;
    this.velocity = new Vector3();
	this.grounded = true;
	this.jumpStrength = jumpStrength;
	this.fallLimit = fallLimit;
	this.restartElement = document.getElementById("restart");
	document.onkeydown = function(event) {
		let keyCode = event.which || event.keyCode;
		keyPressed[keyCode] = true;
	}
    document.onkeyup = function(event) {
        let keyCode = event.which || event.keyCode;
        keyPressed[keyCode] = false;
    };
};

PlayerController.prototype = Object.create(Script.prototype);

PlayerController.prototype.update = function(deltaTime) {
	if(isDead) {
		this.listenForRestart();
	}
	dKeyPressed = keyPressed['68'] || false;
	aKeyPressed = keyPressed['65'] || false;
	spaceKeyPressed = keyPressed['32'] || false;
    this.velocity.x = (+dKeyPressed*-1 + aKeyPressed) * this.speed;
	if( !isDead && (this.velocity.x !== 0 || this.velocity.y !== 0 || this.velocity.z !== 0) ) {
		//this.owner.translate(this.velocity.x * deltaTime, this.velocity.y * deltaTime, this.velocity.z * deltaTime);
		this.owner.setPosition(this.owner.position.x + this.velocity.x * deltaTime,
                                this.owner.position.y + this.velocity.y * deltaTime,
                                this.owner.position.z + this.velocity.z * deltaTime);
	}
	if(spaceKeyPressed) {
		if(this.grounded) {
			this.jump();
		}
	}
	this.applyGravity(deltaTime);
};

PlayerController.prototype.jump = function() {
	this.grounded = false;
	this.velocity.y = this.jumpStrength;
};

PlayerController.prototype.applyGravity = function(deltaTime) {
	if(this.owner.position.y > this.fallLimit) {
		this.velocity.y -= 16 * deltaTime;
	} else if(this.velocity.y < 0) {
		this.owner.position.y = this.fallLimit;
		this.velocity.y = 0;
		this.grounded = true;
	}
};

PlayerController.prototype.die = function() {
	this.velocity = new Vector3(0, 0, 0);
	isDead = true;
	this.restartElement.innerHTML = "It's over! Press 'R' to restart";
};

PlayerController.prototype.listenForRestart = function() {
	let rPressed = keyPressed['82'] || false;
	if(rPressed) {
		this.restart();
	}
};

PlayerController.prototype.restart = function() {
	this.restartElement.innerText = '';
	isDead = false;
	sceneGraph.gameObjects.length = 0;

	window.location.reload();
    main();
};
