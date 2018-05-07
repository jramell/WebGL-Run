var gl; //global WebGL environment

main();

function main() {
    let canvas = document.getElementById('canvas');
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if(!gl) {
        console.log("WebGL not supported");
    }

    gl.enable(gl.DEPTH_TEST);
    let program = getWebGLProgram(gl, getHTMLScriptWithId("vertex-shader"), getHTMLScriptWithId("fragment-shader"));
    gl.useProgram(program);

    let mainScene = new Scene(gl, program);
    let sceneManager = new SceneManager(gl);
    sceneManager.loadScene(mainScene);

    let mainCamera = new Camera(mainScene);
    mainCamera.initViewMatrix();
    mainCamera.initProjectionMatrix(canvas.width, canvas.height);

    let pyramid = new Pyramid(mainScene);
    let pyramid2 = new Pyramid(mainScene);
    pyramid2.translate(3, 0, 0);

    pyramid.setColor([0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [1, 1, 0]);

    console.log("------- Start of Scene Graph -------");
    console.log(mainScene.sceneGraph());
    console.log("------- End of Scene Graph -------");

    //Main render loop
    let loop = function() {
        clearCanvas();
        sceneManager.currentScene.render();
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
}

function clearCanvas() {
    gl.clearColor(0.75, 0.85, 0.8, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}