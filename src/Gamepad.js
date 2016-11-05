var EventEmitter = require("@nathanfaucett/event_emitter"),
    createPool = require("@nathanfaucett/create_pool");


var GamepadPrototype,
    GamepadAxisPrototype,
    GamepadButtonPrototype;


module.exports = Gamepad;


function Gamepad() {

    EventEmitter.call(this, -1);

    this._input = null;

    this.id = null;
    this.uid = null;
    this.index = null;
    this.connected = null;
    this.timestamp = null;
    this.time = null;
    this.frame = null;
    this.axes = createArray(GamepadAxis, 4);
    this.buttons = createArray(GamepadButton, 16);
}
EventEmitter.extend(Gamepad);
createPool(Gamepad);
GamepadPrototype = Gamepad.prototype;

function createArray(Class, count) {
    var array = new Array(count),
        i = count;

    while (i--) {
        array[i] = new Class(i);
    }

    return array;
}

Gamepad.create = function(input, e) {
    return (Gamepad.getPooled()).construct(input, e);
};

GamepadPrototype.destroy = function() {
    return Gamepad.release(this);
};

GamepadPrototype.construct = function(input, e) {

    this._input = input;

    this.id = e.id;
    this.uid = e.uid;
    this.index = e.index;
    this.connected = e.connected;
    this.timestamp = e.timestamp;

    return this;
};

GamepadPrototype.destructor = function() {

    this._input = null;

    this.id = null;
    this.uid = null;
    this.index = null;
    this.connected = null;
    this.timestamp = null;

    return this;
};

GamepadPrototype.connect = function(e, time, frame) {

    this.connected = true;
    this.timestamp = e.timestamp;
    this.time = time;
    this.frame = frame;

    Gamepad_updateAxis(this, this.axes, e.axes);
    Gamepad_updateButtons(this, this.buttons, e.buttons);

    return this;
};

GamepadPrototype.update = function(e, time, frame) {
    var changed = false;

    this.connected = true;
    this.timestamp = e.timestamp;
    this.time = time;
    this.frame = frame;

    changed = Gamepad_updateAxis(this, this.axes, e.axes, time, frame, changed);
    changed = Gamepad_updateButtons(this, this.buttons, e.buttons, time, frame, changed);

    if (changed) {
        this.emitArg("update", this);
    }

    return this;
};

GamepadPrototype.disconnect = function(e, time, frame) {

    this.connected = false;
    this.timestamp = e.timestamp;
    this.time = time;
    this.frame = frame;

    return this;
};

function Gamepad_updateAxis(_this, axes, eventAxes, time, frame, changed) {
    var i = -1,
        il = axes.length - 1,
        axis, value;

    while (i++ < il) {
        axis = eventAxes[i];
        value = axis.value;

        if (axes[i].update(value)) {
            changed = true;
            _this._input.buttons.update("gamepad" + _this.index + "-axis" + i, value, value !== 0.0, time, frame);
            _this._input.emit("gamepad-axis", axis, _this);
            _this.emit("axis", axis, _this);
        }
    }

    return changed;
}

function Gamepad_updateButtons(_this, buttons, eventButtons, time, frame, changed) {
    var i = -1,
        il = buttons.length - 1,
        button, value, pressed;

    while (i++ < il) {
        button = eventButtons[i];
        value = button.value;
        pressed = button.pressed;

        if (buttons[i].update(value, pressed)) {
            changed = true;
            _this._input.buttons.update("gamepad" + _this.index + "-button" + i, value, pressed, time, frame);
            _this._input.emit("gamepad-button", button, _this);
            _this.emit("button", button, _this);
        }
    }

    return changed;
}

GamepadPrototype.toJSON = function(json) {

    json = json || {};

    json.id = this.id;
    json.uid = this.uid;
    json.index = this.index;
    json.connected = this.connected;
    json.timestamp = this.timestamp;
    json.time = this.time;
    json.frame = this.frame;

    json.axes = eachToJSON(json.axes || [], this.axes);
    json.buttons = eachToJSON(json.buttons || [], this.buttons);

    return json;
};

GamepadPrototype.fromJSON = function(json) {

    this.id = json.id;
    this.uid = json.uid;
    this.index = json.index;
    this.connected = json.connected;
    this.timestamp = json.timestamp;
    this.time = json.time;
    this.frame = json.frame;

    eachFromJSON(this.axes, json.axes);
    eachFromJSON(this.buttons, json.buttons);

    return this;
};

function eachToJSON(json, array) {
    var i = -1,
        il = array.length - 1;

    while (i++ < il) {
        json[i] = array[i].toJSON(json[i] || {});
    }

    return json;
}

function eachFromJSON(array, json) {
    var i = -1,
        il = json.length - 1;

    while (i++ < il) {
        array[i].fromJSON(json[i]);
    }

    return array;
}

function GamepadAxis(index) {
    this.index = index;
    this.value = 0.0;
}
GamepadAxisPrototype = GamepadAxis.prototype;

GamepadAxisPrototype.update = function(value) {
    var changed = Math.abs(value - this.value) > 0.01;
    this.value = value;
    return changed;
};

GamepadAxisPrototype.toJSON = function(json) {
    json = json || {};

    json.index = this.index;
    json.value = this.value;

    return json;
};

GamepadAxisPrototype.fromJSON = function(json) {

    this.index = json.index;
    this.value = json.value;

    return this;
};

function GamepadButton(index) {
    this.index = index;
    this.value = 0.0;
    this.pressed = false;
}
GamepadButtonPrototype = GamepadButton.prototype;

GamepadButtonPrototype.update = function(value, pressed) {
    var changed = this.value !== value;

    this.value = value;
    this.pressed = pressed;

    return changed;
};

GamepadButtonPrototype.toJSON = function(json) {
    json = json || {};

    json.index = this.index;
    json.value = this.value;
    json.pressed = this.pressed;

    return json;
};

GamepadButtonPrototype.fromJSON = function(json) {

    this.index = json.index;
    this.value = json.value;
    this.pressed = json.pressed;

    return this;
};