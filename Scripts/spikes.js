/**
 *
 * @param scene scene the spikes object is going to be added to
 * @param parent
 * @param options
 * @constructor
 */
let Spikes = function(scene, options=null, parent=null) {
    GameObject.call(this, scene, parent);
    this.leftPyramid = new Pyramid(scene, this);
    this.rightPyramid = new Pyramid(scene, this);
    this.centerPyramid = new Pyramid(scene, this);

    this.leftPyramid.translate(-2, 0, 0);
    this.rightPyramid.translate(2, 0, 0);

    this.leftPyramid.setColor([0.2, 0.2, 0.2], [0.4, 0.4, 0.4], [0.4, 0.4, 0.4], [0.2, 0.2, 0.2], [0.2, 0.2, 0.2]);
    this.rightPyramid.setColor([0.2, 0.2, 0.2], [0.4, 0.4, 0.4], [0.4, 0.4, 0.4], [0.2, 0.2, 0.2], [0.2, 0.2, 0.2]);
    this.centerPyramid.setColor([0.2, 0.2, 0.2], [0.4, 0.4, 0.4], [0.4, 0.4, 0.4], [0.2, 0.2, 0.2], [0.2, 0.2, 0.2]);
    this.setScale(1, 0.85, 1);
    let spikeCollider = new BoxCollider("SpikeCollider", 6, 3, 2, this);
};

Spikes.prototype.reset = function() {
    this.setPosition(0, 0, 0);
    // this.leftPyramid.translate(-2, 0, 0);
    // this.rightPyramid.translate(2, 0, 0);
};

Spikes.prototype = Object.create(GameObject.prototype);

Spikes.prototype.setLeftPyramidColor = function(baseColor=[0.5, 0.5, 0.5], leftFaceColor=[0.75, 0.25, 0.5],
                                                rightFaceColor=[0.25, 0.25, 0.75], frontFaceColor=[1.0, 0.0, 0.15],
                                                backFaceColor=[1.0, 1.0, 0.15]) {
    this.leftPyramid.setColor(baseColor, leftFaceColor, rightFaceColor, frontFaceColor, backFaceColor);
};

Spikes.prototype.setRightPyramidColor = function(baseColor=[0.5, 0.5, 0.5], leftFaceColor=[0.75, 0.25, 0.5],
                                                rightFaceColor=[0.25, 0.25, 0.75], frontFaceColor=[1.0, 0.0, 0.15],
                                                backFaceColor=[1.0, 1.0, 0.15]) {
    this.rightPyramid.setColor(baseColor, leftFaceColor, rightFaceColor, frontFaceColor, backFaceColor);
};

Spikes.prototype.setCenterPyramidColor = function(baseColor=[0.5, 0.5, 0.5], leftFaceColor=[0.75, 0.25, 0.5],
                                                 rightFaceColor=[0.25, 0.25, 0.75], frontFaceColor=[1.0, 0.0, 0.15],
                                                 backFaceColor=[1.0, 1.0, 0.15]) {
    this.centerPyramid.setColor(baseColor, leftFaceColor, rightFaceColor, frontFaceColor, backFaceColor);
};
