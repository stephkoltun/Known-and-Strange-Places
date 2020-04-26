var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
if (!isMobile) alert("This works best on mobile devices")


// configure grid sizes
var wWidth = window.innerWidth;
var wHeight = window.innerHeight;
let numOfSubsWidth = 3;
let numOfSubsHeight = 5;
let xDim = wWidth/numOfSubsWidth
let yDim = wHeight/numOfSubsHeight

// resize canvas elements
$('#map').width(numOfSubsWidth * xDim);
$('#map').height(numOfSubsHeight * yDim);
var canvas2D = document.getElementById("shuffle");
var ctx2D = canvas2D.getContext("2d");
ctx2D.canvas.width = numOfSubsWidth * xDim;
ctx2D.canvas.height = numOfSubsHeight * yDim;


var imgWidth = numOfSubsWidth * xDim;
var imgHeight = numOfSubsHeight * yDim;
var totalSubs = numOfSubsWidth * numOfSubsHeight

//generate normal order
var normalOrder = createOrder(numOfSubsWidth, numOfSubsHeight);
var newOrder = shuffleArray(normalOrder);

// initialize map
mapboxgl.accessToken = key;
// start tracking
navigator.geolocation.watchPosition(movePosition, gotError, geoOptions);
var map = new mapboxgl.Map({
    container: 'map',
    // satellite imagery styling
    style: 'mapbox://styles/mapbox/satellite-v9',
    //style: 'mapbox://styles/stephkoltun/cjcapx5je1wql2so4uigw0ovc',
    // set the start point of the map - needs to be long-lat (not lat-long)
    center:[-73.9541134, 40.675237599999996],    // this should be a random point
    zoom: 19,   // 10 - what scale
});

map.scrollZoom.disable();
map.doubleClickZoom.disable();
map.dragPan.disable();
map.dragRotate.disable();
map.touchZoomRotate.disable();

var geoOptions = {
  enableHighAccuracy: true,
  maximumAge        : 30000,
  timeout           : 27000
};

function movePosition(position) {
  var curPoint = [position.coords.longitude, position.coords.latitude];
  console.log(curPoint);
  map.panTo(curPoint);
}

map.on('load', function () {
    console.log("map is loaded");

    // redraw the map
    map.on('render', function() {
        swapPixels();
    })
});



function gotError(position) {
  console.log(position)
  alert("Please enable location services for this device and browser.");
}

function swapPixels() {

    var canvasAll = document.getElementsByClassName("mapboxgl-canvas");
    var canvas = canvasAll[0];

    // get the 2D canvas
    var canvas2D = document.getElementById("shuffle");
    var ctx2D = canvas2D.getContext("2d");
    // draw the webGL canvas as an image to the 2D canvas
    ctx2D.drawImage(canvas, 0, 0);

    for (var i = 0; i < newOrder.length-1; i = i+1) {

        // set the first
        var targetSub = normalOrder[i];
        var replaceSub = newOrder[i];

        var targetX = targetSub.x*xDim;
        var targetY = targetSub.y*yDim;

        // get the target subdivision
        var targetImage = ctx2D.getImageData(targetX, targetY, xDim, yDim);
        var targetData = targetImage.data;

        // duplicate this data
        var duplicateTarget = targetData.slice();

        // use the next one in the sequence
        var replaceX = replaceSub.x*xDim;
        var replaceY = replaceSub.y*yDim;

        var replaceImage = ctx2D.getImageData(replaceX, replaceY, xDim, yDim);
        var replaceData = replaceImage.data;

        // swap arrays
        for (var k = 0; k < targetData.length; k += 4) {
          targetData[k]     = replaceData[k];     // red
          replaceData[k]    = duplicateTarget[k];
          //eplaceData[k]    = 255;

          targetData[k+1]   = replaceData[k+1]; // green
          replaceData[k+1]  = duplicateTarget[k+1];

          targetData[k+2]   = replaceData[k+2]; // blue
          replaceData[k+2]  = duplicateTarget[k+2];
        }

        ctx2D.putImageData(targetImage, targetX, targetY);
        ctx2D.putImageData(replaceImage, replaceX, replaceY);
    }
}

function createOrder(wSubs,hSubs) {
    var xyPairs = [];
    for (var x = 0; x < wSubs; x++) {
        for (var y = 0; y < hSubs; y++) {
            var pair = {
                'x': x,
                'y': y
            };
            xyPairs.push(pair);
        }
    }
    console.log(xyPairs)
    return xyPairs;
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

    // var permantCenter = {
    //     'x': 1,
    //     'y': 1
    // };
    // array.splice(4, 0, permantCenter);

    return array;
}
