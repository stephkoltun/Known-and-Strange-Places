// http://wavesurfer-js.org/docs/
var height = $(window).height()/3;
//var width = $(window).width()*4+$(window).width()/2;
var width = $(window).width();

var audiotrack;

function preload(){
  audiotrack = loadSound('audio/walk.m4a');
}
function setup() {
  var audiowidth = $(window).width();
  var audioheight = $(window).height()/3;
  var cnv = createCanvas(audiowidth, audioheight);
  cnv.parent("audio");  // set parent of canvas
  var wave = audiotrack.getPeaks(audiowidth/2);
  audiotrack.play();

  background(255,255,255);

  noFill();
  beginShape();
    stroke('#F06449');
    strokeWeight(1);
    for (var i = 0; i < wave.length; i++){
      var x = map(i, 0, wave.length, 0, width);
      var y = map( wave[i], -1, 1, 0, height);
      vertex(x,y);
    }
  endShape();
}
function draw() {
  if (audiotrack.isPlaying() == true) {
    var curTime = audiotrack.currentTime();
    var duration = audiotrack.duration();
    var position = map(curTime, 0, duration, 0, width);
    $("#playhead").css("left",position);
  }


}

var svg;
var line1;
var xScale;
showGraph();
showRoute();

function showGraph() {
    xScale = d3.scaleLinear()
    .range([0, width])
    .domain([1, 594]);

    var yScale = d3.scaleLinear()
        .range([0, height])
        .domain([0, 100]);

    // add the graph canvas to the body of the webpage
    svg = d3.select("#elevation").append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");

    line1 = d3.line()
        .x(function(d,i) {
            // should use time as X...
            return xScale(d.properties.id);
        })
        .y(function(d) {
            // elevation of point
            return yScale(d.properties.elev);
        })

      svg.append("svg:path")
          .attr("d", line1(pathPointsFuzzy.features))
          .attr("class", "line")
          .style("fill", "none")
          .style("stroke", "#5BC3EB")
          .style("stroke-width", 1.5);
}


function showRoute() {

    mapboxgl.accessToken = key;
    var lonStart = -73.968724;
    var latStart = 40.773138;
    var startPoint = [ lonStart, latStart ];
    route = new mapboxgl.Map({
        container: 'path',
        style: 'mapbox://styles/stephkoltun/cjcapx5je1wql2so4uigw0ovc',
        //style: 'mapbox://styles/stephkoltun/cjcqeyd6n53932smqco6657s3',
        center: startPoint,
        minZoom: 14.62,
        maxZoom: 16,
        attributionControl: false,
        //bearing: 208.5,//28.5
    })
    .addControl(new mapboxgl.AttributionControl({
        compact: true
    }))
    .fitBounds([[-73.992370,40.772130], [-73.941988,40.777883]])
    .setBearing(208.5);

    route.scrollZoom.disable();
    route.doubleClickZoom.disable();

    route.on('load', function () {
        console.log("route is loaded");

        route.addSource('streets', {
                "type": "geojson",
                "data": streets,
            });

        route.addLayer({
            "id": 'streets',
            "type": "line",
            "source": 'streets',
            'paint': {
                "line-color": '#d2d2d2',
                "line-width": 0.75,
            }
        });

        route.addSource('walkedpath', {
                "type": "geojson",
                "data": pathLines,
            });

        route.addLayer({
            "id": 'walkedpath',
            "type": "line",
            "source": 'walkedpath',
            'paint': {
                "line-color": '#3AB795',
                "line-width": 1,
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
                "circle-color": '#3AB795',
                "circle-radius": 2.5,
            }
        })

    });
}

route.scrollZoom.disable();
route.doubleClickZoom.disable();

route.on('click', function(e) {
  console.log("click");
    var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
    var features = route.queryRenderedFeatures(bbox, {layers: ['walkedpoints']});
    //console.log(features);

    if (features.length > 0) {
      var progress = features[0].properties.id/594; // 609 total points

      //console.log(pro)
      //move song position head

      // waveWalk.seekTo(progress);
      var songlength = 6018;
      var start = 6018*progress;
      var duration = 5;
      // var end = start + 5;
      var playheadPosition = width*progress;
      audiotrack.jump(start);
      //$("#audiocursor").css("left",playheadPosition);
      // waveWalk.play(start,end);

    }
})
