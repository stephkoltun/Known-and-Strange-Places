assembleImage();

function assembleImage() {
  var left = nodes.features[Math.floor(Math.random() * Math.floor(nodes.features.length))];
  var right = nodes.features[Math.floor(Math.random() * Math.floor(nodes.features.length))];

  console.log(left);
  console.log(right);

  var randomLeft = {
    lat: left.geometry.coordinates[0],
    lon: left.geometry.coordinates[1],
    heading: left.properties.angle,
  };

  if (left.properties.borocode == 1) {
    randomLeft.boro = "Manhattan";
  } else if (left.properties.borocode == 2) {
    randomLeft.boro = "Bronx";
  } else if (left.properties.borocode == 3) {
    randomLeft.boro = "Brooklyn";
  } else if (left.properties.borocode == 4) {
    randomLeft.boro = "Queens";
  } else if (left.properties.borocode == 5) {
    randomLeft.boro = "Staten Island";
  }

  var randomRight = {
    lat: right.geometry.coordinates[0],
    lon: right.geometry.coordinates[1],
    heading: right.properties.angle,
  };
  if (right.properties.borocode == 1) {
    randomRight.boro = "Manhattan";
  } else if (right.properties.borocode == 2) {
    randomRight.boro = "Bronx";
  } else if (right.properties.borocode == 3) {
    randomRight.boro = "Brooklyn";
  } else if (right.properties.borocode == 4) {
    randomRight.boro = "Queens";
  } else if (right.properties.borocode == 5) {
    randomRight.boro = "Staten Island";
  }

  requestImg('#streetLeft', randomLeft);
  requestImg('#streetRight', randomRight);
}

function requestImg(classname, point) {
  var imgUrl = "https://maps.googleapis.com/maps/api/streetview?&key=" + key + "&size=640x320&location=" + point.lon + "," + point.lat + "&fov=90&heading=" + point.heading;

  convertFunction(imgUrl, function(base64Img){
      console.log(point.boro);
      var img = "<img src='"+base64Img+"'><h1>" + point.boro + "</h1>";
      $(classname).html(img);
  });

  function convertFunction (url, callback){
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function() {
          var reader  = new FileReader();
          reader.onloadend = function () {
              callback(reader.result);
          }
          reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET', url);
      xhr.send();
  }
}
