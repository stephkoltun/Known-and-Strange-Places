var port = 3000;
var PythonShell = require('python-shell');
var express = require("express");
var app = express();

var options = {
  pythonPath: '/usr/local/bin/python3',
};

// this used the tensor flow object detection api
var pyshell = new PythonShell('test.py', options)

pyshell.on('message', function (message) {
  console.log(message);
});

pyshell.on('error', function (error) {
  console.log("----- error");
  console.log(error)
});

pyshell.on('close', function () {
  console.log("----- all done!");
});



// app.listen(port, function () {
//   console.log("server running on port " + port);
// })

// app.get("/", tfObjectDetect);
