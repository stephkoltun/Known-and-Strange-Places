var margin = {top: 100, left: 100, bottom: 100, right: 100};
// var width = $(window).width();

var width =  3771*10;  // num of features * max width * spacing;
var height = $(window).height();

var yScale = d3.scaleLinear()
.domain([0, 1])
.range([0, height]);

var svg = d3.select("#canvas")
.append("svg")
.attr("width", width)
.attr("height", height);

var projection = d3.geoMercator()
// .translate([width/2, height/2])    // translate to center of screen
// .center([-73.859508, 40.856729])  // middle of the bronx
.scale([440000]);          // scale things wayyyy up
var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
.projection(projection);

var consecutiveWidths = [];
var maxWidth = 0;

var xScale;

var clusterSorted = false;
var numClusters = 50;

d3.json('labels50.geojson', function(error, features) {
// d3.json('Bronx-neighborhoods.geojson', function(error, map) {
//  var features = map.features;

  var kSorted = features.slice();
  kSorted.sort(function(a, b){
    // this is the order that was used to generate the features/tsne
    return d3.descending(a.clusters['kmeans'], b.clusters['kmeans']) || d3.ascending(a.properties.area, b.properties.area);
  })

  var gmmSorted = features.slice();
  gmmSorted.sort(function(a, b){
    // this is the order that was used to generate the features/tsne
    return d3.descending(a.clusters['gmm'], b.clusters['gmm']) || d3.ascending(a.properties.area, b.properties.area);
  })

  var agglomSorted = features.slice();
  agglomSorted.sort(function(a, b){
    // this is the order that was used to generate the features/tsne
    return d3.descending(a.clusters['agglom'], b.clusters['agglom']) || d3.ascending(a.properties.area, b.properties.area);
  })

  // var kClust = [];
  // for (var c = 0; c < numClusters; c++) {
  //   var filt = kSorted.filter(function(d) {
  //     return d.clusters.kmeans == c;
  //   });
  //   kClust.push(filt[0]);
  // }
  //
  // var gmmClust = [];
  // for (var c = 0; c < numClusters; c++) {
  //   var filt = gmmSorted.filter(function(d) {
  //     return d.clusters.gmm == c;
  //   });
  //   gmmClust.push(filt[0]);
  // }
  //
  // var agglomClust = [];
  // for (var c = 0; c < numClusters; c++) {
  //   var filt = agglomSorted.filter(function(d) {
  //     return d.clusters.agglom == c;
  //   });
  //   agglomClust.push(filt[0]);
  // }

  xScale = d3.scaleLinear()
  .domain([-1, features.length+1])
  .range([0, width]);


  // figure out the spacing
  // gatherWidths(features);
  // console.log(maxWidth);
  plotRow(kSorted, "kmeans", svg, 1);
  plotRow(gmmSorted, "gmm", svg, 2);
  //plotRow(agglomSorted, "agglom", svg, 3);
  // plotRow(features, "gmm", svg, 2);
  // plotRow(features, "agglom", svg, 3);

  //drawLines();
});

function plotRow(features, _type, canvas, row) {
  var selectString = "path." + _type;
  var classString = _type;

  canvas.selectAll(selectString)
  .data(features)
  .enter()
  .append("path")
  .attr("d",path)
  .attr("class",classString)
  .style("stroke", "none")
  .style("fill", "#d2d2d2")
  .attr("transform",function(d,i) {
    var bounds = (path.bounds(d));
    var centroid = (path.centroid(d));
    var centroidX = centroid[0];
    var centroidY = centroid[1];
    var offsetY = (height/4*row);

    var x0 = xScale(i) - centroidX;
    var y0 = offsetY - centroidY;

    return "translate(" + x0 + "," + y0 + ")";
  })
  .on("click", function(d,i) {
    var kmeansCluster = d.clusters.kmeans;
    var gmmCluster = d.clusters.gmm;
    var agglomCluster = d.clusters.agglom;

    drawLines(kmeansCluster, gmmCluster, agglomCluster)
  });
}

