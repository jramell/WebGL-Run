let ObstacleSpawner = function(distanceBetweenObstacles=20, visibleObstacles=3, name="ObstacleSpawner") {
    Script.call(this, name);
    // this.walls = [];
    // for(let i = 0; i < visibleObstacles; ++i) {
    //     let wall = new Cube();
    //     wall.setColor([0.25, 0.25, 0.25],[0.25, 0.25, 0.25], [0.25, 0.25, 0.25],
    //             [0.25, 0.25, 0.25], [0.25, 0.25, 0.25], [0.25, 0.25, 0.25]);
    //     this.walls.push(new Obstacle(wall));
    // }
};

ObstacleSpawner.prototype = Object.create(Script.prototype);

ObstacleSpawner.prototype.update = function(deltaTime) {
    let distanceToFarthestObstacle = farthestObstacleZ - player.position.z;
    let distanceBetweenObstacles = 15;
    let numberOfObservableObstacles = 2;
    let shouldSpawnObstacle = distanceToFarthestObstacle <= distanceBetweenObstacles * numberOfObservableObstacles;
    if(shouldSpawnObstacle) {
        let obstacle = new Pyramid(mainScene);
        let obstacleCollider = new BoxCollider("PyramidCollider");
        obstacleCollider.attachTo(obstacle);
        obstacle.translate(lane, 0, farthestObstacleZ + distanceBetweenObstacles);
        lane *= -1;
        farthestObstacleZ += distanceBetweenObstacles;
    }
};

ObstacleSpawner.prototype.spawnRandomObstacle = function(obstacleDistance, lane=0) {
    if(lane == 0) {
        lane = Math.random() < 0.5? 1 : -1;
    }
    let obstacleSelector = Math.random();
    let obstacle;
    if(obstacleSelector <= 0.5) {
        obstacle = new Spikes(this.owner.scene);
    } else {
        obstacle = new Wall(this.owner.scene);
    }

    let elevationSelector = Math.random();
    if(elevationSelector <= 0.5) {
        obstacle.translate(0, 1, 0);
    }

    obstacle.translate(lane, 0, obstacleDistance);
};


