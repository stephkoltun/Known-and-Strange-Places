// data source
// https://www.baruch.cuny.edu/confluence/display/geoportal/NYC+Mass+Transit+Spatial+Layers

// var mta = new Mta({
//   //key: 'MY-MTA-API-KEY-HERE', // only needed for mta.schedule() method
//   feed_id: 1                  // optional, default = 1
// });

// browser-ify tutorial
// need to write more so that the mta stuff is accessible...
//http://www.bradoncode.com/tutorials/browserify-tutorial-node-js/

//console.log(mta);

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
    zoom: 10,   // 10 - what scale
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
    // {
    //     dataObj: subwayEntrancesObj,
    //     dataName: 'subway-entraces',
    //     layerId: 'subwayEntrances',
    //     color: '#39a95c',
    //     type: 'circle'
    // },
    {
        dataObj: subwayStopsObj,
        dataName: 'subway-stops',
        layerId: 'subwayStops',
        color: '#0979f3',
        type: 'circle'
    },
    {
        dataObj: busRoutesObj,
        dataName: 'bus-lines',
        layerId: 'busLines',
        color: '#0e1166',
        type: 'line'
    },
    {
        dataObj: busStopObj,
        dataName: 'bus-stops',
        layerId: 'busStops',
        color: '#11ff66',
        type: 'line'
    },
];


map.on('load', function () {
    console.log("map is loaded");

    // calculate and add walk buffer
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

    for (var i = 0; i < transitLayers.length; i++) {
        var thisLayer = transitLayers[i];

        map.addSource(thisLayer.dataName, {
            "type": "geojson",
            "data": thisLayer.dataObj,
        });

        if (thisLayer.type == 'circle') {
            // add circle
            // map.addLayer({
            //     "id": thisLayer.layerId,
            //     "type": "circle",
            //     "source": thisLayer.dataName,
            //     'paint': {
            //         'circle-radius': 2,
            //         'circle-color': thisLayer.color
            //     }
            // });
        } else if (thisLayer.dataName == 'bus-lines') {
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


    map.on('data', function (data) {
    if (data.dataType === 'source' && data.isSourceLoaded) {
        console.log('data loaded', data)

        // stop listening to map.on('data'), if applicable

        //var accessibleSubways = checkSubways();
        //showAccessibleSubways(accessibleSubways);

        //checkBuses();
        //var intersectingBusRoutes = checkBusRoutes();
        var accesibleBusStops = checkBusStops();
        console.log(accesibleBusStops);

        MTABusRoutes(accesibleBusStops);

        //console.log(accessibleRoutes);
        
    }
  })

});

var walkRadiusPoly;
var walkDistanceInKm = 1.2;

function createWalkRadius() {
    var point = turf.point(centerPt);
    var buffered = turf.buffer(point, walkDistanceInKm, {units: 'kilometers'});
    return buffered;
}

function confirmStopsOnRoutes(_routes, _nearbyStops) { 

    var realRoutes = [];

    for (var i = 0; i < _routes.length; i++) {
        var route = _routes[i];
        var url = 'http://bustime.mta.info/api/where/stops-for-route/MTA%20NYCT_' + route + '.json?key=' + mtabuskey +'&includePolylines=false&version=2';

        $.ajax({
            'url': url, 
            'dataType': 'jsonp',
            success: function(result) {
                //console.log(result)

                var stopsOnRoute = result.data.entry.stopIds;

                for (var s = 0; s < _nearbyStops.length; s++) {
                    var stop = "MTA_" + _nearbyStops[s].properties.stop_id;
                    if (stopsOnRoute.includes(stop)) {

                        if (!realRoutes.includes(result.data.entry.routeId))
                        realRoutes.push(result.data.entry.routeId);
                    }
                }
            }
        });
    }
}

function checkBusRoutes() {
    console.log("check bus lines");
    var busRoutes = busRoutesObj.features;
    var includedRoutes = [];

    for (var b = 0; b < busRoutes.length; b++) {

        var intersect;

        // check if route intersects
        if (busRoutes[b].geometry.type == 'LineString') {
            var busLine = turf.lineString(busRoutes[b].geometry.coordinates);
            intersect = turf.lineIntersect(walkRadiusPoly, busLine);
        } else if (busRoutes[b].geometry.type == 'MultiLineString') {
            var busLine = turf.multiLineString(busRoutes[b].geometry.coordinates);
            intersect = turf.lineIntersect(walkRadiusPoly, busLine);
        }

        if (intersect.features.length > 0) {
            //includedBusFeatures.push(busRoutes[b]); - need to draw the feature later

            if (includedRoutes.includes(busRoutes[b].properties.route_id)==false) {
                includedRoutes.push(busRoutes[b].properties.route_id);
            }           
        } 
    }

    return includedRoutes;
}

function MTABusRoutes(_stops) {

    var promiseArray = [];
    var allRoutes = [];
    var allRouteNames = [];

    for (var i = 0; i < _stops.length; i++) {

        var stopid = _stops[i].properties.stop_id;
        var promise = MTAPromise(stopid)
            .then(function(response_json){
                var routes = response_json.data.routes;
                for (var r = 0; r < routes.length; r++) {
                    allRoutes.push(routes[r]);
                    if (!allRouteNames.includes(routes[r].shortName)) {
                        allRouteNames.push(routes[r].shortName);
                    }
                } 
            }); 
        promiseArray.push(promise);
    } 

    Promise.all(promiseArray).then(function() {
        console.log("looked up all stop routes");
        drawMatchingBusRoutes(allRoutes, allRouteNames);
    }) 
}

function drawMatchingBusRoutes(_routes, _names) {
    // find matching features
    var allBusLines = busRoutesObj.features;
    console.log(_names);

    var busFeatures = [];

    for (var b = 0; b < allBusLines.length; b++) {
        if (_names.includes(allBusLines[b].properties.route_shor)) {
            busFeatures.push(allBusLines[b]);
        }
    }

    var geojson = {
        "type": "FeatureCollection",
        "features": busFeatures
    };

    map.addLayer({
        "id": 'busRoutes',
        "type": "line",
        "source": {
            "type": "geojson",
            "data": geojson
        },
        'paint': {
            "line-color": "#0e1166",
            "line-width": .8
        }
    });
}

function MTAPromise(_stopId) {
    return new Promise(function(resolve, reject) {
        var url = 'http://bustime.mta.info/api/where/stop/MTA_' + _stopId + '.json?key=' + mtabuskey ;

        $.ajax({
            'url': url, 
            'dataType': 'jsonp',
            success: function(data) {
                resolve(data);
            }
        });
    })
}

function checkBusStops() {
    console.log("check bus stops");
    var busStops = busStopObj.features;

    var accessibleStops = [];   // array of point features

    for (var i = 0; i < busStops.length; i++) 
    {
        var pt = turf.point(busStops[i].geometry.coordinates);
        if (turf.booleanPointInPolygon(pt, walkRadiusPoly)) 
        {
            // add the stop
            accessibleStops.push(busStops[i]);
        };
    }

    return accessibleStops;
}

function showAccessibleSubways(_accessible) {
    var lines = _accessible.lineFeatures;

    var geojson = {
        "type": "FeatureCollection",
        "features": lines
    };

    map.addLayer({
        "id": 'subRoutes',
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
