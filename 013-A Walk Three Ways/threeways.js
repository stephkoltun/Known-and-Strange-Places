var width = $(window).width();
var height = $(window).height()/3;

showGraph();
showAerial();
showRoute();

function showGraph() {
    var xScale = d3.scaleLinear()
    .range([0, width])
    .domain([0, pathPoints.features.length]);

    var yScale = d3.scaleLinear()
        .range([0, height])
        .domain([0, 100]);

    // add the graph canvas to the body of the webpage
    var svg = d3.select("#graph").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");

    var pathPointData = pathPoints.features;

    var line1 = d3.line()
        .x(function(d,i) { 
            // should use time as X...
            return xScale(i); 
        })
        .y(function(d) { 
            return yScale(d.properties.elev); // use the 1st index of data (for example, get 20 from [20,13])
        })


    svg.append("svg:path")
        .attr("d", line1(pathPointData))
        .attr("class", "line")
        .style("fill", "none")
        .style("stroke", "#000")
        .style("stroke-width", 1);

    svg.selectAll('.altitude')
        .data(pathPointData)
        .enter().append("circle")
        .attr("class", "altitude")
        .attr("r", .5)
        .attr("cx", function(d,i) {
            return xScale(i)
        })
        .attr("cy", function(d) {
            return yScale(d.properties.elev)
        })
        .style("fill", "#000")
        .on("mouseover", function(d,i) {

            console.log(d);
            console.log(i);
            d3.selectAll(".altitude").attr("r", .5).style("fill", "#000");
            d3.select(this).attr("r", 5).style("fill", "#33ab67");
            var coords = [d.properties.lon,d.properties.lat]
            aerial.panTo(coords);
            route.panTo(coords);

            if (route.getLayer('curPt') != undefined) {
                route.removeLayer('curPt');
                route.removeSource('curPt');
            }

            route.addLayer({
                "id": 'curPt',
                "type": "circle",
                "source": {
                    "type": 'geojson',
                    "data": {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": coords
                        },
                        "properties": {
                        }
                    }
                },
                'paint': {
                    "circle-color": "#33ab67",
                    "circle-radius": 5,
                }
            })
        });
}


// ----- MAPBOX STUFF ------ //
    


var aerial;
var route;

function showRoute() {
    mapboxgl.accessToken = key;
    var startPoint = [ -73.969647, 40.671737 ];
    route = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/stephkoltun/cjcqeyd6n53932smqco6657s3',
        center: startPoint,  
        zoom: 16,  
    });

    route.scrollZoom.disable();
    route.doubleClickZoom.disable();

    route.on('load', function () {
        console.log("route is loaded");

        route.addSource('walkedpath', {
                "type": "geojson",
                "data": pathLines,
            });

        route.addLayer({
            "id": 'walkedpath',
            "type": "line",
            "source": 'walkedpath',
            'paint': {
                "line-color": "#000",
                "line-width": 1.5,
            }
        })

        route.addSource('walkedpoints', {
                "type": "geojson",
                "data": pathPoints,
            });

        route.addLayer({
            "id": 'walkedpoints',
            "type": "circle",
            "source": 'walkedpoints',
            'paint': {
                "circle-color": "#000",
                "circle-radius": .75,
            }
        })

    });
}

function showAerial() {
    mapboxgl.accessToken = key;
    var startPoint = [ -73.969647, 40.671737 ];
    aerial = new mapboxgl.Map({
        container: 'aerial',
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: startPoint,  
        zoom: 18,  
    });

    aerial.scrollZoom.disable();
    aerial.doubleClickZoom.disable();

    aerial.on('load', function () {
        console.log("aerial is loaded");

    });
}
