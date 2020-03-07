$(document).ready(function () {

  $("#desc").delay(5000).fadeOut(1000);

  //var centerPt = [40.857092, -73.866514];
  var centerPt = [40.85800,-73.90185];
  var map = L.map('map', {
    attributionControl: false,
    zoomControl:false
  }).setView(centerPt, 15.5);

  map.dragging.disable();
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();

  var streetLayer = L.geoJSON(streets, {
    style: {
      "color": "#b1b1b1",
      "weight": 2,
      "opacity": 0,
    }
  }).addTo(map);

  var intersectionsLayers = L.geoJSON(inters, {
    style: {
      "color": "#000",
      "weight": 0.5,
      "opacity": 1,
    }
  }).addTo(map);


  var pointsLayer = L.geoJSON(points, {
		style: function (feature) {
			return feature.properties && feature.properties.style;
		},
		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, {
				radius: 2,
				fillColor: "#337788",
				color: "#000",
				weight: 5,
				opacity: 0,
				fillOpacity: 0
			});
		},
    onEachFeature: function (feature, layer) {
        layer.on('mouseover', function () {
          console.log(feature);

          // set buffer around point
          var point = turf.point(feature.geometry.coordinates);
          var buffer = turf.buffer(point, .02, {units: 'kilometers'});

          // show the buffer
          // var bufferLayer = L.geoJSON(buffer, {
          //   style: {
          //     color: '#000',
          //     width: 3,
          //   },
          // }).addTo(map);

          var matchingStreets = [];
          // capture the streets it intersects with
          for (var i = 0; i < streets.features.length; i++) {
            var thisStreet = streets.features[i];
            var line = turf.lineString(thisStreet.geometry.coordinates);
            //console.log(street)
            var cross = turf.booleanCrosses(line, buffer);
            if (cross) {
              matchingStreets.push(thisStreet.properties.st_name);
              //console.log(thisStreet);
            }
          }

          map.removeLayer(streetLayer);
          streetLayer = L.geoJSON(streets, {
            style: {
              color: '#323232',
              weight: 1,
            },
            filter: function(feature) {
              var checkName = feature.properties.st_name
              if (matchingStreets.includes(checkName)) {
                return true
              }
            }
          }).addTo(map);
          pointsLayer.bringToFront();

          // pointsLayer.onEachFeature: (feature) {
          //   var checkName = feature.properties.st_name;
          //   if (matchingStreets.includes(checkName)) {
          //     feature.properties.style.opacity =  1
          //   } else {
          //     feature.properties.style.opacity = 0.3
          //   }
          // }
          //
          // pointsLayer.setStyle(function (feature) {
          //   return feature.properties && feature.properties.style;
          // })
        });
        layer.on('mouseout', function () {
          map.removeLayer(streetLayer);
        });
      }
	}).addTo(map);


  function getVisibility(vis) {
    switch (vis) {
      case 'true':
        return {
          opacity: 1,
        };
      case 'false':
        return {
          opacity: 0,
        };
    }
  }

}); // end of document ready
