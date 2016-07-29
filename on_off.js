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

//if (debug) {console.log(Date().toJSON);}

function apiAddEvent(eventInfo) {
    //Function to add events to global global event queue to handled by
    //  remote devices
    var apiPath = '_table/RPI_ActionQueue';
    var options = {
        url: config.hdsApiUrl + apiPath,
        json: true,
        body: {
            resource: eventInfo
        }
    };

    restRequest.post(options, function(error, response, body) {
        if (!error && !body.error) {
            if (debug) {
                console.log('POST ', apiPath, ' API OK! response:', body);
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


// button is attaced to pin 17, led to 18
var GPIO = require('onoff').Gpio,
    redLED_1 = new GPIO(18, 'out'),
    yellowLED_1 = new GPIO(23, 'out'),
    greenLED_1 = new GPIO(24, 'out'),

    redMultiLED = new GPIO(13, 'out'),
    blueMultiLED = new GPIO(5, 'out'),
    greenMultiLED = new GPIO(6, 'out'),

    redButton = new GPIO(26, 'in', 'both'),
    blueButton = new GPIO(19, 'in', 'both');


if (debug) {
    console.log("Setting Button Watches...");
}

redButton.watch(function(err, state) {
    //Turn all the LEDs on
    if (debug) {
        console.log("Blue button Pressed...");
    }
    //redMultiLED.writeSync(1);
    //blueMultiLED.writeSync(1);
    greenMultiLED.writeSync(1);

    //redLED_1.writeSync(1);
    //yellowLED_1.writeSync(1);
    //greenLED_1.writeSync(1);
});

blueButton.watch(function(err, state) {
    //Turn all the LEDs on
    if (debug) {
        console.log("Red button Pressed...");
    }
    redMultiLED.writeSync(0);
    blueMultiLED.writeSync(0);
    greenMultiLED.writeSync(0);

    redLED_1.writeSync(0);
    yellowLED_1.writeSync(0);
    greenLED_1.writeSync(0);
});

//cleanup when ctrl-c is pressed
process.on('SIGINT', function () {
    redLED_1.unexport();
    yellowLED_1 .unexport();
    greenLED_1.unexport();
    redMultiLED.unexport();
    blueMultiLED.unexport();
    greenMultiLED.unexport();
    redButton.unexport();
    blueButton.unexport();
});

if (debug) {
    console.log("Start up Complete!");
}
