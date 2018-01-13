
// initialize map
mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlcGhrb2x0dW4iLCJhIjoiVXJJT19CQSJ9.kA3ZPQxKKHNngVAoXqtFzA';

var map = new mapboxgl.Map({
    container: 'map',
    // satellite imagery styling
    style: 'mapbox://styles/stephkoltun/cjcapx5je1wql2so4uigw0ovc',
    // set the start point of the map - needs to be long-lat (not lat-long)
    center: [-73.9926559, 40.7159975],    // this should be a random point
    zoom: 17,   // 2500
    interactive: false,
});



map.on('load', function () {
    console.log("map is loaded");

    // use the mask for both boundary and mask
    map.addSource('catch-basin', {
        "type": "geojson",
        "data": 'localhost:8001/GEOJSON/neighborhood-2500/NYCOD_catch-basins.geojson'
    });

    // add boundary
    map.addLayer({
        "id": 'catchBasins',
        "type": "circle",
        "source": 'catch-basin',
        'paint': {
            'circle-radius': 10,
            'circle-color': '#ff12ee'
        }
    });


    // map.addLayer({
    //     "id": 'catchBasins',
    //     "type": "line",
    //     "source": 'catch-basin',
    //     "paint": {
    //         "line-color": colors[i],
    //         "line-width": 0.5
    //     },
    // });

});

