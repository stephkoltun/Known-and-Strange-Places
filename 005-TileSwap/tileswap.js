
// initialize map
mapboxgl.accessToken = key;

var startPoints = [
    [-73.903207, 40.608448],
    [-73.925492, 40.790892],
    [-73.797266, 40.793105],
    [-73.820011, 40.602733],
    [-73.785777, 40.621554],
    [-73.883871, 40.693623],
    [-73.998303, 40.696152],
    [-74.000262, 40.758289],
    [-73.956949, 40.792846],
    [-73.928162, 40.848156],
];

var randomStart = Math.floor(Math.random() * Math.floor(startPoints.length));

var map = new mapboxgl.Map({
    container: 'map',
    // satellite imagery styling
    style: 'mapbox://styles/mapbox/satellite-v9',
    //style: 'mapbox://styles/stephkoltun/cjcapx5je1wql2so4uigw0ovc',
    // set the start point of the map - needs to be long-lat (not lat-long)
    center: startPoints[randomStart],    // this should be a random point
    zoom: 15,   // 10 - what scale
});

map.scrollZoom.disable();
map.doubleClickZoom.disable();

//var nSubs = 4;
var xSubs = 5;
var ySubs = 3;
var imgWidth = 1930;
var imgHeight = 1086;
var subSizeX = imgWidth/xSubs;
var subSizeY = imgHeight/ySubs;
var totalSubs = xSubs*ySubs;

//generate normal order
var normalOrder = createOrder(xSubs, ySubs);
var newOrder = shuffleArray(normalOrder);
console.log(normalOrder);
console.log(newOrder);

map.on('load', function () {
    console.log("map is loaded");

    // redraw the map
    map.on('render', function() {
        swapPixels();
    })
});



function swapPixels() {

    var canvasAll = document.getElementsByClassName("mapboxgl-canvas");
    var canvas = canvasAll[0];

    // get the 2D canvas
    var canvas2D = document.getElementById("shuffle");
    var ctx2D = canvas2D.getContext("2d");
    // draw the webGL canvas as an image to the 2D canvas
    ctx2D.drawImage(canvas, 0, 0);

    const futureData = [];

    for (var i = 0; i < newOrder.length; i++) {
        var replaceSub = newOrder[i];

        // use the next one in the sequence
        var replaceX = replaceSub.x*subSizeX;
        var replaceY = replaceSub.y*subSizeY;

        var replaceImage = ctx2D.getImageData(replaceX, replaceY, subSizeX, subSizeY);
        var replaceData = replaceImage.data;
        // save the replacement data
        futureData[i] = replaceData;
    }

    for (var i = 0; i < newOrder.length; i++) {
      var targetSub = normalOrder[i];
      var targetX = targetSub.x*subSizeX;
      var targetY = targetSub.y*subSizeY;
      // get the target subdivision
      var targetImage = ctx2D.getImageData(targetX, targetY, subSizeX, subSizeY);
      var targetData = targetImage.data;

      var replacementData = futureData[i];
      for (var k = 0; k < replacementData.length; k += 4) {
        targetData[k] = replacementData[k];
        targetData[k+1] = replacementData[k+1];
        targetData[k+2] = replacementData[k+2]; 
      }

      ctx2D.putImageData(targetImage, targetX, targetY);
    }
}

function createOrder(xsubs, ysubs) {
    var xyPairs = [];
    for (var x = 0; x < xsubs; x++) {
        for (var y = 0; y < ysubs; y++) {
            var pair = {
                'x': x,
                'y': y
            }
            xyPairs.push(pair);
        }
    }
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

    return array;
}
