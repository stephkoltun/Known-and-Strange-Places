// initialize map
mapboxgl.accessToken = key;

var datasets = [
  cemeteryOne.features,
  cemeteryTwo.features,
  cemeteryThree.features,
  cemeteryFour.features,
  cemeteryFive.features,
  cemeterySix.features,
  housingOne.features,
  housingTwo.features,
  housingThree.features,
  housingFour.features,
]

var currentTop = "remix"; // or alt

var randomStart = Math.floor(Math.random() * Math.floor(datasets.length));

var curDatasetIndex = randomStart;
var data = datasets[curDatasetIndex];
var remixIndex = 1;
var altIndex = 2;

let context = new mapboxgl.Map({
    container: 'context',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: data[0].geometry.coordinates,
    zoom: 16,
});

let remix = new mapboxgl.Map({
    container: 'remix',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: data[remixIndex].geometry.coordinates,
    zoom: 16,
});

let altremix = new mapboxgl.Map({
    container: 'altremix',
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: data[altIndex].geometry.coordinates,
    zoom: 16,
});

context.scrollZoom.disable();
context.doubleClickZoom.disable();
remix.scrollZoom.disable();
remix.doubleClickZoom.disable();
altremix.scrollZoom.disable();
altremix.doubleClickZoom.disable();

setInterval(switchRemix,1500);

function switchRemix() {

  if (remixIndex < data.length-2) {
    currentTop == "remix" ? remixIndex += 2 : altIndex +=2;
  } else {
    remixIndex = 1;
    altIndex = 2;
    console.log("change dataset");

    if (curDatasetIndex < datasets.length-1) {
      curDatasetIndex++;
    } else {
      curDatasetIndex = 0;
    }
  }

  switch (currentTop) {
    case "remix":
      $("#remix").css("z-index", "-10");
      $("#altremix").css("z-index", "10");
      remix.jumpTo({center: data[remixIndex].geometry.coordinates});
      currentTop = "alt";
      break;
    case "alt":
      $("#remix").css("z-index", "10");
      $("#altremix").css("z-index", "-10");
      altremix.jumpTo({center: data[altIndex].geometry.coordinates});
      currentTop = "remix";
      break;
  }

}
