var Cube = function() {
    GameObject.call(this);
    var cubeInfo = createCube();
    this.vertices = cubeInfo.vertices;
    this.indices = cubeInfo.indices;
};

Cube.prototype = Object.create(GameObject.prototype);

