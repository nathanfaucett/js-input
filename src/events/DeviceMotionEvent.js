var createPool = require("@nathanfaucett/create_pool");


var DeviceMotionEventPrototype;


module.exports = DeviceMotionEvent;


function DeviceMotionEvent(e) {
    this.type = e.type;
    this.accelerationIncludingGravity = e.accelerationIncludingGravity;
}
createPool(DeviceMotionEvent);
DeviceMotionEventPrototype = DeviceMotionEvent.prototype;

DeviceMotionEvent.create = function(e) {
    return DeviceMotionEvent.getPooled(e);
};

DeviceMotionEventPrototype.destroy = function() {
    DeviceMotionEvent.release(this);
};

DeviceMotionEventPrototype.destructor = function() {
    this.type = null;
    this.accelerationIncludingGravity = null;
};