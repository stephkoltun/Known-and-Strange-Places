
var winheight = $(window).height();
var winwidth = $(window).width();
var margin = {top: 100, left: 250, bottom: 200, right: 200};
var width = $(window).width() - margin.left - margin.right;
var height = $(window).height() - margin.top - margin.bottom;

var neighborhoods = ["Van Nest-Morris Park-Westchester Square", "Co-op City", "Hunts Point", "North Riverdale-Fieldston-Riverdale", "Eastchester-Edenwald-Baychester", "park-cemetery-etc-Bronx", "Mott Haven-Port Morris", "Van Cortlandt Village", "Belmont", "Schuylerville-Throgs Neck-Edgewater Park", "East Tremont", "Spuyten Duyvil-Kingsbridge", "Parkchester", "Woodlawn-Wakefield", "Melrose South-Mott Haven North", "Highbridge", "Soundview-Castle Hill-Clason Point-Harding Park", "University Heights-Morris Heights", "East Concourse-Concourse Village", "Norwood", "Pelham Parkway", "West Concourse", "Claremont-Bathgate", "Allerton-Pelham Gardens", "Bronxdale", "West Farms-Bronx River", "Crotona Park East", "Bedford Park-Fordham North", "Marble Hill-Inwood", "Soundview-Bruckner", "Westchester-Unionport", "Morrisania-Melrose", "Fordham South", "Kingsbridge Heights", "Pelham Bay-Country Club-City Island", "Longwood", "Mount Hope", "Williamsbridge-Olinville", null];

var xScale = d3.scaleLinear()
.domain([0, 1])
.range([0, width]);

var yScale = d3.scaleLinear()
.domain([0, 1])
.range([0, height]);

var svg = d3.select("#blocks")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom);


var projection = d3.geoMercator()
.translate([width/2, height/2])
.center([-73.899508, 40.876729])
.scale([320000]);
var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
.projection(projection);  // tell path generator to use albersUsa projection


// var projectionBronx = d3.geoMercator()
// .translate([width/2, height/2])    // translate to center of screen
// .center([-73.882508, 40.867529])  // middle of the bronx
// .scale([200000]);          // scale things wayyyy up
//
// var pathGeo = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
// .projection(projectionBronx);

d3.json('Bronx-neighborhoods.geojson', function(error, mapData) {

  var features = mapData.features;
  features.sort(function(x, y){
    // this is the order that was used to generate the features/tsne
    return d3.descending(x.properties.area, y.properties.area);
  })

  // for (var f = 0; f < features.length; f++) {
  //   var neigh = features[f].properties.ntaname;
  //   if (neighborhoods.indexOf(neigh) == -1) {
  //     neighborhoods.push(neigh);
  //   }
  // }
  // console.log(neighborhoods);

  //plotGeographically(features);
  plotAsTsne(features);
  addNeighborhoodIndex();
});

var layoutmode = "tsne";
var colormode = "similarity";

var labels = labelsSix;
var tsnedata = tsnedataThirty;

$("#geography").on("click", function() {
  $("#geography").addClass("selected");
  $("#cluster").removeClass("selected");
  locateByGeography();
  $("#perplexityFive").removeClass("selected");
  $("#perplexityEight").removeClass("selected");
  $("#perplexityThirty").removeClass("selected");

  $("#perplexgroup").css('opacity','40%');
});
$("#cluster").on("click", function() {
  $("#geography").removeClass("selected");
  $("#cluster").addClass("selected");
  locateByCluster();
  $("#perplexgroup").css('opacity','100%');
});

$("#neighborhood").on("click", function() {
  $("#neighborhood").addClass("selected");
  $("#similarity").removeClass("selected");
  colorByNeighborhood();
  $("#clustergroup").css('opacity','40%');
});
$("#similarity").on("click", function() {
  $("#neighborhood").removeClass("selected");
  $("#similarity").addClass("selected");
  colorBySimilarity();
  $("#clustergroup").css('opacity','100%');
});

$("#perplexityFive").on("click", function() {
  $("#geography").removeClass("selected");
  $("#cluster").addClass("selected");
  $("#perplexityFive").addClass("selected");
  $("#perplexityEight").removeClass("selected");
  $("#perplexityThirty").removeClass("selected");
  changePerplexity(5);
});
$("#perplexityEight").on("click", function() {

  $("#geography").removeClass("selected");
  $("#cluster").addClass("selected");
  $("#perplexityFive").removeClass("selected");
  $("#perplexityEight").addClass("selected");
  $("#perplexityThirty").removeClass("selected");
  changePerplexity(8);
});
$("#perplexityThirty").on("click", function() {

  $("#geography").removeClass("selected");
  $("#cluster").addClass("selected");
  $("#perplexityFive").removeClass("selected");
  $("#perplexityThirty").addClass("selected");
  $("#perplexityEight").removeClass("selected");
  changePerplexity(30);
});


$("#clusterSix").on("click", function() {
  $("#clusterSix").addClass("selected");
  $("#clusterTen").removeClass("selected");
  $("#clusterTwenty").removeClass("selected");
  $("#clusterFifty").removeClass("selected");
  changeClusterNumber(6);
});
$("#clusterTen").on("click", function() {
  $("#clusterSix").removeClass("selected");
  $("#clusterTen").addClass("selected");
  $("#clusterTwenty").removeClass("selected");
  $("#clusterFifty").removeClass("selected");
  changeClusterNumber(10);
});
$("#clusterTwenty").on("click", function() {
  $("#clusterSix").removeClass("selected");
  $("#clusterTen").removeClass("selected");
  $("#clusterTwenty").addClass("selected");
  $("#clusterFifty").removeClass("selected");
  changeClusterNumber(20)
});
$("#clusterFifty").on("click", function() {
  $("#clusterSix").removeClass("selected");
  $("#clusterTen").removeClass("selected");
  $("#clusterTwenty").removeClass("selected");
  $("#clusterFifty").addClass("selected");
  changeClusterNumber(50)
});

