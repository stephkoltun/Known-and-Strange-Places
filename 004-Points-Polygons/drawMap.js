// initialize map
mapboxgl.accessToken = key;

var useStyle;
if (mapMode == 'neighborhood') {
    useStyle = 'mapbox://styles/stephkoltun/cjcjp91ec8yio2rnwrpt8lwfh'   // with elev points
} else {
    useStyle = 'mapbox://styles/stephkoltun/cjcapx5je1wql2so4uigw0ovc'  // no elevs
}

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
    style: useStyle,
    // set the start point of the map - needs to be long-lat (not lat-long)
    center: startPoints[randomStart],    // this should be a random point
    zoom: zoomLevel,
});

// disable map zoom
map.scrollZoom.disable();
map.doubleClickZoom.disable();

map.on('load', function () {
    console.log("map is loaded");

    for (var i = 0; i < mapLayers.length; i++) {
        var thisLayer = mapLayers[i];

        map.addSource(thisLayer.dataName, {
            "type": "geojson",
            "data": thisLayer.dataObj,
        });

        if (thisLayer.type == 'circle') {
            // add circle
            map.addLayer({
                "id": thisLayer.layerId,
                "metadata": {
                    "displaylabel": thisLayer.displaylabel,
                },
                "type": "circle",
                "source": thisLayer.dataName,
                'paint': {
                    'circle-radius': 2,
                    'circle-color': thisLayer.color
                }
            });
        } else if (thisLayer.type == 'line') {
            map.addLayer({
                "id": thisLayer.layerId,
                "metadata": {
                    "displaylabel": thisLayer.displaylabel,
                },
                "type": "fill",
                "source": thisLayer.dataName,
                'paint': {
                  "fill-color": 'rgba(255,255,255,0)',
                  "fill-outline-color": thisLayer.color,
                  //"line-width": .8
                }
            });
        }
    };

    var currentlyHidden = false;

    map.on('click', function(e) {
        // set bbox as 5px reactangle area around clicked point
        var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
        var features = map.queryRenderedFeatures(bbox);


        if (features.length > 0 && !currentlyHidden) {
            var isolateLayer = features[0].layer.id;
            console.log("isolate " + isolateLayer);

            // hide all other layers
            for (var i = 0; i < mapLayers.length; i++) {
                if (mapLayers[i].layerId != isolateLayer) {
                    //map.setLayoutProperty(mapLayers[i].layerId, 'visibility', 'none');
                    if (mapLayers[i].type == 'line') {
                      map.setPaintProperty(mapLayers[i].layerId, 'fill-opacity',0.2);
                    } else if (mapLayers[i].type == 'circle') {
                      map.setPaintProperty(mapLayers[i].layerId, 'circle-opacity',0.2);
                    }
                } else {
                    map.setLayoutProperty(mapLayers[i].layerId, 'visibility', 'visible');

                    if (mapLayers[i].type == 'line') {
                      map.setPaintProperty(mapLayers[i].layerId, 'fill-color', mapLayers[i].color)
                    }

                }
            }
            // add text
            console.log(features[0]);
            var templabel;
            if (features[0].layer.id == "elevPoints") {
                templabel = "<p class='label'>Elevation Points</p>";
            } else {
                templabel = "<p class='label'>"+ features[0].layer.metadata.displaylabel + "</p>";
            }

            $("body").append(templabel);
            $(".label").css("top", (e.point.y - 15)).css("left", (e.point.x + 15));

            currentlyHidden = true;

        } else if (features.length == 0 && currentlyHidden) {

            currentlyHidden = false;
            console.log("unhide");

            $(".label").remove();

            for (var i = 0; i < mapLayers.length; i++) {
                map.setLayoutProperty(mapLayers[i].layerId, 'visibility', 'visible');

                if (mapLayers[i].type == 'line') {
                  map.setPaintProperty(mapLayers[i].layerId, 'fill-color', 'rgba(255,255,255,0)');
                  map.setPaintProperty(mapLayers[i].layerId, 'fill-opacity',1);
                } else if (mapLayers[i].type == 'circle') {
                  map.setPaintProperty(mapLayers[i].layerId, 'circle-opacity',1);
                }
            }
        }
    });

});


$(document).keypress(function(e) {
    console.log(e.keyCode);
    if(e.keyCode == 32) {
        changeMap();
    }
});

$("body").on("swipe", function() {
	changeMap();
});

function changeMap() {
  console.log("--- change map");
  // go to next map

  if (mapMode == 'neighborhood') {
      window.location.href = "http://anothersideproject.co/knownandstrange/004/polygonDistribution.html";
  } else if (mapMode == 'polygons') {
      window.location.href = "http://anothersideproject.co/knownandstrange/004/pointDistribution.html";
  } else if (mapMode == 'points') {
      window.location.href = "http://anothersideproject.co/knownandstrange/004/areaCategorization.html";
  } else if (mapMode == 'areas') {
      window.location.href = "http://anothersideproject.co/knownandstrange/004/index.html";
  }
}
