let dKeyPressed = false;
let aKeyPressed = false;

let PlayerController = function(speed=10) {
    this.speed = speed;
    this.velocity = new Vector3();
};

PlayerController.prototype = Object.create(Script.prototype);

PlayerController.prototype.update = function(deltaTime) {
    document.onkeypress = function(event) {
        let keyCode = event.which || event.keyCode;
        dKeyPressed = keyCode == '100' || keyCode == '68';
        aKeyPressed = keyCode == '97' || keyCode == '65';
    };
    document.onkeyup = function(event) {
        let keyCode = event.which || event.keyCode;
        let dKeyUp = keyCode == '100' || keyCode == '68';
        let aKeyUp = keyCode == '97' || keyCode == '65';
        if(dKeyUp) {
            dKeyPressed = false;
        } else if(aKeyUp) {
            aKeyPressed = false;
        }
    };
    this.velocity.x = (+dKeyPressed*-1 + aKeyPressed) * this.speed * deltaTime;
        this.owner.translate(this.velocity.x, 0, 0);
};
