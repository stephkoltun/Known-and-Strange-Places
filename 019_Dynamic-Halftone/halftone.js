$(document).ready(function () {

    var centerPt = [40.648063, -73.972526];
    //var centerPt = [40.575162,-73.946886];

  var aerialmap = L.map('aerialmap', {attributionControl: false, zoomControl:false}).setView(centerPt, 17); 
  var aerialtile = L.tileLayer('Flatbush-Ditmas-Park/Flatbush-Ditmas-Park_RGB/{z}/{x}/{y}.png', {
//var aerialtile = L.tileLayer('Coney-AER/{z}/{x}/{y}.png', {
    minZoom: 17,
    maxZoom: 17,
    tms: true,
  }).addTo(aerialmap);
  //L.control.layers({'Coney-AER':aerialtile}).addTo(aerialmap);

  var irmap = L.map('irmap', {attributionControl: false, zoomControl: false}).setView(centerPt, 17);
  var irtile = L.tileLayer('Flatbush-Ditmas-Park/Flatbush-Ditmas-Park_IR/{z}/{x}/{y}.png', {
  //var irtile = L.tileLayer('Coney-IR-RED/{z}/{x}/{y}.png', {
    minZoom: 17,
    maxZoom: 17,
    tms: true,
  }).addTo(irmap);
  //L.control.layers({'Coney-IR':irtile}).addTo(irmap);

  var demmap = L.map('demmap', {attributionControl: false, zoomControl: false}).setView(centerPt, 17);
  var demtile = L.tileLayer('Flatbush-Ditmas-Park/Flatbush-Ditmas-Park_DEM/{z}/{x}/{y}.png', {
    minZoom: 17,
    maxZoom: 17,
    tms: true,
  }).addTo(demmap);


  aerialtile.on('load', function() {
    console.log("layer loaded");

    // $("#aerialmap").css("opacity", 1);
    // $("#irmap").css("opacity", 1);

    // get the aerial map canvas
    html2canvas(document.querySelector("#aerialmap")).then(function(aercanvas) {
      //document.body.appendChild(aercanvas);
      // get the aerial 2D canvas
      prevAERContext = aercanvas.getContext("2d");

      html2canvas(document.querySelector("#irmap")).then(function(ircanvas) {
        //document.body.appendChild(ircanvas);
        // get the aerial 2D canvas
        prevIRContext = ircanvas.getContext("2d");

        html2canvas(document.querySelector("#demmap")).then(function(demcanvas) {
        //document.body.appendChild(ircanvas);
        // get the aerial 2D canvas
            prevDEMContext = demcanvas.getContext("2d");

            $("#aerialmap").css("opacity", 0);
            $("#irmap").css("opacity", 0);
            $("#demmap").css("opacity", 0);

            generateHalftone();
        });
      });
    });
  });// end of loading my tiles
}); // end of document ready

var prevAERContext;
var prevIRContext;
var prevDEMContext;
var nSubs = 50;
var imgWidth = 600;
var subSize = imgWidth/nSubs;
var totalSubs = nSubs*nSubs;
var aerXOffset = 1;
var aerYOffset = 1;
var irXOffset = -3;
var irYOffset = -3;
var demXOffset = -4;
var demYOffset = 4;


subsizeSlider.oninput = function() {
    //console.log("prev size: " + subSize);
    subSize = parseInt(this.value);
    //console.log("new size: " + subSize);
    nSubs = Math.ceil(imgWidth/subSize);
    generateHalftone();
}

aerXSlider.oninput = function() {
    aerXOffset = parseInt(this.value);
    generateHalftone();
}

aerYSlider.oninput = function() {
    aerYOffset = parseInt(this.value);
    generateHalftone();
}

irXSlider.oninput = function() {
    irXOffset = parseInt(this.value);
    generateHalftone();
}

irYSlider.oninput = function() {
    irYOffset = parseInt(this.value);
    generateHalftone();
}

demXSlider.oninput = function() {
    demXOffset = parseInt(this.value);
    generateHalftone();
}

demYSlider.oninput = function() {
    demYOffset = parseInt(this.value);
    generateHalftone();
}


