var vec2 = require("@nathanfaucett/vec2");


var MousePrototype;


module.exports = Mouse;


function Mouse() {
    this.position = vec2.create();
    this.delta = vec2.create();
    this.wheel = null;
    this._first = null;
}
MousePrototype = Mouse.prototype;

Mouse.create = function() {
    return (new Mouse()).construct();
};

MousePrototype.construct = function() {

    this.wheel = 0;
    this._first = false;

    return this;
};

MousePrototype.destructor = function() {

    vec2.set(this.position, 0, 0);
    vec2.set(this.delta, 0, 0);
    this.wheel = null;
    this._first = null;

    return this;
};

MousePrototype.update = function(x, y) {
    var first = this._first,
        position = this.position,
        delta = this.delta,

        lastX = first ? position[0] : x,
        lastY = first ? position[1] : y;

    position[0] = x;
    position[1] = y;

    delta[0] = x - lastX;
    delta[1] = y - lastY;

    this._first = true;
};

MousePrototype.toJSON = function(json) {

    json = json || {};

    json.position = vec2.copy(json.position || [], this.position);
    json.delta = vec2.copy(json.delta || [], this.delta);
    json.wheel = this.wheel;

    return json;
};

MousePrototype.fromJSON = function(json) {

    vec2.copy(this.position, json.position);
    vec2.copy(this.delta, json.delta);
    this.wheel = json.wheel;

    return this;
};