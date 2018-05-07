var SceneManager = function(gl) {
    this.gl = gl;
};

SceneManager.prototype.loadScene = function(scene) {
    this.currentScene = scene;
    this.gl.useProgram(scene.currentWebGLProgram);
    scene.onLoaded();
};