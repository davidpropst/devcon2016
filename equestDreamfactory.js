var request = require('request');

var baseRequest = request.defaults({
  headers: {
    'X-DreamFactory-Api-Key': '201ea5cb4098bb40823cfe1dcc4a8d8eabc610b40e37379efc3b757cc812ecb8'
  }
})

var options = {
  url: 'http://dpapplications-test.apigee.net/hds_devcon_nw/_table'
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
    console.log(info);
  }
}

console.log(options);
//baseRequest(options, callback);

BaseRequest('http://dpapplications-test.apigee.net/hds_devcon_nw/_table', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage.
  }
})
