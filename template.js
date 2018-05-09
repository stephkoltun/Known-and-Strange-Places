function addTitle(index, color) {

  var num = allMaps[index].num;
  var title = allMaps[index].title;
  var description = allMaps[index].description

  var titleBlock = "<div id='desc' class='" + color + "'><h1>" + num + "</h1><h2>" + title + "</h2><p>" + description + "</p></div>";

  $('body').append(titleBlock);
  // fade out text
  $('#desc').delay(5000).fadeOut(1000);
}


var allMaps = [
  {
    'num': '001',
    'title': 'Slow Shore Shuffle',
    'description': 'Roam the shoreline of Staten Island &mdash; reload to start again elsewhere.'
  },
  {
    'num': '002',
    'title': 'The Thick Boundary of New York City',
    'description': 'Outlines of the city as identified by different agencies, histories, and data collection methods are compiled. Together, they illustrate the thickness of the city&rsquo;s perimeter and its many imaginings.'
  },
  {
    'num': '003',
    'title': 'Identifying Darkness',
    'description': 'Press and hold to toggle modes. Swipe or press the spacebar to change scale.'
  },
  {
    'num': '004',
    'title': 'Points and Polygons',
    'description': 'Click to isolate a system. Press spacebar to change modes.'
  },
  {
    'num': '005',
    'title': 'Tileswap',
    'description': 'Pan around, exploring the reconfigured aerial imagery of New York City.'
  },
  {
    'num': '006',
    'title': 'From City Island',
    'description': 'What public transit lines are directly available from any point in the city? Click to select a new point. Drag to reveal the aerial imagery.'
  },
  {
    'num': '007',
    'title': 'Finding Green',
    'description': 'An aerial image of Randall&rsquo;s Island is divided into subdivisions and the pixels within each are sorted by their hue value. Move the cursor to reveal and hide the originating image.'
  },
  {
    'num': '008',
    'title': '',
    'description': ''
  },
  {
    'num': '009',
    'title': 'New York I Love You',
    'description': 'Hover over a track to hear different field recordings of the LCD Soundsystem song, &ldquo;New York I Love You, But You&rsquo;re Bringing Me Down&rdquo;.'
  },
  {
    'num': '010',
    'title': 'Measuring Light',
    'description': 'Click the buttons to change between sampling point representations.'
  },
]
