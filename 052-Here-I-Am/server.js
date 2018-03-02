var port = 443;
var http = require('https');

//var port = 3040;
//var http = require('http');

var fs = require('fs'); // Using the filesystem module
var express = require('express');			// include express.js
var app = express();						// a local instance of it
var bodyParser = require('body-parser');	// include body-parser

var ExpressPeerServer = require('peer').ExpressPeerServer;
var options = {
    debug: true
}

// set up a database for storing info
var Datastore = require('nedb');
var bodyUser = new Datastore({filename: "data.db", autoload: true});

var credentials = {
    key: fs.readFileSync('my-key.pem'),
    cert: fs.readFileSync('my-cert.pem')
};

//parsers for the body of a POST request:
app.use(bodyParser.json({limit: '50mb'})); 						               // for  application/json
app.use(bodyParser.urlencoded({extended: false}));    // for application/x-www-form-urlencoded
app.use(express.static('public'));



app.set('view engine', 'ejs');

// this runs after the server successfully starts:
function serverStart() {
  var p = server.address().port;
  console.log('Server listening on port '+ p);

  // clear all users when the server restarts
  bodyUser.remove({}, {multi: true}, function (err, numRemoved) {
    console.log(numRemoved + " documents were removed");
  });
}

// HANDLER this is for the person with the kinect
function userPage(request, response) {
  response.render("tracking.ejs");
}

// HANDLER this is for the person elsewhere
function remotePage(request, response) {
  response.render("watching.ejs")
}

// HANDLER to add the kinect user
function initiateTrackedUser(request, response) {
  console.log("--- add the kinect user");
  console.log(request.body);
  var newUserPromise = addNewUser(request.body)
    .then(function(newUserObj) {
      console.log("-- new user added to database");
      console.log(newUserObj)

      // just send an empty response, everything is fine
      response.status(204).send();

    })
    .catch(function(err) {
      console.log("couldn't add new user", err);
      response.send({"data": {"msg": "uh oh"}});
    })
}

// HANDLER to update kinect user's location
function updateLocation(request, response) {
  console.log("--- let's update " + request.body.name);
  console.log(request.body);

  var query = {'name': request.body.name};
  var options = {};

  var newData = {
    'lat': parseFloat(request.body.lat),
    'lon': parseFloat(request.body.lon),
  };

  bodyUser.update(query, {$set: newData}, options, function (err, numUpdated) {
    if (err) {
      console.log("unable to update", err);
    } else {
      console.log("updated " + request.body.name + " with location");
      response.status(204).send();   // sends nothing back
    }
  });
}

function updateUserImage(request, reponse) {
  console.log("--- update pixels");
  console.log(request.body);
}


// handler to get partner's location
function getUserLocation(request, response) {
  bodyUser.findOne({name: request.body.lookingFor}, function (err, doc) {
    if (err) {
      console.log(err);
    }
    if (doc != null) {
      response.send(doc);
    } else {
      response.status(204).send();
    }
  })
}


// ----- HELPER DATABASE FUNCTIONS ------ //
function addNewUser(info) {
  return new Promise(function(resolve, reject) {

    var userToAdd = {
      'name': info.name,
      'lat': info.lat,
      'lon': info.lon
    };

    // add them to the database
    bodyUser.insert(userToAdd, function(err, newDoc) {
      if (err) {
        reject(err);
      } else if (newDoc) {
        resolve(newDoc);
      }
    })
  })
}


// start the server
var server = http.createServer(credentials, app);
app.use('/peerjs', ExpressPeerServer(server, options));
//var server = http.createServer(app);
server.listen(port, serverStart);
// route handlers
app.get('/user', userPage);
app.get('/remote', remotePage);
app.post('/addUser', initiateTrackedUser);
app.post('/updateLocation', updateLocation);
app.post('/updateUserImage', updateUserImage);
app.post('/getPartner', getUserLocation);
