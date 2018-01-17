
// http://bustime.mta.info/wiki/Developers/OneBusAwayRESTfulAPI

// initialize map
mapboxgl.accessToken = key;

var startPoints = [
    {
        'coord': [-73.956949, 40.792846],
        'name': "Central Park"
    },

];

var randomStart = Math.floor(Math.random() * Math.floor(startPoints.length));

var centerPt = startPoints[0].coord;

var map = new mapboxgl.Map({
    container: 'map',
    // satellite imagery styling
    //style: 'mapbox://styles/mapbox/satellite-v9',
    style: 'mapbox://styles/stephkoltun/cjcapx5je1wql2so4uigw0ovc',
    // set the start point of the map - needs to be long-lat (not lat-long)
    center: centerPt,    // this should be a random point
    zoom: 15,   // 10 - what scale
});

map.scrollZoom.disable();
map.doubleClickZoom.disable();

var transitLayers = [
    {
        dataObj: routesObj,
        dataName: 'lines',
        layerId: 'subwayLines',
        color: '#0979f3',
        type: 'line'
    },
    {
        dataObj: entrancesObj,
        dataName: 'entrances',
        layerId: 'subwayEntrances',
        color: '#aa124b',
        type: 'line'
    },
    // {
    //     dataObj: stationsObj,
    //     dataName: 'stations',
    //     layerId: 'subwayStations',
    //     color: '#0e1166',
    //     type: 'line'
    // },
    // {
    //     dataObj: ventsObj,
    //     dataName: 'vents',
    //     layerId: 'subwayVents',
    //     color: '#06443f',
    //     type: 'line'
    // },
];


map.on('load', function () {
    console.log("map is loaded");

    for (var i = 0; i < transitLayers.length; i++) {
        var thisLayer = transitLayers[i];
        console.log(thisLayer);

        map.addSource(thisLayer.dataName, {
            "type": "geojson",
            "data": thisLayer.dataObj,
        });

        map.addLayer({
            "id": thisLayer.layerId,
            "type": "line",
            "source": thisLayer.dataName,
            'paint': {
                "line-color": thisLayer.color,
                "line-width": 2
            }
        })

        if (thisLayer.layerId == 'subwayEntrances') {
            var allEntrances = thisLayer.dataObj.features;
            for (var i = 0; i < allEntrances.length; i++) {
                var coords = allEntrances[i].geometry.coordinates;
                var entrance = turf.polygon(coords);
                var buffer = turf.buffer(entrance, .03, {units: 'kilometers'})

                var bbox = turf.bbox(buffer);
                var bboxPoly = turf.bboxPolygon(bbox);


                var x1 = coords[0][0][0];
                var x2 = coords[0][1][0];
                var y1 = coords[0][0][1];
                var y2 = coords[0][1][1];
                
                var run = Math.abs(x1-x2);
                var rise = Math.abs(y1-y2);
                var angle = Math.atan(run/rise) * 180/Math.PI;

                var rotatedPoly = turf.transformRotate(bboxPoly, angle)

                var sourceName = thisLayer.dataName + 'Buffer' + i;
                var layerName = thisLayer.layerId + 'Buffer' + i;
                map.addSource(sourceName, {
                    "type": "geojson",
                    "data": rotatedPoly,
                });
                map.addLayer({
                    "id": layerName,
                    "type": "line",
                    "source": sourceName,
                    'paint': {
                        "line-color": '#000000',
                        "line-width": 1
                    }
                })
            }
        }
    };

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
            'raster-opacity': 0
        }
    });

});


