// initialize map
mapboxgl.accessToken = key;

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
    style: 'mapbox://styles/stephkoltun/cjcapx5je1wql2so4uigw0ovc',
    // set the start point of the map - needs to be long-lat (not lat-long)
    center: startPoints[randomStart],    // this should be a random point
    zoom: 13,
});

// disable map zoom
map.scrollZoom.disable();
map.doubleClickZoom.disable();

var filter;
map.on('load', function () {
    console.log("map is loaded");

    map.addSource("streets", {
        "type": "geojson",
        "data": 'GEOJSON/NYC_streetcenterlines.geojson',
    });
    map.addLayer({
        "id": "streets",
        // "metadata": {
        //     "displaylabel": thisLayer.displaylabel,
        // },
        "type": "line",
        "source": "streets",
        'paint': {
            //"line-color": "#ff66a7",
            "line-width": .8,
            // color lines by angle, using a match expression
            // https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
            'line-color': {
              property: 'minusBearing',
              type: 'interval',
              stops: [
                [0, "#A6BD60"],
                [10, "#e55e5e"],
                [20, "#CFF232"],
                [30, "#3ABEF2"],
                [40, "#FFCF4C"],
                [50, "#CBAFFF"],
                [60, "#84A59D"],
                [70, "#54CEFF"],
                [80, "#9E1299"],
                [90, "#0CF574"],
                [100, "#FF99C5"],
                [110, "#13890D"],
                [120, "#2660A4"],
                [130, "#FF671C"],
                [140, "#4824CC"],
                [150, "#15E6CD"],
                [160, "#02397C"],
                [170, "#F9A7C8"],
                [180, "#2E294E"],
              ],
            }
        }
    });
    // $("#desc").delay(3000).fadeOut(1000);


    var currentlyHidden = false;


    map.on('click', function(e) {
      if (currentlyHidden) {
          currentlyHidden = false;
          map.setFilter('streets', null);

          // $(".label").remove();
      } else {
        var bbox = [[e.point.x - 3, e.point.y - 3], [e.point.x + 3, e.point.y + 3]];
        var features = map.queryRenderedFeatures(bbox);

        if (features.length > 0) {
            //console.log(features[0]);

            var bearing = features[0].properties.minusBearing;
            var upperBearing = bearing + 2;
            var lowerBearing = bearing - 2;

            // filter features from other layers
            filter = [
                "all",
                ["<=", "minusBearing", upperBearing],
                [">=", "minusBearing", lowerBearing],
            ];

            map.setFilter('streets', filter);

            // var templabel = "<p class='label'>" + lowerBearing + '-' + upperBearing + " degrees</p>";
            //
            // $("body").append(templabel);
            // $(".label").css("top", (e.point.y - 15)).css("left", (e.point.x + 15));

            currentlyHidden = true;
        }
      }
    })
});
