let Wall = function(scene, options=null, parent=null) {
    GameObject.call(this, scene, parent);
    this.body = new Cube("Wall", scene, this);
    this.body.setScale(1.5, 1.1, 0.7);
    this.body.translate(0, 1.75, 0);
    //this.body.setColor()
    let wallCollider = new BoxCollider("WallCollider", 2*1.5, 2*1.1, 2*0.7);
};

Wall.prototype = Object.create(GameObject.prototype);