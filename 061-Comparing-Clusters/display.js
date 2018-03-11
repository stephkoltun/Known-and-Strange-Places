
var winheight = $(window).height();
var winwidth = $(window).width();
var margin = {top: 100, left: 100, bottom: 100, right: 100};
var width = $(window).width()/3;
var height = width;

var neighborhoods = ["Van Nest-Morris Park-Westchester Square", "Co-op City", "Hunts Point", "North Riverdale-Fieldston-Riverdale", "Eastchester-Edenwald-Baychester", "park-cemetery-etc-Bronx", "Mott Haven-Port Morris", "Van Cortlandt Village", "Belmont", "Schuylerville-Throgs Neck-Edgewater Park", "East Tremont", "Spuyten Duyvil-Kingsbridge", "Parkchester", "Woodlawn-Wakefield", "Melrose South-Mott Haven North", "Highbridge", "Soundview-Castle Hill-Clason Point-Harding Park", "University Heights-Morris Heights", "East Concourse-Concourse Village", "Norwood", "Pelham Parkway", "West Concourse", "Claremont-Bathgate", "Allerton-Pelham Gardens", "Bronxdale", "West Farms-Bronx River", "Crotona Park East", "Bedford Park-Fordham North", "Marble Hill-Inwood", "Soundview-Bruckner", "Westchester-Unionport", "Morrisania-Melrose", "Fordham South", "Kingsbridge Heights", "Pelham Bay-Country Club-City Island", "Longwood", "Mount Hope", "Williamsbridge-Olinville", null];

var xScale = d3.scaleLinear()
.domain([0, 1])
.range([0, width]);

var yScale = d3.scaleLinear()
.domain([0, 1])
.range([0, height]);

var svgKmeans = d3.select("#kmeans")
.append("svg")
.attr("width", width)
.attr("height", height);

var svgGmm = d3.select("#gmm")
.append("svg")
.attr("width", width)
.attr("height", height);

var svgAgglom = d3.select("#agglom")
.append("svg")
.attr("width", width)
.attr("height", height);

var svgAffinity = d3.select("#affinity")
.append("svg")
.attr("width", width)
.attr("height", height);

var projectionBronx = d3.geoMercator()
.translate([width/2, height/2])    // translate to center of screen
.center([-73.882508, 40.867529])  // middle of the bronx
.scale([200000]);          // scale things wayyyy up
var pathGeo = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
.projection(projectionBronx);

d3.json('Bronx-neighborhoods.geojson', function(error, mapData) {

  var features = mapData.features;
  features.sort(function(x, y){
    // this is the order that was used to generate the features/tsne
    return d3.descending(x.properties.area, y.properties.area);
  })

  plotGeographically(features, "kmeans");
  plotGeographically(features, "gmm");
  plotGeographically(features, "agglom");
  plotGeographically(features, "affinity");
});


