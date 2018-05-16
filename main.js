let sceneManager;

main();

function main() {
    let canvas = document.getElementById('canvas');
    let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if(!gl) {
        console.log("WebGL not supported");
    }

    gl.enable(gl.DEPTH_TEST);
    let program = getWebGLProgram(gl, getHTMLScriptWithId("vertex-shader"), getHTMLScriptWithId("fragment-shader"));
    gl.useProgram(program);

    let mainScene = new Scene(gl, program);
    sceneManager = new SceneManager(gl);
    sceneManager.loadScene(mainScene);

    let mainCamera = new Camera(mainScene);
    mainCamera.initViewMatrix();
    mainCamera.initProjectionMatrix(canvas.width, canvas.height);
    mainCamera.translate(0, 5, -3);

    let player = new Cube("Player", mainScene);

    player.setColor([0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]);
    player.translate(0, 2, 0);

    console.log("------- Start of Scene Graph -------");
    console.log(mainScene.sceneGraph);
    console.log("------- End of Scene Graph -------");

    let gc = new DistanceGarbageCollector(-15, 1);
    gc.attachTo(player);

    let playerController = new PlayerController();
    playerController.attachTo(player);
    playerController.velocity.z = 10;

    //Main render loop
    let then = 0;

    let farthestObstacleZ = 0;
    let lane = 4;
    let deltaTime = 0;
    let loop = function(now) {
        now *= 0.001;
        deltaTime = now - then;
        then = now;

        clearCanvas();
        mainCamera.translate(0, 0, 10 * deltaTime);

        sceneManager.currentScene.update(deltaTime);
        sceneManager.currentScene.render();

        //----- code to be moved to an "Obstacle Generator" --------//
        let distanceToFarthestObstacle = farthestObstacleZ - player.position.z;
        let distanceBetweenObstacles = 15;
        let numberOfObservableObstacles = 2;
        if(distanceToFarthestObstacle <= distanceBetweenObstacles * numberOfObservableObstacles) {
            let obstacle = new Pyramid(mainScene);
            obstacle.translate(lane, 0, farthestObstacleZ + distanceBetweenObstacles);
            lane *= -1;
            farthestObstacleZ += distanceBetweenObstacles;
        }
        //------------------------------------------------------------------
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
}

function clearCanvas(gl=sceneManager.currentScene.gl) {
    gl.clearColor(0.75, 0.85, 0.8, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}