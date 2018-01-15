
var Mta = require('mta-gtfs');
var mta = new Mta({
  key: 'a86acf5964ab16759937ddbc4c32f007', // only needed for mta.schedule() method
  feed_id: 1                  // optional, default = 1
});

mta.stop().then(function (result) {
  console.log(result);
}).catch(function (err) {
  console.log(err);
});

mta.stop(635).then(function (result) {
  console.log(result);
});