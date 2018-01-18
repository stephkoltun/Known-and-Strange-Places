// http://wavesurfer-js.org/docs/

var waveHome = WaveSurfer.create({
    container: '#waveform-home',
    waveColor: 'violet',
    progressColor: 'purple'
});

var waveSubway = WaveSurfer.create({
    container: '#waveform-subway',
    waveColor: 'teal',
    progressColor: 'green'
});

var waveStreet = WaveSurfer.create({
    container: '#waveform-street',
    waveColor: 'lightblue',
    progressColor: 'blue'
});

waveHome.load('audio/home.wav');
waveSubway.load('audio/subway.wav');
waveStreet.load('audio/street.wav');

waveStreet.on('ready', function () {
    waveStreet.play();
});

//wavesurfer.pause();
//wavesurfer.toggleMute();