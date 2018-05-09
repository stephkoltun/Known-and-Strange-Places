// data source
// https://www.baruch.cuny.edu/confluence/display/geoportal/NYC+Mass+Transit+Spatial+Layers

// var mta = new Mta({
//   //key: 'MY-MTA-API-KEY-HERE', // only needed for mta.schedule() method
//   feed_id: 1                  // optional, default = 1
// });

// browser-ify tutorial
// need to write more so that the mta stuff is accessible...
//http://www.bradoncode.com/tutorials/browserify-tutorial-node-js/

// MTA Bus Time API
// http://bustime.mta.info/wiki/Developers/OneBusAwayRESTfulAPI

// initialize map
mapboxgl.accessToken = key;

var startPoints = [
    {
        'coord': [-73.903207, 40.608448],
        'name': "Mill Basin",
    },
    {
        'coord': [-73.925492, 40.790892],
        'name': "Randall's Island"
    },
    {
        'coord': [-73.822370, 40.827342],
        'name': "Throgs Neck"
    },
    {
        'coord': [-73.841395, 40.654482],
        'name': "Howard Beach"
    },
    {
        'coord': [-73.881296, 40.696222],
        'name': "Glendale"
    },
    {
        'coord': [-73.998303, 40.696152],
        'name': "Brooklyn Heights"
    },
    {
        'coord': [-74.000262, 40.758289],
        'name': "Javits Convention Center"
    },
    {
        'coord': [-73.956949, 40.792846],
        'name': "Central Park"
    },
    {
        'coord': [-73.928162, 40.848156],
        'name': "Harlem River Park"
    },
];

var randomStart = Math.floor(Math.random() * Math.floor(startPoints.length));

var centerPt = startPoints[randomStart].coord;
$("#place").text(startPoints[randomStart].name + " " + centerPt[1] + ", " +centerPt[0]);

var map = new mapboxgl.Map({
    container: 'map',
    // satellite imagery styling
    //style: 'mapbox://styles/mapbox/satellite-v9',
    style: 'mapbox://styles/stephkoltun/cjcapx5je1wql2so4uigw0ovc',
    // set the start point of the map - needs to be long-lat (not lat-long)
    center: centerPt,    // this should be a random point
    zoom: 13,   // 10 - what scale
    scrollZoom: false,
    doubleClickZoom: false,
    pitchWithRotate: false
});
<<<<<<< HEAD
=======

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
    {
        dataObj: expressRouteObj,
        dataName: 'express-lines',
        layerId: 'expressLines',
        color: '#0e1166',
        type: 'line'
    },
    {
        dataObj: expressStopObj,
        dataName: 'express-stops',
        layerId: 'expressStops',
        color: '#11ff66',
        type: 'line'
    },
    {
        dataObj: neighborhoodObj,
        dataName: 'neighborhood-areas',
        layerId: 'neighborhoodAreas',
        color: '#11ff66',
        type: 'line'
    },
];
>>>>>>> parent of b9e4dff... fixed 006, 007, and 009

var showRoutes = true;
var showStops = false;

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
        'paint': {
            'raster-opacity': 1
        }
    });

<<<<<<< HEAD
    var neighborhood = findNeighborhood(centerPt);
    $('.caption').text(neighborhood);
=======
    //startTimer();

    // calculate and add walk buffer
    // walkRadiusPoly = createWalkRadius();
    // drawStartPoint();
    // drawAndCalculateRoutes(); 
>>>>>>> parent of b9e4dff... fixed 006, 007, and 009

});

