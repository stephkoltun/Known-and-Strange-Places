
var winheight = $(window).height();
var winwidth = $(window).width();
var margin = {top: 160, left: 100, bottom: 160, right: 100};
var width = winwidth*3 - margin.left - margin.right;
var clusterWidth = winwidth*7.3 - margin.left - margin.right;
var height = winheight - margin.top - margin.bottom;

imageDisplay();

var xIntersectionScale;
var xClusterScale;
var yGridScale;
var yClusterScale;
var svg;
var mode = "grid";
var rapidPlaying = false;
var rapidInterval;


function imageDisplay() {

  xIntersectionScale = d3.scaleLinear()
  .range([0, width])
  .domain([0, intersections.length]);

  xClusterScale = d3.scaleLinear()
  .range([0, clusterWidth])
  .domain([0, intersections.length]);

  yGridScale = d3.scaleLinear()
  .range([0, height])
  .domain([0, 3]);

  yClusterScale = d3.scaleLinear()
  .range([0, height])
  .domain([0, 2]);

  // add the graph canvas to the body of the webpage
  svg = d3.select("#grid").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);
  svg.append("g");

  var inters = svg.selectAll("g.intersection")
  .data(intersections)
  .enter()
  .append("g")
  .attr("class", "intersection")
  .attr("transform", function(d,i) {
    var xPos = xIntersectionScale(i) + width/intersections.length/2; // so that its centered in its column;
    return "translate(" + (margin.left+xPos) + "," + margin.top + ")";
  })

  // grid display
  var direction = inters.selectAll("g.column")
  .data(function(d) {
    return d.images;
  })
  .enter()
  .append("g")
  .attr("class", "column")
  .attr("transform", function(d,i) {
    var yPos = yGridScale(i);
    return "translate(0," + yPos + ")";
  })
  .on("click", function(d,i) {
    var parent = d3.select(this.parentNode).datum();
    var streetlabel = parent.street;
    var dirlabel;
    if (d.direction == "N") {
      dirlabel = "<span class='bold'>North</span>";
    } else if (d.direction == "E") {
      dirlabel = "<span class='bold'>East</span>";
    } else if (d.direction == "S") {
      dirlabel = "<span class='bold'>South</span>";
    } else if (d.direction == "W") {
      dirlabel = "<span class='bold'>West</span>";
    }
    //var dirlabel = "All images facing " + d.direction;
    console.log(mode, d);
    rapidFire(d.direction, parent.id, d.path,i,dirlabel,streetlabel);
  });

  var point = direction.append("svg:image")
  .attr("xlink:href",  function(d) {
    return "img/600px/" + d.path;
  })
  .attr("class", "gridPoint")
  .attr("width", imgSize)
  .attr("height", imgSize)
  .attr("x", function(d) {
    return imgSize/2*(-1);
  })
  .attr("y", function(d) {
    return imgSize/2*(-1);
  });


  // cluster display
  // var cluster = inters.selectAll("g.cluster")
  // .data(function(d) {
  //   return d.images;
  // })
  // .enter()
  // .append("g")
  // .attr("class", "cluster")
  // .attr("transform", function(d) {
  //   var yOffset = height/2;
  //   var xPos;
  //   var yPos;
  //   if (d.direction == "N") {
  //     xPos = 0;
  //     yPos = -1*clusterOffset;
  //   } else if (d.direction == "E") {
  //     xPos = clusterOffset;
  //     yPos = 0;
  //   } else if (d.direction == "S") {
  //     xPos = 0;
  //     yPos = clusterOffset;
  //   } else if (d.direction == "W") {
  //     xPos = -1*clusterOffset;
  //     yPos = 0;
  //   }
  //   return "translate(" + xPos + "," + (yPos+yOffset) + ")";
  // })
  // .on("click", function(d,i) {
  //   var parent = d3.select(this.parentNode).datum();
  //   var label = parent.street;
  //   rapidFire(d.direction, parent.id, d.path,i,label);
  // });

  // var clus = cluster.append("svg:image")
  // .attr("xlink:href",  function(d) {
  //   return d.path;
  // })
  // .attr("class", "clusterPoint")
  // .attr("width", imgSize)
  // .attr("height", imgSize)
  // .attr("x", function(d) {
  //   return imgSize/2*(-1);
  // })
  // .attr("y", function(d) {
  //   return imgSize/2*(-1);
  // });




}
