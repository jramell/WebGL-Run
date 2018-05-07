var Pyramid = function(scene, parent, options=null) {
    GameObject.call(this, scene, parent);
    var pyramidInfo = createPyramid(options);
    this.indices = new Uint16Array(pyramidInfo.indices);
    this.vertices = new Float32Array(pyramidInfo.vertices);
};

Pyramid.prototype = Object.create(GameObject.prototype);

Pyramid.prototype.renderSelf = function(gl=this.scene.gl) {
    this.scene.setShaderWorldMatrix(this.worldMatrix);
    this.configureIndices(gl);
    this.configureVertices(gl, this.scene.currentWebGLProgram);
    this.configureColors(gl, this.scene.currentWebGLProgram);
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
};

/**
 * @param baseColor array of the form [r, g, b], describes color of the base of the pyramid
 * @param leftFaceColor array of the form [r, g, b], describes color of the left face of the pyramid
 * @param rightFaceColor array of the form [r, g, b], describes color of the right face of the pyramid
 * @param frontFaceColor array of the form [r, g, b], describes color of the front face of the pyramid
 * @param backFaceColor array of the form [r, g, b], describes color of the back face of the pyramid
 */
Pyramid.prototype.setColor = function(baseColor=[0.5, 0.5, 0.5], leftFaceColor=[0.75, 0.25, 0.5],
                                      rightFaceColor=[0.25, 0.25, 0.75], frontFaceColor=[1.0, 0.0, 0.15],
                                      backFaceColor=[1.0, 1.0, 0.15]) {
    var options = {
        'baseColor': {r: baseColor[0], g: baseColor[1], b: baseColor[2]},
        'leftFaceColor': {r: leftFaceColor[0], g: leftFaceColor[1], b: leftFaceColor[2]},
        'rightFaceColor': {r: rightFaceColor[0], g: rightFaceColor[1], b: rightFaceColor[2]},
        'frontFaceColor': {r: frontFaceColor[0], g: frontFaceColor[1], b: frontFaceColor[2]},
        'backFaceColor': {r: backFaceColor[0], g: backFaceColor[1], b: backFaceColor[2]},
    };
    this.vertices = new Float32Array(createPyramid(options).vertices);
};

Pyramid.prototype.configureIndices = function(gl) {
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
};

Pyramid.prototype.configureVertices = function(gl) {
    var vertexBuffer = gl.createBuffer();
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

Pyramid.prototype.configureColors = function(gl, webGLProgram) {
    var colorAttribLocation = gl.getAttribLocation(webGLProgram, 'vertexColor');
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