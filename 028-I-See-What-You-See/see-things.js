function getLocation() {
  if (navigator.geolocation)  // check if geolocation is supported
  {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log(position);
      requestImg(position.coords);
      $("body").append("<p>" + position.coords.latitude + " " + position.coords.longitude + "</p>")
    })
  }
}



function requestImg(point) {
  var imgUrl = "https://maps.googleapis.com/maps/api/streetview?&key=" + key + "&size=640x320&location=" + point.latitude + "," + point.longitude + "&fov=90";
  //&heading=" + point.heading;

  convertFunction(imgUrl, function(base64Img){
      //var img = "<img src='"+base64Img+"'>";
      $("#streetview").attr("src",base64Img);
      //$('body').html(img);
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
