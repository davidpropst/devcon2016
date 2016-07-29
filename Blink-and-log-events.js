//House keeping
var debug = true;

if (debug) {console.log("Initializing...");}
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
  var apiPath = '_table/RPI_EventQueue';
  var options = {
    url: config.hdsApiUrl + apiPath,
    json: true,
    body: {
            resource: eventInfo
          }
  };

  restRequest.post(options, function (error, response, body) {
      if (!error && !body.error) {
        if (debug) {console.log(apiPath, ' API OK! response:', body);}
        return body.resource.id;
      } else {
        if (error) {console.error(new Error (apiPath, ' !!! Request Error MSG:', error));}
        if (body.error) {console.error(new Error (apiPath, ' !!!  API Error MSG:', body.error.message));}
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

  restRequest.post(options, function (error, response, body) {
      if (!error && !body.error) {
        if (debug) {console.log(apiPath, ' API OK! response:', body);}
        return body.resource.id;
      } else {
        if (error) {console.error(new Error (apiPath, ' !!! Request Error MSG:', error));}
        if (body.error) {console.error(new Error (apiPath, ' !!!  API Error MSG:', body.error.message));}
      }
  });

}

// button is attaced to pin 17, led to 18
var GPIO = require('onoff').Gpio,
  redLED_1 = new GPIO(22, 'out'),
  blueLED_1 = new GPIO(18, 'out'),
  redMultiLED = new GPIO(13, 'out'),
  blueMultiLED = new GPIO(5, 'out'),
  greenMultiLED = new GPIO(6, 'out'),
  redButton = new GPIO(26, 'in', 'both'),
  blueButton = new GPIO(19, 'in', 'both');


if (debug) {console.log("Setting Button Watches...");}

// pass the callback function to the
// as the first argument to watch()
redButton.watch(function(err, state) {
  // check the state of the button
  // 1 == pressed, 0 == not pressed
  if(state == 1) {
    // turn LED on
    if (debug) {console.log("Turn redMultiLED on");}
    //Add to GLobal Event Queue
    apiRecordEvent({
                    teamName: config.teamName,
                    eventName: "redButtonPress",
                    deviceTimestamp: Date()
    });
    redMultiLED.writeSync(1);
    redLED_1.writeSync(1);
  } else {
    // turn LED off
    if (debug) {console.log("Turn redMultiLED off");}
    redMultiLED.writeSync(0);
    redLED_1.writeSync(0);
  }
});

blueButton.watch(function(err, state) {
  // check the state of the button
  // 1 == pressed, 0 == not pressed
  if(state == 1) {
    // turn LED on
    if (debug) {console.log("Turn blueMultiLED on");}
    apiRecordEvent({
                    teamName: config.teamName,
                    eventName: "blueButtonPress",
                    deviceTimestamp: Date()
    });
    blueMultiLED.writeSync(1);
    blueLED_1.writeSync(1);
  } else {
    // turn LED off
    if (debug) {console.log("Turn blueMultiLED off");}
    blueMultiLED.writeSync(0);
    blueLED_1.writeSync(0);
  }
});

// start a timer that runs the callback
// function every second (1000 ms)
setInterval(function() {
  // get the current state of the LED
  var state = blueLED_1.readSync();
  // write the opposite of the current state to the LED pin
  blueLED_1.writeSync(Number(!state));
}, 1000);




if (debug) {console.log("Start up Complete!");}
