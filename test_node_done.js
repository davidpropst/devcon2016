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

function apiAddActionToQueue(actionInfo) {
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

function apiConfirmAction(id) {
    //Function to add events to global global event queue to handled by
    //  remote devices
    var apiPath = '_table/RPI_ActionQueue';
    var options = {
        url: config.hdsApiUrl + apiPath,
        json: true,
        body: {
            resource: [{
                id: id,
                confirmed: 'yes'
            }]
        }
    };

    restRequest.put(options, function(error, response, body) {
        if (!error && !body.error) {
            if (debug) {
                console.log('PUT ', apiPath, ' API OK! response:', body);
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

function apiRecordEvent(eventInfo) {
    //Function to record events that occure on remote devices
    //  remote devices
    var apiPath = '_table/RPI_EventHistory';
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
    redButton = new GPIO(26, 'in', 'rising'),
    blueButton = new GPIO(19, 'in', 'rising');


function setLEDs(led) {
    //set all LEDs off
    redMultiLED.writeSync(0);
    blueMultiLED.writeSync(0);
    greenMultiLED.writeSync(0);
    redLED_1.writeSync(0);
    //yellowLED_1.writeSync(0);
    greenLED_1.writeSync(0);

    if (led) {
        led.writeSync(1);
        if (debug) {
            console.log("Led name: ", led);
        }
    }

}

function executeActions(actionList) {
    if (debug) {
        console.log('actionList.length:', actionList.length);
    }

    actionList.forEach(function(action) {
        if (debug) {
            console.log('action:', action);
        }
        if (action.actionName) {
            switch (action.actionName) {
                case "redMultiLED":
                    setLEDs(redMultiLED);
                    break;
                case "blueMultiLED":
                    setLEDs(blueMultiLED);
                    break;
                case "greenMultiLED":
                    setLEDs(greenMultiLED);
                    break;
                case "redLED_1":
                    setLEDs(redLED_1);
                    break;
                case "yellowLED_1":
                    setLEDs(yellowLED_1);
                    break;
                case "greenLED_1":
                    setLEDs(greenLED_1);
                    break;
                default:
                    console.log('Got invalid action:', action.actionName);
            }

            apiRecordEvent({
                teamName: config.teamName,
                deviceName: config.deviceName,
                eventName: action.actionName,
                deviceTimestamp: Date()
            });

            apiConfirmAction(action.id);
        }

    });
}


//Check for events in event queue via API and act upon them
setInterval(function() {
    // blink the top blue light so we can see stuff going on
    yellowLED_1.writeSync(Number(!yellowLED_1.readSync()));

    // call API to read open events for this devices inot actionList
    var apiPath = '_table/RPI_ActionQueue';
    restRequest.get({
        url: config.hdsApiUrl + apiPath,
        json: true,
        qs: {
            filter: '(deviceName=' + config.deviceName + ') and (confirmed = no)'
        }
    }, function(error, response, body) {
        if (!error && !body.error && body.resource.length !== 0) {
            if (debug) {
                console.log('GET ' + apiPath, ' API OK! Number of actions:', body.resource.length);
            }
            executeActions(body.resource);
        } else {
            if (error) {
                console.error(new Error(apiPath, ' !!! Request Error MSG:', error));
            }
            if (body.error) {
                console.error(new Error(apiPath, ' !!!  API Error MSG:', body.error.message));
            }
        }
    });
}, config.eventCheckIntervalInMs); // Interval in Millisecounds 1000 = 1 sec

//TODO remove this exit it is only for testing
//process.exit();

if (debug) {
    console.log("Setting Button Watches...");
}

// pass the callback function to the
// as the first argument to watch()
redButton.watch(function(err, state) {
    // check the state of the button
    // 1 == pressed, 0 == not pressed
    if (state == 1) {
        if (debug) {
            console.log("Red Button Pressed");
        }
        //Add to GLobal Event Queue
        apiRecordEvent({
            teamName: config.teamName,
            deviceName: config.deviceName,
            eventName: "redButtonPress",
            deviceTimestamp: Date()
        });
        setLEDs(redLED_1);
    }
});

blueButton.watch(function(err, state) {
    // check the state of the button
    // 1 == pressed, 0 == not pressed
    if (state == 1) {
        if (debug) {
            console.log("Blue Button Pressed");
        }
        //Add to GLobal Event Queue
        apiRecordEvent({
            teamName: config.teamName,
            deviceName: config.deviceName,
            eventName: "blueButtonPress",
            deviceTimestamp: Date()
        });
        setLEDs(greenLED_1);
    }
});

//cleanup when ctrl-c is pressed
process.on('SIGINT', function() {
    redLED_1.unexport();
    yellowLED_1.unexport();
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
