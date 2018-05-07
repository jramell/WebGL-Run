//has projectionMatrix, viewMatrix
var Camera = function(scene) {
    this.scene = scene;
    this.projectionMatrix = mat4.create();
    this.position = [0, 0, -9];
    this.lookDirection = [0, 0, 0];
    this.upVector = [0, 1, 0];
    this.viewMatrix = mat4.create();
};

Camera.prototype.initProjectionMatrix = function(width, height, webGLProgram=this.scene.currentWebGLProgram){
    let gl = this.scene.gl;
    this.projectionMatrixUniformLocation = gl.getUniformLocation(webGLProgram, 'projectionMatrix');
    mat4.perspective(this.projectionMatrix, glMatrix.toRadian(45), width/height, 0.1, 1000);
    gl.uniformMatrix4fv(this.projectionMatrixUniformLocation, gl.FALSE, this.projectionMatrix);
};

Camera.prototype.initViewMatrix = function(webGLProgram=this.scene.currentWebGLProgram,
                                           position=[0,0,-9], lookingAt=[0,0,0], upVector=[0,1,0]) {
    this.viewMatrixUniformLocation = gl.getUniformLocation(webGLProgram, 'viewMatrix');
    this.viewMatrix = new Float32Array(16);
    mat4.lookAt(this.viewMatrix,
        position, //position of the viewer
        lookingAt, //position the viewer is looking at
        upVector); //vector defining what is up
    this.scene.gl.uniformMatrix4fv(this.viewMatrixUniformLocation, this.scene.gl.FALSE, this.viewMatrix);
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
    this.position = [
        this.position[0] + x,
        this.position[1] + y,
        this.position[2] + z]
    this.lookDirection = [
        this.lookDirection[0] + x,
        this.lookDirection[1] + y,
        this.lookDirection[2] + z]
    this.update();
};

Camera.prototype.update = function() {
    let gl = this.scene.gl;
    mat4.lookAt(this.viewMatrix, this.position, this.lookDirection, this.upVector);
    gl.uniformMatrix4fv(this.viewMatrixUniformLocation, gl.FALSE, this.viewMatrix);
};