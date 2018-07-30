function addTitle(index, color, background=false) {

  var num = allMaps[index].num;
  var title = allMaps[index].title;
  var description = allMaps[index].description;

  var classes = background ? (color + " bkgnd") : color

  var titleBlock = "<div id='desc' class='" + classes + "'><h2>" + title + "</h2><p>" + description + "</p></div>";

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
    'description': 'Click to isolate a system. Swipe or press spacebar to change modes.'
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
    'title': 'Subway At Grade',
    'description': 'Pan around the NY subway system. Click to aerial comparisons of each station along a line.'
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
  {
    'num': '011',
    'title': 'Dominant Forms: Area',
    'description': 'Buildings are grouped by footprint size. Hover to isolate each group.'
  },
  {
    'num': '012',
    'title': 'Looking Up',
    'description': 'Hover to reveal the GPS accuracy at each point where a photo was taken.'
  },
  {
    'num': '013',
    'title': 'A Walk Three Ways',
    'description': 'Scrub along the altitude graph, pan within the aerial, or scrub along the path to update all views.'
  },
  {
    'num': '014',
    'title': 'Subway Stream',
    'description': 'Watch advertisements from subway stations whiz by like passing trains.'
  },
  {
    'num': '015',
    'title': 'Looking Down',
    'description': 'Hover to reveal an image of the sky corresponding to point on the ground.'
  },
  {
    'num': '016',
    'title': 'Sampling Prospect Park',
    'description': 'Hover to highlight points at a similar elevation. Click to isolate each sampling system.'
  },
  {
    'num': '017',
    'title': 'Dominant Heights',
    'description': 'Click on a contour line to isolate the corresponding aerial imagery.'
  },
  {
    'num': '018',
    'title': 'Every Borough Has A Broadway',
    'description': 'Click an image to see a new Broadway, or wait to them advance automatically.'
  },
  {
    'num': '019',
    'title': 'Dynamic Halftone',
    'description': 'Adjust the parameters to change the halftone visualization.'
  },
  {
    'num': '020',
    'title': 'Crossing 72nd Street',
    'description': 'Once loaded, click at any point on the path to jump to that point in time.'
  },
  {
    'num': '021',
    'title': 'Looking Around',
    'description': 'Press spacebar to change mode: grid or cluster. Click an image to see a series: all in the same direction or all from one intersection. Press enter to return to view.'
  },
  {
    'num': '022',
    'title': 'Typical: All The Blocks in Manhattan',
    'description': 'Watch a slow scroll of all the blocks in Manhattan sorted by area.'
  },
  {
    'num': '023',
    'title': 'Intersections',
    'description': 'Hover on an intersection to see the connecting routes.'
  },
  {
    'num': '024',
    'title': 'Zoom Zoom Zoom',
    'description': 'Scroll to change zoom levels.'
  },
  {
    'num': '025',
    'title': 'Glendale Slide',
    'description': 'Wander along the construction of city and "nature" &mdash; reload to start again elsewhere.'
  },
  {
    'num': '026',
    'title': '',
    'description': ''
  },
  {
    'num': '027',
    'title': 'Flat Incline',
    'description': 'Click anywhere on the aerial to reveal topographic subdivisions. Drag to pan.'
  },
  {
    'num': '028',
    'title': 'This Is What I See &emdash; But Not Really',
    'description': 'Walk to see the streetview image update to where you are.'
  },
  {
    'num': '029',
    'title': 'Parallel and Perpendicular',
    'description': 'Click to isolate all streets oriented in the same direction.'
  },
  {
    'num': '030',
    'title': 'Terrapattern Remix',
    'description': 'Watch visually similar places cycle through the originating location. Refresh to start elsewhere.'
  },
  {
    'num': '031',
    'title': '',
    'description': ''
  },
  {
    'num': '032',
    'title': 'Foreground Middleground Background',
    'description': 'Move the mouse horizontally to see different clippings of the aerial image.'
  },
  {
    'num': '033',
    'title': 'Center Boundaries',
    'description': 'Hover to toggle between formal and centroid representations.'
  },
  {
    'num': '034',
    'title': '',
    'description': ''
  },
  {
    'num': '035',
    'title': '',
    'description': ''
  },
  {
    'num': '036',
    'title': '',
    'description': ''
  },
  {
    'num': '037',
    'title': '',
    'description': ''
  },{
    'num': '038',
    'title': '',
    'description': ''
  },
  {
    'num': '039',
    'title': '',
    'description': ''
  },
  {
    'num': '040',
    'title': '',
    'description': ''
  },
  {
    'num': '041',
    'title': '',
    'description': ''
  },
  {
    'num': '042',
    'title': '',
    'description': ''
  },
  {
    'num': '043',
    'title': '',
    'description': ''
  },
  {
    'num': '044',
    'title': '',
    'description': ''
  },
  {
    'num': '045',
    'title': '',
    'description': ''
  },
  {
    'num': '046',
    'title': '',
    'description': ''
  },
  {
    'num': '047',
    'title': '',
    'description': ''
  },
  {
    'num': '048',
    'title': '',
    'description': ''
  },
  {
    'num': '049',
    'title': '',
    'description': ''
  },
  {
    'num': '050',
    'title': '',
    'description': ''
  },
  {
    'num': '051',
    'title': '',
    'description': ''
  },
  {
    'num': '052',
    'title': '',
    'description': ''
  },
  {
    'num': '053',
    'title': '',
    'description': ''
  },
  {
    'num': '054',
    'title': '',
    'description': ''
  },
  {
    'num': '055',
    'title': '',
    'description': ''
  },
  {
    'num': '056',
    'title': '',
    'description': ''
  },
  {
    'num': '057',
    'title': '',
    'description': ''
  },
  {
    'num': '058',
    'title': '',
    'description': ''
  },
  {
    'num': '059',
    'title': 'All The Blocks in the Bronx',
    'description': 'A visualization of block shape similarity in the New York City borough. Use the buttonss to adjust layout, color coding and hyperparamters.'
  },
  {
    'num': '060',
    'title': '',
    'description': ''
  },
  {
    'num': '061',
    'title': '',
    'description': ''
  },
  {
    'num': '062',
    'title': '',
    'description': ''
  },
  {
    'num': '063',
    'title': '',
    'description': ''
  },
  {
    'num': '064',
    'title': '',
    'description': ''
  },
  {
    'num': '065',
    'title': '',
    'description': ''
  },
  {
    'num': '066',
    'title': 'Comparing Sorted Clusters',
    'description': 'How do clusters different when compared across different methods?'
  },
]
