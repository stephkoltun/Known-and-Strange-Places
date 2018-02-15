// initialize map
mapboxgl.accessToken = key;

var datasets = [
  placeOne.features,
  placeTwo.features,
  placeThree.features,
  placeFour.features,
  placeFive.features,
  placeSix.features,
  placeSeven.features,
]

var randomStart = Math.floor(Math.random() * Math.floor(datasets.length));

var curDatasetIndex = randomStart;
var data = datasets[curDatasetIndex];
var remixIndex = 0;
var backgroundIndex = 0;
var mode = "center";  // center, full, context

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

setInterval(switchRemix,1200);

function switchRemix() {

  if (mode == "center") {
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
    mode = "full";
  } else if (mode == "full") {

    var jumpOptions = {
      center: data[remixIndex].geometry.coordinates,
    }
    context.jumpTo(jumpOptions);
    mode = "center";
  } else if (mode == "context") {
    if (backgroundIndex < data.length-1) {
      backgroundIndex++;
    } else {
      backgroundIndex = 1;
      if (curDatasetIndex < datasets.length-1) {
        curDatasetIndex++;
      } else {
        curDatasetIndex = 0;
      }
    }

    var jumpOptions = {
      center: data[backgroundIndex].geometry.coordinates,
    }
    context.jumpTo(jumpOptions);
    mode = "center";
  }
}
