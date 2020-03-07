
// initialize map
mapboxgl.accessToken = key;

var startPoints = [
    [-74.007679, 40.674632],
    [-73.903207, 40.608448],
    [-74.008388, 40.684944],
    [-74.150060, 40.607673],
    [-73.859634, 40.677469],
    [-73.864629, 40.722568],
    [-73.963808, 40.632482],
    [-73.917551, 40.765166],
    [-73.950191, 40.805484],
    [-73.906388, 40.820918],
    [-73.898160, 40.853974]
    // [-73.903207, 40.608448],
    // [-73.925492, 40.790892],
    // [-73.797266, 40.793105],
    // [-73.820011, 40.602733],
    // [-73.785777, 40.621554],
    // [-73.883871, 40.693623],
    // [-73.998303, 40.696152],
    // [-74.000262, 40.758289],
    // [-73.956949, 40.792846],
    // [-73.928162, 40.848156],
];



var initialCenters = randomStarts(startPoints.length);
console.log(initialCenters);

var bottomMap = new mapboxgl.Map({
    container: 'bottom',
    // satellite imagery styling
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: startPoints[initialCenters.bottom],
    zoom: 16.5,
});

var topMap = new mapboxgl.Map({
    container: 'top',
    // satellite imagery styling
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: startPoints[initialCenters.top],
    zoom: 16.5,
});

// for tracking to pan the other map simultaneously
var topMapPrevCenter = {lng: startPoints[initialCenters.top][0], lat: startPoints[initialCenters.top][1]};

topMap.scrollZoom.disable();
topMap.doubleClickZoom.disable();
bottomMap.scrollZoom.disable();
bottomMap.doubleClickZoom.disable();

var nSubs = 12;
var imgWidth = $(window).width();
var subSize = imgWidth/nSubs;
var totalSubs = nSubs*nSubs;

var erase = true;

var topLoaded = false;
var bottomLoaded = false;
var creating = false;

topMap.on('load', function () {
    console.log("top map is loaded");

    topMap.on('render', function() {
      topLoaded = true;
      if (topLoaded && bottomLoaded && !creating) {
        creating = true;
        createCheckerboard();
      }
    })
});

bottomMap.on('load', function () {
    console.log("bottom map is loaded");

    bottomMap.on('render', function() {
      bottomLoaded = true;
      if (topLoaded && bottomLoaded && !creating) {
        creating = true;
        createCheckerboard();
      }
    })
});

topMap.on('drag', function(e) {
  var topCenter = topMap.getCenter();

  var moveLng = topMapPrevCenter.lng - topCenter.lng;
  var moveLat = topMapPrevCenter.lat - topCenter.lat;

  var bottomCenter = bottomMap.getCenter();
  var newBottomCenter = {lng: bottomCenter.lng - moveLng, lat: bottomCenter.lat - moveLat};

  bottomMap.setCenter(newBottomCenter);
  createCheckerboard();

  topMapPrevCenter = topCenter;
})

function randomStarts(points) {
  var startingPoints = {
    top: Math.floor(Math.random() * Math.floor(points)),
    bottom: Math.floor(Math.random() * Math.floor(points))
  }

  if (startingPoints.top != startingPoints.bottom) {
    return startingPoints;
  } else {
    var newStarts = randomStarts(points);
    return newStarts;
  }
}

function createCheckerboard() {

  var canvasAll = document.getElementsByClassName("mapboxgl-canvas");
  var canvas = canvasAll[1];

  // get the 2D canvas
  var canvas2D = document.getElementById("shuffle");
  var ctx2D = canvas2D.getContext("2d");
  ctx2D.canvas.width  = $(window).width();
  ctx2D.canvas.height = $(window).width();
  // draw the webGL canvas as an image to the 2D canvas
  ctx2D.drawImage(canvas, 0, 0, imgWidth, imgWidth);

  for (var y = 0; y < nSubs; y++) {
    for (var x = 0; x < nSubs; x++) {

      var index = x + y*nSubs;
      //console.log(index);

      var targetX = x*subSize;
      var targetY = y*subSize;

      //console.log(index + ", x: " + targetX + ", y: " + targetY);
      // get the target subdivision
      var targetImage = ctx2D.getImageData(targetX, targetY, subSize, subSize);
      var targetData = targetImage.data;

      if (erase && y % 2 == 0 || !erase && y %2 == 1) {
        for (var k = 0; k < targetData.length; k += 4) {
          // set alpha to 0 (transparent)
          targetData[k+3] = 0;
        }
      }
      erase = !erase;
      ctx2D.putImageData(targetImage, targetX, targetY);
    }
  }
}
