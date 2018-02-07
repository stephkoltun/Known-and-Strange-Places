function getLocation() {
  if (navigator.geolocation)  // check if geolocation is supported
  {
    navigator.geolocation.watchPosition(gotLocation, gotError, geoOptions);
    //navigator.geolocation.getCurrentPosition(gotLocation,gotError)
  } else {
    alert("uh oh no geo")
  }
}

var geoOptions = {
  enableHighAccuracy: true,
  maximumAge        : 30000,
  timeout           : 27000
};

function gotLocation(position) {
  //alert("new position");
  console.log(position);
  //alert("lat: " + position.coords.latitude + " lon: " + position.coords.longitude);
  requestImg(position.coords);
  //$("body").append("<p>" + position.coords.latitude + " " + position.coords.longitude + "</p>")

}

function gotError(position) {
  console.log(position)
  alert("Please enable location services for this device and browser.");
}

function requestImg(point) {
  var imgUrl;
  if (point.heading != null) {
    imgUrl = "https://maps.googleapis.com/maps/api/streetview?&key=" + key + "&size=640x320&location=" + point.latitude + "," + point.longitude + "&fov=120&heading=" + point.heading;
  } else {
    imgUrl = "https://maps.googleapis.com/maps/api/streetview?&key=" + key + "&size=640x320&location=" + point.latitude + "," + point.longitude + "&fov=120";
  }

  convertFunction(imgUrl, function(base64Img){
      var img = "<img src='"+base64Img+"'>";
      $("#streetview").attr("src",base64Img);
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
