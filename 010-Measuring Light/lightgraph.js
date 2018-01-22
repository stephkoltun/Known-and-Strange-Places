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
}, 5000);

var curTime = 1;

var ratio = 227.5 / 481;

var margin = { right: 70, left: 70 };
var planWidth = $(window).width() - margin.left - margin.right;
var planHeight = planWidth * ratio;
margin.top = ($(window).height() - planHeight) / 2;
margin.bottom = ($(window).height() - planHeight) / 2;


var xScale = d3.scaleLinear()
    .range([0, planWidth])
    .domain([0, 481]);

var yScale = d3.scaleLinear()
    .range([planHeight, 0]) // value -> display
    .domain([0, 227.5]);

var lightScale = d3.scaleLinear()
    .range([1, 35])
    .domain([0, 350]);

function showPlot() {
    // add the graph canvas to the body of the webpage
    var svg = d3.select("body").append("svg")
        .attr("width", planWidth + margin.left + margin.right)
        .attr("height", planHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the tooltip area to the webpage
    // var tooltip = d3.select("body").append("div")
    //     .attr("class", "tooltip")
    //     .style("opacity", 0);


    var dataCollection = [kitchen, dining, foyer, bedroom, closet];
    // var dataCollection = [kitchen];

    for (var i = 0; i < dataCollection.length; i++) {
        for (var t = curTime - 1; t < curTime + 1; t++) {
          console.log(curTime);
            // for (var t = 0; t < curTime+1; t++) {

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
                .attr("cx", function(d) {
                    return xScale(d.x)
                })
                .attr("cy", function(d) {
                    return yScale(d.y)
                })
                .style("fill", "none")
                //.style("stroke", colors[t])
                .style("stroke", "#000000")
                .style("stroke-width", 1.5)
                .style("opacity", function(d) {
                    if (t == curTime) {
                        return 1
                    } else {
                        return 0.2
                    }
                })
        }
    }
}


    // .on("mouseover", function(d) {
    //     tooltip.transition()
    //          .duration(200)
    //          .style("opacity", .9);
    //     tooltip.html(d["Cereal Name"] + "<br/> (" + xValue(d) 
    //    + ", " + yValue(d) + ")")
    //          .style("left", (d3.event.pageX + 5) + "px")
    //          .style("top", (d3.event.pageY - 28) + "px");
    // })
    // .on("mouseout", function(d) {
    //     tooltip.transition()
    //          .duration(500)
    //          .style("opacity", 0);
    // });
