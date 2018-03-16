var margin = {top: 200, left: 200, bottom: 100, right: 100};
var width = $(window).width()/2;
var height = $(window).height()/2;

var widthLarge = $(window).width();
var heightLarge = $(window).height();

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

var svgLarge = d3.select("#large")
.append("svg")
.attr("width", widthLarge)
.attr("height", heightLarge);

var projectionBronx = d3.geoMercator()
.translate([width/2, height/2])    // translate to center of screen
.center([-73.859508, 40.856729])  // middle of the bronx
.scale([140000]);          // scale things wayyyy up
var pathGeo = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
.projection(projectionBronx);

var projectionLarge = d3.geoMercator()
.translate([widthLarge/2, heightLarge/2])    // translate to center of screen
.center([-73.859508, 40.856729])  // middle of the bronx
.scale([350000]);          // scale things wayyyy up
var pathLarge = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
.projection(projectionLarge);



d3.json('Bronx-neighborhoods.geojson', function(error, mapData) {

  var features = mapData.features;
  features.sort(function(x, y){
    // this is the order that was used to generate the features/tsne
    return d3.descending(x.properties.area, y.properties.area);
  })

  for (var i = 0; i < features.length; i++) {
    features[i].clusters = {};
    features[i].clusters["gmm"] = gmm.clusters[i].label;
    features[i].clusters["kmeans"] = kmeans.clusters[i].label;
    features[i].clusters["agglom"] = agglom.clusters[i].label;
    features[i].clusters["affinity"] = affinity.clusters[i].label;
  }

  console.log(features[10]);

  plotGeographically(features, "kmeans");
  plotGeographically(features, "gmm");
  plotGeographically(features, "agglom");
  plotGeographically(features, "affinity");
  plotGeographically(features, "large");
});

var kmeansColors = colorGroupings(kmeans, kmeans.count);
var gmmColors = colorGroupings(gmm, gmm.count);
var agglomColors = colorGroupings(agglom, agglom.count);
var affinityColors = colorGroupings(affinity, affinity.count);


