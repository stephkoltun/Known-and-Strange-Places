var express = require('express');			// include express.js
var app = express();						// a local instance of it
var bodyParser = require('body-parser');	// include body-parser
var getRequest = require('./getRequest.js');
var postRequest = require('./postRequest.js');

// you need a couple of parsers for the body of a POST request:
app.use(bodyParser.json()); 						  // for  application/json
app.use(bodyParser.urlencoded({extended: false})); // for application/x-www-form-urlencoded
app.use(express.static('public'));

// gives you information
app.get('/latest', getRequest.getLatest);
app.get('/all', getRequest.getAll);
app.get('/sensor/:sensor', getRequest.getSensor);

// these use CURL
// change time iincrements
app.post('/addReading', postRequest.addReading);
app.post('/resetReadings', postRequest.resetReadings);

// this runs after the server successfully starts:
function serverStart() {
  var port = server.address().port;
  console.log('Server listening on port '+ port);
}

// start the server:
var server = app.listen(8080, serverStart);
