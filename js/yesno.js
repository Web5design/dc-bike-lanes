var po = org.polymaps;
var div = document.getElementById("map");
var map = po.map()
    .container(div.appendChild(po.svg("svg")))
    .add(po.interact())
    .add(po.hash());

/*
 * Load the "AerialWithLabels" metadata. "Aerial" and "Road" also work. For more
 * information about the Imagery Metadata service, see
 * http://msdn.microsoft.com/en-us/library/ff701716.aspx
 * You should register for your own key at https://www.bingmapsportal.com/.
 */
var script = document.createElement("script");
script.setAttribute("type", "text/javascript");
script.setAttribute("src", "http://dev.virtualearth.net"
    + "/REST/V1/Imagery/Metadata/Aerial"
    + "?key=AmT-ZC3HPevQq5IBJ7v8qiDUxrojNaqbW1zBsKF0oMNEs53p7Nk5RlAuAmwSG7bg"
    + "&jsonp=callback");
document.body.appendChild(script);

var gjLayer = po.geoJson();
function callback(data) {

  /* Display each resource as an image layer. */
  var resourceSets = data.resourceSets;
  for (var i = 0; i < resourceSets.length; i++) {
    var resources = data.resourceSets[i].resources;
    for (var j = 0; j < resources.length; j++) {
      var resource = resources[j];
      map.add(po.image()
          .url(template(resource.imageUrl, resource.imageUrlSubdomains)))
          .tileSize({x: resource.imageWidth, y: resource.imageHeight});
    }
  }
  map.add(gjLayer);

  /* Display brand logo. */
  document.getElementById("logo").src = data.brandLogoUri;

  /* Display copyright notice. */
  document.getElementById("copy").appendChild(document.createTextNode(data.copyright));

  /* Display compass control. */
  map.add(po.compass()
      .pan("none"));

}

/** Returns a Bing URL template given a string and a list of subdomains. */
function template(url, subdomains) {
  var n = subdomains.length,
      salt = ~~(Math.random() * n); // per-session salt

  /** Returns the given coordinate formatted as a 'quadkey'. */
  function quad(column, row, zoom) {
    var key = "";
    for (var i = 1; i <= zoom; i++) {
      key += (((row >> zoom - i) & 1) << 1) | ((column >> zoom - i) & 1);
    }
    return key;
  }

  return function(c) {
    var quadKey = quad(c.column, c.row, c.zoom),
        server = Math.abs(salt + c.column + c.row + c.zoom) % n;
    return url
        .replace("{quadkey}", quadKey)
        .replace("{subdomain}", subdomains[server]);
  };
}


function extent(feature) {
    var bounds = [
        { lon: Infinity,
          lat: Infinity },
        { lon: -Infinity,
          lat: -Infinity }];
    var c = feature.geometry.coordinates;
    for (var i = 0; i < c.length; i++) {
        if (c[i][0] < bounds[0].lon) {
            bounds[0].lon = c[i][0];
        }
        if (c[i][1] < bounds[0].lat) {
            bounds[0].lat = c[i][1];
        }
        if (c[i][0] > bounds[1].lon) {
            bounds[1].lon = c[i][0];
        }
        if (c[i][1] > bounds[1].lat) {
            bounds[1].lat = c[i][1];
        }
    }
    return bounds;
}


var gj, feature;
d3.json('data/cycle_route_wgs.geojson', function(_) {
    gj = _;
    find_feature();
});

function find_feature() {
    var ft = gj.features[Math.floor(Math.random() * gj.features.length)];
    gjLayer.features([ft]);
    feature = ft;
    document.getElementById('name').innerHTML = ft.properties.NAME;
    document.getElementById('cycleway').innerHTML = ft.properties.CYCLEWAY;
    map.extent.call(this, (extent(ft)));
}

function edit_feature() {
    window.location = 'http://www.openstreetmap.org/edit?lat=' + map.center().lat + '&lon=' + map.center().lon + '&node=' + feature.properties.OSM_ID + '&zoom=' + Math.floor(map.zoom());
}

document.getElementById('yes').onclick = find_feature;
document.getElementById('no').onclick = edit_feature;
