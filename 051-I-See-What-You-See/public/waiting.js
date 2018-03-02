var myUserData;
var lookupPartner;
// let's check periodically if my partner is here yet
function checkForPartner(partner) {
  console.log("is our partner here yet?");

  $.ajax({
    url: "/waitingPartner",
    type: 'POST',
    data: {'lookingFor': partner},
    dataType: 'json',
    success: function(data) {
      console.log(data);
      if (data.connected) {
        myUserData.connected = false;
        $("h1").css("color", "#FFFFFF");
        clearInterval(lookupPartner);
        // update view...
        updateText();
        var refreshStreetview = setInterval(getPartnerImage,2000);
      };
    },
    error: function(err) {
    }
  });
}

function updateText() {
  $("#mainText").text("Here I am!");
}

function getPartnerImage() {
  $.ajax({
    url: "/getPartnerLocation",
    type: 'POST',
    data: {'lookingFor': myUserData.lookingFor},
    dataType: 'json',
    success: function(data) {
      console.log("received location");
      requestImg(data.location);
    },
    error: function(err) {
      console.log(err);
      console.log("couldn't get partner's location");
    }
  });
}

function sendNewLocation(position) {
  console.log("send new location to server");
  console.log(position);

  // update our local information
  myUserData.curLocation.lat = position.coords.latitude.toFixed(7);
  myUserData.curLocation.lon = position.coords.longitude.toFixed(7);

  var dataToUpdate = {
    'username': myUserData.name,
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
