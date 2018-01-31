
var winheight = $(window).height();
var winwidth = $(window).width();
var margin = {top: 100, left: 100, bottom: 100, right: 100};
var width = winwidth - margin.left - margin.right;
var height = 168330 - margin.top - margin.bottom;


//$("#desc").delay(3000).fadeOut(1000);

function createSVG() {
  var svg = d3.select("#blocks")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

  var projection = d3.geoMercator()
  //.translate([width/2, height/2])    // translate to center of screen
  //.center([-73.996243, 40.778375])
  .scale([2000000]);          // scale things wayyyy up

  var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
   .projection(projection);  // tell path generator to use albersUsa projection

  d3.json('Manhattan-Blocks.geojson', function(error, mapData) {
    var features = mapData.features;
    features.sort(function(x, y){
      return d3.descending(x.properties.area, y.properties.area);
    })

    //var maxWidth = 2914.2238;
    // always need to compute this id scale is going to be based on browser
    var consecutiveHeights = [];
    var prevHeight = 0;
    for (var b = 0; b < features.length; b++) {
      var bounds = (path.bounds(features[b]));
      var y = bounds[1][1] - bounds[0][1];
      consecutiveHeights.push(prevHeight);
      prevHeight = prevHeight + y;
    }
    console.log(prevHeight);
    var spacing = 40;

    svg.selectAll("path")
      .data(features)
      .enter()
      .append("path")
      .attr("d",path)
      .style("fill", "none")
      .style("stroke", "#000")
      .style("stroke-width", "2")
      .attr('vector-effect', 'non-scaling-stroke')
      .attr("transform",function(d,i) {
        var bounds = (path.bounds(d));
        var blockWidth = bounds[1][0] - bounds[0][0];
        var center = (width - blockWidth)/2;
        var x0 = bounds[0][0]*(-1) + margin.right + center;
        var y0 = bounds[0][1]*(-1) + consecutiveHeights[i] + spacing*i + margin.top;
        var center = (path.centroid(d));
        return "translate(" + x0 + "," + y0 + ") rotate(-29 " + center[0] + " " + center[1] +")"
      });
  });

};

// var scrollable = d3.select("#scrollable");
//
// d3.select("#down").on('click', function() {
//     var scrollheight = scrollable.property("scrollHeight");
//
//     d3.select("#scrollable").transition().duration(3000)
//       .tween("uniquetweenname", scrollTopTween(scrollheight));
//     });
//
// d3.select("#up").on('click', function() {
//     d3.select("#scrollable").transition().duration(1000)
//     .tween("uniquetweenname", scrollTopTween(0));
//     });
//
// function scrollTopTween(scrollTop) {
// return function() {
//   var i = d3.interpolateNumber(this.scrollTop, scrollTop);
//   return function(t) { this.scrollTop = i(t); };
// };
// }
