let Position = function() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
};

let GameObject = function(scene, parent, name="GameObject") {
    this.name = name;
    this.children = [];
    this.localMatrix = mat4.create();
    this.worldMatrix = mat4.create();
    this.indices = [];
    this.vertices = [];
    this.position = new Position();
    this.components = [];
    this.setScene(scene);
    if(parent) {
        this.setParent(parent);
    }
};

GameObject.prototype.setParent = function(parent) {
    // remove us from our parent
    if (this.parent) {
        let indexInParent = this.parent.children.indexOf(this);
        let isPartOfParentChilds = indexInParent >= 0;
        if (isPartOfParentChilds) {
            this.parent.children.splice(indexInParent, 1);
        }
    }

    // Add us to our new parent
    if (parent) {
        parent.children.push(this);
    }
    this.parent = parent;
};

GameObject.prototype.updateWorldMatrix = function(parentWorldMatrix) {
    if (parentWorldMatrix) {
        // a matrix was passed in so do the math
        mat4.multiply(this.worldMatrix, parentWorldMatrix, this.localMatrix);
    } else {
        // no matrix was passed in so just copy local to world
        mat4.copy(this.worldMatrix, this.localMatrix);
    }

    // now process all the children
    var worldMatrix = this.worldMatrix;
    this.children.forEach(function(child) {
        child.updateWorldMatrix(worldMatrix);
    });
};

GameObject.prototype.setScene = function(scene) {
    this.scene = scene;
    if(this.scene) {
        this.scene.addGameObjectAsChildOfRoot(this);
        for(let i = 0; i < this.children.length; i++) {
            this.children[i].scene = this.scene;
        }
    }

};

GameObject.prototype.translate = function(x, y, z) {
    this.position.x += x;
    this.position.y += y;
    this.position.z += z;
    for(let i = 0; i < this.children.length; i++) {
        this.children[i].position.x += x;
        this.children[i].position.y += y;
        this.children[i].position.z += z;
    }
    mat4.translate(this.localMatrix, this.localMatrix, [x, y, z]);
};

GameObject.prototype.setPosition = function(x, y, z) {
    let deltaX = x - this.position.x;
    let deltaY = y - this.position.y;
    let deltaZ = z - this.position.z;
    mat4.translate(this.localMatrix, this.localMatrix, [deltaX, deltaY, deltaZ]);
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    for(let i = 0; i < this.children.length; i++) {
        this.children[i].position.x += deltaX;
        this.children[i].position.y += deltaY;
        this.children[i].position.z += deltaZ;
    }
};

GameObject.prototype.setScale = function(x, y, z) {
    mat4.scale(this.localMatrix, this.localMatrix, [x, y, z]);
};

GameObject.prototype.rotate = function(angle, axis) {
    mat4.rotate(this.localMatrix, this.localMatrix, angle, axis);
};

GameObject.prototype.renderSelfAndChildren = function() {
    //does what every game object should do: update the world matrix in the shader before drawing itself, maybe other logic
    this.renderSelf();
    for(let i = 0; i < this.children.length; i++) {
        this.children[i].renderSelfAndChildren();
    }
};

GameObject.prototype.renderSelf = function () {
    //updates world matrix to self's, uses gl.drawArrays... should be overwritten by each game object inheriting from it,
};

GameObject.prototype.updateSelfAndChildren = function(deltaTime) {
    this.update(deltaTime);
    for(let i = 0; i < this.children.length; i++) {
        this.children[i].update(deltaTime);
    }
};

GameObject.prototype.update = function(deltaTime) {
    for(let i = 0; i < this.components.length; i++) {
        this.components[i].update(deltaTime);
    }
};

GameObject.prototype.reset = function() {

};