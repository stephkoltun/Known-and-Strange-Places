var song;
var analyzer;
var fft;

var waveform;

function preload(){
  song = loadSound('audio/walk.m4a');
}

var width = 1000;
function setup() {
  var cnv = createCanvas(width, 200);
  var wave = song.getPeaks(width/2);
  console.log(wave);

  background(0,0,0);

  noFill();
  beginShape();
    stroke(255,0,0); // waveform is red
    strokeWeight(1);
    for (var i = 0; i < wave.length; i++){
      var x = map(i, 0, wave.length, 0, width);
      var y = map( wave[i], -1, 1, 0, height);
      vertex(x,y);
    }
  endShape();
}
