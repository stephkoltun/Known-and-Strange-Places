var url;
var mic;
var prevState;
var lights;

function setup() {
  mic = new p5.AudioIn();
  mic.start();
  connect();
}

// get the light info
function connect() {
  url = "http://" + ip + '/api/' + user + '/lights/';
  httpDo(url, 'GET', getLights);
}

// receive a connection response from the bridge
function getLights(result) {
  //console.log(result);
  lights = JSON.parse(result);	// parse the HTTP response
  prevState = lights['1'].state.on;
  console.log(lights);
}

// listen for sound
function draw() {
  var vol = mic.getLevel();
  if (vol > .1) {
    changeState("1");
    //changeState("2")
  }
}

// toggle light state
function changeState(lightNum) {
  var setState = !prevState;
  prevState = setState;
  var path = url + lightNum + "/state";
  var content = JSON.stringify(
    {"on": setState}
  )

  $.ajax({
    url: path,
    method: 'PUT',
    dataType: 'text',
    data: content,
    success: receivedChange,
  });
}

// confirm change, update lights
function receivedChange(result) {
  console.log(result);
  connect();
}
