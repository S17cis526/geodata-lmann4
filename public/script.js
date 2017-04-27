window.addEventListener('load', function() {

  if ("geolocation" in navigator)
  navigator.geolocation.getCurrentPosition(function(position) {
    d3.select('body')
    .insert("div", ":first-child")
    .attr("class", "location-bar")
    .text("Your are at: " + position.coords.latitude + ", " + position.coords.longitude);
    console.log(position)
  })

  // Build a table for our location data
  d3.json('/locations.json', function(err, locations) {
    if(err) return console.log(err);

    var table = d3.select('body').append('table');

    table.append('thead')
      .append('tr')
      .selectAll('th')
      .data(['address', 'latitude', 'longitude'])
        .enter()
          .append('th')
          .text(function(d) {return d;});
    table.append('tbody')
      .selectAll('tr')
      .data(locations)
        .enter()
          .append('tr')
          .each(function(d) {
            d3.select(this).append('td').text(d.address);
            d3.select(this).append('td').text(d.latitude);
            d3.select(this).append('td').text(d.longitude);
          });

    // Draw a map with our locations marked with pins
    d3.json('/united-states.json', function(err, usa) {
      if (err) return console.log(err);

      // Create an svg to render into
      var width = 760;
      var height = 480;

      var svg = d3.select('body').append('svg')
        .attr('width', width)
        .attr('height', height);

      // Create Projection
      var projection = d3.geoAlbersUsa()
        .scale(1000)
        .translate([width/2, height/2]);

      var path = d3.geoPath()
        .projection(projection);

      svg.insert('path', '.land-borders')
        .datum(topojson.feature(usa, usa.objects.land))
        .attr('class', 'land')
        .attr('d', path);

      svg.insert('path', '.state-borders')
        .datum(topojson.feature(usa, usa.objects.states))
        .attr('class', 'state')
        .attr('d', path);

    });
  });
});
