var createPool = require("@nathanfaucett/create_pool"),
    keyCodes = require("./keyCodes");


var KeyEventPrototype;


module.exports = KeyEvent;


function KeyEvent(e) {
    var keyCode = e.keyCode;

    this.type = e.type;
    this.key = keyCodes[keyCode];
    this.keyCode = keyCode;
}
createPool(KeyEvent);
KeyEventPrototype = KeyEvent.prototype;

KeyEvent.create = function(e) {
    return KeyEvent.getPooled(e);
};

KeyEventPrototype.destroy = function() {
    KeyEvent.release(this);
};

KeyEventPrototype.destructor = function() {
    this.type = null;
    this.key = null;
    this.keyCode = null;
};