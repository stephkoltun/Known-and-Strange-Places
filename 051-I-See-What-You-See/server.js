var port = 443;

var fs = require('fs'); // Using the filesystem module
var express = require('express');			// include express.js
var app = express();						// a local instance of it
var bodyParser = require('body-parser');	// include body-parser
var dateFormat = require('dateformat');
var http = require('https');

// set up a database for storing info
var Datastore = require('nedb');
var activeUsers = new Datastore({filename: "data.db", autoload: true});

var credentials = {
    key: fs.readFileSync('my-key.pem'),
    cert: fs.readFileSync('my-cert.pem')
};

// you need a couple of parsers for the body of a POST request:
app.use(bodyParser.json()); 						               // for  application/json
app.use(bodyParser.urlencoded({extended: false}));    // for application/x-www-form-urlencoded
app.use(express.static('public'));

app.set('view engine', 'ejs');

// this runs after the server successfully starts:
function serverStart() {
  var p = server.address().port;
  console.log('Server listening on port '+ p);

  // clear all users when the server restarts
  activeUsers.remove({}, {multi: true}, function (err, numRemoved) {
    console.log(numRemoved + " documents were removed");
  });
}

// handler for /
function homePage(request, response) {
  response.render("home.ejs");
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
            response.render("connected.ejs", {"data":newUserObj});
          } else {
            console.log("we need to wait for their partner");
            response.render("waiting.ejs", {"data":newUserObj});
          }
        })
        .catch(function(err) {
          console.log("couldn't add new user", err);
        })
      // check if who they're looking for is there?
    } else {
      console.log("this user already exists. let's delete them. and then add them");
      activeUsers.remove({name: request.body.myname}, {}, function (err, numRemoved) {
        console.log(numRemoved + " documents were removed");
        var newUserPromise = addNewUser(request.body)
          .then(function(newUserObj) {
            console.log("-- new user added to database");
            console.log(newUserObj)

            if (newUserObj.connected) {
              console.log("who they're looking for is also here!");
              response.render("connected.ejs", {"data":newUserObj});
            } else {
              console.log("we need to wait for their partner");
              response.render("waiting.ejs", {"data":newUserObj});
            }
          })
          .catch(function(err) {
            console.log("couldn't add new user", err);
          })
      });
    }
  })
}

// handler to get partner's location
function lookupPartnerLocation(request, response) {
  activeUsers.findOne({name: request.body.lookingFor}, function (err, doc) {
    if (err) {
      console.log(err);
    }
    if (doc != null) {
      var partnerLocation = doc.curLocation;
      response.send({"location": partnerLocation});
    }
  })
}

// handler to keep tabs on an absent partner
function isMyPartnerHereYet(request, response) {
  console.log("--- let's see if " + request.body.lookingFor + " is here yet");

  var areTheyHere = checkForPartner(request.body.lookingFor)
    .then(function(resStatus) {
      console.log("partner is " + resStatus.here);
      response.send({"connected": resStatus.here});
    })
    .catch(function(err) {
      console.log("couldn't check for partner", err);
    })
}

// handler to update a user's location
function updateLocation(request, response) {
  console.log("--- let's update " + request.body.username);
  console.log(request.body);

  var query = {'name': request.body.username};
  var options = {};

  var newCoords = {
    'lat': parseFloat(request.body.lat),
    'lon': parseFloat(request.body.lon)
  };

  activeUsers.update(query, {$set: {'curLocation': newCoords}}, options, function (err, numUpdated) {
    if (err) {
      console.log("unable to update", err);
    } else {
      console.log("updated " + request.body.username + " with location " + newCoords.lat + "," + newCoords.lon);
      response.status(204).send();   // sends nothing back
    }
  });
}



// ----- HELPER DATABASE FUNCTIONS ------ //
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
var server = http.createServer(credentials, app);
server.listen(port, serverStart);
// route handlers
app.post('/addUser', sessionOpened);
app.post('/updateLocation', updateLocation);
app.post('/waitingPartner', isMyPartnerHereYet);
app.post('/getPartnerLocation', lookupPartnerLocation);
app.get('/', homePage);
