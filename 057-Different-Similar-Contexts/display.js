// initialize map
mapboxgl.accessToken = key;
// terrapattern coordinates seem to be at the center of a 256 image grid, zoom level 18
// at zoom level 18, tile size is 256
// at zoom level 16, tile size is 64

var mapPosition = 0;

var initialized = false;
var readyToCopy = false;

var zoomlevel = 19.5
var map = new mapboxgl.Map({
    container: "stagingCanvas",
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: steppedPlaces.features[mapPosition].geometry.coordinates,
    zoom: zoomlevel,
    interactive: false,
});

map.on('render', function() {
  if (!initialized && mapPosition == 0) {
    copyCanvas("displayCanvas");
    copyCanvas("tempCanvas");
  } else {
    readyToCopy = true;
    copyCanvas("tempCanvas");
  }
})

var copyTileIndex = 7; // middle
var tileIndex = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]
var xSubs = 5;
var ySubs = 3;
var xSubSize = 1930/xSubs;
var ySubSize = 1086/ySubs;
var newOrder = shuffleArray(tileIndex);


function startIntervals() {
  var tileTime = 750;
  var totalTime = tileTime*(xSubs*ySubs);
  setInterval(copyTile, tileTime);
  setInterval(changeLocation, totalTime);
}

function copyTile() {
  if (readyToCopy) {
    var target2D = document.getElementById("tempCanvas");
    var ctxTarget = target2D.getContext("2d");

    var displayCanvas = document.getElementById("displayCanvas");
    var ctxDisplayCanvas = displayCanvas.getContext("2d");

    var randomIndex = newOrder[copyTileIndex];

    var yIndex = Math.floor(randomIndex/5);
    var xIndex = randomIndex - yIndex*5;

    //console.log(xIndex, yIndex);

    console.log(xIndex, yIndex);

    var targetX = xIndex*xSubSize;
    var targetY = yIndex*ySubSize;
    // get the target subdivision
    var targetImage = ctxTarget.getImageData(targetX, targetY, xSubSize, ySubSize);
    var targetData = targetImage.data;

    // duplicate this data
    var duplicateTarget = targetData.slice();


    var replaceImage = ctxDisplayCanvas.getImageData(targetX, targetY, xSubSize, ySubSize);
    var replaceData = replaceImage.data;

    // swap arrays
    for (var k = 0; k < targetData.length; k += 4) {
      replaceData[k]    = duplicateTarget[k];
      replaceData[k+1]  = duplicateTarget[k+1];
      replaceData[k+2]  = duplicateTarget[k+2];
    }

    ctxDisplayCanvas.putImageData(replaceImage, targetX, targetY);

    if (copyTileIndex < tileIndex.length-1) {
      copyTileIndex++;
    } else {
      copyTileIndex = 0;
    }
  }
}

function copyCanvas(copyTo) {
  var canvasAll = document.getElementsByClassName("mapboxgl-canvas");
  var canvas = canvasAll[0];

  // get the 2D canvas
  var canvas2D = document.getElementById(copyTo);
  var ctx2D = canvas2D.getContext("2d");
  // draw the webGL canvas as an image to the 2D canvas
  ctx2D.drawImage(canvas, 0, 0);
}

function changeLocation() {
  newOrder = shuffleArray(tileIndex);

  if (!initialized) {
    initialized = true;
  }

  if (mapPosition < steppedPlaces.features.length -1) {
    mapPosition++;
  } else {
    mapPosition = 0;
  }

  map.jumpTo({'center': steppedPlaces.features[mapPosition].geometry.coordinates});
}

function shuffleArray (originalArray) {

    var array = [].concat(originalArray);
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
    // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
