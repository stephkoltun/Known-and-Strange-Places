
// initialize map
mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlcGhrb2x0dW4iLCJhIjoiVXJJT19CQSJ9.kA3ZPQxKKHNngVAoXqtFzA';

var map = new mapboxgl.Map({
    container: 'map',
    // satellite imagery styling
    style: 'mapbox://styles/mapbox/satellite-v9',
    //style: 'mapbox://styles/stephkoltun/cjcapx5je1wql2so4uigw0ovc',
    // set the start point of the map - needs to be long-lat (not lat-long)
    center: [-73.903207, 40.608448],    // this should be a random point
    zoom: 15,   // 10 - what scale
});


map.on('load', function () {
    console.log("map is loaded");

    swapPixels();

    // need to debounce the render
    map.on('dragend', function() {
        map.on('render', function() {
            swapPixels(); 
        }) 
    })

});

var nSubs = 4;
var imgWidth = 800;
var subSize = imgWidth/nSubs;
var totalSubs = nSubs*nSubs;

function swapPixels() {
    console.log("change");

    var canvasAll = document.getElementsByClassName("mapboxgl-canvas");
    var canvas = canvasAll[0];


    // get the 2D canvas
    var canvas2D = document.getElementById("temp");
    var ctx2D = canvas2D.getContext("2d");
    // draw the webGL canvas as an image to the 2D canvas
    ctx2D.drawImage(canvas, 0, 0);

    var ctxImageData = ctx2D.getImageData(400, 400, subSize, subSize);
    var data =  ctxImageData.data;
    var otherSub = ctx2D.getImageData(0, 0, subSize, subSize);
    var otherData = otherSub.data;

    // reassign pixels elsewhere
    for (var i = 0; i < data.length; i += 4) {
      data[i]     = otherData[i];     // red
      data[i + 1] = otherData[i + 1]; // green
      data[i + 2] = otherData[i + 2]; // blue
    }

    ctx2D.putImageData(ctxImageData, 400, 400);

    // for (var subRow = 1; subRow < nSubs; subRow++) {
    //     for (var subCol = 1; subCol < totalSubs; subCol++) {
    //         var xPos = subRow*subSize;
    //         var yPos = subRow*subSize;

    //         var ctxImageData = ctx2D.getImageData(xPos, yPos, subSize, subSize);
    //         var data =  ctxImageData.data;

    //         var otherSub = ctx2D.getImageData(0, 0, subSize, subSize);
    //         var otherdata = otherSub.data;

    //         ctx2D.putImageData(otherSub, xPos, yPos);
    //     }
    // }


    
}





