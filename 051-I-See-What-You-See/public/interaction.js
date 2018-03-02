var geoOptions = {
  enableHighAccuracy: true,
  maximumAge        : 30000,
  timeout           : 27000
};

function getLocation() {
  if (navigator.geolocation)  // check if geolocation is supported
  {
    navigator.geolocation.getCurrentPosition(addLocationToForm,locationError);
  } else {
    alert("uh oh no geo")
  }
}

function locationError(position) {
  console.log(position)
  alert("Please enable location services for this device and browser.");
}

function addLocationToForm(position) {
  $("#lat").val(position.coords.latitude.toFixed(7));
  $("#lon").val(position.coords.longitude.toFixed(7));
}

function gotLocation(position) {
  console.log(position);
  $("#id").text("lat: " + position.coords.latitude + " lon: " + position.coords.longitude);
}

function requestImg(location) {
  var imgUrl= "https://maps.googleapis.com/maps/api/streetview?&key=" + config.key + "&size=640x320&location=" + location.lat + "," + location.lon + "&fov=120";

  convertFunction(imgUrl, function(base64Img){
      var imgTag = "<img src='"+base64Img+"'>";
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
