
// initialize map
mapboxgl.accessToken = 'pk.eyJ1Ijoic3RlcGhrb2x0dW4iLCJhIjoiVXJJT19CQSJ9.kA3ZPQxKKHNngVAoXqtFzA';

var map = new mapboxgl.Map({
    container: 'map',
    // satellite imagery styling
    style: 'mapbox://styles/stephkoltun/cjcapx5je1wql2so4uigw0ovc',
    // set the start point of the map - needs to be long-lat (not lat-long)
    center: [-73.973773,40.712354],    // this should be a random point
    zoom: 11,   // 10 - what scale
    maxBounds: bounds,
    interactive: false,
});

// coords to set max map area
// Southwest coordinates and Northeast coordinates
var bounds = [-74.238132, 40.818576, -73.747180, 40.618473];
// var colors = ["#c1272d","#009245","#006837"]
var lastMaskVisible = false;
var lastMask;
var maskTimer;

var showText = true;

var layersArray = [
    {
        //boundName: "boroBound",
        boundId: "boro-boundary",
        maskObj: boroMask,
        maskName: "boroMask",
        maskId: "boro-mask",
        name: "Boroughs",
        color: "#2e3192"
    },
    {
        //boundName: "mapzenLandBound",
        boundId: "mapzenLand-boundary",
        maskObj: mapzenLandMask,
        maskName: "mapzenLandMask",
        maskId: "mapzenLand-mask",
        name: "Land",
        color: "#39b54a"
    },
    {
        //boundName: "mapzenCostBound",
        boundId: "mapzenCoast-boundary",
        maskObj: mapzenCoastMask,
        maskName: "mapzenCoastMask",
        maskId: "mapzenCoast-mask",
        name: "Coastline",
        color: "#29abe2"
    },
    {
        //boundName: "agricBound",
        boundId: "agric-boundary",
        maskObj: agricMask,
        maskName: "agricMask",
        maskId: "agric-mask",
        name: "Agriculture",
        color: "#9e005d"
    },
    {
        //boundName: "municCourtBound",
        boundId: "municCourt-boundary",
        maskObj: municCourtMask,
        maskName: "municCourtMask",
        maskId: "municCourt-mask",
        name: "Municipal Courts",
        color: "#ed1c24"
    },
    {
        //boundName: "neighborBound",
        boundId: "neighbor-boundary",
        maskObj: neighborMask,
        maskName: "neighborMask",
        maskId: "neighbor-mask",
        name: "Neighborhoods",
        color: "#662d91"
    },
    {
        //boundName: "censusCountyBound",
        boundId: "censusCounty-boundary",
        maskObj: censusCountyMask,
        maskName: "censusCountyMask",
        maskId: "censusCounty-mask",
        name: "Cencus Counties",
        color: "#93278f"
    },
    {
        //boundName: "geologyBound",
        boundId: "geology-boundary",
        maskObj: geologyMask,
        maskName: "geologyMask",
        maskId: "geology-mask",
        name: "Geology",
        color: "#1b1464"
    },
    {
        //boundName: "estSedBound",
        boundId: "estSed-boundary",
        maskObj: estSedMask,
        maskName: "estSedMask",
        maskId: "estSed-mask",
        name: "Estuary Sedimentation",
        color: "#d4145a"
    },
    {
        //boundName: "riverSedBound",
        boundId: "riverSed-boundary",
        maskObj: riverSedMask,
        maskName: "riverSedMask",
        maskId: "riverSed-mask",
        name: "River Sedimentation",
        color: "#fbb03b"
    },
    {
        //boundName: "parksPropsBound",
        boundId: "parksProps-boundary",
        maskObj: parksPropsMask,
        maskName: "parksPropsMask",
        maskId: "parksProps-mask",
        name: "Park Properties",
        color: "#22b573"
    },
    {
        //boundName: "censusTractBound",
        boundId: "censusTract-boundary",
        maskObj: censusTractMask,
        maskName: "censusTractMask",
        maskId: "censusTract-mask",
        name: "Cencus Tract",
        color: "#f15a24"
    },
    {
        //boundName: "coastalBound",
        boundId: "coastal-boundary",
        maskObj: coastalMask,
        maskName: "coastalMask",
        maskId: "coastal-mask",
        name: "Coastal Edge",
        color:"#00a99d"
    },
    {
        //boundName: "freshFoodBound",
        boundId: "freshFood-boundary",
        maskObj: freshFoodMask,
        maskName: "freshFoodMask",
        maskId: "freshFood-mask",
        name: "Fresh Food Areas",
        color: "#8cc63f"
    },
    {
        //boundName: "waterfrontParksBound",
        boundId: "waterfrontParks-boundary",
        maskObj: waterfrontParksMask,
        maskName: "waterfrontParksMask",
        maskId: "waterfrontParks-mask",
        name: "Waterfront Parks",
        color: "#0071bc"
    },
    {
        //boundName: "zipcodeBound",
        boundId: "zipcode-boundary",
        maskObj: zipcodeMask,
        maskName: "zipcodeMask",
        maskId: "zipcode-mask",
        name: "Zipcodes",
        color: "#ed1e79"
    },
    {
        //boundName: "cableBound",
        boundId: "cable-boundary",
        maskObj: cableMask,
        maskName: "cableMask",
        maskId: "cable-mask",
        name: "Cable Zones",
        color: "#d9e021"
    },
    {
        //boundName: "historicBound",
        boundId: "historic-boundary",
        maskObj: historicMask,
        maskName: "historicMask",
        maskId: "historic-mask",
        name: "Historic Districts",
        color: "#f7931e"
    },
    {
        //boundName: "hydrographyBound",
        boundId: "hydrography-boundary",
        maskObj: hydrographyMask,
        maskName: "hydrographyMask",
        maskId: "hydrography-mask",
        name: "Hydrography",
        color: "#d9e021"
    },
];

