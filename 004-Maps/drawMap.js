

// initialize map
mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlcGhrb2x0dW4iLCJhIjoiVXJJT19CQSJ9.kA3ZPQxKKHNngVAoXqtFzA';

var map = new mapboxgl.Map({
    container: 'map',
    // satellite imagery styling
    style: 'mapbox://styles/stephkoltun/cjcapx5je1wql2so4uigw0ovc',
    // set the start point of the map - needs to be long-lat (not lat-long)
    center: [-73.968991, 40.682130],    // this should be a random point
    zoom: zoomLevel,  
});

// disable map zoom when using scroll
map.scrollZoom.disable();

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
                "type": "line",
                "source": thisLayer.dataName,
                'paint': {
                    "line-color": thisLayer.color,
                    "line-width": .8
                }
            });
        }
    };




    var currentlyHidden = false;
    var tempLabel;
    // consider adding debounding function....
    // https://bl.ocks.org/ryanbaumann/0d72890cea4f97e0dbd10ea3cf7189b2

    map.on('mousemove', function(e) {
        // set bbox as 5px reactangle area around clicked point
        var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
        var features = map.queryRenderedFeatures(e.point);


        if (features.length > 0 && !currentlyHidden) {
            var isolateLayer = features[0].layer.id;
            console.log("isolate " + isolateLayer);

            // hide all other layers
            for (var i = 0; i < mapLayers.length; i++) {
                if (mapLayers[i].layerId != isolateLayer) {
                    map.setLayoutProperty(mapLayers[i].layerId, 'visibility', 'none');
                } else {
                    map.setLayoutProperty(mapLayers[i].layerId, 'visibility', 'visible');
                }
            }

            // add text
            tempLabel = $("body").append(features[0].layer.dataName);

            currentlyHidden = true;

        } else if (features.length == 0 && currentlyHidden) {

                currentlyHidden = false;
                console.log("unhide");
                
                for (var i = 0; i < mapLayers.length; i++) {
                    map.setLayoutProperty(mapLayers[i].layerId, 'visibility', 'visible');
                }

        }
    });

});



// map.on('mousemove', function (e) {
//     var features = map.queryRenderedFeatures(e.point);
//     document.getElementById('features').innerHTML = JSON.stringify(features, null, 2);
// });

// map.on("mousemove", function(e) {
//     map.setFilter("state-fills-hover", ["==", "name", e.features[0].properties.name]);
// });

// // Reset the state-fills-hover layer's filter when the mouse leaves the layer.
// map.on("mouseleave", "state-fills", function() {
//     map.setFilter("state-fills-hover", ["==", "name", ""]);
// });

