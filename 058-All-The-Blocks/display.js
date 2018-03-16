
var winheight = $(window).height();
var winwidth = $(window).width();
var margin = {top: 100, left: 250, bottom: 200, right: 200};
var width = $(window).width() - margin.left - margin.right;
var height = $(window).height() - margin.top - margin.bottom;
var path;
var projection;

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

projection = d3.geoMercator()
.scale([600000]);          // scale things wayyyy up

path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
.projection(projection);  // tell path generator to use albersUsa projection

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

  svg.selectAll("path.block")
  .data(features)
  .enter()
  .append("path")
  .attr("d",path)
  .attr("class","block")
  // .attr("class",function(d,i) {
  //   return d.properties.ntaname;
  // })
  .style("stroke", function(d,i){
    var neigh = d.properties.ntaname;
    var index = neighborhoods.indexOf(neigh);
    var color = CSS_COLOR_NAMES[index*2];
    return color;
  })
  .style("fill", function(d,i){
    var neigh = d.properties.ntaname;
    var index = neighborhoods.indexOf(neigh);
    var color = CSS_COLOR_NAMES[index*2];
    return color;
  })
  .style("stroke-width", .5)
  .style("fill-opacity", 0.1)
  .style("stroke-opacity", .7)
  .attr('vector-effect', 'non-scaling-stroke')
  .attr("transform",function(d,i) {

    var bounds = (path.bounds(d));
    var blockWidth = bounds[1][0] - bounds[0][0];
    var blockHeight = bounds[1][1] - bounds[0][1];

    var moveToLeft = bounds[0][0]*(-1) + margin.left;
    var moveToTop = bounds[0][1]*(-1) + margin.top;

    // shift for tSNE
    //get the tsne coordinates
    var positionCoords = tsnedata[i];
    //map them to the window width and height
    var x0 = moveToLeft + xScale(positionCoords.x);
    var y0 = moveToTop + yScale(positionCoords.y);

    return "translate(" + x0 + "," + y0 + ")";
  })
  .on("mousemove", function(d) {
    var match = d.properties.ntaname;
    console.log(match);
    d3.selectAll('path.block')
    .filter(function(s) {
      return s.properties.ntaname != match
    })
    .style('fill-opacity',0.05)
    .style('stroke-opacity',0.05);

    d3.selectAll('path.block')
      .filter(function(s) {
        return s.properties.ntaname == match
      })
      .style('fill-opacity',.8)
      .style("stroke-width", 1)
      .style('stroke-opacity',1);

    d3.selectAll('text.neighborhood')
      .filter(function(s) {
        return s != match
      })
      .attr("fill", "#d2d2d2");
  })
  .on("mouseout", function(d) {
    d3.selectAll('path.block')
    .style("fill-opacity", 0.1)
    .style("stroke-width", 0.5)
    .style("stroke-opacity", .7);

    d3.selectAll('text.neighborhood')
    .attr("fill", "#000");
  });

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


});

// svg.on("click", function() {
//   console.log("clicked!");
// });
// svg.selectAll("path").on("click", function(d, i) {
//   console.log(d);
//   console.log(i);
//   console.log(d3.event);
// });
