let Script = function(name="UntitledScript") {
    this.name = name;
};

Script.prototype = Object.create(Component.prototype);

Script.prototype.update = function(deltaTime) {
    //does something related to the script, should be overwritten by specific scripts
};