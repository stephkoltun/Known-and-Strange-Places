// http://wavesurfer-js.org/docs/
var numOfAudios = 3;
var wavHeight = $(window).height()/3;

var inactiveColor = '#d2d2d2';
<<<<<<< HEAD
var curPlaying;
=======
var activeColor = '#43ccd4';
>>>>>>> parent of b9e4dff... fixed 006, 007, and 009

var waveHome = WaveSurfer.create({
    container: '#waveform-home',
    waveColor: '#43ccd4',
    cursorWidth: 0,
    progressColor: inactiveColor,
    barWidth: 3,
    height: wavHeight,
    normalize: true,
    interact: false,
});

var waveSubway = WaveSurfer.create({
    container: '#waveform-subway',
    waveColor: '#cc43d4',
    cursorWidth: 0,
    progressColor: inactiveColor,
    barWidth: 3,
    height: wavHeight,
    normalize: true,
    interact: false,
});

var waveStreet = WaveSurfer.create({
    container: '#waveform-street',
    waveColor: '#32ffa1',
    cursorWidth: 0,
    progressColor: inactiveColor,
    barWidth: 3,
    height: wavHeight,
    normalize: true,
    interact: false,
});

<<<<<<< HEAD
var waveMorning = WaveSurfer.create({
    container: '#waveform-morning',
    waveColor: '#f7b613',
    cursorWidth: 0,
    progressColor: inactiveColor,
    barWidth: 3,
    height: wavHeight,
    normalize: true,
    interact: false,
});

waveHome.load('audio/home.mp3');
waveSubway.load('audio/subway.mp3');
waveStreet.load('audio/street.mp3');
waveMorning.load('audio/morning.mp3');
=======
waveHome.load('audio/home.wav');
waveSubway.load('audio/subway.wav');
waveStreet.load('audio/street.wav');
>>>>>>> parent of b9e4dff... fixed 006, 007, and 009

var homeReady = false;
var subwayReady = false;
var streetReady = false;

waveStreet.on('ready', function () {
    streetReady = true;
<<<<<<< HEAD
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
=======
    if (homeReady && subwayReady) {
        waveHome.play();
        waveSubway.play();
        waveStreet.play();
        waveStreet.toggleMute();
        waveHome.toggleMute();
>>>>>>> parent of b9e4dff... fixed 006, 007, and 009
    }
});

waveHome.on('ready', function () {
    homeReady = true;
<<<<<<< HEAD
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
=======
    if (streetReady && subwayReady) {
        waveHome.play();
        waveSubway.play();
        waveStreet.play();
        waveStreet.toggleMute();
        waveHome.toggleMute();
>>>>>>> parent of b9e4dff... fixed 006, 007, and 009
    }
});

waveSubway.on('ready', function () {
    subwayReady = true;
    if (homeReady && streetReady) {
        waveHome.play();
        waveSubway.play();
       waveStreet.play();
<<<<<<< HEAD
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
=======
       waveStreet.toggleMute();
       waveHome.toggleMute();
>>>>>>> parent of b9e4dff... fixed 006, 007, and 009
    }
});



$("#waveform-subway").mousemove(function(event) {
    if (curPlaying != 'subway') {
<<<<<<< HEAD
      waveSubway.setMute(false);
      waveStreet.setMute(true);
      waveHome.setMute(true);
      waveMorning.setMute(true);
      curPlaying = 'subway';
=======
        waveSubway.toggleMute();

        // mute the currently playing one
        if (curPlaying == 'home') {
            waveHome.toggleMute();
        } else if (curPlaying = 'street') {
            waveStreet.toggleMute();
        }
        curPlaying = 'subway';
>>>>>>> parent of b9e4dff... fixed 006, 007, and 009
    }
})
$("#waveform-home").mousemove(function(event) {
    if (curPlaying != 'home') {
<<<<<<< HEAD
      waveSubway.setMute(true);
      waveStreet.setMute(true);
      waveHome.setMute(false);
      waveMorning.setMute(true);
=======
        waveHome.toggleMute();

        // mute the currently playing one
        if (curPlaying == 'subway') {
            waveSubway.toggleMute();
        } else if (curPlaying = 'street') {
            waveStreet.toggleMute();
        }
>>>>>>> parent of b9e4dff... fixed 006, 007, and 009
        curPlaying = 'home';
    }
})

$("#waveform-street").mousemove(function(event) {
    if (curPlaying != 'street') {
<<<<<<< HEAD
      waveSubway.setMute(true);
      waveStreet.setMute(false);
      waveHome.setMute(true);
      waveMorning.setMute(true);
=======
        waveStreet.toggleMute();


        // mute the currently playing one
        if (curPlaying == 'subway') {
            waveSubway.toggleMute();
        } else if (curPlaying = 'home') {
            waveHome.toggleMute();
        }
>>>>>>> parent of b9e4dff... fixed 006, 007, and 009
        curPlaying = 'street';
    }  
})

<<<<<<< HEAD
$("#waveform-morning").mousemove(function(event) {
    if (curPlaying != 'morning') {
      waveSubway.setMute(true);
      waveStreet.setMute(true);
      waveHome.setMute(true);
      waveMorning.setMute(false);
        curPlaying = 'morning';
    }
})
=======
>>>>>>> parent of b9e4dff... fixed 006, 007, and 009
