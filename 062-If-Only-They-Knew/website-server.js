//var port = 3040;
var port = 443;
var https = require('https');
var http = require('http');

var fs = require('fs'); // Using the filesystem module
var credentials = {
    key: fs.readFileSync('certs/my-key.pem'),
    cert: fs.readFileSync('certs/my-cert.pem')
};

var express = require('express');			// include express.js
var app = express();						// a local instance of it

var ExpressPeerServer = require('peer').ExpressPeerServer;
var serverOptions = {
    debug: true
}



// this runs after the server successfully starts:
function serverStart() {
  var p = server.address().port;
  console.log('Server listening on port '+ p);
}


// start the server
//var server = http.createServer(app);
var server = https.createServer(credentials, app);

app.use('/peerjs', ExpressPeerServer(server, serverOptions));
app.use(express.static('public'));
server.listen(port, serverStart);
// route handlers
// app.get('/', userPage);


// tutorial:
// http://wern-ancheta.com/blog/2015/07/26/implementing-video-calls-with-peerjs/
