var dateFormat = require('dateformat');
var startTime = new Date();
var startFormat = dateFormat(startTime, "isoDateTime");

var roofObject = {
	readings: [
		{
			'timestamp':startFormat,
			'light': 150,
			'temp': 250,
			'sound': 550,
		}
	],
}


module.exports = roofObject
