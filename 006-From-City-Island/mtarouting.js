// data source
// https://www.baruch.cuny.edu/confluence/display/geoportal/NYC+Mass+Transit+Spatial+Layers

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
    //style: 'mapbox://styles/mapbox/satellite-v9',
    style: 'mapbox://styles/stephkoltun/cjcapx5je1wql2so4uigw0ovc',
    // set the start point of the map - needs to be long-lat (not lat-long)
    center: startPoints[randomStart],    // this should be a random point
    zoom: 15,   // 10 - what scale
});

map.scrollZoom.disable();
map.doubleClickZoom.disable();


map.on('load', function () {
    console.log("map is loaded");

    map.addSource('subwayLines', {
        "type": "geojson",
        "data": subwayLinesObj,
    });

    map.addLayer({
        "id": 'subway-lines',
        // "metadata": {
        //     "displaylabel": thisLayer.displaylabel,
        // },
        "type": "line",
        "source": 'subwayLines',
        'paint': {
            'paint': {
                "line-color": '#39a95c',
                "line-width": 2
            }
        }
    });
});

var walkRadiusPoly = createWalkRadius;

function createWalkRadius() {
    var point = turf.point(randomStart);
    var buffered = turf.buffer(point, 1, {units: 'kilometers'});
    return buffered;
}

function checkTransitStops() {
    for (var i = 0; i < busStops.)
}

function checkSubwayIntersections() {
    var subwayFeatures = subwayLinesObj.features;

    var doesItIntersect = false;

    for (var i = 0; i < subwayFeatures.length; i++) {
        var line = turf.lineString(subwayFeatures[i].geometry.coordinates);
        var intersects = turf.lineIntersect(walkRadiusPoly, line);
        if (intersects.length !0) {
            doesItIntersect = true;
        }
    }

    console.log(doesItIntersect);
}