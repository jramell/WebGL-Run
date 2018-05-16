let dKeyPressed = false;
let aKeyPressed = false;
let spaceKeyPressed = false;

let keyPressed = {};

let PlayerController = function(speed=10, jumpStrength=8.2, fallLimit=2) {
    this.speed = speed;
    this.velocity = new Vector3();
	this.grounded = true;
	this.jumpStrength = jumpStrength;
	this.fallLimit = fallLimit;
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
	//console.log(keyPressed);
	dKeyPressed = keyPressed['68'] || false;
	aKeyPressed = keyPressed['65'] || false;
	spaceKeyPressed = keyPressed['32'] || false;
    this.velocity.x = (+dKeyPressed*-1 + aKeyPressed) * this.speed;
	if(this.velocity.x != 0 || this.velocity.y != 0) {
		this.owner.translate(this.velocity.x * deltaTime, this.velocity.y * deltaTime, 0);
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
}

PlayerController.prototype.applyGravity = function(deltaTime) {
	if(this.owner.position.y > this.fallLimit) {
		this.velocity.y -= 16 * deltaTime;
	} else if(this.velocity.y < 0) {
		this.owner.position.y = this.fallLimit;
		this.velocity.y = 0;
		this.grounded = true;
	}
}
