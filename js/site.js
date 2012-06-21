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

var bytype = {
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
        bytype[ft.properties.FACILITY].push(coord_length(ft.geometry.coordinates));
    }
}
