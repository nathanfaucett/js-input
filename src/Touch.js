var vec2 = require("@nathanfaucett/vec2"),
    createPool = require("@nathanfaucett/create_pool");


var TouchPrototype;


module.exports = Touch;


function Touch() {

    this.id = null;
    this.index = null;

    this.radiusX = null;
    this.radiusY = null;
    this.rotationAngle = null;
    this.force = null;

    this.delta = vec2.create();
    this.position = vec2.create();
}
createPool(Touch);
TouchPrototype = Touch.prototype;

Touch.create = function(e) {
    return (Touch.getPooled()).construct(e);
};

TouchPrototype.destroy = function() {
    return Touch.release(this);
};

TouchPrototype.construct = function(e) {

    this.id = e.identifier;

    vec2.set(this.delta, 0, 0);
    vec2.set(this.position, e.x, e.y);

    this.radiusX = e.radiusX;
    this.radiusY = e.radiusY;
    this.rotationAngle = e.rotationAngle;
    this.force = e.force;

    return this;
};

TouchPrototype.destructor = function() {

    this.id = null;

    this.radiusX = null;
    this.radiusY = null;
    this.rotationAngle = null;
    this.force = null;

    vec2.set(this.delta, 0, 0);
    vec2.set(this.position, 0, 0);

    return this;
};

TouchPrototype.update = function(e) {
    var position = this.position,
        delta = this.delta,

        x = e.x,
        y = e.y,

        lastX = position[0],
        lastY = position[1];

    position[0] = x;
    position[1] = y;

    delta[0] = x - lastX;
    delta[1] = y - lastY;

    this.radiusX = e.radiusX;
    this.radiusY = e.radiusY;
    this.rotationAngle = e.rotationAngle;
    this.force = e.force;

    return this;
};

TouchPrototype.toJSON = function(json) {
    json = json || {};

    json.id = this.id;

    json.radiusX = this.radiusX;
    json.radiusY = this.radiusY;
    json.rotationAngle = this.rotationAngle;
    json.force = this.force;

    json.delta = vec2.copy(json.delta || [], this.delta);
    json.position = vec2.copy(json.position || [], this.position);

    return json;
};

TouchPrototype.fromJSON = function(json) {

    this.id = json.id;

    this.radiusX = json.radiusX;
    this.radiusY = json.radiusY;
    this.rotationAngle = json.rotationAngle;
    this.force = json.force;

    vec2.copy(this.delta, json.delta);
    vec2.copy(this.position, json.position);

    return this;
};