function drawLines(kmeansCluster, gmmCluster, agglomCluster) {

  // d3.selectAll("path.kmeans")
  // .style("fill", "#d2d2d2");

  d3.selectAll("path.kmeans")
  .filter(function(d) {
    return d.clusters.kmeans == kmeansCluster;
  })
  .style("fill", "#5599ff")
  .each(function(d,i) {
    var start = d3.select(this).node().getBoundingClientRect();
    var startID = d.properties.fid;

    var gmmTarget;
    var gmmBlock = d3.selectAll("path.gmm")
    .filter(function(s){
      return s.properties.fid == startID;
    })
    .style("fill", "#5599ff")
    .each(function(s) {
      gmmTarget = d3.select(this).node().getBoundingClientRect();
    })

    var x1 = start.x + start.width/2;
    var x2 =  gmmTarget.x + gmmTarget.width/2;

    svg.append("line")
    .attr("class", "connection")
    .attr("x1", function() {
      return x1
    })
    .attr("y1", start.y+start.height)
    .attr("x2", function() {
      return x2
    })
    .attr("y2", gmmTarget.y)
    .style("stroke", "#0044ff")
    .style("stroke-width", 0.5)
    .style("fill", "none");

    // svg.append("line")
    // .attr("class", "connection")
    // .attr("x1", start.x)
    // .attr("y1", start.y)
    // .attr("x2", agglomTarget.x)
    // .attr("y2", agglomTarget.y)
    // .style("stroke", "#000")
    // .style("fill", "none");
  })
}


var positions = {
  'kmeans': null,
  'gmm': null,
  'agglom': null,
}

function resortByClusters(_cluster, selectedId, selectedCluster, row) {
  var newPosition;

  var pathSelector = "path." + _cluster;
  var clusterSelector = _cluster;

  // RESORT THE KMEANS
  d3.selectAll(pathSelector)
  .sort(function(a, b) {
    return d3.descending(a.clusters[_cluster], b.clusters[_cluster]) || d3.ascending(a.properties.area, b.properties.area);
  })
  .transition()
  .attr("transform",function(s,j) {
    var bounds = (path.bounds(s));
    var centroid = (path.centroid(s));
    var centroidX = centroid[0];
    var centroidY = centroid[1];
    var offsetY = (height/4*row);

    // var x0 = bounds[0][0]*(-1) + consecutiveWidths[i] + spacing*i + margin.right;
    var x0 = xScale(j) - centroidX;
    var y0 = offsetY - centroidY;

    if (s.properties.fid == selectedId) {
      newPosition = xScale(j) - ($(document).width()/2);
      positions[_cluster] = newPosition;
    }
    return "translate(" + x0 + "," + y0 + ")";
  });

  d3.selectAll(pathSelector)
  .style("fill", "#d2d2d2");

  d3.selectAll(pathSelector)
  .filter(function(s) {
    return s.clusters[_cluster] == selectedCluster;
  })
  .style("fill", "#5599ff");

  var block = d3.selectAll(pathSelector)
  .filter(function(s) {
    return s.properties.fid == selectedId;
  })
  .style("fill", "#0044ff");


  //$(canvas).animate({scrollLeft: newPosition.toString()}, 500);
}

function gatherWidths(features) {
  var prevWidth = 0;
  consecutiveWidths = [];
  for (var b = 0; b < features.length; b++) {
    var bounds = (path.bounds(features[b]));
    var x = bounds[1][0] - bounds[0][0];

    if (x > maxWidth) {
      maxWidth = x;
    }
    consecutiveWidths.push(prevWidth);
    prevWidth = prevWidth + x;
  }
}

function colorGroupings(labels, totalClusters) {
  var skip = 2;
  var colorsForGroup = {};
  var colorCounter = 0;

  // make empty colors for each cluster
  for (var i = 0; i < totalClusters; i++) {
    colorsForGroup[i] = null;
  }

  for (var block = 0; block < labels.clusters.length; block+=skip) {
    var groupLabel = labels.clusters[block].label;
    var groupColor = colorsForGroup[groupLabel];
    if (groupColor == null) {
      colorsForGroup[groupLabel] = hexSmall[colorCounter];
      colorCounter++;
      if (colorCounter == totalClusters) {
        break;
      }
    }
  }

  return colorsForGroup;
}
