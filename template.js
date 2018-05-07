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
]
