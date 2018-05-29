//center is a Vector3
let BoxCollider = function(name="BoxCollider", width=1, height=1, depth=1, owner=null, center=new Vector3(0, 0, 0)) {
    this.name = name;
    this._bounds = {
        min: {
            x: center.x - width/2,
            y: center.y - height/2,
            z: center.z - depth/2
        },
        max: {
            x: center.x + width/2,
            y: center.y + height/2,
            z: center.z + depth/2
        }
    };
    if(owner) {
        this.attachTo(owner);
        this.updateBounds();
    }
};

BoxCollider.prototype = Object.create(Component.prototype);

BoxCollider.prototype.update = function(deltaTime) {
    this.updateBounds();
};

BoxCollider.prototype.updateBounds = function() {
    this.bounds = {
        min: {
            x: this._bounds.min.x + this.owner.position.x,
            y: this._bounds.min.y + this.owner.position.y,
            z: this._bounds.min.z + this.owner.position.z
        },
        max: {
            x: this._bounds.max.x + this.owner.position.x,
            y: this._bounds.max.y + this.owner.position.y,
            z: this._bounds.max.z + this.owner.position.z
        }
    }
};