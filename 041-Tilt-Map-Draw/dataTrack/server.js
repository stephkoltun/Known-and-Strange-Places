var port = 3030;

var express = require('express');			// include express.js
var app = express();						// a local instance of it
var bodyParser = require('body-parser');	// include body-parser
var dateFormat = require('dateformat');
var ballPositions = {
  readings: [],
};

//var http = require('https');

// you need a couple of parsers for the body of a POST request:
app.use(bodyParser.json()); 						  // for  application/json
app.use(bodyParser.urlencoded({extended: false})); // for application/x-www-form-urlencoded
app.use(express.static('public'));


// this runs after the server successfully starts:
function serverStart() {
  var p = server.address().port;
  console.log('Server listening on port '+ p);
}

function addReading(request, response) {
  console.log("add new reading");

  var now = new Date();
  var timeFormatted = dateFormat(now, "isoDateTime");

  var currentReading = {
    'timestamp': timeFormatted,
    'x': parseFloat(request.body.x),
    'y': parseFloat(request.body.y),
  }
  ballPositions.readings.push(currentReading);
  response.status(204).send();
}

function allReadings(request, response) {
  response.send(ballPositions);
}

// start the server:
var server = app.listen(port, serverStart);
// post the ball position
app.get('/allReadings', allReadings);
app.post('/add', addReading);
