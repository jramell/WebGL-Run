let Cube = function(name="Cube", scene, parent, options=null) {
    GameObject.call(this, scene, parent, name);
    let cubeInfo = createCube(options);
    this.indices = new Uint16Array(cubeInfo.indices);
    this.vertices = new Float32Array(cubeInfo.vertices);
};

Cube.prototype = Object.create(GameObject.prototype);

Cube.prototype.renderSelf = function(gl) {
    if(!gl) {
            gl = this.scene.gl;
    }
    this.scene.setShaderWorldMatrix(this.worldMatrix);
    this.configureIndices(gl);
    this.configureVertices(gl, this.scene.currentWebGLProgram);
    this.configureColors(gl, this.scene.currentWebGLProgram);
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
};

/**
 * @param baseColor array of the form [r, g, b], describes color of the base of the cube
 * @param leftFaceColor array of the form [r, g, b], describes color of the left face of the cube
 * @param rightFaceColor array of the form [r, g, b], describes color of the right face of the cube
 * @param frontFaceColor array of the form [r, g, b], describes color of the front face of the cube
 * @param backFaceColor array of the form [r, g, b], describes color of the back face of the cube
 */
Cube.prototype.setColor = function(topFaceColor=[0.5, 0.5, 0.5], bottomFaceColor=[0.75, 0.25, 0.5],
                                      rightFaceColor=[0.25, 0.25, 0.75], frontFaceColor=[1.0, 0.0, 0.15],
                                      backFaceColor=[1.0, 1.0, 0.15], leftFaceColor=[0.45, 0.45, 0.6]) {
    let options = {
        'topFaceColor': {r: topFaceColor[0], g: topFaceColor[1], b: topFaceColor[2]},
        'bottomFaceColor': {r: bottomFaceColor[0], g: bottomFaceColor[1], b: bottomFaceColor[2]},
        'rightFaceColor': {r: rightFaceColor[0], g: rightFaceColor[1], b: rightFaceColor[2]},
        'frontFaceColor': {r: frontFaceColor[0], g: frontFaceColor[1], b: frontFaceColor[2]},
        'backFaceColor': {r: backFaceColor[0], g: backFaceColor[1], b: backFaceColor[2]},
        'leftFaceColor': {r: leftFaceColor[0], g: leftFaceColor[1], b: leftFaceColor[2]}
    };
    this.vertices = new Float32Array(createCube(options).vertices);
};

Cube.prototype.configureIndices = function(gl) {
    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
};

Cube.prototype.configureVertices = function(gl) {
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(
        this.scene.vertexPositionAttribLocation, //Attribute location
        3, //Number of elements per attribute
        gl.FLOAT, //Type of elements
        gl.FALSE, // ?
        6 * Float32Array.BYTES_PER_ELEMENT,//Size of each vertex
        0 //Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(this.scene.vertexPositionAttribLocation);
};

Cube.prototype.configureColors = function(gl, webGLProgram) {
    let colorAttribLocation = gl.getAttribLocation(webGLProgram, 'vertexColor');
    gl.vertexAttribPointer(
        colorAttribLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
    );
    gl.enableVertexAttribArray(colorAttribLocation);
};