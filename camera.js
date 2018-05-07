//has projectionMatrix, viewMatrix
var Camera = function() {
    this.projectionMatrix = mat4.create();
    this.position = [0, 0, -10];
    this.lookDirection = [0, 0, 0];
    this.upVector = [0, 1, 0];
    this.viewMatrix = mat4.create();
};

Camera.prototype.initProjectionMatrix = function(webGLProgram, width, height){
    this.projectionMatrixUniformLocation = gl.getUniformLocation(webGLProgram, 'projectionMatrix');
    mat4.perspective(this.projectionMatrix, glMatrix.toRadian(45), width/height, 0.1, 1000);
    gl.uniformMatrix4fv(this.projectionMatrixUniformLocation, this.gl.FALSE, this.projectionMatrix);
};

Camera.prototype.initViewMatrix = function(webGLProgram, position, lookingAt, upVector) {
    viewMatrixUniformLocation = gl.getUniformLocation(webGLProgram, 'viewMatrix');
    viewMatrix = new Float32Array(16);
    mat4.lookAt(viewMatrix,
        [0,0,-8], //position of the viewer
        [0,0,0], //position the viewer is looking at
        [0,1,0]); //vector defining what is up
    gl.uniformMatrix4fv(viewMatrixUniformLocation, gl.FALSE, viewMatrix);
};

Camera.prototype.setPosition = function(x, y, z) {
    this.position = [x, y, z];
    this.update();
};

Camera.prototype.setLookDirection = function(x, y, z) {
    this.lookDirection = [x, y, z];
    this.update();
};

Camera.prototype.translate = function(x, y, z) {
    this.setPosition(
        this.position[0] + x,
        this.position[1] + y,
        this.position[2] + z
    );
};

Camera.prototype.update = function() {
    mat4.lookAt(this.viewMatrix, this.position, this.lookDirection, this.upVector);
    this.gl.uniformMatrix4fv(this.viewMatrixUniformLocation, this.gl.FALSE, this.viewMatrix);
};