
// initialize map
mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlcGhrb2x0dW4iLCJhIjoiVXJJT19CQSJ9.kA3ZPQxKKHNngVAoXqtFzA';

var map = new mapboxgl.Map({
    container: 'map',
    // satellite imagery styling
    style: 'mapbox://styles/stephkoltun/cjcapx5je1wql2so4uigw0ovc',
    // set the start point of the map - needs to be long-lat (not lat-long)
    center: [-73.9926559, 40.7159975],    // this should be a random point
    zoom: 10,   // 10 - what scale
    //maxBounds: bounds,
    //interactive: false,
});

// coords to set max map area
// Southwest coordinates and Northeast coordinates
var bounds = [-74.238132, 40.818576, -73.747180, 40.618473];
var colors = ["#c2ab33", "#22d316", "#0133dd", "#a24603", "#ddab33", "#c71233", "#dda123", "#a074bd", "#1d2faf", "#413b77", "#52ce2d", "#d3f873", "#49b2c3", "#bff24e", "#a37976", "#248c13", "#c745c9", "#fcba3c", "#ad3348", "#d3b0bb", "#164f35", "#a2afa4", "#9472c9"];
var lastMaskVisible = false;
var lastMask;
var maskTimer;

map.on('load', function () {
    console.log("map is loaded");

    map.addSource('satellite', {
        type: 'raster',
        url: 'mapbox://mapbox.satellite'
    });

    map.addLayer({
        'id': 'satellite',
        'type': 'raster',
        'source': 'satellite',
        'source-layer': 'contour',
        'paint': {
            'raster-opacity': 0
        }
    });

    var layersArray = [
    {
        boundName: "quadBound",
        boundId: "quad-boundary",
        maskObj: quadMask,
        maskName: "quadMask",
        maskId: "quad-mask",
    },
    {
        boundName: "estShoreBound",
        boundId: "estShore-boundary",
        maskObj: estShoreMask,
        maskName: "estShoreMask",
        maskId: "estShore-mask",
    },
    {
        boundName: "boroBound",
        boundId: "boro-boundary",
        maskObj: boroMask,
        maskName: "boroMask",
        maskId: "boro-mask",
    },
    {
        boundName: "mapzenLandBound",
        boundId: "mapzenLand-boundary",
        maskObj: mapzenLandMask,
        maskName: "mapzenLandMask",
        maskId: "mapzenLand-mask",
    },
    {
        boundName: "mapzenCostBound",
        boundId: "mapzenCoast-boundary",
        maskObj: mapzenCoastMask,
        maskName: "mapzenCoastMask",
        maskId: "mapzenCoast-mask",
    },
    {
        boundName: "agricBound",
        boundId: "agric-boundary",
        maskObj: agricMask,
        maskName: "agricMask",
        maskId: "agric-mask",
    },
    {
        boundName: "municCourtBound",
        boundId: "municCourt-boundary",
        maskObj: municCourtMask,
        maskName: "municCourtMask",
        maskId: "municCourt-mask",
    },
    {
        boundName: "neighborBound",
        boundId: "neighbor-boundary",
        maskObj: neighborMask,
        maskName: "neighborMask",
        maskId: "neighbor-mask",
    },
    {
        boundName: "parksPropsBound",
        boundId: "parksProps-boundary",
        maskObj: parksPropsMask,
        maskName: "parksPropsMask",
        maskId: "parksProps-mask",
    },
    {
        boundName: "zoningQuarterBound",
        boundId: "zoningQuarter-boundary",
        maskObj: zoningQuarterMask,
        maskName: "zoningQuarterMask",
        maskId: "zoningQuarter-mask",
    },
    {
        boundName: "zoningSectionBound",
        boundId: "zoningSection-boundary",
        maskObj: zoningSectionMask,
        maskName: "zoningSectionMask",
        maskId: "zoningSection-mask",
    },
    {
        boundName: "censusCountyBound",
        boundId: "censusCounty-boundary",
        maskObj: censusCountyMask,
        maskName: "censusCountyMask",
        maskId: "censusCounty-mask",
    },
    {
        boundName: "geologyBound",
        boundId: "geology-boundary",
        maskObj: geologyMask,
        maskName: "geologyMask",
        maskId: "geology-mask",
    },
    {
        boundName: "estSedBound",
        boundId: "estSed-boundary",
        maskObj: estSedMask,
        maskName: "estSedMask",
        maskId: "estSed-mask",
    },
    {
        boundName: "riverSedBound",
        boundId: "riverSed-boundary",
        maskObj: riverSedMask,
        maskName: "riverSedMask",
        maskId: "riverSed-mask",
    },
    {
        boundName: "censusTractBound",
        boundId: "censusTract-boundary",
        maskObj: censusTractMask,
        maskName: "censusTractMask",
        maskId: "censusTract-mask",
    },
    {
        boundName: "coastalBound",
        boundId: "coastal-boundary",
        maskObj: coastalMask,
        maskName: "coastalMask",
        maskId: "coastal-mask",
    },
    {
        boundName: "freshFoodBound",
        boundId: "freshFood-boundary",
        maskObj: freshFoodMask,
        maskName: "freshFoodMask",
        maskId: "freshFood-mask",
    },
    {
        boundName: "waterfrontParksBound",
        boundId: "waterfrontParks-boundary",
        maskObj: waterfrontParksMask,
        maskName: "waterfrontParksMask",
        maskId: "waterfrontParks-mask",
    },
    {
        boundName: "zipcodeBound",
        boundId: "zipcode-boundary",
        maskObj: zipcodeMask,
        maskName: "zipcodeMask",
        maskId: "zipcode-mask",
    },
    {
        boundName: "cableBound",
        boundId: "cable-boundary",
        maskObj: cableMask,
        maskName: "cableMask",
        maskId: "cable-mask",
    },
    {
        boundName: "historicBound",
        boundId: "historic-boundary",
        maskObj: historicMask,
        maskName: "historicMask",
        maskId: "historic-mask",
    },
    {
        boundName: "hydrographyBound",
        boundId: "hydrography-boundary",
        maskObj: hydrographyMask,
        maskName: "hydrographyMask",
        maskId: "hydrography-mask",
    },
    ];



    for (var i = 0; i < layersArray.length; i++) {
        var thisLayer = layersArray[i];

        // use the mask for both boundary and mask
        map.addSource(thisLayer.maskName, {
            "type": "geojson",
            "data": thisLayer.maskObj
        });

        // add boundary
        map.addLayer({
            "id": thisLayer.boundId,
            "type": "line",
            "source": thisLayer.maskName,
            "paint": {
                "line-color": colors[i],
                "line-width": 0.5
            },
        });
    }  
});





