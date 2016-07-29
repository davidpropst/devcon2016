//House keeping
var debug = true;

if (debug) {
    console.log("Initializing...");
}
var config = require('./configSettings').config;

var restRequest = require('request').defaults({
    headers: {
        'X-DreamFactory-Api-Key': config.dreamFactoryApiKey
    }
});
var GPIO = require('onoff').Gpio,
  redLED_1 = new GPIO(18, 'out'),
  yellowLED_1 = new GPIO(23, 'out'),
  greenLED_1 = new GPIO(24, 'out'),
  blueLED_1 = new GPIO(27, 'out'),
  blueLED_2 = new GPIO(22, 'out'),

  redMultiLED = new GPIO(13, 'out'),
  blueMultiLED = new GPIO(5, 'out'),
  greenMultiLED = new GPIO(6, 'out'),
  redButton = new GPIO(26, 'in', 'both'),
  blueButton = new GPIO(19, 'in', 'both');

//if (debug) {console.log(Date().toJSON);}

function apiAddActinToQueue(actionInfo) {
    //Function to add events to global global event queue to handled by
    //  remote devices
    var apiPath = '_table/RPI_ActionQueue';
    var options = {
        url: config.hdsApiUrl + apiPath,
        json: true,
        body: {
            resource: actionInfo
        }
    };

    restRequest.post(options, function(error, response, body) {
        if (!error && !body.error) {
            if (debug) {
                console.log(apiPath, ' API OK! response:', body);
            }
            return body.resource.id;
        } else {
            if (error) {
                console.error(new Error(apiPath, ' !!! Request Error MSG:', error));
            }
            if (body.error) {
                console.error(new Error(apiPath, ' !!!  API Error MSG:', body.error.message));
            }
        }
    });

}

//Set a binking light timer
setInterval(function() {
    // get the current state of the LED
    var state = redLED_1.readSync();
    // write the opposite of the current state to the LED pin
    redLED_1.writeSync(Number(!state));
}, 1000);


apiAddActinToQueue({
    sourceName: config.teamName,
    deviceName: 'Device2',
    actionName: "redLED_1",
    value1: "on", //Set state to on
    value2: "1000" // duration in MS
});

apiAddActinToQueue({
    sourceName: config.teamName,
    deviceName: config.deviceName,
    actionName: "blueLED_1",
    value1: "on", //Set state to on
    value2: "1000" // duration in MS
});

if (debug) {
    console.log("Complete!");
}
