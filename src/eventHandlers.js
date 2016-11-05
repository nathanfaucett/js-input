var mathf = require("@nathanfaucett/mathf");


var eventHandlers = exports,
    mouseButtons = [
        "mouse0",
        "mouse1",
        "mouse2"
    ];


eventHandlers.keydown = function(input, e, time, frame) {
    var key = e.key,
        button = input.buttons.on(key, 1.0, time, frame);

    input.emit("keydown", e, button);
};

eventHandlers.keyup = function(input, e, time, frame) {
    var key = e.key,
        button = input.buttons.off(key, 0.0, time, frame);

    input.emit("keyup", e, button);
};

eventHandlers.gamepadconnect = function(input, e, time, frame) {
    var gamepad = e.gamepad;
    input.gamepads.connect(gamepad, time, frame);
    input.emit("gamepadconnect", e, gamepad);
};

eventHandlers.gamepadupdate = function(input, e, time, frame) {
    var gamepad = e.gamepad;
    input.gamepads.update(gamepad, time, frame);
    input.emit("gamepadupdate", e, gamepad);
};

eventHandlers.gamepaddisconnect = function(input, e, time, frame) {
    var gamepad = e.gamepad;
    input.gamepads.disconnect(gamepad, time, frame);
    input.emit("gamepaddisconnect", e, gamepad);
};

eventHandlers.mousemove = function(input, e) {
    input.mouse.update(e.x, e.y);
    input.emit("mousemove", e, input.mouse);
};

eventHandlers.mousedown = function(input, e, time, frame) {
    var button = input.buttons.on(mouseButtons[e.button], 1.0, time, frame);

    input.emit("mousedown", e, button, input.mouse);
};

eventHandlers.mouseup = function(input, e, time, frame) {
    var button = input.buttons.off(mouseButtons[e.button], 0.0, time, frame);

    input.emit("mouseup", e, button, input.mouse);
};

eventHandlers.mouseout = function(input, e, time, frame) {

    input.mouse.update(e.x, e.y);
    input.buttons.allOff(time, frame);

    input.emit("mouseout", e, input.mouse);
};

eventHandlers.wheel = function(input, e) {
    var value = mathf.sign(e.deltaY);

    input.mouse.wheel = value;
    input.emit("wheel", e, value, input.mouse);
};

eventHandlers.touchstart = function(input, e) {
    var touches = input.touches,
        targetTouches = e.targetTouches,
        i = -1,
        il = targetTouches.length - 1,
        touch;

    while (i++ < il) {
        touch = touches._start(targetTouches[i]);

        if (touch) {
            input.emit("touchstart", e, touch, touches);
        }
    }
};

eventHandlers.touchend = function(input, e) {
    var touches = input.touches,
        changedTouches = e.changedTouches,
        i = -1,
        il = changedTouches.length - 1,
        touch;

    while (i++ < il) {
        touch = touches._end(changedTouches[i]);

        if (touch) {
            input.emit("touchend", e, touch, touches);
            touch.destroy();
        }
    }
};

eventHandlers.touchmove = function(input, e) {
    var touches = input.touches,
        changedTouches = e.changedTouches,
        i = -1,
        il = changedTouches.length - 1,
        touch;

    while (i++ < il) {
        touch = touches._move(changedTouches[i]);

        if (touch) {
            input.emit("touchmove", e, touch, touches);
        }
    }
};

eventHandlers.touchcancel = function(input, e) {
    input.emit("touchcancel", e);
    input.touches.allOff();
};

eventHandlers.devicemotion = function(input, e) {
    var acc = e.accelerationIncludingGravity,
        acceleration;

    if (acc && (acc.x || acc.y || acc.z)) {
        acceleration = input.acceleration;

        acceleration[0] = acc.x;
        acceleration[1] = acc.y;
        acceleration[2] = acc.z;

        input.emit("acceleration", e, acceleration);
    }
};