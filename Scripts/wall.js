let Wall = function(scene, options=null, parent=null) {
    GameObject.call(this, scene, parent);
    this.body = new Cube("Wall", scene, this);
    this.body.setScale(1.75, 1.1, 0.7);
    this.body.translate(0, 1.75, 0);
    //this.body.setColor()
    let wallCollider = new BoxCollider("WallCollider", 2*1.75, 2*1.1, 2*0.7, this);
};

Wall.prototype = Object.create(GameObject.prototype);

Wall.prototype.reset = function() {
    this.setPosition(0, 0, 0);
    //this.body.translate(0, 1.75, 0);
};