function resetLocation(e) {
    var newCoords = [e.lngLat.lng, e.lngLat.lat]
    map.panTo(newCoords);

    console.log("remove layers");
    clearAerial();
    
    if (map.getLayer("expressBusRoutes") != undefined) {
        map.removeLayer("expressBusRoutes");
        map.removeSource("expressBusRoutes");
    }

    if (map.getLayer("localBusRoutes") != undefined) {
        map.removeLayer("localBusRoutes");
        map.removeSource("localBusRoutes");
    }
    
    if (map.getLayer("subwayRoutes") != undefined) {
        map.removeLayer("subwayRoutes");
        map.removeSource("subwayRoutes");
    }
    if (map.getLayer("startPoint") != undefined) {
    map.removeLayer("startPoint");
    map.removeSource("startPoint");
    }
    centerPt = newCoords;
    walkRadiusPoly = createWalkRadius();

    drawStartPoint();
    drawAndCalculateRoutes(); 

    var neighborhood = findNeighborhood(centerPt);
<<<<<<< HEAD
    $('.caption').text(neighborhood);

=======
    console.log(neighborhood);
    $("#place").text(neighborhood.properties.ntaname + " " + centerPt[1] + ", " + centerPt[0]);
>>>>>>> parent of b9e4dff... fixed 006, 007, and 009
}

map.on('click', function(e) {
  clearAerial();
  resetLocation(e);
});

<<<<<<< HEAD
map.on('mousedown', function(e){
    showAerial();
})

map.on('dragstart', function(e){
    showAerial();
})

$("#routes").click(function() {
  $(this).toggleClass("hidden visible");
  showRoutes = !showRoutes;

  resetLayer("localBusRoutes");
  resetLayer("expressBusRoutes");
  resetLayer("subwayRoutes");

  drawAndCalculateRoutes();
})

$("#stops").click(function() {
  $("#stops").toggleClass("hidden visible");
  showStops = !showStops;
=======
map.on('drag', function(e){
    showAerial();
})

>>>>>>> parent of b9e4dff... fixed 006, 007, and 009

  resetLayer("localBusStops");
  resetLayer("expressBusStops");
  resetLayer("subwayStops");

  drawAndCalculateRoutes();
})


function resetLayer(layerName) {
  console.log(layerName);
  if (map.getLayer(layerName) != undefined) {
      map.removeLayer(layerName);
      map.removeSource(layerName);
  }
}

function findNeighborhood(centerPt) {
    console.log("find neighborhood");
    var point = turf.point(centerPt);
    var neighborhoodBounds = neighborhoodObj.features;
    for (var n = 0; n < neighborhoodBounds.length; n++) {
        if (neighborhoodBounds[n].geometry.type == "MultiPolygon") {
            var neighborPolys = turf.multiPolygon(neighborhoodBounds[n].geometry.coordinates);
            var check = turf.booleanPointInPolygon(point, neighborPolys)
            if (check) {
                return neighborhoodBounds[n].properties.ntaname;
            }
        }
<<<<<<< HEAD
    }
    // if the point isn't part of a neighborhood
    return "";
}

function drawAndCalculateRoutes() {

    let accesibleLocalBusStops = checkBusStops("local");
    //console.log("--- nearby bus stops");
    //console.log(accesibleBusStops);
    if (accesibleLocalBusStops.length != 0) {
      if (showStops) {
        showAccessibleBusStops(accesibleLocalBusStops, "localBusStops")
      }
      if (showRoutes) {
        MTABusRoutes(accesibleLocalBusStops, "local");
      }
    } else {
      resetLayer("localBusStops");
      resetLayer("localBusRoutes");
    }


    let accesibleExpressStops = checkBusStops("express");
    //console.log("--- nearby express stops");
    //console.log(accesibleExpressStops);
    if (accesibleExpressStops.length != 0) {
      if (showStops) {
        showAccessibleBusStops(accesibleExpressStops, "expressBusStops")
      }
      if (showRoutes) {
        MTABusRoutes(accesibleExpressStops, "express");
      }
    } else {
      resetLayer("expressBusStops");
      resetLayer("expressBusRoutes");
    }

    let accessibleSubways = checkSubways();
    //console.log("--- nearby subway stops");
    //console.log(accessibleSubways);
    if (accessibleSubways.stops.length != 0) {
      if (showStops) {
        showAccessibleSubwayStops(accessibleSubways.stops);
      }
      if (showRoutes) {
        showAccessibleSubways(accessibleSubways.lineFeatures);
      }
    } else {
      resetLayer("subwayStops");
      resetLayer("subwayRoutes");
    }
=======
    } 
}

