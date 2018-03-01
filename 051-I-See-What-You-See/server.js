var port = 3040;

var express = require('express');			// include express.js
var server = express();						// a local instance of it
var bodyParser = require('body-parser');	// include body-parser
var dateFormat = require('dateformat');
var http = require('https');

// set up a database for storing info
var Datastore = require('nedb');
var activeUsers = new Datastore({filename: "data.db", autoload: true});

// you need a couple of parsers for the body of a POST request:
server.use(bodyParser.json()); 						               // for  application/json
server.use(bodyParser.urlencoded({extended: false}));    // for application/x-www-form-urlencoded
server.use(express.static('public'));

// this runs after the server successfully starts:
function serverStart() {
  var p = this.address().port;
  console.log('Server listening on port '+ p);

  // clear all users when the server restarts
  activeUsers.remove({}, {multi: true}, function (err, numRemoved) {
    console.log(numRemoved + " documents were removed");
  })
}

// handler for /addUser
function sessionOpened(request, response) {
  console.log('----- New user connected!');
  console.log(request.body);

  // check if user is already in the database
  activeUsers.findOne({name: request.body.myname}, function (err, doc) {
    if (err) {
      console.log(err);
    }
    if (doc == null) {
      // this user isn't there
      console.log("this user doesn't exist. let's add them!");
      var newUserPromise = addNewUser(request.body)
        .then(function(newUserObj) {
          console.log("-- new user added to database");
          console.log(newUserObj)
          if (newUserObj.connected) {
            console.log("who they're looking for is also here!");
            // send to the connected page, using EJS template so I can pass in data to it.
          } else {
            console.log("we need to wait for their partner");
            // send to the connected page, using EJS template so I can pass in data to it.
          }
        })
        .catch(function(err) {
          console.log("couldn't add new user", err);
        })
      // check if who they're looking for is there?
    } else {
      console.log("this user already exists");
    }
    response.status(204).send();   // sends nothing back
  })
}

function addNewUser(info) {
  return new Promise(function(resolve, reject) {
    var now = new Date();
    var nowFormat = dateFormat(now, "isoDateTime");

    var coords = {'lat': parseFloat(info.lat), 'lon': parseFloat(info.lon)};
    var userToAdd = {
      'name': info.myname,
      'lookingFor': info.who,
      'startTime': nowFormat,
      'curLocation': coords,
      'connected': null,
    };

    var areTheyHere = checkForPartner(info.who)
      .then(function(resStatus) {
        console.log("partner is " + resStatus.here);
        userToAdd.connected = resStatus.here;

        // add them to the database
        activeUsers.insert(userToAdd, function(err, newDoc) {
          if (err) {
            reject(err);
          } else if (newDoc) {
            resolve(newDoc);
          }
        })
      })
      .catch(function(err) {
        console.log("couldn't check for partner", err);
      })
  })
}

function checkForPartner(partner) {
  console.log("checking for partner");
  return new Promise(function (resolve, reject) {
    var status = {
      'here': false
    };

    activeUsers.findOne({name: partner}, function (err, doc) {
      if (err) {
        reject(err);
      };

      if (doc != null) {
        status.here = true;
      } else {
        status.here = false;
      }
      resolve(status);
    })
  })
};

// start the server
server.listen(port, serverStart);
// route handlers
server.post('/addUser', sessionOpened);
//server.get('/allReadings', allReadings);
