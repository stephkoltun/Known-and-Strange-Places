
// initialize map
mapboxgl.accessToken = key;

var IRmap = new mapboxgl.Map({
    container: 'IRmap',
    // IR imagery
    //style: 'mapbox://styles/stephkoltun/cjcthb4ui12ir2ro9r05wrr9k',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [-73.945561, 40.574217],
    zoom: 15,   // 10 - what scale
});

//map.scrollZoom.disable();
//map.doubleClickZoom.disable();

var nSubs = 20;
var imgWidth = 800;
var subSize = imgWidth/nSubs;
var totalSubs = nSubs*nSubs;
// use this to update halftone when map is dragged
var prevIRContext;


IRmap.on('load', function () {
    console.log("map is loaded");

    //redraw the map
    IRmap.on('render', function() {
        // get the mapbox webGL canvas
        var canvasAll = document.getElementsByClassName("mapboxgl-canvas");
        var canvas = canvasAll[0];

        // get the 2D canvas
        var canvas2D = document.getElementById("imgmap");
        var ctx2D = canvas2D.getContext("2d");
        // draw the webGL canvas as an image to the 2D canvas
        ctx2D.drawImage(canvas, 0, 0);
        prevIRContext = ctx2D;
        generateHalftone();
    })
});


subsizeSlider.oninput = function() {
    //console.log("prev size: " + subSize);
    subSize = parseInt(this.value);
    //console.log("new size: " + subSize);
    nSubs = Math.ceil(imgWidth/subSize);
    console.log("num of subs:" + nSubs);
    generateHalftone();
}

xOffsetSlider.oninput = function() {
    xOffset = parseInt(this.value);
    generateHalftone();
}

yOffsetSlider.oninput = function() {
    yOffset = parseInt(this.value);
    generateHalftone();
}

var xOffset = 3;
var yOffset = 3;

function generateHalftone() {
    var halftone2D = document.getElementById("halftone");
    var halftoneCxt = halftone2D.getContext("2d");
    halftoneCxt.clearRect(0, 0, halftone2D.width, halftone2D.height);
    
    for (var m = 0; m < imgWidth; m+=subSize) {
        for (var n = 0; n < imgWidth; n+=subSize) {

            // get the target subdivision
            var pixelImage = prevIRContext.getImageData(m, n, subSize, subSize);
            // grab the pixels
            var pixelData = pixelImage.data;
            //console.log(pixelData);

            assemblePixels(pixelData, m, n)
                .then(function(subdivPixels) {
                    //console.log(subdivPixels);

                    var hslData = subdivPixels.hslArray;
                    var maxBrightness = subdivPixels.maxBrightness;  
                    var minBrightness = subdivPixels.minBrightness;
                    var avgBrightness = subdivPixels.totalBrightness/hslData.length;

                    var radius = mapVal(avgBrightness, 0.0, 1.0, 0.0, subSize/2);   // brighter = bigger

                    var x = subdivPixels.xCenter + xOffset;
                    var y = subdivPixels.yCenter + yOffset;

                    halftoneCxt.beginPath();
                    halftoneCxt.arc(x, y, radius, 0, 2 * Math.PI, false);
                    halftoneCxt.fillStyle = "rgba(0, 120, 255, 0.5)";
                    halftoneCxt.fill();

                    var greenRadius = mapVal(subdivPixels.avgGreen, 0, subdivPixels.maxGreen, 0.0, subSize/2);   // brighter = bigger

                    var xGreen = subdivPixels.xCenter - 5;
                    var yGreen = subdivPixels.yCenter - 7;

                    halftoneCxt.beginPath();
                    halftoneCxt.arc(xGreen, yGreen, greenRadius, 0, 2 * Math.PI, false);
                    halftoneCxt.fillStyle = "rgba(0, 255, 100, 0.5)";
                    halftoneCxt.fill();


                    // this is the center reference
                    halftoneCxt.beginPath();
                    halftoneCxt.arc(subdivPixels.xCenter , subdivPixels.yCenter , 1, 0, 2 * Math.PI, false);
                    halftoneCxt.fillStyle = 'black';
                    halftoneCxt.fill();
                })
        }
    }
}

function assemblePixels(unsorted_array, m, n) {
    return new Promise(function(resolve, reject) {
        var pixelInfo = {
            'hslArray': [],
            'maxBrightness': 0,
            'minBrightness': 1,
            'totalBrightness': 0,
            'maxGreen': 0,
            'minGreen': 1,
            'avgGreen': 0,
            'mVal': m,
            'nVal': n,
            'xCenter': m+subSize/2,
            'yCenter': n+subSize/2,
        }

        var totalGreen = 0;

        // assemble arrays
        for (var k = 0; k < unsorted_array.length; k += 4) {
            var red = unsorted_array[k]; 
            var green = unsorted_array[k+1];  
            var blue = unsorted_array[k+2]; 

            totalGreen += green;

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


        }

        pixelInfo.avgGreen = totalGreen/(unsorted_array.length/4);

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






