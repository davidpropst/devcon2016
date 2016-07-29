var request = require('request');

var debug = true;

var config = require('./configSettings').config;

var baseRequest = request.defaults({
  headers: {
    'X-DreamFactory-Api-Key': config.dreamFactoryApiKey
  }
});

if (debug) {console.log("plop");}


//Post IFTTT Button press event
iftttEvent = 'redButtonPress';

url = 'https://maker.ifttt.com/trigger/' + iftttEvent + '/with/key/' + config.iftttKey;

baseRequest.post({
  url: url,
  body: JSON.stringify({value1: 'bar'})
  },
  function (error, response, body) {
    if (error) {
      return console.error('IFFF failed:', error);
    }
    if (debug) {console.log(url, ' Post successful!  Server responded with:', body);}
});
