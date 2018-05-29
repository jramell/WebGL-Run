let Component = function() {

};

Component.prototype.attachTo = function(gameObject) {
    if(this.owner) {
        let indexInOwnerComponentList = this.owner.components.indexOf(this);
        this.owner.components.splice(indexInOwnerComponentList, 1);
    }
    this.owner = gameObject;
    this.owner.components.push(this);
};

Component.prototype.update = function(deltaTime) {
    //does something related to the component, should be overwritten by specific scripts
};