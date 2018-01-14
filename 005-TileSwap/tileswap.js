
// initialize map
mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlcGhrb2x0dW4iLCJhIjoiVXJJT19CQSJ9.kA3ZPQxKKHNngVAoXqtFzA';

var map = new mapboxgl.Map({
    container: 'map',
    // satellite imagery styling
    style: 'mapbox://styles/mapbox/satellite-v9',
    //style: 'mapbox://styles/stephkoltun/cjcapx5je1wql2so4uigw0ovc',
    // set the start point of the map - needs to be long-lat (not lat-long)
    center: [-73.9926559, 40.7159975],    // this should be a random point
    zoom: 15,   // 10 - what scale
});



map.on('load', function () {
    console.log("map is loaded");

    var canvasAll = document.getElementsByClassName("mapboxgl-canvas");
    var canvas = canvasAll[0];
    console.log(canvas);
    var gl = canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true});
    console.log(gl);
    var pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
    gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    console.log(pixels);

    // need to debounce the render
    map.on('dragend', function() {
        map.on('render', function() {
            console.log("rerendered");
            var canvasAll = document.getElementsByClassName("mapboxgl-canvas");
            var canvas = canvasAll[0];
            console.log(canvas);
            var gl = canvas.getContext("experimental-webgl", {preserveDrawingBuffer: true});
            console.log(gl);
            var pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
            gl.readPixels(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            console.log(pixels);
        })
        
    })

});








