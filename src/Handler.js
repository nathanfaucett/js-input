var EventEmitter = require("@nathanfaucett/event_emitter"),
    focusNode = require("@nathanfaucett/focus_node"),
    blurNode = require("@nathanfaucett/blur_node"),
    getActiveElement = require("@nathanfaucett/get_active_element"),
    eventListener = require("@nathanfaucett/event_listener"),
    gamepads = require("@nathanfaucett/gamepads"),
    GamepadEvent = require("./events/GamepadEvent"),
    events = require("./events");


var HandlerPrototype;


module.exports = Handler;


function Handler() {
    var _this = this;

    EventEmitter.call(this, -1);

    this._input = null;
    this._element = null;

    this.onEvent = function(e) {
        _this._onEvent(e);
    };

    this.onGamepadConnect = function(e) {
        _this._onGamepad("gamepadconnect", e);
    };
    this.onGamepadUpdate = function(e) {
        _this._onGamepad("gamepadupdate", e);
    };
    this.onGamepadDisconnect = function(e) {
        _this._onGamepad("gamepaddisconnect", e);
    };

    this.onFocus = function(e) {
        _this._onFocus(e);
    };

    this.onBlur = function(e) {
        _this._onBlur(e);
    };
}
EventEmitter.extend(Handler);
HandlerPrototype = Handler.prototype;

Handler.create = function(input) {
    return (new Handler()).construct(input);
};

HandlerPrototype.construct = function(input) {

    this._input = input;

    return this;
};

HandlerPrototype.destructor = function() {

    this._input = null;
    this._element = null;

    return this;
};

HandlerPrototype._onEvent = function(e) {
    var stack = this._input._stack,
        type = e.type,
        event;

    e.preventDefault();

    event = events[type].create(e);

    this.emit("event", event);
    stack[stack.length] = event;
};

HandlerPrototype._onGamepad = function(type, e) {
    var stack = this._input._stack,
        event = GamepadEvent.create(type, e);

    this.emit("event", event);
    stack[stack.length] = event;
};

HandlerPrototype._onFocus = function() {
    var element = this._element;

    if (getActiveElement() !== element) {
        focusNode(element);
    }
};

HandlerPrototype._onBlur = function() {
    var element = this._element;

    if (getActiveElement() === element) {
        blurNode(element);
    }
};

HandlerPrototype.setElement = function(element) {
    if (element === this._element) {
        return this;
    } else {
        element.setAttribute("tabindex", 1);
        focusNode(element);
        eventListener.on(element, "mouseover touchstart", this.onFocus);
        eventListener.on(element, "mouseout touchcancel", this.onBlur);

        eventListener.on(
            element,
            "mousedown mouseup mousemove mouseout wheel " +
            "keydown keyup " +
            "touchstart touchmove touchend touchcancel",
            this.onEvent
        );
        eventListener.on(window, "devicemotion", this.onEvent);

        gamepads.on("connect", this.onGamepadConnect);
        gamepads.on("update", this.onGamepadUpdate);
        gamepads.on("disconnect", this.onGamepadDisconnect);

        this._element = element;

        return this;
    }
};

HandlerPrototype.removeElement = function() {
    var element = this._element;

    if (element) {
        element.removeAttribute("tabindex");
        eventListener.off(element, "mouseover touchstart", this.onFocus);
        eventListener.off(element, "mouseout touchcancel", this.onBlur);

        eventListener.off(
            element,
            "mousedown mouseup mousemove mouseout wheel " +
            "keydown keyup " +
            "touchstart touchmove touchend touchcancel",
            this.onEvent
        );
        eventListener.off(window, "devicemotion", this.onEvent);

        gamepads.off("connect", this.onGamepadConnect);
        gamepads.off("update", this.onGamepadUpdate);
        gamepads.off("disconnect", this.onGamepadDisconnect);
    }

    this._element = null;

    return this;
};