$(document).keydown(function(e) {
  if ( e.which == 84 ) {
   showText = !showText;
  }
})

map.on('load', function () {
    console.log("map is loaded");

    map.addSource('satellite', {
        type: 'raster',
        url: 'mapbox://mapbox.satellite'
    });

    map.addLayer({
      'id':'background',
      'type':'background',
      'paint': {
          'background-color': '#FFF'
      }
    })

    map.addLayer({
        'id': 'satellite',
        'type': 'raster',
        'source': 'satellite',
        'source-layer': 'contour',
        'paint': {
            'raster-opacity': 0
        }
    });

    for (var i = 0; i < layersArray.length; i++) {
        var thisLayer = layersArray[i];
        var boundaryId = thisLayer.boundId;

        // use the mask for both boundary and mask
        map.addSource(thisLayer.maskName, {
            "type": "geojson",
            "data": thisLayer.maskObj
        });

        // add boundary
        map.addLayer({
            "id": boundaryId,
            "type": "line",
            "source": thisLayer.maskName,
            "paint": {
                "line-color": thisLayer.color ? thisLayer.color : '#FFF',
                "line-width": 0.5
            },
            "metadata": {
              "displaylabel": thisLayer.name
            }
        });
    }
});





map.on('click', function(e) {
    // set bbox as 5px reactangle area around clicked point
    var bbox = [[e.point.x - 5, e.point.y - 5], [e.point.x + 5, e.point.y + 5]];
    var features = map.queryRenderedFeatures(bbox);

    if (features.length > 0) {
      var clickedLayer = features[0].layer.id;

      var fillColor = map.getPaintProperty(clickedLayer, 'line-color');

      if (showText) {
        // add text
        var label = "<p class='label'>"+ features[0].layer.metadata.displaylabel + "</p>";

        $("body").append(label);
        $(".label").css("top", (e.point.y - 15)).css("left", (e.point.x + 15));
      }


      if (clickedLayer == "boro-boundary") {
          console.log("over boro");
          showMask("boro-mask", "boroMask", fillColor);
      } else if (clickedLayer == "estShore-boundary") {
          console.log("over est shore");
          showMask("estShore-mask", "estShoreMask", fillColor);
      } else if (clickedLayer == "quad-boundary") {
          console.log("over est shore");
          showMask("quad-mask", "quadMask", fillColor);
      } else if (clickedLayer == "mapzenCoast-boundary") {
          console.log("over mapzen coast");
          showMask("mapzenCoast-mask", "mapzenCoastMask", fillColor);
      }else if (clickedLayer == "mapzenLand-boundary") {
          console.log("over mapzen land");
          showMask("mapzenLand-mask", "mapzenLandMask", fillColor);
      } else if (clickedLayer == "agric-boundary") {
          console.log("over census agric");
          showMask("agric-mask", "agricMask", fillColor);
      } else if (clickedLayer == "municCourt-boundary") {
          console.log("over munic court");
          showMask("municCourt-mask", "municCourtMask", fillColor);
      } else if (clickedLayer == "neighbor-boundary") {
          console.log("over neighbor");
          showMask("neighbor-mask", "neighborMask", fillColor);
      } else if (clickedLayer == "parksProps-boundary") {
          console.log("over parks props");
          showMask("parksProps-mask", "parksPropsMask", fillColor);
      } else if (clickedLayer == "zoningQuarter-boundary") {
          console.log("over zoningQuarter");
          showMask("zoningQuarter-mask", "zoningQuarterMask", fillColor);
      } else if (clickedLayer == "zoningSection-boundary") {
          console.log("over zoningSection");
          showMask("zoningSection-mask", "zoningSectionMask", fillColor);
      } else if (clickedLayer == "censusCounty-boundary") {
          console.log("over censusCounty");
          showMask("censusCounty-mask", "censusCountyMask", fillColor);
      } else if (clickedLayer == "geology-boundary") {
          console.log("over geology");
          showMask("geology-mask", "geologyMask", fillColor);
      } else if (clickedLayer == "estSed-boundary") {
          console.log("over estSed");
          showMask("estSed-mask", "estSedMask", fillColor);
      } else if (clickedLayer == "riverSed-boundary") {
          console.log("over riverSed");
          showMask("riverSed-mask", "riverSedMask", fillColor);
      } else if (clickedLayer == "censusTract-boundary") {
          console.log("over censusTract");
          showMask("censusTract-mask", "censusTractMask", fillColor);
      } else if (clickedLayer == "coastal-boundary") {
          console.log("over coastal");
          showMask("coastal-mask", "coastalMask", fillColor);
      } else if (clickedLayer == "freshFood-boundary") {
          console.log("over freshFood");
          showMask("freshFood-mask", "freshFoodMask", fillColor);
      } else if (clickedLayer == "waterfrontParks-boundary") {
          console.log("over waterfrontParks");
          showMask("waterfrontParks-mask", "waterfrontParksMask", fillColor);
      } else if (clickedLayer == "zipcode-boundary") {
          console.log("over zipcode");
          showMask("zipcode-mask", "zipcodeMask", fillColor);
      } else if (clickedLayer == "cable-boundary") {
          console.log("over cable");
          showMask("cable-mask", "cableMask", fillColor);
      } else if (clickedLayer == "dsny-boundary") {
          console.log("over dsny");
          showMask("dsny-mask", "dsnyMask", fillColor);
      } else if (clickedLayer == "historic-boundary") {
          console.log("over historic");
          showMask("historic-mask", "historicMask", fillColor);
      } else if (clickedLayer == "hydrography-boundary") {
          console.log("over hydrography");
          showMask("hydrography-mask", "hydrographyMask", fillColor);
      }
  }
});

