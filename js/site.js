function coord_length(coords) {
    if (coords.length < 2) return 0;
    var length = 0;
    for (var i = 1; i < coords.length; i++) {
        length += Math.sqrt(
            Math.pow(coords[i-1][0] - coords[i][0], 2) +
            Math.pow(coords[i-1][1] - coords[i][1], 2));
    }
    return length;
}

var bt = {
    'Proposed Bike Lane': [],
    'Existing Bike Lane': [],
    'Shared Lane': [],
    'Climbing Lane': [],
    'Proposed Climbing Lane': [],
    'Proposed Shared Lane': []
};

for (var i = 0; i < bike_ddot.features.length; i++) {
    var ft = bike_ddot.features[i];
    if (ft.properties.FACILITY) {
        bt[ft.properties.FACILITY].push(coord_length(ft.geometry.coordinates));
    }
}

var w = 700,
    h = 200,
    p = [150, 50, 30, 20];

var type_sums = [];

for (var c in bt) {
    type_sums.push({
        name: c,
        value: d3.sum(bt[c])
    });
}

var x = d3.scale.linear()
    .range([0, w])
    .domain([p[0], d3.max(type_sums, function(d) {
        return d.value;
    }) - p[2]]);

var y = d3.scale.ordinal()
    .rangePoints([0, h - 40])
    .domain(Object.keys(bt));

var xAxis = d3.svg.axis().scale(x).orient("bottom").tickSize(6, 0);

var svg = d3.select("#chart").selectAll("svg")
  .attr("width", w)
  .attr("height", h)
  .data([type_sums]);

// Otherwise, create the skeletal chart.
var gEnter = svg.enter().append("svg").append("g");
gEnter.append("g").attr("class", "x axis");
gEnter.append("g").attr("class", "y axis");

var g = svg.select("g")
    .attr("transform", "translate(0, 0)");

g.selectAll('rect.lane-type')
  .data(type_sums)
  .enter()
  .append('rect')
  .attr('class', 'lane-type')
  .attr('width',function(d) { return x(d.value); })
  .attr('x',function(d) { return x.domain()[0]; })
  .attr('y',function(d) { return y(d.name); })
  .attr('height',function(d, i) { return 10; });

svg.selectAll("text.lane-type-name")
  .data(type_sums)
  .enter()
  .append('text')
  .attr('class', 'lane-type-name')
  .attr("text-anchor", "end")
  .attr('x',function(d) { return x.domain()[0] - 5; })
  .attr('y',function(d) { return y(d.name) + 15; })
  .attr('dy', -7)
  .text(function(d) { return d.name; });

// Update the x-axis.
g.select(".x.axis")
    .attr("transform", "translate(" + p[0] + ',' + (y.range()[5] + 15) + ")")
    .call(xAxis);
