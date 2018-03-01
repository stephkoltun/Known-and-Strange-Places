var geoOptions = {
  enableHighAccuracy: true,
  maximumAge        : 30000,
  timeout           : 27000
};

function getLocation() {
  if (navigator.geolocation)  // check if geolocation is supported
  {
    //navigator.geolocation.watchPosition(gotLocation, locationError, geoOptions);
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
