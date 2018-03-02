var geoOptions = {
  enableHighAccuracy: true,
  maximumAge        : 30000,
  timeout           : 27000
};


function locationError(position) {
  console.log(position)
  alert("Please enable location services for this device and browser.");
}

function sendNewLocation(position) {
  console.log("send new location to server");
  console.log(position);

  var dataToUpdate = {
    'name': 'Steph',
    'lat': position.coords.latitude.toFixed(7),
    'lon': position.coords.longitude.toFixed(7)
  }

  // send our new location to the server
  $.ajax({
    url: "/updateLocation",
    type: 'POST',
    data: dataToUpdate,
    dataType: 'json',
    success: function() {
      console.log("updated location");
    },
    error: function(err) {
      console.log(err);
      console.log("location went nowhere");
    }
  });
}


function requestImg(location) {
  var imgUrl= "https://maps.googleapis.com/maps/api/streetview?&key=" + config.key + "&size=640x320&location=" + location.lat + "," + location.lon + "&fov=120";

  convertFunction(imgUrl, function(base64Img){
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
