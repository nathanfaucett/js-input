var vec3 = require("@nathanfaucett/vec3"),
    EventEmitter = require("@nathanfaucett/event_emitter"),
    isNullOrUndefined = require("@nathanfaucett/is_null_or_undefined"),
    Handler = require("./Handler"),
    Mouse = require("./Mouse"),
    Buttons = require("./Buttons"),
    Gamepads = require("./Gamepads"),
    Touches = require("./Touches"),
    Axes = require("./Axes"),
    eventHandlers = require("./eventHandlers");


var MOUSE_BUTTONS = [
        "mouse0",
        "mouse1",
        "mouse2"
    ],
    InputPrototype;


module.exports = Input;


function Input() {

    EventEmitter.call(this, -1);

    this._lastTime = null;
    this._frame = null;

    this._stack = [];
    this._handler = null;

    this.mouse = new Mouse();
    this.buttons = new Buttons();
    this.gamepads = new Gamepads();
    this.touches = new Touches();
    this.axes = new Axes();
    this.acceleration = vec3.create();
}
EventEmitter.extend(Input);
InputPrototype = Input.prototype;

Input.create = function() {
    return (new Input()).construct();
};

InputPrototype.construct = function() {

    this.mouse.construct();
    this.buttons.construct();
    this.gamepads.construct(this);
    this.touches.construct();
    this.axes.construct();

    return this;
};

InputPrototype.destructor = function() {

    this._lastTime = null;
    this._frame = null;

    this._stack.length = 0;
    this._handler = null;

    this.mouse.destructor();
    this.buttons.destructor();
    this.gamepads.destructor();
    this.touches.destructor();
    this.axes.destructor();

    vec3.set(this.acceleration, 0, 0, 0);

    return this;
};

InputPrototype.setElement = function(element) {
    var handler = this._handler;

    if (!handler) {
        handler = this._handler = Handler.create(this);
    } else {
        handler.removeElement(element);
    }

    handler.setElement(element);

    return this;
};

InputPrototype.server = function(socket) {
    var stack = this._stack;

    socket.on("input-event", function(e) {
        stack[stack.length] = e;
    });

    return this;
};

InputPrototype.client = function(socket) {
    var handler = this._handler,
        send = createSendFn(socket);

    handler.on("event", function(e) {
        send("input-event", e);
    });

    return this;
};

function createSendFn(socket) {
    if (socket.emit) {
        return function send(type, data) {
            return socket.emit(type, data);
        };
    } else {
        return function send(type, data) {
            return socket.send(type, data);
        };
    }
}

InputPrototype.axis = function(name) {
    var axis = this.axes._hash[name];
    return axis ? axis.value : 0;
};

InputPrototype.touch = function(index) {
    return this.touches._array[index];
};

InputPrototype.mouseButton = function(id) {
    var button = this.buttons._hash[MOUSE_BUTTONS[id]];
    return button && button.value;
};

InputPrototype.mouseButtonDown = function(id) {
    var button = this.buttons._hash[MOUSE_BUTTONS[id]];
    return !!button && button.value && (button.frameDown >= this._frame);
};

InputPrototype.mouseButtonUp = function(id) {
    var button = this.buttons._hash[MOUSE_BUTTONS[id]];
    return isNullOrUndefined(button) ? true : (button.frameUp >= this._frame);
};

InputPrototype.key = function(name) {
    var button = this.buttons._hash[name];
    return !!button && button.value;
};

InputPrototype.keyDown = function(name) {
    var button = this.buttons._hash[name];
    return !!button && button.value && (button.frameDown >= this._frame);
};

InputPrototype.keyUp = function(name) {
    var button = this.buttons._hash[name];
    return isNullOrUndefined(button) ? true : (button.frameUp >= this._frame);
};

InputPrototype.button = InputPrototype.key;
InputPrototype.buttonDown = InputPrototype.keyDown;
InputPrototype.buttonUp = InputPrototype.keyUp;

InputPrototype.update = function(time, frame) {
    var stack = this._stack,
        i = -1,
        il = stack.length - 1,
        event, lastTime;

    this._frame = frame;
    this.mouse.wheel = 0;

    while (i++ < il) {
        event = stack[i];

        eventHandlers[event.type](this, event, time, frame);

        if (event.destroy) {
            event.destroy();
        }
    }

    stack.length = 0;

    lastTime = this._lastTime || (this._lastTime = time);
    this._lastTime = time;

    this.axes.update(this, time - lastTime);
    this.emit("update");

    return this;
};