map.on('click', function(e) {
    // set bbox as 5px reactangle area around clicked point
    var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
    var features = map.queryRenderedFeatures(bbox);

    if (features.length > 0) {
    var clickedLayer = features[0].layer.id;
        if (clickedLayer == "boro-boundary") {
            console.log("over boro");
            showMask("boro-mask", "boroMask");
        } else if (clickedLayer == "estShore-boundary") {
            console.log("over est shore");
            showMask("estShore-mask", "estShoreMask");
        } else if (clickedLayer == "quad-boundary") {
            console.log("over est shore");
            showMask("quad-mask", "quadMask");
        } else if (clickedLayer == "mapzenCoast-boundary") {
            console.log("over mapzen coast"); 
            showMask("mapzenCoast-mask", "mapzenCoastMask");
        }else if (clickedLayer == "mapzenLand-boundary") {
            console.log("over mapzen land"); 
            showMask("mapzenLand-mask", "mapzenLandMask");
        } else if (clickedLayer == "agric-boundary") {
            console.log("over census agric"); 
            showMask("agric-mask", "agricMask");
        } else if (clickedLayer == "municCourt-boundary") {
            console.log("over munic court"); 
            showMask("municCourt-mask", "municCourtMask");
        } else if (clickedLayer == "neighbor-boundary") {
            console.log("over neighbor"); 
            showMask("neighbor-mask", "neighborMask");
        } else if (clickedLayer == "parksProps-boundary") {
            console.log("over parks props"); 
            showMask("parksProps-mask", "parksPropsMask");
        } else if (clickedLayer == "zoningQuarter-boundary") {
            console.log("over zoningQuarter"); 
            showMask("zoningQuarter-mask", "zoningQuarterMask");
        } else if (clickedLayer == "zoningSection-boundary") {
            console.log("over zoningSection"); 
            showMask("zoningSection-mask", "zoningSectionMask");
        } else if (clickedLayer == "censusCounty-boundary") {
            console.log("over censusCounty"); 
            showMask("censusCounty-mask", "censusCountyMask");
        } else if (clickedLayer == "geology-boundary") {
            console.log("over geology"); 
            showMask("geology-mask", "geologyMask");
        } else if (clickedLayer == "estSed-boundary") {
            console.log("over estSed"); 
            showMask("estSed-mask", "estSedMask");
        } else if (clickedLayer == "riverSed-boundary") {
            console.log("over riverSed"); 
            showMask("riverSed-mask", "riverSedMask");
        } else if (clickedLayer == "censusTract-boundary") {
            console.log("over censusTract"); 
            showMask("censusTract-mask", "censusTractMask");
        } else if (clickedLayer == "coastal-boundary") {
            console.log("over coastal"); 
            showMask("coastal-mask", "coastalMask");
        } else if (clickedLayer == "freshFood-boundary") {
            console.log("over freshFood"); 
            showMask("freshFood-mask", "freshFoodMask");
        } else if (clickedLayer == "waterfrontParks-boundary") {
            console.log("over waterfrontParks"); 
            showMask("waterfrontParks-mask", "waterfrontParksMask");
        } else if (clickedLayer == "zipcode-boundary") {
            console.log("over zipcode"); 
            showMask("zipcode-mask", "zipcodeMask");
        } else if (clickedLayer == "cable-boundary") {
            console.log("over cable"); 
            showMask("cable-mask", "cableMask");
        } else if (clickedLayer == "dsny-boundary") {
            console.log("over dsny"); 
            showMask("dsny-mask", "dsnyMask");
        } else if (clickedLayer == "historic-boundary") {
            console.log("over historic"); 
            showMask("historic-mask", "historicMask");
        } else if (clickedLayer == "hydrography-boundary") {
            console.log("over hydrography"); 
            showMask("hydrography-mask", "hydrographyMask");
        }
    }
});

function showMask(maskId, maskSource) {
    if (lastMaskVisible == true) {
        clearTimeout(maskTimer);
        map.removeLayer(lastMask)
    } 

    map.addLayer({
        "id": maskId,
        "type": "fill",
        "source": maskSource,
        "paint": {
            "fill-color": "#fff",
            "fill-opacity": 0.9999
        },
    });
        
    lastMask = maskId;
    lastMaskVisible = true;
    startTimer();
    map.setPaintProperty('satellite', 'raster-opacity', 1);
}

function clearMask() {
    console.log("clear mask and satellite");
    map.removeLayer(lastMask);
    lastMaskVisible = false;
    lastMask = null;
    map.setPaintProperty('satellite', 'raster-opacity', 0);
}

function startTimer() {
    console.log("startTimer");
    maskTimer = setTimeout("clearMask()", 3500);
}






