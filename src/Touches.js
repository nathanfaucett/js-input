var isNull = require("@nathanfaucett/is_null"),
    indexOf = require("@nathanfaucett/index_of"),
    Touch = require("./Touch");


var TouchesPrototype;


module.exports = Touches;


function Touches() {
    this._array = [];
}
TouchesPrototype = Touches.prototype;

Touches.create = function() {
    return (new Touches()).construct();
};

TouchesPrototype.construct = function() {
    return this;
};

TouchesPrototype.destructor = function() {
    this._array.length = 0;
    return this;
};

function findTouch(array, id) {
    var i = -1,
        il = array.length - 1,
        touch;

    while (i++ < il) {
        touch = array[i];

        if (touch.id === id) {
            return touch;
        }
    }

    return null;
}

TouchesPrototype._start = function(targetTouch) {
    var array = this._array,
        oldTouch = findTouch(array, targetTouch.identifier),
        touch;

    if (isNull(oldTouch)) {
        touch = Touch.create(targetTouch);
        array[array.length] = touch;
        return touch;
    } else {
        return oldTouch;
    }
};

TouchesPrototype._end = function(changedTouch) {
    var array = this._array,
        touch = findTouch(array, changedTouch.identifier);

    if (!isNull(touch)) {
        array.splice(indexOf(array, touch), 1);
    }

    return touch;
};

TouchesPrototype._move = function(changedTouch) {
    var touch = findTouch(this._array, changedTouch.identifier);

    if (!isNull(touch)) {
        touch.update(changedTouch);
    }

    return touch;
};

TouchesPrototype.get = function(index) {
    return this._array[index];
};

TouchesPrototype.allOff = function() {
    var array = this._array,
        i = -1,
        il = array.length - 1;

    while (i++ < il) {
        array[i].destroy();
    }
    array.length = 0;
};

TouchesPrototype.toJSON = function(json) {

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

TouchesPrototype.fromJSON = function(json) {
    var jsonArray = json.array,
        i = -1,
        il = jsonArray.length - 1,
        array = this._array,
        hash = this._hash = {},
        touch;

    array.length = 0;

    while (i++ < il) {
        touch = Touch.create();
        touch.fromJSON(jsonArray[i]);

        array[array.length] = touch;
        hash[touch.name] = touch;
    }

    return this;
};