function showMask(maskId, maskSource, color) {
    if (lastMaskVisible == true) {
        clearTimeout(maskTimer);
        map.removeLayer(lastMask)
    }

    map.addLayer({
        "id": maskId,
        "type": "fill",
        "source": maskSource,
        "paint": {
            "fill-color": "#FFF",
            "fill-opacity": 0.9999
        },
    });

    map.setPaintProperty('background','background-color', color);

    lastMask = maskId;
    lastMaskVisible = true;
    startTimer();
    //map.setPaintProperty('satellite', 'raster-opacity', 1);

    for (var i = 0; i < layersArray.length; i++) {
        if (layersArray[i].maskId != maskId) {
            map.setLayoutProperty(layersArray[i].boundId, 'visibility', 'none');
        } else {
            map.setLayoutProperty(layersArray[i].boundId, 'visibility', 'visible');
        }
    }

}

function clearMask() {
    console.log("clear mask and satellite");

    $(".label").remove();

    map.setPaintProperty('background','background-color', "#FFF");

    map.removeLayer(lastMask);
    lastMaskVisible = false;
    lastMask = null;
    //map.setPaintProperty('satellite', 'raster-opacity', 0);

    for (var i = 0; i < layersArray.length; i++) {
      map.setLayoutProperty(layersArray[i].boundId, 'visibility', 'visible');
    }
}

function startTimer() {
    console.log("startTimer");
    maskTimer = setTimeout("clearMask()", 2500);
}
