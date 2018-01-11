
// initialize map
mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlcGhrb2x0dW4iLCJhIjoiVXJJT19CQSJ9.kA3ZPQxKKHNngVAoXqtFzA';

var map = new mapboxgl.Map({
    container: 'map',
    // satellite imagery styling
    style: 'mapbox://styles/stephkoltun/cjcapx5je1wql2so4uigw0ovc',
    // set the start point of the map - needs to be long-lat (not lat-long)
    center: [-73.9926559, 40.7159975],    // this should be a random point
    zoom: 10,   // 10 - what scale
    maxBounds: bounds,
    //interactive: false,
});

// coords to set max map area
// Southwest coordinates and Northeast coordinates
var bounds = [-74.238132, 40.818576, -73.747180, 40.618473];

map.on('load', function () {
    console.log("map is loaded");

    map.addSource('satellite', {
        type: 'raster',
        url: 'mapbox://mapbox.satellite'
    });

    map.addLayer({
        'id': 'satellite',
        'type': 'raster',
        'source': 'satellite',
        'source-layer': 'contour',
        'layout': {
            //'visibility': 'none',
        },
        'paint': {
            'raster-opacity': 0
        }
    });

    var layersArray = [
    {
        boundObj: quadBound,
        boundName: "quadBound",
        boundId: "quad-boundary",
        maskObj: quadMask,
        maskName: "quadMask",
        maskId: "quad-mask",
    },
    {
        boundObj: estShoreBound,
        boundName: "estShoreBound",
        boundId: "estShore-boundary",
        maskObj: estShoreMask,
        maskName: "estShoreMask",
        maskId: "estShore-mask",
    },
    {
        boundObj: boroBound,
        boundName: "boroBound",
        boundId: "boro-boundary",
        maskObj: boroMask,
        maskName: "boroMask",
        maskId: "boro-mask",
    },
    ];


    for (var i = 0; i < layersArray.length; i++) {
        var thisLayer = layersArray[i];

        map.addSource(thisLayer.boundName, {
            "type": "geojson",
            "data": thisLayer.boundObj
        });

        map.addSource(thisLayer.maskName, {
            "type": "geojson",
            "data": thisLayer.maskObj
        });

        map.addLayer({
            "id": thisLayer.boundId,
            "type": "line",
            "source": thisLayer.boundName,
            "paint": {
                "line-color": colors[i],
                "line-width": 1
            },
        });
    } 

    // map.on('click', 'boro-boundary', function () {
    //     console.log("over boro");
    //     showMask("boro-mask", "boroMask");
    // });

    // map.on('click', 'estShore-boundary', function () {
    //     console.log("over est shore");
    //     showMask("estShore-mask", "estShoreMask");
    // });   
});

var lastMaskVisible = false;
var lastMask;
var maskTimer;

function showMask(maskId, maskSource) {
    if (lastMaskVisible == true) {
        clearTimeout(maskTimer);
        map.removeLayer(lastMask);
    } 
    map.addLayer({
        "id": maskId,
        "type": "fill",
        "source": maskSource,
        "paint": {
            "fill-color": "#fff",
            "fill-opacity": 0.9999
        },
    });
    lastMask = maskId;
    lastMaskVisible = true;
    startTimer();
    map.setPaintProperty('satellite', 'raster-opacity', 1);
}

map.on('click', function(e) {
    // set bbox as 5px reactangle area around clicked point
    var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
    var features = map.queryRenderedFeatures(bbox);
    var clickedLayer = features[0].layer.id;

    if (clickedLayer == "boro-boundary") {
        console.log("over boro");
        showMask("boro-mask", "boroMask");
    } else if (clickedLayer == "estShore-boundary") {
        console.log("over est shore");
        showMask("estShore-mask", "estShoreMask");
    } else if (clickedLayer == "quad-boundary") {
        console.log("over est shore");
        showMask("quad-mask", "quadMask");
    }
});

function startTimer() {
    console.log("startTimer");
    maskTimer = setTimeout("clearMask()", 3500);
}

function clearMask() {
    console.log("clear mask and satellite");
    map.removeLayer(lastMask);
    lastMaskVisible = false;
    lastMask = null;
    map.setPaintProperty('satellite', 'raster-opacity', 0);
}

var colors = ["#c2ab33", "#22d316", "#0133dd"];




