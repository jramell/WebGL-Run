/**
 * Removes objects from the scene that are farther than maxDistance in the Z axis from the object it is attached to. The scene
 * it removes the objects from is the one its owner is a part of.
 * @param maxDistance
 * @param collectFrequency
 * @param name
 * @constructor
 */
let DistanceGarbageCollector = function(maxDistance=100, collectFrequency=0.2, name="UnnamedGarbageCollector") {
    Script.call(this, name);
    this.maxDistance = maxDistance;
    this.timeSinceLastCollect = 0;
    this.collectFrequency = collectFrequency;
};

DistanceGarbageCollector.prototype = Object.create(Script.prototype);

DistanceGarbageCollector.prototype.update = function(deltaTime) {
    this.timeSinceLastCollect += deltaTime;
    if(this.timeSinceLastCollect >= this.collectFrequency) {
        this.collect();
    }
};

DistanceGarbageCollector.prototype.collect = function() {
    objectsInScene = this.owner.scene.sceneGraph().gameObjects;
    for(let i = 0; i < objectsInScene.length; i++) {
        let currentObject = objectsInScene[i];
        let distanceWithObject = currentObject.position.z - this.owner.position.z;

        if(this.maxDistance > 0) {
            if(distanceWithObject >= this.maxDistance) {
                //object will persist because object has components, which point to it. Must do something else
                currentObject.setParent(null);
				currentObject = null;
				objectsInScene[i] = null;
            }
        } else {
            if(distanceWithObject <= this.maxDistance) {
                currentObject.setParent(null);
				currentObject = null;
				objectsInScene[i] = null;
            }
        }
    }
    //console.log(sceneManager.currentScene.sceneGraph());
    this.timeSinceLastCollect = 0;
	objectsInScene.length = 0;
};