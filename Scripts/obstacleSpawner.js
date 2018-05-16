let ObstacleSpawner = function(distanceBetweenObstacles=20, visibleObstacles=3, name="ObstacleSpawner") {
    Script.call(this, name);
    this.walls = [];
    for(let i = 0; i < visibleObstacles; ++i) {
        let wall = new Cube();
        wall.setColor([0.25, 0.25, 0.25],[0.25, 0.25, 0.25], [0.25, 0.25, 0.25],
                [0.25, 0.25, 0.25], [0.25, 0.25, 0.25], [0.25, 0.25, 0.25]);
        this.walls.push(new Obstacle(wall));
    }
};

ObstacleSpawner.prototype = Object.create(Script.prototype);

ObstacleSpawner.prototype.update = function(deltaTime) {

};