function drawAndCalculateRoutes() {
    var accessibleSubways = checkSubways();
    console.log("--- nearby subway stops");
    console.log(accessibleSubways);
    showAccessibleSubways(accessibleSubways);


    var accesibleBusStops = checkBusStops("local");
    console.log("--- nearby bus stops");
    console.log(accesibleBusStops);
    MTABusRoutes(accesibleBusStops, "local");
>>>>>>> parent of b9e4dff... fixed 006, 007, and 009

    var accesibleExpressStops = checkBusStops("express");
    console.log("--- nearby express stops");
    console.log(accesibleExpressStops);
    MTABusRoutes(accesibleExpressStops, "express");
}

var walkRadiusPoly;
var walkDistanceInKm = .8;

function createWalkRadius() {
    var point = turf.point(centerPt);
    var buffered = turf.buffer(point, walkDistanceInKm, {units: 'kilometers'});
    return buffered;
}

function drawStartPoint() {
<<<<<<< HEAD

  resetLayer("startPoint");

=======
>>>>>>> parent of b9e4dff... fixed 006, 007, and 009
    map.addSource('startPoint', {
        "type": "geojson",
        "data": {
            "type": "Point",
            "coordinates": centerPt,
        }
    });
    map.addLayer({
        "id": 'startPoint',
        "type": "circle",
        "source": 'startPoint',
        'paint': {
            "circle-color": '#000000',
            "circle-radius": 3
        }
    })
}



function MTABusRoutes(_stops, _type) {

    var promiseArray = [];
    var allRoutes = [];
    var allRouteNames = [];

    for (var i = 0; i < _stops.length; i++) {

        var stopid = _stops[i].properties.stop_id;
        var promise = MTAPromise(stopid)
            .then(function(response_json){
                if (response_json.code == 200) {
                    var routes = response_json.data.routes;
                    for (var r = 0; r < routes.length; r++) {
                        allRoutes.push(routes[r]);
                        if (!allRouteNames.includes(routes[r].shortName)) {
                            allRouteNames.push(routes[r].shortName);
                        }
                    } 
                } else {
                    console.log(response_json);
                }
            }); 
        promiseArray.push(promise);
    } 

    Promise.all(promiseArray).then(function() {
        console.log("--- nearby " + _type + " routes");
        console.log(allRoutes);
        drawMatchingBusRoutes(allRoutes, allRouteNames, _type);
    }) 
}

