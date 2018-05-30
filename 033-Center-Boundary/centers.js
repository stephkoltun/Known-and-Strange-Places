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
    style: 'mapbox://styles/stephkoltun/cjdja89kwj1f02trlhkgj03hg', // centroids and footprints
    //style: 'mapbox://styles/stephkoltun/cjc97oyqh0jmq2sp7yydxkggr', // satelitte test
    //center: [-73.107, 40.625],    // this should be a random point
    center: [-73.968,40.677],
    zoom: 16,
});

// disable map zoom
map.scrollZoom.disable();
map.doubleClickZoom.disable();

map.on('load', function() {
  map.setPaintProperty('background', 'background-color', "#fff");
  map.setPaintProperty('footprints', 'fill-opacity', 0);
  map.setPaintProperty('centroids', 'circle-opacity', 1);
  map.setPaintProperty('footprints', 'fill-color', "#fff");
  map.setPaintProperty('centroids', 'circle-color', "#000");
})

var currentlyShown = false;

map.on('mousemove', function(e) {
    //set bbox as rectangle area around clicked point
    var bbox = [[e.point.x - 3, e.point.y - 3], [e.point.x + 3, e.point.y + 3]];
    var features = map.queryRenderedFeatures(bbox, "footprints");

    if (!currentlyShown && features.length > 0) {
      map.setPaintProperty('footprints', 'fill-opacity', 1);
      map.setPaintProperty('centroids', 'circle-opacity', 0);
      map.setPaintProperty('background', 'background-color', "#000");
      currentlyShown = true;
    }

    if (currentlyShown && features.length == 0) {
      map.setPaintProperty('footprints', 'fill-opacity', 0);
      map.setPaintProperty('centroids', 'circle-opacity', 1);
      map.setPaintProperty('background', 'background-color', "#fff");
      currentlyShown = false;
    }

});
