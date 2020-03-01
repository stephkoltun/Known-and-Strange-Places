
var winheight = $(window).height();
var winwidth = $(window).width();
var margin = {top: 100, left: 100, bottom: 100, right: 100};
var width = winwidth - margin.left - margin.right;
var height = 178330 - margin.top - margin.bottom;


var path;
var projection;
var consecutiveHeights = [];
var spacing = 40;

function createSVG() {
  var svg = d3.select("#blocks")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  projection = d3.geoMercator()
  //.translate([width/2, height/2])    // translate to center of screen
  //.center([-73.996243, 40.778375])
  .scale([2000000]);          // scale things wayyyy up

  path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
   .projection(projection);  // tell path generator to use albersUsa projection

  d3.json('Manhattan-Blocks.geojson', function(error, mapData) {
    var features = mapData.features;
    features.sort(function(x, y){
      return d3.descending(x.properties.area, y.properties.area);
    })

    //var maxWidth = 2914.2238;
    // always need to compute this id scale is going to be based on browser
    var prevHeight = 0;
    for (var b = 0; b < features.length; b++) {
      var bounds = (path.bounds(features[b]));
      var y = bounds[1][1] - bounds[0][1];
      consecutiveHeights.push(prevHeight);
      prevHeight = prevHeight + y;
    }
    console.log(prevHeight);

    svg.selectAll("path.block")
      .data(features)
      .enter()
      .append("path")
      .attr("d",path)
      .attr("class","block")
      .style("fill", "none")
      .style("stroke", "#000")
      .style("stroke-width", "2")
      .style("opacity", 1)
      .attr('vector-effect', 'non-scaling-stroke')
      .attr("transform",function(d,i) {
        var bounds = (path.bounds(d));
        var blockWidth = bounds[1][0] - bounds[0][0];
        var blockHeight = bounds[1][1] - bounds[0][1];
        var center = (width - blockWidth)/2;
        var centroid = (path.centroid(d));
        var centroidX = centroid[0];
        var centroidY = centroid[1];

        var desireY = (winheight-margin.top-margin.bottom)/2;

        var y0 = desireY-centroidY + margin.top;
        var x0 = bounds[0][0]*(-1) + margin.right + center;
        return "translate(" + x0 + "," + y0 + ") rotate(-29 " + centroidX + " " + centroidY +")"
      });
  });
};


var expand = setInterval(function() {
  d3.selectAll(".block")
  .transition()
  .duration(2000)
  .style("fill", "#000")
  .attr("transform",function(d,i) {
    var bounds = (path.bounds(d));
    var blockWidth = bounds[1][0] - bounds[0][0];
    var blockHeight = bounds[1][1] - bounds[0][1];
    var center = (width - blockWidth)/2;
    var centroid = (path.centroid(d));
    var centroidX = centroid[0];
    var centroidY = centroid[1];

    var x0 = bounds[0][0]*(-1) + margin.right + center;
    var y0 = bounds[0][1]*(-1) + consecutiveHeights[i] + spacing*i + margin.top;
    return "translate(" + x0 + "," + y0 + ") rotate(-29 " + centroidX + " " + centroidY +")"
  });

  var pos = 0;
  var increment = 1;

  var randomStart = Math.random() * document.body.getBoundingClientRect().height;

  d3.transition()
  .duration(200)
  .tween("scroll",scrollTo(0,randomStart))
  pos = randomStart

  d3.transition()
  .delay(800)
  .duration(document.body.getBoundingClientRect().height)
  .tween("scroll", scrollTween(document.body.getBoundingClientRect().height - window.innerHeight));

  function scrollTween(offset) {
    return function() {
      // var i = d3.interpolateNumber(window.pageYOffset || document.documentElement.scrollTop, offset);
      // return function(t) { scrollTo(0, i(t)); };
      return function(t) {
        pos += increment;
        if (pos < 0) {
          pos = 0;
        } else if (pos > $(window).height) {
          pos = $(window).height;
        }

        scrollTo(0, pos);
      };
    };
  }

  $(document).mousemove(function(e) {
    var maxSpeed = 40;
    var mapMouse = d3.scaleLinear()
      .domain([0, $(window).height()]) // input
      .range([(-1*maxSpeed), maxSpeed]);  // output
    increment = mapMouse(e.clientY);
  })

  clearInterval(expand);
}, 7000);
