var margin = {top: 100, left: 100, bottom: 100, right: 100};
// var width = $(window).width();

var width =  3771*50;  // num of features * max width * spacing;
var height = $(window).height()/3;

var yScale = d3.scaleLinear()
.domain([0, 1])
.range([0, height]);

var svgKmeans = d3.select("#kmeans")
.append("svg")
.attr("width", width)
.attr("height", height);

var svgGMM = d3.select("#gmm")
.append("svg")
.attr("width", width)
.attr("height", height);

var svgAgglom = d3.select("#agglom")
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

d3.json('labels50.geojson', function(error, features) {
// d3.json('Bronx-neighborhoods.geojson', function(error, map) {
//  var features = map.features;

  features.sort(function(x, y){
    // this is the order that was used to generate the features/tsne
    return d3.descending(x.properties.area, y.properties.area);
  })

  // for (var i = 0; i < features.length; i++) {
  //   features[i].clusters = {};
  //   features[i].clusters["gmm"] = gmm.clusters[i].label;
  //   features[i].clusters["kmeans"] = kmeans.clusters[i].label;
  //   features[i].clusters["agglom"] = agglom.clusters[i].label;
  // }
  //
  // function download(content, fileName, contentType) {
  //     var a = document.createElement("a");
  //     var file = new Blob([content], {type: contentType});
  //     a.href = URL.createObjectURL(file);
  //     a.download = fileName;
  //     a.click();
  // }
  // download(JSON.stringify(features), 'labels50.geojson', 'application/json');

  xScale = d3.scaleLinear()
  .domain([0, features.length+3])
  .range([0, width]);

  // figure out the spacing
  gatherWidths(features);
  console.log(maxWidth);
  plotRow(features, "kmeans", svgKmeans, 1);
  plotRow(features, "gmm", svgGMM, 1);
  plotRow(features, "agglom", svgAgglom, 1);
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
    var offsetY = (height/2*row);

    var x0 = xScale(i) - centroidX;
    var y0 = offsetY - centroidY;

    return "translate(" + x0 + "," + y0 + ")";
  })
  .on("click", function(d,i) {
    var selectedId = d.properties.fid;
    var kmeansCluster = d.clusters.kmeans;
    var gmmCluster = d.clusters.gmm;
    var agglomCluster = d.clusters.agglom;

    resortByClusters("kmeans", selectedId, kmeansCluster, 1)
    resortByClusters("gmm", selectedId, gmmCluster, 1)
    resortByClusters("agglom", selectedId, agglomCluster, 1)
  });
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
  var canvas = "#" + _cluster;

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
    var offsetY = (height/2*row);

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


  $(canvas).animate({scrollLeft: newPosition.toString()}, 500);

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
