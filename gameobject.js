var GameObject = function() {
    this.children = [];
    this.localMatrix = mat4.create();
    this.worldMatrix = mat4.create();
    this.indices = [];
    this.vertices = [];
};

GameObject.prototype.setParent = function(parent) {
    // remove us from our parent
    if (this.parent) {
        var indexInParent = this.parent.children.indexOf(this);
        var isPartOfParentChilds = indexInParent >= 0;
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

GameObject.prototype.translate = function(x, y, z) {
    mat4.translate(this.localMatrix, this.localMatrix, [x, y, z]);
};

GameObject.prototype.setScale = function(x, y, z) {
    
};

GameObject.prototype._render = function() {
    //does what every game object should do: update the world matrix in the shader before drawing itself, maybe other logic
};

GameObject.prototype.render = function () {
    this._render();
    //updates world matrix in shader, then uses gl.drawArrays... should be overwritten by each game object inheriting from it,
    //but they should call the parent version
};