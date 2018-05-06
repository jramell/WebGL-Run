main();

function main() {
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        console.log("WebGL context not found");
        return;
    }

    var program = getWebGLProgram(gl, getHTMLScriptWithId("vertex-shader"), getHTMLScriptWithId("fragment-shader"));
    gl.enable(gl.DEPTH_TEST);
    clearCanvas(gl, 0.15, 1, 0.5, 0.65);
    gl.useProgram(program);


    var mainCamera = new Camera(gl);
    mainCamera.initProjectionMatrix(program, canvas.width, canvas.height);
    mainCamera.initViewMatrix(program, [0, 0, -10], [0, 0, 0], [0, 1, 0]);

    var cubeTest = new Cube();

    var object = new GameObject();
}
