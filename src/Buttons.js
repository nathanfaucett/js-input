var Button = require("./Button");


var ButtonsPrototype;


module.exports = Buttons;


function Buttons() {
    this._array = [];
    this._hash = {};
}
ButtonsPrototype = Buttons.prototype;

Buttons.create = function() {
    return (new Buttons()).construct();
};

ButtonsPrototype.construct = function() {

    Buttons_add(this, "mouse0");
    Buttons_add(this, "mouse1");
    Buttons_add(this, "mouse2");

    return this;
};

ButtonsPrototype.destructor = function() {
    var array = this._array,
        hash = this._hash,
        i = -1,
        il = array.length - 1,
        button;

    while (i++ < il) {
        button = array[i];
        button.destructor();
        array.splice(i, 1);
        delete hash[button.name];
    }

    return this;
};

ButtonsPrototype.on = function(name, value, time, frame) {
    return (this._hash[name] || Buttons_add(this, name)).on(value, time, frame);
};

ButtonsPrototype.update = function(name, value, pressed, time, frame) {
    return (this._hash[name] || Buttons_add(this, name)).update(value, pressed, time, frame);
};

ButtonsPrototype.off = function(name, value, time, frame) {
    return (this._hash[name] || Buttons_add(this, name)).off(value, time, frame);
};

ButtonsPrototype.allOff = function(time, frame) {
    var array = this._array,
        i = -1,
        il = array.length - 1;

    while (i++ < il) {
        array[i].off(0.0, time, frame);
    }

    return this;
};

function Buttons_add(_this, name) {
    var button = Button.create(name),
        array = _this._array;

    array[array.length] = button;
    _this._hash[name] = button;

    return button;
}

ButtonsPrototype.toJSON = function(json) {

    json = json || {};

    json.array = eachToJSON(this._array, json.array || []);

    return json;
};

function eachToJSON(array, out) {
    var i = -1,
        il = array.length - 1;

    while (i++ < il) {
        out[i] = array[i].toJSON(out[i]);
    }

    return out;
}

ButtonsPrototype.fromJSON = function(json) {
    var jsonArray = json.array,
        i = -1,
        il = jsonArray.length - 1,
        array = this._array,
        hash = this._hash = {},
        button;

    array.length = 0;

    while (i++ < il) {
        button = new Button();
        button.fromJSON(jsonArray[i]);

        array[array.length] = button;
        hash[button.name] = button;
    }

    return this;
};