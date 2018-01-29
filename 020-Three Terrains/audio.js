// http://wavesurfer-js.org/docs/
var numOfAudios = 3;
var wavHeight = $(window).height()/3;

var inactiveColor = '#d2d2d2';
var activeColor = '#43ccd4';

var waveHome = WaveSurfer.create({
    container: '#waveform-home',
    waveColor: '#43ccd4',
    progressColor: inactiveColor,
    barWidth: 3,
    height: wavHeight,
    normalize: true,
    interact: false,
});

var waveSubway = WaveSurfer.create({
    container: '#waveform-subway',
    waveColor: '#cc43d4',
    progressColor: inactiveColor,
    barWidth: 3,
    height: wavHeight,
    normalize: true,
    interact: false,
});

var waveStreet = WaveSurfer.create({
    container: '#waveform-street',
    waveColor: '#32ffa1',
    progressColor: inactiveColor,
    barWidth: 3,
    height: wavHeight,
    normalize: true,
    interact: false,
});

waveHome.load('audio/home.wav');
waveSubway.load('audio/subway.wav');
waveStreet.load('audio/street.wav');

var homeReady = false;
var subwayReady = false;
var streetReady = false;

waveStreet.on('ready', function () {
    streetReady = true;
    if (homeReady && subwayReady) {
        waveHome.play();
        waveSubway.play();
        waveStreet.play();
        waveStreet.toggleMute();
        waveHome.toggleMute();
    }
});

waveHome.on('ready', function () {
    homeReady = true;
    if (streetReady && subwayReady) {
        waveHome.play();
        waveSubway.play();
        waveStreet.play();
        waveStreet.toggleMute();
        waveHome.toggleMute();
    }
});

waveSubway.on('ready', function () {
    subwayReady = true;
    if (homeReady && streetReady) {
        waveHome.play();
        waveSubway.play();
       waveStreet.play();
       waveStreet.toggleMute();
       waveHome.toggleMute();
    }
});

var curPlaying = 'subway';

$("#waveform-subway").mousemove(function(event) {
    if (curPlaying != 'subway') {
        waveSubway.toggleMute();

        // mute the currently playing one
        if (curPlaying == 'home') {
            waveHome.toggleMute();
        } else if (curPlaying = 'street') {
            waveStreet.toggleMute();
        }
        curPlaying = 'subway';
    }
})
$("#waveform-home").mousemove(function(event) {
    if (curPlaying != 'home') {
        waveHome.toggleMute();

        // mute the currently playing one
        if (curPlaying == 'subway') {
            waveSubway.toggleMute();
        } else if (curPlaying = 'street') {
            waveStreet.toggleMute();
        }
        curPlaying = 'home';
    }
})

$("#waveform-street").mousemove(function(event) {
    if (curPlaying != 'street') {
        waveStreet.toggleMute();


        // mute the currently playing one
        if (curPlaying == 'subway') {
            waveSubway.toggleMute();
        } else if (curPlaying = 'home') {
            waveHome.toggleMute();
        }
        curPlaying = 'street';
    }  
})

