var MouseEvent = require("./MouseEvent"),
    WheelEvent = require("./WheelEvent"),
    KeyEvent = require("./KeyEvent"),
    TouchEvent = require("./TouchEvent"),
    DeviceMotionEvent = require("./DeviceMotionEvent");


module.exports = {
    mousedown: MouseEvent,
    mouseup: MouseEvent,
    mousemove: MouseEvent,
    mouseout: MouseEvent,

    wheel: WheelEvent,

    keyup: KeyEvent,
    keydown: KeyEvent,

    touchstart: TouchEvent,
    touchmove: TouchEvent,
    touchend: TouchEvent,
    touchcancel: TouchEvent,

    devicemotion: DeviceMotionEvent
};