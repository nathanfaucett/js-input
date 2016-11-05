var EventEmitter = require("@nathanfaucett/event_emitter"),
    Gamepad = require("./Gamepad");


var GamepadsPrototype;


module.exports = Gamepads;


function Gamepads() {

    EventEmitter.call(this, -1);

    this._input = null;

    this._array = [];
    this._connected = 0;
}
EventEmitter.extend(Gamepads);
GamepadsPrototype = Gamepads.prototype;

Gamepads.create = function(input) {
    return (new Gamepads()).construct(input);
};

GamepadsPrototype.construct = function(input) {
    this._input = input;
    return this;
};

GamepadsPrototype.destructor = function() {
    this._input = null;
    this._array.length = 0;
    return this;
};

GamepadsPrototype.connect = function(targetGamepad, time, frame) {
    var array = this._array,
        index = targetGamepad.index,
        gamepad = array[index];

    if (gamepad) {
        this.disconnect(targetGamepad, time, frame);
    }

    this._connected += 1;
    gamepad = Gamepad.create(this._input, targetGamepad);

    array[index] = gamepad;

    gamepad.connect(targetGamepad, time, frame);
    this.emitArg("connect", gamepad);
};

GamepadsPrototype.update = function(targetGamepad, time, frame) {
    var array = this._array,
        gamepad = array[targetGamepad.index];

    if (gamepad) {
        if (gamepad.update(targetGamepad, time, frame)) {
            this.emitArg("update", gamepad);
        }
    } else {
        this.connect(targetGamepad, time, frame);
    }
};

GamepadsPrototype.disconnect = function(targetGamepad, time, frame) {
    var array = this._array,
        index = targetGamepad.index,
        gamepad = array[index];

    if (gamepad) {
        this._connected -= 1;
        gamepad.disconnect(targetGamepad, time, frame);

        this.emitArg("disconnect", gamepad);
        gamepad.destroy();
        array.splice(index, 1);
    }
};

GamepadsPrototype.get = function(index) {
    return this._array[index];
};

GamepadsPrototype.getActiveCount = function() {
    return this._connected;
};

GamepadsPrototype.toJSON = function(json) {

    json = json || {};

    return json;
};

GamepadsPrototype.fromJSON = function( /* json */ ) {
    return this;
};