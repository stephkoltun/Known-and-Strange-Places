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
    style: 'mapbox://styles/stephkoltun/cjgznqkec00092ssail0j7jla',
    //style: 'mapbox://styles/stephkoltun/cjcapx5je1wql2so4uigw0ovc',
    center: centerPt,
    zoom: 14.5,
});

map.scrollZoom.disable();
map.doubleClickZoom.disable();

var buildingLayers = [
    {
        //dataObj: oneObj,
        geoURL: 'GEOJSON/building500.geojson',
        dataName: 'oneRange',
        layerId: 'oneRange',
        color: '#000',
        type: 'fill',
    },
    // {
    //     //dataObj: twoObj,
    //     geoURL: 'GEOJSON/building500-2000.geojson',
    //     dataName: 'original',
    //     layerId: 'original',
    //     color: '#8ae314',
    //     type: 'fill',
    // },
    {
        //dataObj: threeObj,
        geoURL: 'GEOJSON/building2000-5000.geojson',
        dataName: 'threeRange',
        layerId: 'threeRange',
        color: '#000',
        type: 'fill',
    },
    {
        //dataObj: fourObj,
        geoURL: 'GEOJSON/building5000-10000.geojson',
        dataName: 'fourRange',
        layerId: 'fourRange',
        color: '#000',
        type: 'fill',
    },
    {
        //dataObj: fiveObj,
        geoURL: 'GEOJSON/building10000-25000.geojson',
        dataName: 'fiveRange',
        layerId: 'fiveRange',
        color: '#000',
        type: 'fill',
    },
    {
        //dataObj: sixObj,
        geoURL: 'GEOJSON/building25000-50000.geojson',
        dataName: 'sixRange',
        layerId: 'sixRange',
        color: '#000',
        type: 'fill',
    },
    {
        //dataObj: sevenObj,
        geoURL: 'GEOJSON/building50000-100000.geojson',
        dataName: 'sevenRange',
        layerId: 'sevenRange',
        color: '#000',
        type: 'fill',
    },
    {
        //dataObj: eightObj,
        geoURL: 'GEOJSON/building100000.geojson',
        dataName: 'eightRange',
        layerId: 'eightRange',
        color: '#000',
        type: 'fill',
    },
];



map.on('load', function () {
    console.log("map is loaded");

    for (var i = 0; i < buildingLayers.length; i++) {
        var thisLayer = buildingLayers[i];


        map.addSource(thisLayer.dataName, {
                "type": "geojson",
                "data": thisLayer.geoURL,
                "tolerance": 0.6,
                "buffer": 64,
            });

        map.addLayer({
            "id": thisLayer.layerId,
            "type": "fill",
            "source": thisLayer.dataName,
            'paint': {
                "fill-color": "#efefef",
                'fill-antialias': true,
            }
        })
    };
});

var currentlyHidden = false;

map.on('click', function(e) {
    var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
    var features = map.queryRenderedFeatures(bbox);

    if (features.length > 0 && !currentlyHidden) {
        var isolateLayer = features[0].layer.id;

        console.log(isolateLayer);

        // hide all other layers

        if (isolateLayer !== 'original') {
          map.setLayoutProperty('original', 'visibility', 'none');
        } else {
          map.setPaintProperty('original', 'fill-color', '#000');
        }

        for (var i = 0; i < buildingLayers.length; i++) {
            if (buildingLayers[i].layerId != isolateLayer) {
                map.setLayoutProperty(buildingLayers[i].layerId, 'visibility', 'none');
            } else {
                map.setLayoutProperty(buildingLayers[i].layerId, 'visibility', 'visible');
                map.setPaintProperty(buildingLayers[i].layerId, 'fill-color', buildingLayers[i].color);
            }
        }

        currentlyHidden = true;

    } else if (features.length == 0 && currentlyHidden) {

        currentlyHidden = false;

        //$(".label").remove();
        map.setLayoutProperty('original', 'visibility', 'visible');
        map.setPaintProperty('original', 'fill-color', '#efefef');

        for (var i = 0; i < buildingLayers.length; i++) {
            map.setLayoutProperty(buildingLayers[i].layerId, 'visibility', 'visible');
            map.setPaintProperty(buildingLayers[i].layerId, 'fill-color', '#efefef');
        }

    }
})
