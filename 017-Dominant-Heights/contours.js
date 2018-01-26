// initialize map
mapboxgl.accessToken = key;

var useStyle ='mapbox://styles/stephkoltun/cjcapx5je1wql2so4uigw0ovc';    // all white
//var useStyle = 'mapbox://styles/stephkoltun/cjcw3515z0nju2spkfl9yhvf4'  // incl contour lines
//var useStyle = 'mapbox://styles/mapbox/streets-v9';

var map = new mapboxgl.Map({
    container: 'map',
    style: useStyle,
    //center: [-73.927284, 40.820219], 
    center: [-73.927078,40.860777],
    zoom: 16
});

var bounds = [-74.009080, 40.899271, -73.893638, 40.819490];
// disable map zoom
//map.scrollZoom.disable();
map.doubleClickZoom.disable();

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

    map.addSource('contours', {
        "type": "geojson",
        //"data": contourObj,
        "data": 'polygons-elev.geojson'
    });  

    map.addLayer({
        "id": 'contours',
        "type": "line",
        "source": 'contours',
        //"source-layer": "original",
        'paint': {
            'line-width': .5,
            'line-color': "#c6c6c6"
            // 'circle-radius': thisLayer.size,
            // 'circle-color': thisLayer.color
        }
    });
});




var currentlyHidden = false;

map.on('mousemove', function(e) {
    // set bbox as 5px reactangle area around clicked point
    var bbox = [[e.point.x - 3, e.point.y - 3], [e.point.x + 3, e.point.y + 3]];
    var features = map.queryRenderedFeatures(bbox);

    console.log(features);

    if (features.length > 0 && !currentlyHidden) {
        //console.log(features[0]);

        var elev;
        var upperElev;
        var lowerElev;

        elev = features[0].properties.DN;

        upperElev = elev;
        lowerElev = elev;

        // filter features from other layers
        filter = [
            "all",
            ["<=", "DN", upperElev],
            [">=", "DN", lowerElev],
        ];
        
        // use rendered features to get all the matching 
        var matchHeight = map.querySourceFeatures('contours', filter);
        console.log(matchHeight);

        // var line = turf.multiLineString(features[0].geometry.coordinates);
        // //console.log(line);
        // var single = turf.lineString(line.geometry.coordinates)
        var mask = turf.polygon(features[0].geometry.coordinates);
        console.log(mask);
        showMask(mask);

        map.setFilter('contours', filter);    // elevation
        var templabel = "<p class='label'>" + lowerElev + '-' + upperElev + "m</p>";

        $("body").append(templabel);
        $(".label").css("top", (e.point.y - 15)).css("left", (e.point.x + 15));

        currentlyHidden = true;

    }

    if (currentlyHidden) {

        if (features.length == 0) {
            currentlyHidden = false;
            console.log("clear mask and satellite");
            map.removeLayer('zmask');
            map.removeSource('mask'); 
            map.setPaintProperty('satellite', 'raster-opacity', 0);

            map.setFilter('contours', null);

            $(".label").remove();
        } else {
            if (features[0].layer.id == 'zmask') {
                currentlyHidden = false;
                console.log("clear mask and satellite");
                map.removeLayer('zmask');
                map.removeSource('mask'); 
                map.setPaintProperty('satellite', 'raster-opacity', 0);

                map.setFilter('contours', null);

                $(".label").remove();
            } 
        }
    }
});


function polyMask(mask, bounds) {
  var bboxPoly = turf.bboxPolygon(bounds);
  var diff = turf.difference(bboxPoly, mask);
  console.log(diff);
  return diff;
}

function showMask(mask) {
    console.log("make a mask");

    map.addSource('mask', {
        "type": "geojson",
        "data": polyMask(mask, bounds)
      });

    map.addLayer({
        "id": "zmask",
        "source": "mask",
        "type": "fill",
        "paint": {
          "fill-color": "#fff",
          'fill-opacity': 0.999
        }
    },'contours');
        
    currentlyHidden = true;
    map.setPaintProperty('satellite', 'raster-opacity', 1);
}