function plotGeographically(features, mode) {
  if (mode == "kmeans") {
    var labels = kmeans;

    svgKmeans.selectAll("path.kmeans")
    .data(features)
    .enter()
    .append("path")
    .attr("d",pathGeo)
    .attr("class","kmeans")
    .style("stroke", "none")
    .style("fill", function(d,i){
      var label = labels.clusters[i].label;
      var color = kmeansColors[label];
      return color;
    })
    .style("fill-opacity", 0.7)
    .on("mousedown", function(d,i) {
      var randomNum = Math.floor(Math.random()*hexSmall.length);
      var randomColor = hexSmall[randomNum];

      var gmm = d.clusters.gmm;
      var kmeans = d.clusters.kmeans;
      var agglom = d.clusters.agglom;
      var affinity = d.clusters.affinity;

      gmmColors[gmm] = randomColor;
      kmeansColors[kmeans] = randomColor;
      agglomColors[agglom] = randomColor;
      affinityColors[affinity] = randomColor;

      d3.selectAll('path.gmm')
      .filter(function(s) {
        return s.clusters.gmm != gmm
      })
      .transition()
      .duration(150)
      .style('fill-opacity',0.05);

      d3.selectAll('path.gmm')
      .filter(function(s) {
        return s.clusters.gmm == gmm
      })
      .transition()
      .duration(150)
      .style("fill", randomColor);

      d3.selectAll('path.kmeans')
      .filter(function(s) {
        return s.clusters.kmeans != kmeans
      })
      .transition()
      .duration(150)
      .style('fill-opacity',0.05);

      d3.selectAll('path.kmeans')
      .filter(function(s) {
        return s.clusters.kmeans == kmeans
      })
      .transition()
      .duration(150)
      .style("fill", randomColor);

      d3.selectAll('path.agglom')
      .filter(function(s) {
        return s.clusters.agglom != agglom
      })
      .transition()
      .duration(150)
      .style('fill-opacity',0.05);

      d3.selectAll('path.agglom')
      .filter(function(s) {
        return s.clusters.agglom == agglom
      })
      .transition()
      .duration(150)
      .style("fill", randomColor);

      d3.selectAll('path.affinity')
      .filter(function(s) {
        return s.clusters.affinity != affinity
      })
      .transition()
      .duration(150)
      .style('fill-opacity',0.05);

      d3.selectAll('path.affinity')
      .filter(function(s) {
        return s.clusters.affinity == affinity
      })
      .transition()
      .duration(150)
      .style("fill", randomColor);
    })
    .on("mouseup", function(d,i) {
      var gmm = d.clusters.gmm;
      var kmeans = d.clusters.kmeans;
      var agglom = d.clusters.agglom;
      var affinity = d.clusters.affinity;

      d3.selectAll('path.gmm')
      .transition()
      .duration(150)
      .style('fill-opacity',.7);

      d3.selectAll('path.kmeans')
      .transition()
      .duration(150)
      .style('fill-opacity',.7);

      d3.selectAll('path.agglom')
      .transition()
      .duration(150)
      .style('fill-opacity',.7);

      d3.selectAll('path.affinity')
      .transition()
      .duration(150)
      .style('fill-opacity',.7);
    });


    svgKmeans.append("text")
    .text("K-Means")
    .attr("x", 50)
    .attr("y", 50)
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("font-weight", 700)
    .attr("fill", "#000");

    var title = "Clusters: " + labels.count;
    svgKmeans.append("text")
    .text(title)
    .attr("x", 50)
    .attr("y", 70)
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("font-weight", 400)
    .attr("fill", "#000");

    svgKmeans.append("text")
    .text("Zernike Moments")
    .attr("x", 50)
    .attr("y", 90)
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("font-weight", 400)
    .attr("fill", "#000");
  }

  if (mode == "gmm") {
    var labels = gmm;

    svgGmm.selectAll("path.gmm")
    .data(features)
    .enter()
    .append("path")
    .attr("d",pathGeo)
    .attr("class","gmm")
    .style("stroke", "none")
    .style("fill", function(d,i){
      var label = labels.clusters[i].label;
      var color = gmmColors[label];
      return color;
    })
    .style("fill-opacity", 0.7)
    .on("mousedown", function(d,i) {
      var randomNum = Math.floor(Math.random()*hexSmall.length);
      var randomColor = hexSmall[randomNum];

      var gmm = d.clusters.gmm;
      var kmeans = d.clusters.kmeans;
      var agglom = d.clusters.agglom;
      var affinity = d.clusters.affinity;

      gmmColors[gmm] = randomColor;
      kmeansColors[kmeans] = randomColor;
      agglomColors[agglom] = randomColor;
      affinityColors[affinity] = randomColor;

      d3.selectAll('path.gmm')
      .filter(function(s) {
        return s.clusters.gmm != gmm
      })
      .transition()
      .duration(150)
      .style('fill-opacity',0.05);

      d3.selectAll('path.gmm')
      .filter(function(s) {
        return s.clusters.gmm == gmm
      })
      .transition()
      .duration(150)
      .style("fill", randomColor);

      d3.selectAll('path.kmeans')
      .filter(function(s) {
        return s.clusters.kmeans != kmeans
      })
      .transition()
      .duration(150)
      .style('fill-opacity',0.05);

      d3.selectAll('path.kmeans')
      .filter(function(s) {
        return s.clusters.kmeans == kmeans
      })
      .transition()
      .duration(150)
      .style("fill", randomColor);

      d3.selectAll('path.agglom')
      .filter(function(s) {
        return s.clusters.agglom != agglom
      })
      .transition()
      .duration(150)
      .style('fill-opacity',0.05);

      d3.selectAll('path.agglom')
      .filter(function(s) {
        return s.clusters.agglom == agglom
      })
      .transition()
      .duration(150)
      .style("fill", randomColor);

      d3.selectAll('path.affinity')
      .filter(function(s) {
        return s.clusters.affinity != affinity
      })
      .transition()
      .duration(150)
      .style('fill-opacity',0.05);

      d3.selectAll('path.affinity')
      .filter(function(s) {
        return s.clusters.affinity == affinity
      })
      .transition()
      .duration(150)
      .style("fill", randomColor);
    })
    .on("mouseup", function(d,i) {
      var gmm = d.clusters.gmm;
      var kmeans = d.clusters.kmeans;
      var agglom = d.clusters.agglom;
      var affinity = d.clusters.affinity;

      d3.selectAll('path.gmm')
      .transition()
      .duration(150)
      .style('fill-opacity',.7);

      d3.selectAll('path.kmeans')
      .transition()
      .duration(150)
      .style('fill-opacity',.7);

      d3.selectAll('path.agglom')
      .transition()
      .duration(150)
      .style('fill-opacity',.7);

      d3.selectAll('path.affinity')
      .transition()
      .duration(150)
      .style('fill-opacity',.7);
    });


    svgGmm.append("text")
    .text("Gaussian Mixture Method")
    .attr("x", 50)
    .attr("y", 50)
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("font-weight", 700)
    .attr("fill", "#000");

    var title = "Clusters: " + labels.count;
    svgGmm.append("text")
    .text(title)
    .attr("x", 50)
    .attr("y", 70)
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("font-weight", 400)
    .attr("fill", "#000");

    svgGmm.append("text")
    .text("Zernike Moments")
    .attr("x", 50)
    .attr("y", 90)
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("font-weight", 400)
    .attr("fill", "#000");
  }

  if (mode == "agglom") {
    var labels = agglom;

    svgAgglom.selectAll("path.agglom")
    .data(features)
    .enter()
    .append("path")
    .attr("d",pathGeo)
    .attr("class","agglom")
    .style("stroke", "none")
    .style("fill", function(d,i){
      var label = labels.clusters[i].label;
      var color = agglomColors[label];
      return color;
    })
    .style("fill-opacity", 0.7)
    .on("mousedown", function(d,i) {
      var randomNum = Math.floor(Math.random()*hexSmall.length);
      var randomColor = hexSmall[randomNum];

      var gmm = d.clusters.gmm;
      var kmeans = d.clusters.kmeans;
      var agglom = d.clusters.agglom;
      var affinity = d.clusters.affinity;

      gmmColors[gmm] = randomColor;
      kmeansColors[kmeans] = randomColor;
      agglomColors[agglom] = randomColor;
      affinityColors[affinity] = randomColor;

      d3.selectAll('path.gmm')
      .filter(function(s) {
        return s.clusters.gmm != gmm
      })
      .transition()
      .duration(150)
      .style('fill-opacity',0.05);

      d3.selectAll('path.gmm')
      .filter(function(s) {
        return s.clusters.gmm == gmm
      })
      .transition()
      .duration(150)
      .style("fill", randomColor);

      d3.selectAll('path.kmeans')
      .filter(function(s) {
        return s.clusters.kmeans != kmeans
      })
      .transition()
      .duration(150)
      .style('fill-opacity',0.05);

      d3.selectAll('path.kmeans')
      .filter(function(s) {
        return s.clusters.kmeans == kmeans
      })
      .transition()
      .duration(150)
      .style("fill", randomColor);

      d3.selectAll('path.agglom')
      .filter(function(s) {
        return s.clusters.agglom != agglom
      })
      .transition()
      .duration(150)
      .style('fill-opacity',0.05);

      d3.selectAll('path.agglom')
      .filter(function(s) {
        return s.clusters.agglom == agglom
      })
      .transition()
      .duration(150)
      .style("fill", randomColor);

      d3.selectAll('path.affinity')
      .filter(function(s) {
        return s.clusters.affinity != affinity
      })
      .transition()
      .duration(150)
      .style('fill-opacity',0.05);

      d3.selectAll('path.affinity')
      .filter(function(s) {
        return s.clusters.affinity == affinity
      })
      .transition()
      .duration(150)
      .style("fill", randomColor);
    })
    .on("mouseup", function(d,i) {
      var gmm = d.clusters.gmm;
      var kmeans = d.clusters.kmeans;
      var agglom = d.clusters.agglom;
      var affinity = d.clusters.affinity;

      d3.selectAll('path.gmm')
      .transition()
      .duration(150)
      .style('fill-opacity',.7);

      d3.selectAll('path.kmeans')
      .transition()
      .duration(150)
      .style('fill-opacity',.7);

      d3.selectAll('path.agglom')
      .transition()
      .duration(150)
      .style('fill-opacity',.7);

      d3.selectAll('path.affinity')
      .transition()
      .duration(150)
      .style('fill-opacity',.7);
    });

    svgAgglom.append("text")
    .text("Ward Agglomerative Clustering")
    .attr("x", 50)
    .attr("y", 50)
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("font-weight", 700)
    .attr("fill", "#000");

    var title = "Clusters: " + labels.count;
    svgAgglom.append("text")
    .text(title)
    .attr("x", 50)
    .attr("y", 70)
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("font-weight", 400)
    .attr("fill", "#000");

    svgAgglom.append("text")
    .text("Zernike Moments")
    .attr("x", 50)
    .attr("y", 90)
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("font-weight", 400)
    .attr("fill", "#000");
  }

  if (mode == "affinity") {
    var labels = affinity;

    svgAffinity.selectAll("path.affinity")
    .data(features)
    .enter()
    .append("path")
    .attr("d",pathGeo)
    .attr("class","affinity")
    .style("stroke", "none")
    .style("fill", function(d,i){
      var label = labels.clusters[i].label;
      var color = affinityColors[label];
      return color;
    })
    .style("fill-opacity", 0.7)
    .on("mousedown", function(d,i) {
      var randomNum = Math.floor(Math.random()*hexSmall.length);
      var randomColor = hexSmall[randomNum];

      var gmm = d.clusters.gmm;
      var kmeans = d.clusters.kmeans;
      var agglom = d.clusters.agglom;
      var affinity = d.clusters.affinity;

      gmmColors[gmm] = randomColor;
      kmeansColors[kmeans] = randomColor;
      agglomColors[agglom] = randomColor;
      affinityColors[affinity] = randomColor;

      d3.selectAll('path.gmm')
      .filter(function(s) {
        return s.clusters.gmm != gmm
      })
      .transition()
      .duration(150)
      .style('fill-opacity',0.05);

      d3.selectAll('path.gmm')
      .filter(function(s) {
        return s.clusters.gmm == gmm
      })
      .transition()
      .duration(150)
      .style("fill", randomColor);

      d3.selectAll('path.kmeans')
      .filter(function(s) {
        return s.clusters.kmeans != kmeans
      })
      .transition()
      .duration(150)
      .style('fill-opacity',0.05);

      d3.selectAll('path.kmeans')
      .filter(function(s) {
        return s.clusters.kmeans == kmeans
      })
      .transition()
      .duration(150)
      .style("fill", randomColor);

      d3.selectAll('path.agglom')
      .filter(function(s) {
        return s.clusters.agglom != agglom
      })
      .transition()
      .duration(150)
      .style('fill-opacity',0.05);

      d3.selectAll('path.agglom')
      .filter(function(s) {
        return s.clusters.agglom == agglom
      })
      .transition()
      .duration(150)
      .style("fill", randomColor);

      d3.selectAll('path.affinity')
      .filter(function(s) {
        return s.clusters.affinity != affinity
      })
      .transition()
      .duration(150)
      .style('fill-opacity',0.05);

      d3.selectAll('path.affinity')
      .filter(function(s) {
        return s.clusters.affinity == affinity
      })
      .transition()
      .duration(150)
      .style("fill", randomColor);
    })
    .on("mouseup", function(d,i) {
      var gmm = d.clusters.gmm;
      var kmeans = d.clusters.kmeans;
      var agglom = d.clusters.agglom;
      var affinity = d.clusters.affinity;

      d3.selectAll('path.gmm')
      .transition()
      .duration(150)
      .style('fill-opacity',.7);

      d3.selectAll('path.kmeans')
      .transition()
      .duration(150)
      .style('fill-opacity',.7);

      d3.selectAll('path.agglom')
      .transition()
      .duration(150)
      .style('fill-opacity',.7);

      d3.selectAll('path.affinity')
      .transition()
      .duration(150)
      .style('fill-opacity',.7);
    });

    svgAffinity.append("text")
    .text("Affinity Propagation")
    .attr("x", 50)
    .attr("y", 50)
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("font-weight", 700)
    .attr("fill", "#000");

    var title = "Clusters: " + labels.count;
    svgAffinity.append("text")
    .text(title)
    .attr("x", 50)
    .attr("y", 70)
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("font-weight", 400)
    .attr("fill", "#000");

    svgAffinity.append("text")
    .text("Zernike Moments")
    .attr("x", 50)
    .attr("y", 90)
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("font-weight", 400)
    .attr("fill", "#000");
  }

  if (mode == "large") {
    var labels = gmm;
    svgLarge.selectAll("path.large")
    .data(features)
    .enter()
    .append("path")
    .attr("d",pathLarge)
    .attr("class","large")
    .style("stroke", "none")
    .style("fill", function(d,i){
      var color = "#d2d2d2";
      return color;
    })
    .style("fill-opacity", 0.7);

    $('#large').hide();
  }
}

