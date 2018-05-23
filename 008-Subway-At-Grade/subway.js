
// http://bustime.mta.info/wiki/Developers/OneBusAwayRESTfulAPI

// initialize map
mapboxgl.accessToken = key;

var startPoints = [
    {
        'coord': [-73.980235, 40.688508],
        'name': "LIU-Brooklyn"
    },
];

var randomStart = Math.floor(Math.random() * Math.floor(startPoints.length));

var centerPt = startPoints[0].coord;

var map = new mapboxgl.Map({
    container: 'map',
    // satellite imagery styling
    //style: 'mapbox://styles/mapbox/satellite-v9',
    style: 'mapbox://styles/stephkoltun/cjcapx5je1wql2so4uigw0ovc',
    center: centerPt,
    zoom: 13.7,
});
map.scrollZoom.disable();
map.doubleClickZoom.disable();

var transitLayers = [
    {
        dataObj: routesObj,
        dataName: 'lines',
        layerId: 'subwayLines',
        color: '#acacac',
        type: 'line',
        width: 0.5,
        opac: 1
    },
    {
        dataObj: bufferObj,
        dataName: 'buffers',
        layerId: 'bufferEntrances',
        color: '#000',
        //color: "rgb(25,180,220)",
        type: 'line',
        width: 1,
        // type: 'fill',
        opac: 1
    },
    // {
    //     dataObj: entrancesObj,
    //     dataName: 'entrances',
    //     layerId: 'subwayEntrances',
    //     color: '#aa124b',
    //     type: 'line'
    // },
    // {
    //     dataObj: ventsObj,
    //     dataName: 'vents',
    //     layerId: 'subwayVents',
    //     color: '#83d2f8',
    //     type: 'line',
    //     opac: 0
    // },

    // {
    //     dataObj: stationsObj,
    //     dataName: 'stations',
    //     layerId: 'subwayStations',
    //     color: '#0e1166',
    //     type: 'line'
    // },

];



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
            'raster-opacity': 0
        }
    });

    for (var i = 0; i < transitLayers.length; i++) {
        var thisLayer = transitLayers[i];
        //console.log(thisLayer);
        map.addSource(thisLayer.dataName, {
                "type": "geojson",
                "data": thisLayer.dataObj,
            });

        if (thisLayer.type == 'line') {

            map.addLayer({
                "id": thisLayer.layerId,
                "type": "line",
                "source": thisLayer.dataName,
                'paint': {
                    "line-color": thisLayer.color,
                    "line-width": thisLayer.width,
                    'line-opacity': thisLayer.opac,
                },
                'layout': {
                    'line-cap': "round",
                    'line-join': 'round'
                }
            })
        } else if (thisLayer.type == 'fill') {

            map.addLayer({
                "id": thisLayer.layerId,
                "type": "fill",
                "source": thisLayer.dataName,
                'paint': {
                    "fill-color": "#000000",
                    //"fill-outline-color": thisLayer.color,
                    'fill-antialias': true,
                    'fill-opacity': thisLayer.opac,
                }
            })
        }


    };

    // Use this if want to export new buffer shapes
    //createBuffer(0.01, true)

});

map.on('click', function(e) {
    var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
    var features = map.queryRenderedFeatures(bbox, {layers: ['bufferEntrances']});
    console.log(features);

    if (features.length > 0) {
        // make mask with feature
        var mask = turf.polygon(features[0].geometry.coordinates);
        var centroid = turf.centroid(mask);
        showMask(mask);

        map.setLayoutProperty('bufferEntrances', 'visibility', 'none');
        map.setLayoutProperty('subwayLines', 'visibility', 'none');

        map.easeTo({
            center: centroid.geometry.coordinates,
            zoom: 20.5,
            duration: 1200,
            easing(t) {
                return t;
            }
        })

    }
})

var bounds = [-74.120188, 40.916945, -73.574491, 40.433158];



function polyMask(mask, bounds) {
  var bboxPoly = turf.bboxPolygon(bounds);
  return turf.difference(bboxPoly, mask);
}

var masked = false;
function showMask(mask) {
    if (masked == true) {
        clearTimeout(maskTimer);
        map.removeLayer('zmask');
        map.removeSource('mask');
    }

    map.addSource('mask', {
            "type": "geojson",
            "data": polyMask(mask, bounds)
          });

    map.addLayer({
        "id": "zmask",
        "source": "mask",
        "type": "fill",
        "paint": {
          "fill-color": "#ffffff",
          'fill-opacity': 0.999
        }
    }, 'subwayLines');

    masked = true;
    startTimer();
    map.setPaintProperty('satellite', 'raster-opacity', 1);
}

function clearMask() {
    console.log("clear mask and satellite");
    map.setPaintProperty('satellite', 'raster-opacity', 0);
    map.setLayoutProperty('bufferEntrances', 'visibility', 'visible');
    map.setLayoutProperty('subwayLines', 'visibility', 'visible');

    map.removeLayer('zmask');
    map.removeSource('mask');
    map.easeTo({
            center: map.getCenter(),
            zoom: 14,
            duration: 1200,
            easing(t) {
                return t;
            }
        })
    masked = false;
}

function startTimer() {
    console.log("startTimer");
    maskTimer = setTimeout("clearMask()", 4500);
}
