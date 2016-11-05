var Axis = require("./Axis"),
    enums = require("./enums");


var AxesPrototype;


module.exports = Axes;


function Axes() {
    this._array = [];
    this._hash = {};
}
AxesPrototype = Axes.prototype;

Axes.create = function() {
    return (new Axes()).construct();
};

AxesPrototype.construct = function() {

    this.add({
        name: "horizontal",
        posButton: "right",
        negButton: "left",
        altPosButton: "d",
        altNegButton: "a",
        type: enums.BUTTON
    });

    this.add({
        name: "vertical",
        posButton: "up",
        negButton: "down",
        altPosButton: "w",
        altNegButton: "s",
        type: enums.BUTTON
    });

    this.add({
        name: "fire",
        posButton: "ctrl",
        negButton: "",
        altPosButton: "mouse0",
        altNegButton: "",
        type: enums.BUTTON
    });

    this.add({
        name: "jump",
        posButton: "space",
        negButton: "",
        altPosButton: "mouse2",
        altNegButton: "",
        type: enums.BUTTON
    });

    this.add({
        name: "mouseX",
        type: enums.MOUSE,
        axis: 0
    });

    this.add({
        name: "mouseY",
        type: enums.MOUSE,
        axis: 1
    });

    this.add({
        name: "touchX",
        type: enums.TOUCH,
        axis: 0
    });

    this.add({
        name: "touchY",
        type: enums.TOUCH,
        axis: 1
    });

    this.add({
        name: "mouseWheel",
        type: enums.WHEEL
    });

    this.add({
        name: "analogX",
        type: enums.GAMEPAD,
        gamepadIndex: 0,
        dead: 0.075,
        index: 0,
        axis: 0
    });

    this.add({
        name: "analogY",
        type: enums.GAMEPAD,
        gamepadIndex: 0,
        dead: 0.075,
        index: 0,
        axis: 1
    });

    return this;
};

AxesPrototype.destructor = function() {
    var array = this._array,
        hash = this._hash,
        i = -1,
        il = array.length - 1,
        axis;

    while (i++ < il) {
        axis = array[i];
        enums.destructor();
        array.splice(i, 1);
        delete hash[enums.name];
    }

    return this;
};

AxesPrototype.add = function(options) {
    var hash = this._hash,
        array = this._array,
        instance;

    options = options || {};

    if (hash[name]) {
        throw new Error(
            'Axes add(): Axes already have Axis named ' + name + ' use Axes.get("' + name + '") and edit it instead'
        );
    }

    instance = Axis.create(options);

    array[array.length] = instance;
    hash[instance.name] = instance;

    return instance;
};

AxesPrototype.get = function(name) {
    return this._hash[name];
};

AxesPrototype.update = function(input, dt) {
    var array = this._array,
        i = -1,
        il = array.length - 1;

    while (i++ < il) {
        array[i].update(input, dt);
    }

    return this;
};

AxesPrototype.toJSON = function(json) {

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

AxesPrototype.fromJSON = function(json) {
    var jsonArray = json.array,
        i = -1,
        il = jsonArray.length - 1,
        array = this._array,
        hash = this._hash = {},
        axis;

    array.length = 0;

    while (i++ < il) {
        axis = new Axis();
        enums.fromJSON(jsonArray[i]);

        array[array.length] = axis;
        hash[enums.name] = axis;
    }

    return this;
};