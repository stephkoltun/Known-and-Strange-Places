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
var currentTopRemix = "remix"; // or alt
var remixAltIndex = 1;

var contextCurrent = "context"; // or alt
var backgroundIndex = 0;
var mode = "center";  // center, full, context


// TERRAPATTERN ORIGINAL: zm 19, sq 256x256
// adjusted to 19.8, sq 450x450
var zoomlevel = 19.8

var context = new mapboxgl.Map({
    container: 'context',
    style: 'mapbox://styles/mapbox/satellite-v9',  // satellite imagery styling
    center: data[0].geometry.coordinates,    // this should be a random point
    zoom: zoomlevel,   // 10 - what scale
});

var contextAlt = new mapboxgl.Map({
    container: 'contextAlt',
    style: 'mapbox://styles/mapbox/satellite-v9',  // satellite imagery styling
    center: data[0].geometry.coordinates,    // this should be a random point
    zoom: zoomlevel,   // 10 - what scale
});

var remix = new mapboxgl.Map({
    container: 'remix',
    style: 'mapbox://styles/mapbox/satellite-v9',  // satellite imagery styling
    // set the start point of the map - needs to be long-lat (not lat-long)
    center: data[remixIndex].geometry.coordinates,    // this should be a random point
    zoom: zoomlevel,   // 10 - what scale
});

var remixAlt = new mapboxgl.Map({
    container: 'remixAlt',
    style: 'mapbox://styles/mapbox/satellite-v9',  // satellite imagery styling
    // set the start point of the map - needs to be long-lat (not lat-long)
    center: data[remixAltIndex].geometry.coordinates,    // this should be a random point
    zoom: zoomlevel,   // 10 - what scale
});



context.scrollZoom.disable();
context.doubleClickZoom.disable();
remix.scrollZoom.disable();
remix.doubleClickZoom.disable();

setInterval(switchRemix,1200);


function switchRemix() {

  // increment the center through its dataset
  if (mode == "center") {
    if (remixIndex < data.length-2) {
      currentTopRemix == "remix" ? remixIndex += 2 : remixAltIndex +=2;
    } else {
      remixIndex = 1;
      remixAltIndex = 2;
      console.log("change dataset");

      if (curDatasetIndex < datasets.length-1) {
        curDatasetIndex++;
      } else {
        curDatasetIndex = 0;
      }
    }

    switch (currentTopRemix) {
      case "remix":
        $("#remix").css("z-index", "-10");
        $("#remixAlt").css("z-index", "10");
        remix.jumpTo({center: data[remixIndex].geometry.coordinates});
        currentTopRemix = "alt";
        break;
      case "alt":
        $("#remix").css("z-index", "10");
        $("#remixAlt").css("z-index", "-10");
        remixAlt.jumpTo({center: data[remixAltIndex].geometry.coordinates});
        currentTopRemix = "remix";
        break;
    }

    mode = "full";
  }

  else if (mode == "full") {

    switch (contextCurrent) {
      case "context":
        $("#context").css("z-index", "-1");
        $("#contextAlt").css("z-index", "1");
        context.jumpTo({center: data[remixIndex].geometry.coordinates});
        contextCurrent = "alt";
        break;
      case "alt":
        $("#context").css("z-index", "1");
        $("#contextAlt").css("z-index", "-1");
        contextAlt.jumpTo({center: data[remixAltIndex].geometry.coordinates});
        contextCurrent = "context";
        break;
    }

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

    mode = "center";
  }
}
