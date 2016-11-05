var createPool = require("@nathanfaucett/create_pool");


var GamepadEventPrototype;


module.exports = GamepadEvent;


function GamepadEvent(type, e) {
    this.type = type;
    this.gamepad = e;
}
createPool(GamepadEvent);
GamepadEventPrototype = GamepadEvent.prototype;

GamepadEvent.create = function(type, e) {
    return GamepadEvent.getPooled(type, e);
};

GamepadEventPrototype.destroy = function() {
    GamepadEvent.release(this);
};

GamepadEventPrototype.destructor = function() {
    this.type = null;
    this.gamepad = null;
};