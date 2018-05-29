let sceneManager;
let sceneGraph;

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
    playerController.velocity.z = 10;

    let playerCollider = new BoxCollider("PlayerCollider", width = 2, height = 2, depth = 2);
    playerCollider.attachTo(player);


    let obstacle = new Wall(mainScene);
    obstacle.translate(-4, 0, 10);

    let spikeTest = new Spikes(mainScene);
    spikeTest.translate(4, 0, 10);

    console.log("------- Start of Scene Graph -------");
    console.log(mainScene.sceneGraph().gameObjects);
    console.log("------- End of Scene Graph -------");

    sceneGraph = mainScene.sceneGraph();



    //Main render loop
    let then = 0;

    let farthestObstacleZ = 0;
    let lane = 4;
    let deltaTime = 0;
    let collidingWithPlayer = [];
    let loop = function(now) {
        sceneGraph.length = 0;
        sceneGraph = mainScene.sceneGraph();
        now *= 0.001;
        deltaTime = now - then;
        then = now;

        clearCanvas();
        //mainCamera.translate(0, 0, 10 * deltaTime);

        sceneManager.currentScene.update(deltaTime);
        sceneManager.currentScene.render();

        //----- code to be moved to an "Obstacle Generator" --------//
        // let distanceToFarthestObstacle = farthestObstacleZ - player.position.z;
        // let distanceBetweenObstacles = 15;
        // let numberOfObservableObstacles = 2;
        // if(distanceToFarthestObstacle <= distanceBetweenObstacles * numberOfObservableObstacles) {
        //     let obstacle = new Pyramid(mainScene);
        //     let obstacleCollider = new BoxCollider("PyramidCollider");
        //     obstacleCollider.attachTo(obstacle);
        //     obstacle.translate(lane, 0, farthestObstacleZ + distanceBetweenObstacles);
        //     lane *= -1;
        //     farthestObstacleZ += distanceBetweenObstacles;
        // }
        //------------------------------------------------------------------
        if(keyPressed['81']) { //q key
            console.log("colliders in scene -------------------");
            console.log(sceneGraph.objectsWithColliders);
            console.log("end colliders in scene -------------------");
        }

        if(keyPressed['87']) {
            playerController.velocity.z = 5;
        } else if(keyPressed['83']) {
            playerController.velocity.z = -5;
        } else {
            playerController.velocity.z = 0;
        }

        collidingWithPlayer.length = 0;
        collidingWithPlayer = checkCollisionsOf(playerCollider);
        let obstacleIsCollidingWithPlayer = collidingWithPlayer.length > 0;
        if(obstacleIsCollidingWithPlayer) {
            console.log("colliding with player -------------------");
            console.log(collidingWithPlayer);
            console.log("end colliding with player -------------------");
        }

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
}

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