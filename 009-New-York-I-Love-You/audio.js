// http://wavesurfer-js.org/docs/
var numOfAudios = 4;
var wavHeight = $(window).height()/numOfAudios;

var inactiveColor = '#d2d2d2';
var curPlaying;

var waveHome = WaveSurfer.create({
    container: '#waveform-home',
    waveColor: '#d9e021',
    cursorWidth: 0,
    progressColor: inactiveColor,
    barWidth: 3,
    height: wavHeight,
    normalize: true,
    interact: false,
});

var waveSubway = WaveSurfer.create({
    container: '#waveform-subway',
    waveColor: '#0071bc',
    cursorWidth: 0,
    progressColor: inactiveColor,
    barWidth: 3,
    height: wavHeight,
    normalize: true,
    interact: false,
});

var waveStreet = WaveSurfer.create({
    container: '#waveform-street',
    waveColor: '#f7931e',
    cursorWidth: 0,
    progressColor: inactiveColor,
    barWidth: 3,
    height: wavHeight,
    normalize: true,
    interact: false,
});

var waveMorning = WaveSurfer.create({
    container: '#waveform-morning',
    waveColor: '#00a99d',
    cursorWidth: 0,
    progressColor: inactiveColor,
    barWidth: 3,
    height: wavHeight,
    normalize: true,
    interact: false,
});

["#c1272d","#ed1c24","#f15a24","#f7931e","#fbb03b","#fcee21","#d9e021","#8cc63f","#39b54a","#009245","#006837","#22b573","#00a99d","#29abe2","#0071bc","#2e3192","#1b1464","#662d91","#93278f","#9e005d","#d4145a","#ed1e79"]

waveHome.load('audio/home.mp3');
waveSubway.load('audio/subway.mp3');
waveStreet.load('audio/street.mp3');
waveMorning.load('audio/morning.mp3');

var homeReady = false;
var subwayReady = false;
var streetReady = false;
var morningReady = false;

waveStreet.on('ready', function () {
    streetReady = true;
    console.log("street ready");
    if (homeReady && subwayReady && morningReady) {
    waveHome.play();
    waveSubway.play();
     waveStreet.play();
     waveMorning.play();

     waveSubway.setMute(true);
     waveStreet.setMute(false);
     waveHome.setMute(true);
     waveMorning.setMute(true);
     curPlaying = 'street';
    }
});

waveHome.on('ready', function () {
    homeReady = true;
    console.log("home ready");
    if (streetReady && subwayReady && morningReady) {
      waveHome.play();
      waveSubway.play();
     waveStreet.play();
     waveMorning.play();

     waveSubway.setMute(true);
     waveStreet.setMute(true);
     waveHome.setMute(false);
     waveMorning.setMute(true);
     curPlaying = 'home';
    }
});

waveSubway.on('ready', function () {
    subwayReady = true;
    if (homeReady && streetReady) {
        waveHome.play();
        waveSubway.play();
       waveStreet.play();
       waveMorning.play();

       waveSubway.setMute(false);
       waveStreet.setMute(true);
       waveHome.setMute(true);
       waveMorning.setMute(true);
       curPlaying = 'subway';
    }
});

waveMorning.on('ready', function () {
    morningReady = true;
    console.log("morning ready");
    if (homeReady && streetReady && subwayReady) {
        waveHome.play();
        waveSubway.play();
        waveStreet.play();
        waveMorning.play();

        waveSubway.setMute(true);
        waveStreet.setMute(true);
        waveHome.setMute(true);
        waveMorning.setMute(false);

        curPlaying = 'morning';
    }
});



$("#waveform-subway").mousemove(function(event) {
    if (curPlaying != 'subway') {
      waveSubway.setMute(false);
      waveStreet.setMute(true);
      waveHome.setMute(true);
      waveMorning.setMute(true);
      curPlaying = 'subway';
    }
})
$("#waveform-home").mousemove(function(event) {
    if (curPlaying != 'home') {
      waveSubway.setMute(true);
      waveStreet.setMute(true);
      waveHome.setMute(false);
      waveMorning.setMute(true);
        curPlaying = 'home';
    }
})

$("#waveform-street").mousemove(function(event) {
    if (curPlaying != 'street') {
      waveSubway.setMute(true);
      waveStreet.setMute(false);
      waveHome.setMute(true);
      waveMorning.setMute(true);
        curPlaying = 'street';
    }
})

$("#waveform-morning").mousemove(function(event) {
    if (curPlaying != 'morning') {
      waveSubway.setMute(true);
      waveStreet.setMute(true);
      waveHome.setMute(true);
      waveMorning.setMute(false);
        curPlaying = 'morning';
    }
})
