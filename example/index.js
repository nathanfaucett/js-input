var now = require("@nathanfaucett/now"),
    Input = require("..");


var input = global.input = Input.create();


input.on("mousemove", function(event, mouse) {
    console.log(mouse.delta);
});


input.setElement(document.getElementById("canvas"));


var time = 0,
    frame = 0;
(function update() {
    time = now() - time;
    input.update(time, frame++);
    setTimeout(update, 16);
}());
