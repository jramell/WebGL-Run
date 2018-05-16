/**
 * Has: gl, currentWebGLProgram, worldMatrixUniformLocation
 * @param gl
 * @param webGLProgram
 * @constructor
 */
let Scene = function(gl, webGLProgram) {
    this.gl = gl;
    this.setWebGLProgram(webGLProgram);
    this.rootGameObject = new GameObject(null, null, "Root");
    this.updateReferenceToWorldMatrix();
    this.initWorldMatrix();
};

Scene.prototype.onLoaded = function () {
    this.updateReferenceToWorldMatrix();
    this.updateVertexPositionAttribLocation();
};

Scene.prototype.setWebGLProgram = function(webGLProgram) {
    this.currentWebGLProgram = webGLProgram;
};

Scene.prototype.updateReferenceToWorldMatrix = function() {
    this.worldMatrixUniformLocation = this.gl.getUniformLocation(this.currentWebGLProgram, 'worldMatrix');
};

Scene.prototype.initWorldMatrix = function() {
    this.worldMatrix = new Float32Array(16);
    mat4.identity(this.worldMatrix);
    this.setShaderWorldMatrix(this.worldMatrix);
};

Scene.prototype.updateVertexPositionAttribLocation = function () {
    this.vertexPositionAttribLocation = this.gl.getAttribLocation(this.currentWebGLProgram, 'vertexPosition')
};

Scene.prototype.setShaderWorldMatrix = function(newWorldMatrix) {
    this.gl.uniformMatrix4fv(this.worldMatrixUniformLocation, this.gl.FALSE, newWorldMatrix);
};

Scene.prototype.addGameObjectAsChildOfRoot = function(gameObject) {
    gameObject.setParent(this.rootGameObject);
};

Scene.prototype.update = function(deltaTime) {
    this.rootGameObject.updateSelfAndChildren(deltaTime);
};

Scene.prototype.render = function() {
    this.setShaderWorldMatrix(this.worldMatrix);
    this.updateSceneMatrices();
    this.rootGameObject.renderSelfAndChildren();
};

Scene.prototype.updateSceneMatrices = function() {
    this.rootGameObject.updateWorldMatrix(this.worldMatrix);
}

Scene.prototype.sceneGraph = function() {
    let list = [];
    this.descendanceList(this.rootGameObject, list);
    return list;
};

Scene.prototype.descendanceList = function(gameObject, list) {
    list.push(gameObject);
    for(let i = 0; i < gameObject.children.length; i++) {
        this.descendanceList(gameObject.children[i], list);
    }
};