function generateHalftone(prevCan) {
    console.log("generate halftone");
    var halftone2D = document.getElementById("halftone");
    var halftoneCxt = halftone2D.getContext("2d");
    
    halftoneCxt.clearRect(0, 0, halftone2D.width, halftone2D.height);

    halftoneCxt.rect(0,0,halftone2D.width,halftone2D.height);
    halftoneCxt.fillStyle = "rgb(255, 255, 255)";
    halftoneCxt.fill();
    
    for (var m = 0; m < imgWidth; m+=subSize) {
        for (var n = 0; n < imgWidth; n+=subSize) {
    
            // get the AER subdiv
            var aerImage = prevAERContext.getImageData(m, n, subSize, subSize);
            var aerData = aerImage.data;

            var irImage = prevIRContext.getImageData(m, n, subSize, subSize);
            var irData = irImage.data;

            var demImage = prevDEMContext.getImageData(m, n, subSize, subSize);
            var demData = demImage.data;
    
            assemblePixels(aerData, m, n, "aer")
                .then(function(subdivPixels) {
                    //console.log(subdivPixels);
            
                    var hslData = subdivPixels.hslArray;
                    var maxBrightness = subdivPixels.maxBrightness;
                    var minBrightness = subdivPixels.minBrightness;
                    var avgBrightness = subdivPixels.totalBrightness/hslData.length;
            
                    var radius = mapVal(avgBrightness, 0.0, 1.0, 0.0, subSize/2.5);   // brighter = bigger
            
                    var x = subdivPixels.xCenter + aerXOffset;
                    var y = subdivPixels.yCenter + aerYOffset;
            
                    halftoneCxt.beginPath();
                    halftoneCxt.arc(x, y, radius, 0, 2 * Math.PI, false);
                    halftoneCxt.fillStyle = "rgba(0, 0, 255, .5)";
                    halftoneCxt.fill();
            
                    // this is the center reference
                    // halftoneCxt.beginPath();
                    // halftoneCxt.arc(subdivPixels.xCenter, subdivPixels.yCenter, 1, 0, 2 * Math.PI, false);
                    // halftoneCxt.fillStyle = 'black';
                    // halftoneCxt.fill();
                })

            assemblePixels(irData, m, n, "ir")
                .then(function(subdivPixels) {
                    //console.log(subdivPixels);
                    var avgRed = subdivPixels.avgRed;
                    var radius = mapVal(avgRed, 0.0, 255.0, 0.0, subSize/2.5);
            
                    var x = subdivPixels.xCenter + irXOffset;
                    var y = subdivPixels.yCenter + irYOffset;
            
                    halftoneCxt.beginPath();
                    halftoneCxt.arc(x, y, radius, 0, 2 * Math.PI, false);
                    // halftoneCxt.rect(x,y,radius*2,radius*2);
                    halftoneCxt.fillStyle = "rgba(0, 255, 0, .5)";
                    halftoneCxt.fill();
                })

            assemblePixels(demData, m, n, "dem")
                .then(function(subdivPixels) {
                    //console.log(subdivPixels);
                    var hslData = subdivPixels.hslArray;
                    //console.log(hslData);
                    var maxBrightness = subdivPixels.maxBrightness;
                    var minBrightness = subdivPixels.minBrightness;
                    var avgBrightness = subdivPixels.totalBrightness/hslData.length;
            
                    var radius = mapVal(avgBrightness, 0.0, 1.0, 0.0, subSize/2.5);
            
                    var x = subdivPixels.xCenter + demXOffset;
                    var y = subdivPixels.yCenter + demYOffset;
            
                    //halftoneCxt.beginPath();
                    //halftoneCxt.arc(x, y, radius, 0, 2 * Math.PI, false);
                    halftoneCxt.beginPath();
                    halftoneCxt.arc(x, y, radius, 0, 2 * Math.PI, false);
                    halftoneCxt.fillStyle = "rgba(255, 0, 0, .5)";
                    halftoneCxt.fill();
                })
        }
    }
}

function assemblePixels(unsorted_array, m, n, mode) {
    return new Promise(function(resolve, reject) {

        var pixelInfo = {
            'hslArray': [],
            'maxBrightness': 0,
            'minBrightness': 1,
            'totalBrightness': 0,
            'maxGreen': 0,
            'minGreen': 1,
            'avgGreen': 0,
            'maxRed': 0,
            'minRed': 1,
            'avgRed': 0,
            'mVal': m,
            'nVal': n,
            'xCenter': m+subSize/2,
            'yCenter': n+subSize/2,
        }

        var totalGreen = 0;
        var totalRed = 0;

        // assemble arrays
        for (var k = 0; k < unsorted_array.length; k += 4) {
            var red = unsorted_array[k];
            var green = unsorted_array[k+1];
            var blue = unsorted_array[k+2];

            totalGreen += green;
            totalRed += red;

           var hsl = rgbToHsl(red,green,blue); // each is mapped from 0 to 1
            pixelInfo.hslArray.push({
                'h': hsl[0],
                's': hsl[1],
                'l': hsl[2],
            });
            if (hsl[2] > pixelInfo.maxBrightness) {
                pixelInfo.maxBrightness = hsl[2];
            }
            if (hsl[2] < pixelInfo.mixBrightness) {
                pixelInfo.mixBrightness = hsl[2]
            }
            pixelInfo.totalBrightness += hsl[2];

            if (green > pixelInfo.maxGreen) {
                pixelInfo.maxGreen = green;
            }
            if (green < pixelInfo.minGreen) {
                pixelInfo.minGreen = green;
            }

            if (red > pixelInfo.maxRed) {
                pixelInfo.maxRed = red;
            }
            if (red < pixelInfo.minRed) {
                pixelInfo.minRed = red;
            } 

        }

        pixelInfo.avgGreen = totalGreen/(unsorted_array.length/4);
        pixelInfo.avgRed = totalRed/(unsorted_array.length/4);

        resolve(pixelInfo);
    })
}

function mapVal(value, istart, istop, ostart, ostop) {
    return ostart + ( ostop - ostart ) * ( ( value - istart ) / ( istop - istart ) );
}


function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}
