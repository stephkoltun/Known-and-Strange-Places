
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

var nSubs = 4;
var imgWidth = 1000;
var subSize = imgWidth/nSubs;
var totalSubs = nSubs*nSubs;

//generate normal order
var normalOrder = createOrder(nSubs);
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

    for (var i = 0; i < newOrder.length; i = i+2) {
        // set the first
        var targetSub = newOrder[i];
        var replaceSub = newOrder[i+1];

        var targetX = targetSub.x*subSize;
        var targetY = targetSub.y*subSize;
        // get the target subdivision
        var targetImage = ctx2D.getImageData(targetX, targetY, subSize, subSize);
        var targetData = targetImage.data;

        // duplicate this data
        var duplicateTarget = targetData.slice();

        // use the next one in the sequence
        
        var replaceX = replaceSub.x*subSize;
        var replaceY = replaceSub.y*subSize;

        var replaceImage = ctx2D.getImageData(replaceX, replaceY, subSize, subSize);
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

function createOrder(subs) {
    var xyPairs = [];
    for (var x = 0; x < subs; x++) {
        for (var y = 0; y < subs; y++) {
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