function drawMatchingBusRoutes(_routes, _names, _type) {
    // find matching features
<<<<<<< HEAD

    let compareName = _type + 'BusRoutes';

    resetLayer(compareName);

=======
>>>>>>> parent of b9e4dff... fixed 006, 007, and 009
    var allBusLines = busRoutesObj.features;

    var busFeatures = [];

    for (var b = 0; b < allBusLines.length; b++) {
        var thisFeature = allBusLines[b];
        if (_names.includes(thisFeature.properties.route_shor)) {
            if (thisFeature.properties.color.substring(0,1) != "#") {
                thisFeature.properties.color = "#" + thisFeature.properties.color;
            }
            busFeatures.push(thisFeature);
        }
    }

    var geojson = {
        "type": "FeatureCollection",
        "features": busFeatures
    };


    map.addLayer({
        "id": _type + 'BusRoutes',
        "type": "line",
        "source": {
            "type": "geojson",
            "data": geojson
        },
        'paint': {
            "line-color": ['get', 'color'],
            "line-width": 1.4,
            "line-opacity": 1,
            
        },
        'layout': {
            "line-cap": "round"
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

function checkBusStops(_type) {
    console.log("check bus stops");

    var busStops;

    if (_type == 'local') {
       busStops = busStopObj.features; 
   } else if (_type == 'express') {
        busStops = expressStopObj.features;
   }

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

<<<<<<< HEAD
function showAccessibleBusStops(_stops, name) {
  console.log(_stops);

  resetLayer(name);

  var geojson = {
      "type": "FeatureCollection",
      "features": _stops
  };

    map.addSource(name, {
        "type": "geojson",
        "data": geojson
    });
    map.addLayer({
        "id": name,
        "type": "circle",
        "source": name,
        'paint': {
            "circle-color": "#666666",
            "circle-radius": 2
        }
    })
}

function showAccessibleSubwayStops(_stops) {
  console.log(_stops);

  resetLayer("subwayStops");

  let colorPrefix = [
    'match',
    ['get', 'trains']
  ]

  let colorPicker = colorPrefix.concat(subwayColors);

  var geojson = {
      "type": "FeatureCollection",
      "features": _stops
  };

    map.addSource('subwayStops', {
        "type": "geojson",
        "data": geojson
    });
    map.addLayer({
        "id": 'subwayStops',
        "type": "circle",
        "source": 'subwayStops',
        'paint': {
            "circle-color": colorPicker,
            "circle-radius": 3
        }
    })
}

function showAccessibleSubways(_lines) {
  console.log("--- show subways");

  resetLayer("subwayRoutes");

    let geojson = {
=======
function showAccessibleSubways(_accessible) {
    var lines = _accessible.lineFeatures;

    var geojson = {
>>>>>>> parent of b9e4dff... fixed 006, 007, and 009
        "type": "FeatureCollection",
        "features": lines
    };

    map.addLayer({
        "id": 'subwayRoutes',
        "type": "line",
        "source": {
            "type": "geojson",
            "data": geojson
        },
        'paint': {
            "line-color": "#000",
            "line-width": 1.4,
            "line-opacity": 1,
            
        },
        'layout': {
            "line-cap": "round"
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
                    accessibleLinesFeatures.push(thisFeature);
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

var aerialVisible = false;
var aerialTimer;

function showAerial() {
    if (aerialVisible == true) {
        clearTimeout(aerialTimer);
    } 
     
    aerialVisible = true;
    startTimer();
    map.setPaintProperty('satellite', 'raster-opacity', 1);
    if (map.getLayer("subwayRoutes") != undefined) {
       map.setPaintProperty('subwayRoutes', 'line-opacity', 0);
<<<<<<< HEAD
    }
    if (map.getLayer('subwayStops') != undefined) {
       map.setPaintProperty('subwayStops', 'circle-opacity', 0);
    }
    if (map.getLayer("expressBusRoutes") != undefined) {
        map.setPaintProperty('expressBusRoutes', 'line-opacity', 0);
    }
    if (map.getLayer('expressBusStops') != undefined) {
        map.setPaintProperty('expressBusStops', 'circle-opacity', 0);
    }
    if (map.getLayer("localBusRoutes") != undefined) {
        map.setPaintProperty('localBusRoutes', 'line-opacity', 0);
    }
    if (map.getLayer('localBusStops') != undefined) {
        map.setPaintProperty('localBusStops', 'circle-opacity', 0);
=======
    }
    if (map.getLayer("expressBusRoutes") != undefined) {
        map.setPaintProperty('expressBusRoutes', 'line-opacity', 0);
    }
    if (map.getLayer("localBusRoutes") != undefined) {
        map.setPaintProperty('localBusRoutes', 'line-opacity', 0);
>>>>>>> parent of b9e4dff... fixed 006, 007, and 009
    }
}

function clearAerial() {
    console.log("clear aerial");
    aerialVisible = false;
    map.setPaintProperty('satellite', 'raster-opacity', 0);
    if (map.getLayer("subwayRoutes") != undefined) {
       map.setPaintProperty('subwayRoutes', 'line-opacity', 1);
    }
    if (map.getLayer("expressBusRoutes") != undefined) {
        map.setPaintProperty('expressBusRoutes', 'line-opacity', 1);
    }
    if (map.getLayer("localBusRoutes") != undefined) {
        map.setPaintProperty('localBusRoutes', 'line-opacity', 1);
    }
}

function startTimer() {
    aerialTimer = setTimeout("clearAerial()", 800);
}

