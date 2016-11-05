var createPool = require("@nathanfaucett/create_pool");


var WheelEventPrototype;


module.exports = WheelEvent;


function WheelEvent(e) {
    this.type = e.type;
    this.deltaX = getDeltaX(e);
    this.deltaY = getDeltaY(e);
    this.deltaZ = e.deltaZ || 0;
}
createPool(WheelEvent);
WheelEventPrototype = WheelEvent.prototype;

WheelEvent.create = function(e) {
    return WheelEvent.getPooled(e);
};

WheelEventPrototype.destroy = function() {
    WheelEvent.release(this);
};

WheelEventPrototype.destructor = function() {
    this.type = null;
    this.deltaX = null;
    this.deltaY = null;
    this.deltaZ = null;
};

function getDeltaX(e) {
    return e.deltaX ? e.deltaX : (
        e.wheelDeltaX ? -e.wheelDeltaX : 0
    );
}

function getDeltaY(e) {
    return e.deltaY ? e.deltaY : (
        e.wheelDeltaY ? -e.wheelDeltaY : (
            e.wheelDelta ? -e.wheelDelta : 0
        )
    );
}