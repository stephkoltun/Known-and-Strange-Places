// initialize map
mapboxgl.accessToken = key;

var useStyle ='mapbox://styles/stephkoltun/cjcapx5je1wql2so4uigw0ovc';    // all white
//var useStyle = 'mapbox://styles/stephkoltun/cjcw3515z0nju2spkfl9yhvf4'  // incl contour lines
//var useStyle = 'mapbox://styles/mapbox/streets-v9';

var map = new mapboxgl.Map({
    container: 'map',
    style: useStyle,
    //center: [-73.927284, 40.820219],
    center: [-73.824150843246443, 40.759726946136112],
    zoom: 14.5,
    maxBounds:  [
      [-73.860420, 40.729782], // Northeast coordinates
      [-73.794416, 40.781763] // Southwest coordinates
    ]
});

// disable map zoom
//map.scrollZoom.disable();
map.doubleClickZoom.disable();

var showText = true;
$(document).keydown(function(e) {
  if ( e.which == 84 ) {
   showText = !showText;
  }
})

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
        //"data": 'polygons-elev.geojson'
        "data": 'DEM_Merged_Discrete_Polygonized.geojson'
    });

    map.addLayer({
        "id": 'contours',
        "type": "fill",
        "source": 'contours',
        //"source-layer": "original",
        'paint': {
            //'line-width': 0.5,
            'fill-outline-color': "#c6c6c6",
            'fill-color': "#fff"
            // 'circle-radius': thisLayer.size,
            // 'circle-color': thisLayer.color
        }
    });
});

function sourceCallback() {
    // assuming 'map' is defined globally, or you can use 'this'
    if (map.getSource('contours') && map.isSourceLoaded('contours')) {
        console.log('source loaded!');
    }
}
map.on('sourcedata', sourceCallback);


var currentlyHidden = false;

map.on('click', function(e) {
    // set bbox as 5px reactangle area around clicked point
    var bbox = [[e.point.x - 3, e.point.y - 3], [e.point.x + 3, e.point.y + 3]];
    var features = map.queryRenderedFeatures(bbox);

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


        var mask = turf.multiPolygon(features[0].geometry.coordinates);
        console.log(mask);
        var maskCreated = showMask(mask);

        if (maskCreated) {
          map.setFilter('contours', filter);    // elevation

          if (showText) {
            var templabel = "<p class='label'>" + lowerElev + '-' + upperElev + "m</p>";

            $("body").append(templabel);
            $(".label").css("top", (e.point.y - 15)).css("left", (e.point.x + 15));
          }

          currentlyHidden = true;
        } else {
          // do nothing
          currentlyHidden = false;
        }

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


function polyMask(mask) {
  console.log("poly mask");

  var line = turf.lineString([[-73.794416, 40.781763], [-73.860420, 40.729782]]);
  console.log(line);
  var bbox = turf.bbox(line);
  var bboxPoly = turf.bboxPolygon(bbox);

  try {
    var diff = turf.difference(bboxPoly, mask);
    console.log(diff);
    return diff;
  }
  catch (err) {
    return null
  }
}

function showMask(mask) {
    console.log("make a mask");

    if (map.getLayer('zmask') != undefined) {
        map.removeLayer('zmask');
        map.removeSource('mask');
        map.setPaintProperty('satellite', 'raster-opacity', 0);
        map.setFilter('contours', null);
    }

    var maskData = polyMask(mask);
    console.log(maskData);

    if (maskData != null) {
      map.addSource('mask', {
          "type": "geojson",
          "data": maskData
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
      return true
    } else {
      return false
    }

}
