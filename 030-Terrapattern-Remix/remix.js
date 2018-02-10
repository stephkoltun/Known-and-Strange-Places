// initialize map
mapboxgl.accessToken = key;

var datasets = [
  cemeteryOne.features,
  cemeteryTwo.features,
  cemeteryThree.features,
  cemeteryFour.features,
  cemeteryFive.features,
  cemeterySix.features,
  housingOne.features,
  housingTwo.features,
  housingThree.features,
  housingFour.features,
]

var randomStart = Math.floor(Math.random() * Math.floor(datasets.length));


var curDatasetIndex = randomStart;
var data = datasets[curDatasetIndex];
var remixIndex = 1;

var context = new mapboxgl.Map({
    container: 'context',
    style: 'mapbox://styles/mapbox/satellite-v9',  // satellite imagery styling
    center: data[0].geometry.coordinates,    // this should be a random point
    zoom: 16,   // 10 - what scale
});

var remix = new mapboxgl.Map({
    container: 'remix',
    style: 'mapbox://styles/mapbox/satellite-v9',  // satellite imagery styling
    // set the start point of the map - needs to be long-lat (not lat-long)
    center: data[remixIndex].geometry.coordinates,    // this should be a random point
    zoom: 16,   // 10 - what scale
});

context.scrollZoom.disable();
context.doubleClickZoom.disable();
remix.scrollZoom.disable();
remix.doubleClickZoom.disable();

setInterval(switchRemix,1500);

function switchRemix() {

  if (remixIndex < data.length-1) {
    remixIndex++;
  } else {
    remixIndex = 1;
    console.log("change dataset");
    if (curDatasetIndex < datasets.length-1) {
      curDatasetIndex++;
    } else {
      curDatasetIndex = 0;
    }
  }

  var jumpOptions = {
    center: data[remixIndex].geometry.coordinates,
  }
  remix.jumpTo(jumpOptions);
}
