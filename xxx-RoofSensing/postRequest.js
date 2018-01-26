var roofObject = require('./roofObject.js');
var dateFormat = require('dateformat');

module.exports = {
    addReading: function(request, response) {
      console.log("add new reading");

      var now = new Date();
      var timeFormatted = dateFormat(now, "isoDateTime");

      var currentReading = {
        'timestamp': timeFormatted,
        'light': parseFloat(request.body.light),
        'temp': parseFloat(request.body.sound),
        'sound': parseFloat(request.body.temperature)
      }

      roofObject.readings.push(currentReading);
      response.send(currentReading);
    },

  resetReadings: function(request,response) {
    roofObject.readings = [];
    response.send(roofObject);
  }
}