function changePerplexity(num) {
  console.log("change perplexity " + num)
  switch (num) {
    case 5:
      tsnedata = tsnedataFive;
      break;
    case 8:
      tsnedata = tsnedataEight;
      break;
    case 30:
      tsnedata = tsnedataThirty;
      break;
  }
  locateByCluster();

}

function changeClusterNumber(num) {
  console.log("change clusters " + num)
  switch (num) {
    case 6:
      labels = labelsSix;
      break;
    case 10:
      labels = labelsTen;
      break;
    case 20:
      labels = labelsTwenty;
      break;
    case 50:
      labels = labelsFifty;
      break;
  }

  if (colormode == "similarity") {
    colorBySimilarity()
  } else if (colormode == "similarity") {
    colorByNeighborhood()
  }
}

function plotGeographically(features) {
  layoutmode = "tsne";
  svg.selectAll("path.block")
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
}

function plotAsTsne(features) {
  layoutmode = "tsne";
  svg.selectAll("path.block")
  .data(features)
  .enter()
  .append("path")
  .attr("d",path)
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
  .style("fill-opacity", 0.2)
  .style("stroke-opacity", .8)
  .attr('vector-effect', 'non-scaling-stroke')
  .attr("transform",function(d,i) {

    var bounds = (path.bounds(d));
    var blockWidth = bounds[1][0] - bounds[0][0];
    var blockHeight = bounds[1][1] - bounds[0][1];

    var moveToLeft = bounds[0][0]*(-1) + margin.left;
    var moveToTop = bounds[0][1]*(-1) + margin.top;

    // shift for tSNE
    //get the tsne coordinates
    var positionCoords = tsnedata.tsne[i];
    //map them to the window width and height
    var x0 = moveToLeft + xScale(positionCoords.x);
    var y0 = moveToTop + yScale(positionCoords.y);

    return "translate(" + x0 + "," + y0 + ")";
  })
  .on("mousemove", function(d) {
    var match = d.properties.ntaname;

    d3.selectAll('path.block')
    .filter(function(s) {
      return s.properties.ntaname != match
    })
    .transition()
    .duration(150)
    .style('fill-opacity',0.05)
    .style('stroke-opacity',0.05);

    d3.selectAll('path.block')
      .filter(function(s) {
        return s.properties.ntaname == match
      })
      .transition()
      .duration(150)
      .style('fill-opacity',.6)
      .style("stroke-width", 1)
      .style('stroke-opacity',1);

    d3.selectAll('text.neighborhood')
      .filter(function(s) {
        return s != match
      })
      .attr("fill", "#d2d2d2");
  })
  .on("mouseout", function(d) {

    if (layoutmode == "tsne") {
      d3.selectAll('path.block')
      .transition()
      .duration(150)
      .style("stroke-width", 0.5)
      .style("fill-opacity", 0.2)
      .style("stroke-opacity", .8);
    } else if (layoutmode == "geo") {
      d3.selectAll('path.block')
      .transition()
      .duration(150)
      .style('fill-opacity',.6)
      .style("stroke-width", 1)
      .style('stroke-opacity',1);
    }

    d3.selectAll('text.neighborhood')
    .attr("fill", "#000");
  });
}


function colorByNeighborhood() {
  colormode = "neighborhood";
  d3.selectAll("path.block")
  .transition()
  .duration(300)
  .style("stroke", function(d){
    var neigh = d.properties.ntaname;
    var index = neighborhoods.indexOf(neigh);
    var color = hexSmall[index];
    return color;
  })
  .style("fill", function(d){
    var neigh = d.properties.ntaname;
    var index = neighborhoods.indexOf(neigh);
    var color = hexSmall[index];
    return color;
  });
}

function colorBySimilarity() {
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

function locateByCluster() {
  layoutmode = "tsne";
  d3.selectAll("path.block")
  .transition()
  .duration(2300)
  .style("fill-opacity", 0.2)
  .style("stroke-opacity", .8)
  .attr("transform",function(d,i) {

    var bounds = (path.bounds(d));
    var blockWidth = bounds[1][0] - bounds[0][0];
    var blockHeight = bounds[1][1] - bounds[0][1];

    var moveToLeft = bounds[0][0]*(-1) + margin.left;
    var moveToTop = bounds[0][1]*(-1) + margin.top;

    // shift for tSNE
    //get the tsne coordinates
    var positionCoords = tsnedata.tsne[i];
    //map them to the window width and height
    var x0 = moveToLeft + xScale(positionCoords.x);
    var y0 = moveToTop + yScale(positionCoords.y);

    return "translate(" + x0 + "," + y0 + ")";
  });
}

function addNeighborhoodIndex() {
  svg.selectAll("text.neighborhood")
    .data(neighborhoods)
    .enter()
    .append("text")
    .attr("class", "neighborhood")
    .attr("x", 50)
    .attr("y", function(d,i) {
      return 50 + i*18;
    })
    .text(function(d,i) {
      return d;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("fill", "#000");
}
