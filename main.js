let sceneManager;
let sceneGraph;
let pooledWalls = [];
let pooledSpikes = [];

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

    let gc = new DistanceGarbageCollector(-15, 1);
    gc.attachTo(player);

    let playerController = new PlayerController();
    playerController.attachTo(player);
    playerController.velocity.z = 15;

    let playerCollider = new BoxCollider("PlayerCollider", width = 2, height = 2, depth = 2);
    playerCollider.attachTo(player);

    console.log("------- Start of Scene Graph -------");
    console.log(mainScene.sceneGraph().gameObjects);
    console.log("------- End of Scene Graph -------");

    sceneGraph = mainScene.sceneGraph();

    //Main render loop
    let then = 0;

    let farthestObstacleZ = 0;
    let lane = 3;
    let deltaTime = 0;
    let collidingWithPlayer = [];

    for(let i = 0; i < 10; i++) {
        pooledWalls.push(new Wall());
    }

    for(let i = 0; i < 10; i++) {
        pooledSpikes.push(new Spikes());
    }

    let loop = function(now) {
        sceneGraph.length = 0;
        sceneGraph = mainScene.sceneGraph();
        now *= 0.001;
        deltaTime = now - then;
        then = now;

        clearCanvas();
        mainCamera.translate(0, 0, playerController.velocity.z * deltaTime);

        sceneManager.currentScene.update(deltaTime);
        sceneManager.currentScene.render();

        // ----- code to be moved to an "Obstacle Generator" --------//
        let distanceToFarthestObstacle = farthestObstacleZ - player.position.z;
        let distanceBetweenObstacles = 15;
        let numberOfObservableObstacles = 2;
        if(distanceToFarthestObstacle <= distanceBetweenObstacles * numberOfObservableObstacles) {
            let obstacleSelector = Math.random();
            let obstacle;
            if(obstacleSelector <= 0.5) {
                obstacle = pooledSpikes[0];
                pooledSpikes.splice(0, 1);
            } else {
                obstacle = pooledWalls[0];
                pooledWalls.splice(0, 1);
            }
            let neededX = lane - obstacle.position.x;
            let neededZ = (farthestObstacleZ + distanceBetweenObstacles) - obstacle.position.z;
            obstacle.translate(neededX, 0, neededZ);
            lane *= -1;
            farthestObstacleZ += distanceBetweenObstacles;
            obstacle.setScene(mainScene);
        }
        //------------------------------------------------------

        if(keyPressed['81']) { //q key
            console.log("scene graph -------------------");
            console.log(sceneGraph.gameObjects);
            console.log("end scene graph -------------------");
        }
        if(keyPressed['87']) { //w key
            console.log("pooled walls -------------------");
            console.log(pooledWalls);
            console.log("pooled walls -------------------");
        }
        // if(keyPressed['87']) {
        //     playerController.velocity.z = 5;
        // } else if(keyPressed['83']) {
        //     playerController.velocity.z = -5;
        // } else {
        //     playerController.velocity.z = 0;
        // }

        collidingWithPlayer.length = 0;
        collidingWithPlayer = checkCollisionsOf(playerCollider);
        let obstacleIsCollidingWithPlayer = collidingWithPlayer.length > 0;
        if(obstacleIsCollidingWithPlayer) {

        }

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
}

// function spawnSpikes(scene, positionInZ) {
//     let leftPyramid = new Pyramid(scene, this);
//     let rightPyramid = new Pyramid(scene, this);
//     let centerPyramid = new Pyramid(scene, this);
//
//     leftPyramid.translate(-2, 0, positionInZ);
//     rightPyramid.translate(2, 0, positionInZ);
//     centerPyramid.translate(0, 0, positionInZ);
//
//     leftPyramid.setColor([0.2, 0.2, 0.2], [0.4, 0.4, 0.4], [0.4, 0.4, 0.4], [0.2, 0.2, 0.2], [0.2, 0.2, 0.2]);
//     rightPyramid.setColor([0.2, 0.2, 0.2], [0.4, 0.4, 0.4], [0.4, 0.4, 0.4], [0.2, 0.2, 0.2], [0.2, 0.2, 0.2]);
//     centerPyramid.setColor([0.2, 0.2, 0.2], [0.4, 0.4, 0.4], [0.4, 0.4, 0.4], [0.2, 0.2, 0.2], [0.2, 0.2, 0.2]);
//
//     leftPyramid.setScale(1, 0.85, 1);
//     rightPyramid.setScale(1, 0.85, 1);
//     centerPyramid.setScale(1, 0.85, 1);
// }

//returns [] list of colliders colliding with collider input as a parameter
function checkCollisionsOf(collider) {
    let inCollisionWithCollider = [];
    let colliders = sceneGraph.objectsWithColliders;
    let a = collider;
    let b;
    let areColliding;
    for(let i = 0; i < colliders.length; i++) {
        b = colliders[i];

        if(b.owner.name === a.owner.name) {
            continue;
        }

        areColliding = (a.bounds.min.x <= b.bounds.max.x && a.bounds.max.x >= b.bounds.min.x) &&
            (a.bounds.min.y <= b.bounds.max.y && a.bounds.max.y >= b.bounds.min.y) &&
            (a.bounds.min.z <= b.bounds.max.z && a.bounds.max.z >= b.bounds.min.z);
        if(areColliding) {
            inCollisionWithCollider.push(b);
        }
    }
    return inCollisionWithCollider;
}

function clearCanvas(gl=sceneManager.currentScene.gl) {
    gl.clearColor(0.75, 0.85, 0.8, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}