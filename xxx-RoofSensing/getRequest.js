var roofObject = require('./roofObject.js');

module.exports = {
    getLatest: function(request, response) {
        response.send(roofObject.readings[roofObject.readings.length-1]);
    },

    getAll: function(request, response) {
        response.send(roofObject.readings);
    },

    getSensor: function(request, response) {
        var sensor = request.params.sensor;

        if (sensor == 'light') {
            var onlyLight = [];
            for (var i = 0; i < roofObject.readings.length; i++) {
                onlyLight.push(roofObject.readings[i].light);
            }
            response.send(onlyLight);
        } else if (sensor == 'temperature') {
            var onlyTemp = [];
            for (var i = 0; i < roofObject.readings.length; i++) {
                onlyTemp.push(roofObject.readings[i].temp);
            }
            response.send(onlyTemp);
        } else if (sensor == 'sound') {
            var onlySound = [];
            for (var i = 0; i < roofObject.readings.length; i++) {
                onlySound.push(roofObject.readings[i].sound);
            }
            response.send(onlySound);
        }
    }


    // getPresetValues: function(request, response) {
    //  var preset = request.params.preset;
    // 	if (preset == "tidal") {
    // 		// send client back the revised time divison
    // 		response.send(presetValues.tidal)}
    // }
}
