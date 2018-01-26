// initialize map
mapboxgl.accessToken = key;

var useStyle = 'mapbox://styles/stephkoltun/cjcapx5je1wql2so4uigw0ovc'  // no elevs
//var useStyle = 'mapbox://styles/mapbox/streets-v9';


var map = new mapboxgl.Map({
    container: 'map',
    style: useStyle,
    center: [-73.968647, 40.663430],    // Prospect Park
    zoom: 15
});

// disable map zoom
//map.scrollZoom.disable();
map.doubleClickZoom.disable();

map.on('load', function () {
    console.log("map is loaded");

    map.loadImage('img/square-11.png', function(error, image){
        map.addImage('square', image);
    })

    map.loadImage('img/cross-grey-11.png', function(error, image){
        map.addImage('cross', image);
    })

    map.loadImage('img/triangle-11.png', function(error, image){
        map.addImage('triangle', image);
    })


    var mapLayers = [
        {
            dataObj: nycElev,
            dataName: 'nyc-elev',
            layerId: 'nyc-elev',
            type: 'symbol',
            imgname: 'cross',
            size: .15
        },
        {
            dataObj: walkedPath,
            dataName: 'walked-path',
            layerId: 'walked-path',
            color: '#f4c862',
            type: 'circle',
            size: 1.8
        },
        {
            dataObj: walkedPOI,
            dataName: 'walked-poi',
            layerId: 'walked-poi',
            
            type: 'symbol',
            imgname: 'triangle',
            size: .25
        },
        {
            dataObj: targetPOI,
            dataName: 'target-poi',
            layerId: 'target-poi',
            type: 'symbol',
            imgname: 'square',
            size: .2
        },
    ];




    for (var i = 0; i < mapLayers.length; i++) {
        var thisLayer = mapLayers[i];

        map.addSource(thisLayer.dataName, {
            "type": "geojson",
            "data": thisLayer.dataObj,
        });

        
        
        if (thisLayer.type == 'circle') {
            map.addLayer({
                "id": thisLayer.layerId,
                "type": "circle",
                "source": thisLayer.dataName,
                'paint': {
                    'circle-radius': thisLayer.size,
                    'circle-color': thisLayer.color
                }
            });
        } else if (thisLayer.type == 'symbol') {
            map.addLayer({
                "id": thisLayer.layerId,
                "type": "symbol",
                "source": thisLayer.dataName,
                "layout": {
                    "icon-image": thisLayer.imgname,
                    "icon-size": thisLayer.size,
                }
            });
        }

    };




var currentlyHidden = false;

map.on('mousemove', function(e) {
    // set bbox as 5px reactangle area around clicked point
    var bbox = [[e.point.x - 3, e.point.y - 3], [e.point.x + 3, e.point.y + 3]];
    var features = map.queryRenderedFeatures(bbox);

    if (features.length > 0 && !currentlyHidden) {
        var isolateLayer = features[0].layer.id;
        console.log("isolate " + isolateLayer);
        console.log(features[0]);


        var elev;
        var upperElev;
        var lowerElev;

        if (isolateLayer == 'walked-path') {
            elev = features[0].properties.elev;

            upperElev = elev + 2;
            lowerElev = elev - 2;
        } else if (isolateLayer == 'walked-poi') {
            elev = features[0].properties.elevation;

            upperElev = elev + 2;
            lowerElev = elev - 2;
        } else if (isolateLayer == 'nyc-elev') {
            elev = features[0].properties.elevation*0.3048;

            upperElev = elev + 2;
            lowerElev = elev - 2;
        }else if (isolateLayer == 'target-poi') {
            elev = features[0].properties.elevation;

            upperElev = elev + 2;
            lowerElev = elev - 2;
        } 

        // filter features from other layers
        poiFilter = [
            "all",
            ["<=", "elevation", upperElev],
            [">=", "elevation", lowerElev],
        ];
        elevFilter = [
            "all",
            ["<=", "elevation", upperElev/0.3048],
            [">=", "elevation", lowerElev/0.3048],
        ]
        pathFilter = [
            "all",
            ["<=", "elev", upperElev],
            [">=", "elev", lowerElev],
        ]

        map.setFilter('walked-poi', poiFilter);    // elevation
        map.setFilter('target-poi', poiFilter);    // elevation
        map.setFilter('nyc-elev', elevFilter);      // elevation
        map.setFilter('walked-path', pathFilter);  // elev

        var templabel = "<p class='label'>" + Math.round(lowerElev) + '-' + Math.round(upperElev) + "m</p>";

        $("body").append(templabel);
        $(".label").css("top", (e.point.y - 15)).css("left", (e.point.x + 15));


        // add a buffer around the hovered point
        // if (isolateLayer == 'walked-path') {
        //     var lat = features[0].properties.lat;
        //     var lon = features[0].properties.lon;
        //     var point = turf.point([lon,lat]);
        //     var buffered = turf.buffer(point, 0.02, {units: 'kilometers'});
        //     map.addLayer({
        //         "id": "walk-buffer",
        //         "type": "line",
        //         "source": {
        //             "type": "geojson",
        //             "data": buffered,
        //         },
        //         "paint": {
        //             "line-color": "#000000",
        //             "line-opacity": 0.25,
        //             "line-width": 2 // based on reading accuracy
        //         }
        //     });
        // } else if (isolateLayer == 'walked-poi') {
        //     var lat = features[0].properties.lat;
        //     var lon = features[0].properties.lng;
        //     var point = turf.point([lon,lat]);
        //     var buffered = turf.buffer(point, 0.02, {units: 'kilometers'});
        //     map.addLayer({
        //         "id": "actpoi-buffer",
        //         "type": "line",
        //         "source": {
        //             "type": "geojson",
        //             "data": buffered,
        //         },
        //         "paint": {
        //             "line-color": "#000000",
        //             "line-opacity": 0.25,
        //             "line-width": 2 // based on reading accuracy
        //         }
        //     });
        // }  else if (isolateLayer == 'nyc-elev') {
        //     var accuracy = 0.06//2ft, 0.0006km
        //     var lat = features[0].properties.lat;
        //     var lon = features[0].properties.lon;
        //     var point = turf.point([lon,lat]);
        //     var buffered = turf.buffer(point, accuracy, {units: 'kilometers'});
        //     map.addLayer({
        //         "id": "elev-buffer",
        //         "type": "line",
        //         "source": {
        //             "type": "geojson",
        //             "data": buffered,
        //         },
        //         "paint": {
        //             "line-color": "#000000",
        //             "line-opacity": 0.25,
        //             "line-width": 2 // based on reading accuracy
        //         }
        //     });
        // } 
        currentlyHidden = true;

    } else if (features.length == 0 && currentlyHidden) {

        currentlyHidden = false;
        console.log("unhide");

        map.setFilter('walked-path', null);
        map.setFilter('walked-poi', null);
        map.setFilter('target-poi', null);
        map.setFilter('nyc-elev', null);

        $(".label").remove();

        // if (map.getLayer('walk-buffer') != undefined) {
        //     map.removeLayer('walk-buffer');
        //     map.removeSource('walk-buffer');
        // }

        // if (map.getLayer('actpoi-buffer') != undefined) {
        //     map.removeLayer('actpoi-buffer');
        //     map.removeSource('actpoi-buffer');
        // }

        // if (map.getLayer('elev-buffer') != undefined) {
        //     map.removeLayer('elev-buffer');
        //     map.removeSource('elev-buffer');
        // }
        
        
        // for (var i = 0; i < mapLayers.length; i++) {
        //     map.setLayoutProperty(mapLayers[i].layerId, 'visibility', 'visible');
        // }

    }
});

});

