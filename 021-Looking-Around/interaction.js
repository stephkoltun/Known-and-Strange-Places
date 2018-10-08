var imgSize = 120;
var clusterOffset = 130;

$(document).keypress(function(e) {
  if(e.keyCode == 32 && rapidPlaying == false) {
    console.log("--- toggle mode");
    if (mode == 'grid') {
      // transition to clusters

      svg.attr("width", clusterWidth + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

      d3.selectAll(".column")
      .transition()
      .duration(1000)
      .attr("transform", function(d) {
        var yOffset = height/2;
        var xPos;
        var yPos;
        if (d.direction == "N") {
          xPos = 0;
          yPos = -1*clusterOffset;
        } else if (d.direction == "E") {
          xPos = clusterOffset;
          yPos = 0;
        } else if (d.direction == "S") {
          xPos = 0;
          yPos = clusterOffset;
        } else if (d.direction == "W") {
          xPos = -1*clusterOffset;
          yPos = 0;
        }
        return "translate(" + xPos + "," + (yPos+yOffset) + ")";
      })

      d3.selectAll(".intersection")
      .transition()
      .duration(1000)
      .attr("transform", function(d,i) {
        var xPos = xClusterScale(i) + clusterWidth/intersections.length/2; // so that its centered in its column;
        return "translate(" + (margin.left+xPos) + "," + margin.top + ")";
      })
      mode = 'cluster';

    } else if (mode == 'cluster') {
      // transition to grid

      svg.attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

      d3.selectAll(".column")
      .transition()
      .duration(1000)
      .attr("transform", function(d,i) {
        var xPos = 0;
        var yPos;
        if (d.direction == "N") {
          yPos = yGridScale(0);
        } else if (d.direction == "E") {
          yPos = yGridScale(1);
        } else if (d.direction == "S") {
          yPos = yGridScale(2);
        } else if (d.direction == "W") {
          yPos = yGridScale(3);
        }
        return "translate(" + xPos + "," + yPos + ")";
      })

      d3.selectAll(".intersection")
      .transition()
      .duration(1000)
      .attr("transform", function(d,i) {
        var xPos = xIntersectionScale(i) + width/intersections.length/2; // so that its centered in its column;
        return "translate(" + (margin.left+xPos) + "," + margin.top + ")";
      })

      mode = 'grid';
    }
  } else if(e.keyCode == 13) {
    if (rapidPlaying == true) {
      rapidFire(); // dummy values
    }
  }
});

function rapidFire(direction, intersect, origPath, clusterIndex, dirlabel, streetlabel) {

  if (rapidPlaying == false) {
    console.log("--- start interval");
    rapidPlaying = true;

    // get all the images facing in the same direction
    // or at the same intersection
    var collectedImages = [];

    var startIndex;

    if (mode == "grid") {
      for (var i = 0; i < intersections.length; i++) {
        var thisIntersection = intersections[i];
        for (var img = 0; img < thisIntersection.images.length; img++) {
          var thisImage = thisIntersection.images[img];
          if (thisImage.direction == direction) {
            collectedImages.push(thisImage);
            // need a check because we cant use the original index, not every intersection has 4 photos
            if (thisImage.path == origPath) {
              startIndex = collectedImages.length-1;
            }
          }
        }
      }
      // find start index
    } else if (mode == "cluster") {
      startIndex = clusterIndex;
      for (var i = 0; i < intersections.length; i++) {

        var thisIntersection = intersections[i];
        //console.log(thisIntersection.id, intersect);
        if (thisIntersection.id == intersect) {
          collectedImages = thisIntersection.images;
        }
      }
    }

    console.log(collectedImages);

    // start with the clicked image
    var imgIndex = startIndex;
    $("#visImg").attr("src", ("img/2880px/" + collectedImages[imgIndex].path));
    if (mode == "grid") {
      $("#label").html(dirlabel + "<br>" + collectedImages[imgIndex].street);
      //$("#sublabel").text(collectedImages[imgIndex].street);
    } else if (mode == "cluster") {
      var labeltxt = streetlabel + "<br>";
      if (collectedImages[imgIndex].direction == "N") {
        labeltxt += "North";
      } else if (collectedImages[imgIndex].direction == "E") {
        labeltxt += "East";
      } else if (collectedImages[imgIndex].direction == "S") {
        labeltxt += "South";
      } else if (collectedImages[imgIndex].direction == "W") {
        labeltxt += "West";
      }
      $("#label").html(labeltxt);
    }
    $("#rapidImg").show();


    // invoke interval to cycle through the rest
    // new image every .5s
    rapidInterval = setInterval(function() {
      if (imgIndex < collectedImages.length-1) {
        imgIndex++;
      } else {
        imgIndex = 0;
      }
      var newPath = "img/2880px/" + collectedImages[imgIndex].path;
      $("#visImg").attr("src", newPath);
      if (mode == "grid") {
        $("#label").html(dirlabel + "<br>" + collectedImages[imgIndex].street);
        //$("#sublabel").text(collectedImages[imgIndex].street);
      } else if (mode == "cluster") {
        var labeltxt = streetlabel + "<br>";
        if (collectedImages[imgIndex].direction == "N") {
          labeltxt += "North";
        } else if (collectedImages[imgIndex].direction == "E") {
          labeltxt += "East";
        } else if (collectedImages[imgIndex].direction == "S") {
          labeltxt += "South";
        } else if (collectedImages[imgIndex].direction == "W") {
          labeltxt += "West";
        }
        $("#label").html(labeltxt);
      }
    },500);

  } else {
    clearRapid();
  }
}

function clearRapid() {
  console.log("end interval");
  clearInterval(rapidInterval);
  $("#rapidImg").hide();
  rapidPlaying = false;
}