var modes = [gmm, kmeans, agglom, affinity];
var curMode = 0;

var seenStates = 1;
var showModesInterval;
var flipping = false;

$('#restore').on("click", function() {
  d3.selectAll("path")
  .transition()
  .style("fill-opacity", 0.7)
})

$('#cycle').on("click", function() {
  console.log("click");
  if (flipping == false) {
    $('#gmm').fadeOut();
    $('#kmeans').fadeOut();
    $('#agglom').fadeOut();
    $('#affinity').fadeOut();
    $('#large').fadeIn();
    showModesInterval = setInterval(changeModes, 2000);
    flipping = true;
  } else {
    $('#gmm').fadeIn();
    $('#kmeans').fadeIn();
    $('#agglom').fadeIn();
    $('#affinity').fadeIn();
    $('#large').fadeOut();
    clearInterval(showModesInterval);
    flipping = false;
  }
});


function changeModes() {
  if (curMode < modes.length-1) {
    curMode++;
  } else {
    curMode = 0;
  }

  var colorsForGroup;
  var labels;
  if (curMode == 0) {
    colorsForGroup = gmmColors;
    labels = gmm;
  } else if (curMode == 1) {
    colorsForGroup = kmeansColors;
    labels = kmeans;
  } else if (curMode == 2) {
    colorsForGroup = agglomColors;
    labels = agglom;
  } else if (curMode == 3) {
    colorsForGroup = affinityColors;
    labels = affinity;
  }


  d3.selectAll("path.large")
  .transition()
  .duration(550)
  .style("fill", function(d,i){
    var label = labels.clusters[i].label;
    var color = colorsForGroup[label];
    return color;
  })

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
