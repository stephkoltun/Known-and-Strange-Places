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

var centerPt = [-74.000262, 40.758289];

var map = new mapboxgl.Map({
    container: 'map',
    // satellite imagery styling
    //style: 'mapbox://styles/mapbox/satellite-v9',
    style: 'mapbox://styles/stephkoltun/cjcapx5je1wql2so4uigw0ovc',
    // set the start point of the map - needs to be long-lat (not lat-long)
    center: centerPt,    // this should be a random point
    zoom: 14,   // 10 - what scale
});

map.scrollZoom.disable();
map.doubleClickZoom.disable();

var transitLayers = [
    {
        dataObj: subwayRoutesObj,
        dataName: 'subway-lines',
        layerId: 'subwayLines',
        color: '#0979f3',
        type: 'line'
    },
    {
        dataObj: subwayEntrancesObj,
        dataName: 'subway-entraces',
        layerId: 'subwayEntrances',
        color: '#39a95c',
        type: 'circle'
    },
    {
        dataObj: subwayStopsObj,
        dataName: 'subway-stops',
        layerId: 'subwayStops',
        color: '#0979f3',
        type: 'circle'
    },
];


map.on('load', function () {
    console.log("map is loaded");

    for (var i = 0; i < transitLayers.length; i++) {
        var thisLayer = transitLayers[i];

        map.addSource(thisLayer.dataName, {
            "type": "geojson",
            "data": thisLayer.dataObj,
        });

        if (thisLayer.type == 'circle') {
            // add circle
            map.addLayer({
                "id": thisLayer.layerId,
                "type": "circle",
                "source": thisLayer.dataName,
                'paint': {
                    'circle-radius': 2,
                    'circle-color': thisLayer.color
                }
            });
        } else if (thisLayer.type == 'line') {
            // map.addLayer({
            //     "id": thisLayer.layerId,
            //     "type": "line",
            //     "source": thisLayer.dataName,
            //     'paint': {
            //         "line-color": thisLayer.color,
            //         "line-width": .8
            //     }
            // });
        }
    };

    walkRadiusPoly = createWalkRadius();

    map.addSource('walkBuffer', {
            "type": "geojson",
            "data": walkRadiusPoly,
        });

    map.addLayer({
        "id": 'walkBuffer',
        "type": "line",
        "source": 'walkBuffer',
        'paint': {
            "line-color": '#000000',
            "line-width": .8
        }
    });

    map.on('data', function (data) {
    if (data.dataType === 'source' && data.isSourceLoaded) {
        console.log('data loaded', data)
        // stop listening to map.on('data'), if applicable
        var accessibleSubways = checkSubways();
        showAccessibleSubways(accessibleSubways);
    }
  })

    // map.on('styledata', function() {
    //     var accessibleSubways = checkSubways();
    //     showAccessibleSubways(accessibleSubways);
    // })

    

});

var walkRadiusPoly;
var walkDistanceInKm = 1.2;

function createWalkRadius() {
    var point = turf.point(centerPt);
    var buffered = turf.buffer(point, walkDistanceInKm, {units: 'kilometers'});
    return buffered;
}


function showAccessibleSubways(_accessible) {
    var lines = _accessible.lineFeatures;

    var geojson = {
        "type": "FeatureCollection",
        "features": lines
    };

    map.addLayer({
        "id": 'newRoutes',
        "type": "line",
        "source": {
            "type": "geojson",
            "data": geojson
        },
        'paint': {
            "line-color": "#ac1234",
            "line-width": .8
        }
    });
}

function checkSubways() {
    var subwayEntrances = subwayEntrancesObj.features;
    var subwayStops = subwayStopsObj.features;
    var subwayRoutes = subwayRoutesObj.features;

    var accessibleStops = [];   // array of point features
    var accessibleLines = [];   // array of strings with the line name
    var accessibleLinesFeatures = [];   // array of line features

    for (var i = 0; i < subwayStops.length; i++) 
    {
        var pt = turf.point(subwayStops[i].geometry.coordinates);
        if (turf.booleanPointInPolygon(pt, walkRadiusPoly)) 
        {
            // add the stop
            accessibleStops.push(subwayStops[i]);

            // what are the trains for this stop
            var trains = subwayStops[i].properties.trains;
            var trainLinesAtStop = trains.split(" ");

            for (var l = 0; l < subwayRoutes.length; l++) {
                var thisFeature = subwayRoutes[l];
                var thisFeatureTrains = thisFeature.properties.name.split("-");

                var addFeature = false;

                for (var t = 0; t < thisFeatureTrains.length; t++) {
                    if (trainLinesAtStop.includes(thisFeatureTrains[t])) {
                        addFeature = true;
                    };
                }

                if (addFeature) {
                    accessibleLinesFeatures.push(thisFeature)
                }
            }

            for (var k = 0; k < trainLinesAtStop.length; k++) {
                var trainLine = trainLinesAtStop[k];
                if (accessibleLines.includes(trainLine) == false) {
                    accessibleLines.push(trainLinesAtStop[k]);
                }
            }
            
        };
    }
    var accessible = {
        'stops': accessibleStops,
        'lines': accessibleLines,
        'lineFeatures': accessibleLinesFeatures,
    }
    //console.log(accessibleStops);
    //console.log(accessibleLines);
    return accessible;
}


function checkSubwayIntersections() {
    var subwayFeatures = subwayLinesObj.features;

    var doesItIntersect = false;

    for (var i = 0; i < subwayFeatures.length; i++) {
        var line = turf.lineString(subwayFeatures[i].geometry.coordinates);
        var intersects = turf.lineIntersect(walkRadiusPoly, line);
        if (intersects.length != 0) {
            doesItIntersect = true;
        }
    }

    console.log(doesItIntersect);
}