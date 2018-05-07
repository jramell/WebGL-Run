var gl; //global WebGL environment
var webGLProgram; //WebGLProgram that's running
var canvas; //WebGL canvas things are being drawn on

var viewMatrixUniformLocation;
var viewMatrix;

var projectionMatrixUniformLocation;
var projectionMatrix;

main();

function main() {
    canvas = document.getElementById('canvas');
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if(!gl) {
        console.log("WebGL not supported");
    }

    clearCanvas();
    gl.enable(gl.DEPTH_TEST);

    var program = getWebGLProgram(gl, getHTMLScriptWithId("vertex-shader"), getHTMLScriptWithId("fragment-shader"));
    webGLProgram = program;
    gl.useProgram(program);

    var mainScene = new Scene(gl, webGLProgram);
    configureViewMatrix();
    configureProjectionMatrix();

    var pyramid = new Pyramid(mainScene);
    pyramid.setColor([0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 1, 0]);

    console.log("------- Start of Scene Graph -------");
    console.log(mainScene.sceneGraph());
    console.log("------- End of Scene Graph -------");

    //Main render loop
    var loop = function() {
        clearCanvas();
        mainScene.render();
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
}

function clearCanvas() {
    gl.clearColor(0.75, 0.85, 0.8, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function configureViewMatrix() {
    viewMatrixUniformLocation = gl.getUniformLocation(webGLProgram, 'viewMatrix');
    viewMatrix = new Float32Array(16);
    mat4.lookAt(viewMatrix,
        [0,0,-8], //position of the viewer
        [0,0,0], //position the viewer is looking at
        [0,1,0]); //vector defining what is up
    gl.uniformMatrix4fv(viewMatrixUniformLocation, gl.FALSE, viewMatrix);
}

function configureProjectionMatrix() {
    projectionMatrixUniformLocation = gl.getUniformLocation(webGLProgram, 'projectionMatrix');
    projectionMatrix = new Float32Array(16); //16 is how many numbers there're in a 4x4 matrix
    mat4.perspective(projectionMatrix, glMatrix.toRadian(45), canvas.width/canvas.height, 0.1, 1000);
    gl.uniformMatrix4fv(projectionMatrixUniformLocation, gl.FALSE, projectionMatrix);
}