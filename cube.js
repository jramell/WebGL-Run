var Cube = function(scene, parent) {
    GameObject.call(this, scene, parent);
    var cubeInfo = createCube();
    this.vertices = new Float32Array(cubeInfo.vertices);
    this.indices = new Uint16Array(cubeInfo.indices);
};

Cube.prototype = Object.create(GameObject.prototype);

Cube.prototype.renderSelf = function() {
   // console.log("started rendering cube --");
    var gl = this.scene.gl;
    this.initBuffers(gl);
    this.configureVertices(gl);

    gl.uniformMatrix4fv(this.scene.worldMatrixUniformLocation, gl.FALSE, this.worldMatrix);
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

    //console.log("--finished rendering cube--");
};

Cube.prototype.configureVertices = function(gl) {
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(
        this.scene.vertexPositionAttribLocation,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(this.scene.vertexPositionAttribLocation);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
};

Cube.prototype.initBuffers = function(gl) {



};