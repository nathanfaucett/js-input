var ButtonPrototype;


module.exports = Button;


function Button() {
    this.name = null;

    this.timeDown = null;
    this.timeUp = null;

    this.frameDown = null;
    this.frameUp = null;

    this.value = null;
    this.pressed = null;

    this._first = null;
}
ButtonPrototype = Button.prototype;

Button.create = function(name) {
    return (new Button()).construct(name);
};

ButtonPrototype.construct = function(name) {

    this.name = name;

    this.timeDown = -1;
    this.timeUp = -1;

    this.frameDown = -1;
    this.frameUp = -1;

    this.value = 0.0;
    this.pressed = false;

    this._first = true;

    return this;
};

ButtonPrototype.destructor = function() {

    this.name = null;

    this.timeDown = null;
    this.timeUp = null;

    this.frameDown = null;
    this.frameUp = null;

    this.value = null;
    this.pressed = null;

    this._first = null;

    return this;
};

ButtonPrototype.on = function(value, time, frame) {

    if (this._first) {
        this.frameDown = frame;
        this.timeDown = time;
        this._first = false;
    }

    this.value = value;
    this.pressed = true;

    return this;
};

ButtonPrototype.update = function(value, pressed, time, frame) {
    if (pressed) {
        return this.on(value, time, frame);
    } else {
        return this.off(value, time, frame);
    }
};

ButtonPrototype.off = function(value, time, frame) {

    this.frameUp = frame;
    this.timeUp = time;

    this.value = value;
    this.pressed = false;

    this._first = true;

    return this;
};

ButtonPrototype.toJSON = function(json) {

    json = json || {};

    json.name = this.name;

    json.timeDown = this.timeDown;
    json.timeUp = this.timeUp;

    json.frameDown = this.frameDown;
    json.frameUp = this.frameUp;

    json.value = this.value;
    json.pressed = this.pressed;

    return json;
};

ButtonPrototype.fromJSON = function(json) {

    this.name = json.name;

    this.timeDown = json.timeDown;
    this.timeUp = json.timeUp;

    this.frameDown = json.frameDown;
    this.frameUp = json.frameUp;

    this.value = json.value;
    this.pressed = json.pressed;

    this._first = true;

    return this;
};