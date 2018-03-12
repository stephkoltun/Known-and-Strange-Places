var from = "kinect";
var to = "live";

// can omit id, if we want the server to auto generate it for us
var options = {
  host: "sk6385.itp.io",
	port: "443",
	path: '/peerjs',
  secure: "true"
};

var peer = new Peer(from, options);

peer.on('open', function(id) {
  console.log("My peer id is: " + id);
})

peer.on('call', onReceiveCall);


peer.on('connection', function(connection) {
  console.log(connection);
  console.log("we're connected!")
})

$('#start-call').click(function(){
    console.log('starting call with ' + to + '...');
    getVideo(streamVideoToPartner, videoError);
    // arguments: success callback, error callback
});

function streamVideoToPartner(MediaStream) {
  console.log('now calling ' + to);
  var call = peer.call(to, MediaStream);
  call.on('stream', onReceiveStream);
}

function videoError(err) {
  console.log('an error occured while getting the video');
  console.log(err);
}

function getVideo(successCallback, errorCallback){
    navigator.getUserMedia({
        audio: false,
        video: true
    }, successCallback, errorCallback);
}

function onReceiveCall(call){

    console.log('peer is calling...');
    console.log(call);

    getVideo(
        function(MediaStream){
            call.answer(MediaStream);
            console.log('answering call started...');
        },
        function(err){
            console.log('an error occured while getting the audio');
            console.log(err);
        }
    );

    call.on('stream', onReceiveStream);
}

function onReceiveStream(stream){
    var video = document.querySelector('video');
    video.src = window.URL.createObjectURL(stream);
    video.onloadedmetadata = function(){
        console.log('video loaded');
    }
}

// tutorial:
// https://www.toptal.com/webrtc/taming-webrtc-with-peerjs
