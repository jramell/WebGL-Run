let ObstacleSpawner = function(distanceBetweenObstacles=20, visibleObstacles=4, name="ObstacleSpawner") {
    Script.call(this, name);
    this.distanceBetweenObstacles = distanceBetweenObstacles;
    this.visibleObstacles = visibleObstacles;
    this.lane = 3;
    this.farthestObstacleZ = 0;
    this.visibleObstacles = visibleObstacles;
    this.spawningObject = false;
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
    if(this.spawningObject) {
        return;
    }
    let distanceToFarthestObstacle = this.farthestObstacleZ - this.owner.position.z;
    let shouldSpawnObstacle = distanceToFarthestObstacle <= this.distanceBetweenObstacles * this.visibleObstacles;
    console.log
    if(shouldSpawnObstacle) {
        this.spawnRandomObstacle(this.distanceBetweenObstacles, this.lane);
        this.lane *= -1;
        this.farthestObstacleZ += this.distanceBetweenObstacles;
    }
};

ObstacleSpawner.prototype.spawnRandomObstacle = function(obstacleDistance, lane=0) {
    this.spawningObject = true;
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
        obstacle.translate(0, 3, 0);
    }

    obstacle.translate(lane, 0, obstacleDistance + this.owner.position.z);
    this.spawningObject = false;
};


