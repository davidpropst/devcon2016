// export GPIO 13 as the red LED output, GPIO 26 as
// the button input, and GPIO 6 as the green led output.
var GPIO = require('onoff').Gpio,
    green = new GPIO(6, 'out'),
    red = new GPIO(13, 'out'),
    button = new GPIO(26, 'in', 'both');

// watch the button for changes, and pass
// the button state (1 or 0) to the red LED
button.watch(function(err, state) {
  red.writeSync(state);
});

// start a timer that runs the callback every second
setInterval(function() {
  // get the current state of the LED
  var state = green.readSync();
  // write the opposite of the current
  // green LED state to the green LED pin
  green.writeSync(Number(!state));
}, 1000);
