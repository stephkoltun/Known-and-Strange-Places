setInterval(function() {
    if (curTime < timestamps.length-1) {
        $('svg').remove();
        curTime++;
        showPlot();
    } else {
        $('svg').remove();
        curTime = 1;
        showPlot();
    }
}, 500);

var curTime = 1;
var evenDistribution = true;

var ratio = 227.5 / 481;
var evenRatio = 8/12;

var margin = { right: 220, left: 220, top: 220, bottom: 220 };

var planWidth = $(window).width() - margin.left - margin.right;
var planHeight = planWidth * ratio;

var evenPlanWidth = $(window).width() - margin.left - margin.right;
var evenPlanHeight = evenPlanWidth * evenRatio;

calculateMargins();

function calculateMargins() {
  if (evenDistribution) {
    margin.top = ($(window).height() - evenPlanHeight)/2;
  } else {
    margin.top = ($(window).height() - planHeight)/2;
  }
  margin.bottom = margin.top;
}


var xScale = d3.scaleLinear()
    .range([0, planWidth])
    .domain([0, 481]);

var yScale = d3.scaleLinear()
    .range([planHeight, 0]) // value -> display
    .domain([0, 227.5]);

var xEvenScale = d3.scaleLinear()
    .range([0, evenPlanWidth])
    .domain([0, 11]);

var yEvenScale = d3.scaleLinear()
    .range([evenPlanHeight, 0])
    .domain([0, 7]);

var lightScale = d3.scaleLinear()
    .range([1, 35])
    .domain([0, 350]);

function showPlot() {
    // add the graph canvas to the body of the webpage
    var svg = d3.select("body").append("svg")
        .attr("width", $(window).width())
        .attr("height", $(window).height())
        .append("g");

    var dataCollection = [kitchen, dining, foyer, bedroom, closet];

    for (var i = 0; i < dataCollection.length; i++) {
        for (var t = 0; t < timestamps.length; t++) {
            var thisRoom = dataCollection[i];
            var classIt = thisRoom.class + t;
            var classSelec = thisRoom.room + t;
            var thisData = thisRoom.data[t].measure;
            svg.selectAll(classIt)
                .data(thisData)
                .enter().append("circle")
                .attr("class", classSelec)
                .attr("r", function(d) {
                    return lightScale(d.val)
                }) // map size to the light value
                .attr("cx", function(d,index) {
                  if (evenDistribution) {
                    let xOffset = thisRoom.xOffset*4;
                    let yOffset = thisRoom.yOffset*4;

                    var yPos = Math.floor(index/4);
                    var xPos = index - yPos*4 + xOffset;
                    return xEvenScale(xPos);
                  } else {
                    return xScale(d.x)
                  }

                })
                .attr("cy", function(d,index) {
                  if (evenDistribution) {
                    let xOffset = thisRoom.xOffset*4;
                    let yOffset = thisRoom.yOffset*4;

                    var yPos = Math.floor(index/4)+ yOffset;

                    return yEvenScale(yPos);
                  } else {
                    return yScale(d.y)
                  }

                })
                .style("fill", "none")
                //.style("stroke", colors[t])
                .style("stroke", "#F96900")
                .style("stroke-width", 1.5)
                .style("opacity", function(d) {
                    if (t == curTime) {
                        return 1
                    } else if (t < curTime) {
                      return t/curTime * 0.35;
                      //return 0.2
                    } else {
                      return 0
                    }
                })
                .attr("transform", function(d) {
                  return "translate(" + margin.left + "," + margin.top + ")"
                })
        }
    }
}

$("#even").click(function() {
  $(this).toggleClass("active inactive");
  $("#measured").toggleClass("active inactive");
  evenDistribution = true;

  calculateMargins();
})

$("#measured").click(function() {
  $(this).toggleClass("active inactive");
  $("#even").toggleClass("active inactive");
  evenDistribution = false;

  calculateMargins();
})
