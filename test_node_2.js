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

function apiAddEvent(teamName, eventName, eventID) {
  var apiPath = '_table/RPI_EventQueue';
  restRequest.post({
    url: config.hdsApiUrl + apiPath,
    json: true,
    body: JSON.stringify({
                        resource: [
                          {
                            teamName: "Team2",
                            eventName: "redButtonPress",
                            timestamp: Date()
                          }
                        ]
                      })
    },
    function (error, response, body) {
      if (error) {
        return console.error('IFFF failed:', error);
      }
      if (debug) {console.log(apiPath, ' Post successful!  Server responded with:', body.err);}
  });

}

// button is attaced to pin 17, led to 18
var GPIO = require('onoff').Gpio,
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
    apiAddEvent(config.teamName,"redButton");
    redMultiLED.writeSync(1);
  } else {
    // turn LED off
    if (debug) {console.log("Turn redMultiLED off");}
    redMultiLED.writeSync(0);
  }
});

blueButton.watch(function(err, state) {
  // check the state of the button
  // 1 == pressed, 0 == not pressed
  if(state == 1) {
    // turn LED on
    if (debug) {console.log("Turn blueMultiLED on");}
    blueMultiLED.writeSync(1);
  } else {
    // turn LED off
    if (debug) {console.log("Turn blueMultiLED on");}
    blueMultiLED.writeSync(0);
  }
});

if (debug) {console.log("Start up Complete!");}
