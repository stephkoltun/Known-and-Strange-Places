
// initialize map
mapboxgl.accessToken = key;

var startPoints = [
    [-74.007679, 40.674632],
    [-73.903207, 40.608448],
    [-74.008388, 40.684944],
    [-74.150060, 40.607673],
    [-73.859634, 40.677469],
    [-73.864629, 40.722568],
    [-73.963808, 40.632482],
    [-73.917551, 40.765166],
    [-73.950191, 40.805484],
    [-73.906388, 40.820918],
    [-73.898160, 40.853974]
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

var start = Math.floor(Math.random() * Math.floor(startPoints.length));

var map = new mapboxgl.Map({
    container: 'map',
    // satellite imagery styling
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: startPoints[start],
    zoom: 19.5,
    interactive: false
});

map.on('load', function () {
    console.log("map is loaded");

    map.easeTo({
      zoom: 15,
      duration: 320000,
      easing: function (t) {
          return t;
      }
    })
});
