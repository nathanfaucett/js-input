var createPool = require("@nathanfaucett/create_pool");


var TouchEventPrototype,
    TouchPrototype;


module.exports = TouchEvent;


function TouchEvent(e) {
    var target = e.target;

    this.type = e.type;
    this.touches = getTouches(this.touches, e.touches, target);
    this.targetTouches = getTouches(this.targetTouches, e.targetTouches, target);
    this.changedTouches = getTouches(this.changedTouches, e.changedTouches, target);
}
createPool(TouchEvent);
TouchEventPrototype = TouchEvent.prototype;

TouchEvent.create = function(e) {
    return TouchEvent.getPooled(e);
};

TouchEventPrototype.destroy = function() {
    TouchEvent.release(this);
};

TouchEventPrototype.destructor = function() {
    this.type = null;
    destroyTouches(this.touches);
    destroyTouches(this.targetTouches);
    destroyTouches(this.changedTouches);
};

function getTouches(touches, nativeTouches, target) {
    var length = nativeTouches.length,
        i = -1,
        il = length - 1,
        touch, nativeTouch;

    touches = touches || [];

    while (i++ < il) {
        nativeTouch = nativeTouches[i];
        touch = Touch.create(nativeTouch, target);
        touches[i] = touch;
    }

    return touches;
}

function destroyTouches(touches) {
    var i = -1,
        il = touches.length - 1;

    while (i++ < il) {
        touches[i].destroy();
    }

    touches.length = 0;
}

function Touch(nativeTouch, target) {
    this.identifier = nativeTouch.identifier;
    this.x = getTouchX(nativeTouch, target);
    this.y = getTouchY(nativeTouch, target);
    this.radiusX = getRadiusX(nativeTouch);
    this.radiusY = getRadiusY(nativeTouch);
    this.rotationAngle = getRotationAngle(nativeTouch);
    this.force = getForce(nativeTouch);
}
createPool(Touch);
TouchPrototype = Touch.prototype;

Touch.create = function(nativeTouch, target) {
    return Touch.getPooled(nativeTouch, target);
};

TouchPrototype.destroy = function() {
    Touch.release(this);
};

TouchPrototype.destructor = function() {
    this.identifier = null;
    this.x = null;
    this.y = null;
    this.radiusX = null;
    this.radiusY = null;
    this.rotationAngle = null;
    this.force = null;
};

function getTouchX(touch, target) {
    return touch.clientX - ((target.offsetLeft || 0) - (window.pageXOffset || 0));
}

function getTouchY(touch, target) {
    return touch.clientY - ((target.offsetTop || 0) - (window.pageYOffset || 0));
}

function getRadiusX(nativeTouch) {
    return (
        nativeTouch.radiusX ? nativeTouch.radiusX :
        nativeTouch.webkitRadiusX ? nativeTouch.webkitRadiusX :
        nativeTouch.mozRadiusX ? nativeTouch.mozRadiusX :
        nativeTouch.msRadiusX ? nativeTouch.msRadiusX :
        nativeTouch.oRadiusX ? nativeTouch.oRadiusX :
        0
    );
}

function getRadiusY(nativeTouch) {
    return (
        nativeTouch.radiusY ? nativeTouch.radiusY :
        nativeTouch.webkitRadiusY ? nativeTouch.webkitRadiusY :
        nativeTouch.mozRadiusY ? nativeTouch.mozRadiusY :
        nativeTouch.msRadiusY ? nativeTouch.msRadiusY :
        nativeTouch.oRadiusY ? nativeTouch.oRadiusY :
        0
    );
}

function getRotationAngle(nativeTouch) {
    return (
        nativeTouch.rotationAngle ? nativeTouch.rotationAngle :
        nativeTouch.webkitRotationAngle ? nativeTouch.webkitRotationAngle :
        nativeTouch.mozRotationAngle ? nativeTouch.mozRotationAngle :
        nativeTouch.msRotationAngle ? nativeTouch.msRotationAngle :
        nativeTouch.oRotationAngle ? nativeTouch.oRotationAngle :
        0
    );
}

function getForce(nativeTouch) {
    return (
        nativeTouch.force ? nativeTouch.force :
        nativeTouch.webkitForce ? nativeTouch.webkitForce :
        nativeTouch.mozForce ? nativeTouch.mozForce :
        nativeTouch.msForce ? nativeTouch.msForce :
        nativeTouch.oForce ? nativeTouch.oForce :
        1
    );
}