function plotGeographically(features, mode) {

  if (mode == "kmeans") {
    var labels = kmeans;

    var totalClusters = labels.count;

    var colorsForGroup = {};
    var colorCounter = 0;

    // make empty colors for each cluster
    for (var i = 0; i < totalClusters; i++) {
      colorsForGroup[i] = null;
    }

    for (var block = 0; block < labels.clusters.length; block++) {
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

    svgKmeans.selectAll("path.block")
    .data(features)
    .enter()
    .append("path")
    .attr("d",pathGeo)
    .attr("class","block")
    .style("stroke", function(d,i){
      var label = labels.clusters[i].label;
      var color = hexSmall[label];
      return color;
    })
    .style("fill", function(d,i){
      var label = labels.clusters[i].label;
      var color = hexSmall[label];
      return color;
    })
    .style("stroke-width", .5)
    .style("fill-opacity", 0.7)
    .style("stroke-opacity", .7)
    .attr('vector-effect', 'non-scaling-stroke');

    var title = labels.method + ", Clusters: " + labels.count;
    svgKmeans.append("text")
    .text(title)
    .attr("x", function() {
      return margin.left/2;
    })
    .attr("y", function() {
      return margin.top/2;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "#000");
  }

  if (mode == "gmm") {
    var labels = gmm;
    svgGmm.selectAll("path.block")
    .data(features)
    .enter()
    .append("path")
    .attr("d",pathGeo)
    .attr("class","block")
    .style("stroke", function(d,i){
      var label = labels.clusters[i].label;
      var color = hexSmall[label];
      return color;
    })
    .style("fill", function(d,i){
      var label = labels.clusters[i].label;
      var color = hexSmall[label];
      return color;
    })
    .style("stroke-width", .5)
    .style("fill-opacity", 0.7)
    .style("stroke-opacity", .7)
    .attr('vector-effect', 'non-scaling-stroke');

    var title = labels.method + ", Clusters: " + labels.count;
    svgGmm.append("text")
    .text(title)
    .attr("x", function() {
      return margin.left/2;
    })
    .attr("y", function() {
      return margin.top/2;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "#000");
  }

  if (mode == "agglom") {
    var labels = agglom;
    svgAgglom.selectAll("path.block")
    .data(features)
    .enter()
    .append("path")
    .attr("d",pathGeo)
    .attr("class","block")
    .style("stroke", function(d,i){
      var label = labels.clusters[i].label;
      var color = hexSmall[label];
      return color;
    })
    .style("fill", function(d,i){
      var label = labels.clusters[i].label;
      var color = hexSmall[label];
      return color;
    })
    .style("stroke-width", .5)
    .style("fill-opacity", 0.7)
    .style("stroke-opacity", .7)
    .attr('vector-effect', 'non-scaling-stroke');

    var title = labels.method + ", Clusters: " + labels.count;
    svgAgglom.append("text")
    .text(title)
    .attr("x", function() {
      return margin.left/2;
    })
    .attr("y", function() {
      return margin.top/2;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "#000");
  }

  if (mode == "affinity") {
    var labels = affinity;
    svgAffinity.selectAll("path.block")
    .data(features)
    .enter()
    .append("path")
    .attr("d",pathGeo)
    .attr("class","block")
    .style("stroke", function(d,i){
      var label = labels.clusters[i].label;

      var color = hexSmall[label];
      return color;
    })
    .style("fill", function(d,i){
      var label = labels.clusters[i].label;
      var color = hexSmall[label];
      return color;
    })
    .style("stroke-width", .5)
    .style("fill-opacity", 0.7)
    .style("stroke-opacity", .7)
    .attr('vector-effect', 'non-scaling-stroke');

    var title = labels.method + ", Clusters: " + labels.count;
    svgAffinity.append("text")
    .text(title)
    .attr("x", function() {
      return margin.left/2;
    })
    .attr("y", function() {
      return margin.top/2;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "#000");
  }
}


function colorBySimilarity(labels) {
  colormode = "similarity";
  d3.selectAll("path.block")
  .transition()
  .duration(300)
  .style("stroke", function(d,i){
    var label = labels.clusters[i].label;
    var color = hexSmall[label];
    return color;
  })
  .style("fill", function(d,i){
    var label = labels.clusters[i].label;
    var color = hexSmall[label];
    return color;
  });
}

function locateByGeography() {
  layoutmode = "geo";
  d3.selectAll("path.block")
  .transition()
  .duration(2300)
  .style("fill-opacity", 0.7)
  .style("stroke-opacity", .7)
  .attr("transform",function(d,i) {
    return "translate(0,0)";
  });
}


function addNeighborhoodIndex() {
  svg.selectAll("text.neighborhood")
    .data(neighborhoods)
    .enter()
    .append("text")
    .attr("class", "neighborhood")
    .attr("x", function(d,i) {
      return margin.left/2;
    })
    .attr("y", function(d,i) {
      return margin.top*1.5 + i*32;
    })
    .text(function(d,i) {
      return d;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "#000");
}
