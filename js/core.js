// Create a mapbox map
L.mapbox.accessToken = 'pk.eyJ1IjoianJkZ3JvdXAiLCJhIjoiY2lnbTRrcGt4MDIyMHYxbHpvNmpuYnRkeiJ9.iAENAl8YgIMrkbDbRTsLVQ';
var map = L.mapbox.map($('.map')[0], 'mapbox.streets')
    .setView([39.9208735, 32.852169], 11)
    .addLayer(L.mapbox.tileLayer('mapbox.streets'));

// Example markers informations
var marker_list = [
    {lat: 39.9708735, lng: 32.852169, title: 'Marker 1.1'},
    {lat: 39.9708735, lng: 32.853169, title: 'Marker 1.2'},
    {lat: 39.9708735, lng: 32.854169, title: 'Marker 1.3'},
    {lat: 39.9758735, lng: 32.855169, title: 'Marker 1.4'},
    {lat: 39.9758735, lng: 32.856169, title: 'Marker 1.5'},
    {lat: 39.9758735, lng: 32.857169, title: 'Marker 1.6'},
    {lat: 39.9808735, lng: 32.862169, title: 'Marker 2.1'},
    {lat: 39.9818735, lng: 32.862169, title: 'Marker 2.2'},
    {lat: 39.9828735, lng: 32.862169, title: 'Marker 2.3'},
    {lat: 39.9838735, lng: 32.868169, title: 'Marker 2.4'},
    {lat: 39.9848735, lng: 32.868169, title: 'Marker 2.5'},
    {lat: 39.9858735, lng: 32.868169, title: 'Marker 2.6'},
    {lat: 39.9908735, lng: 32.872169, title: 'Marker 3'},
    {lat: 40.0008735, lng: 32.882169, title: 'Marker 4'},
    {lat: 40.0108735, lng: 32.892169, title: 'Marker 5'},
    {lat: 40.0208735, lng: 32.902169, title: 'Marker 6'},
    {lat: 40.0308735, lng: 32.912169, title: 'Marker 7'},
    {lat: 40.0408735, lng: 32.922169, title: 'Marker 8'},
    {lat: 40.0508735, lng: 32.932169, title: 'Marker 9'},
    {lat: 40.0608735, lng: 32.942169, title: 'Marker 10'},
    {lat: 40.0708735, lng: 32.952169, title: 'Marker 11'},
    {lat: 40.0808735, lng: 32.962169, title: 'Marker 12'},
    {lat: 40.0908735, lng: 32.972169, title: 'Marker 13'},
    {lat: 40.1008735, lng: 32.982169, title: 'Marker 14'},
    {lat: 40.1108735, lng: 32.992169, title: 'Marker 15'},
    {lat: 40.12023, lng: 33.00104, title: 'Marker test'},
    {lat: 40.118, lng: 33.00516, title: 'Marker test'},
    {lat: 40.12167, lng: 32.99452, title: 'Marker test'},
    {lat: 40.11039, lng: 33.00379, title: 'Marker test'},
    {lat: 40.08951, lng: 32.98714, title: 'Marker test'},
    {lat: 40.097, lng: 32.97633, title: 'Marker test'},
    {lat: 40.1016, lng: 32.96534, title: 'Marker test'},
    {lat: 40.10291, lng: 32.96517, title: 'Marker test'},
    {lat: 40.10291, lng: 32.96637, title: 'Marker test'},
    {lat: 40.11985, lng: 32.97804, title: 'Marker test'},
    {lat: 40.12208, lng: 32.98405, title: 'Marker test'},
    {lat: 40.12169, lng: 32.99452, title: 'Marker test'},
];

var polygon_code = getParameterByName('polygon');

// Get query string which encoded polygon code
var markers = new L.MarkerClusterGroup();
if (polygon_code == '') {

    // Add markers to marker_cluster
    for (var i = 0; i < marker_list.length; i++) {
        var marker = L.marker(new L.LatLng(marker_list[i].lat, marker_list[i].lng), {
            title: marker_list[i].title,
            marker_index: i
        });
        marker.bindPopup(marker_list[i].title);
        marker.on('click', function (e) {
            show_marker_informations(e.target.options.marker_index);
        });
        markers.addLayer(marker);
    }
} else {
    // Make Clear Draw visible and Create Draw hidden
    $('#clear_draw').show(500);
    $('#create_draw').hide();
    // Decode the encoded polygon code
    var decoded_polygon = polyline.decode(polygon_code);
    var latitudes = [];
    var longitudes = [];
    var polygon = L.polygon(decoded_polygon).addTo(map);

    // Create latitudes and longitudes arrays
    for (var i = 0; i < decoded_polygon.length; i++) {
        latitudes.push(decoded_polygon[i][0]);
        longitudes.push(decoded_polygon[i][1]);
    }

    // Add markers to marker_cluster
    for (var i = 0; i < marker_list.length; i++) {
        if (pnpoly(longitudes, latitudes, marker_list[i].lng, marker_list[i].lat)) {
            var marker = L.marker(new L.LatLng(marker_list[i].lat, marker_list[i].lng), {
                title: marker_list[i].title,
                marker_index: i
            });
            marker.bindPopup(marker_list[i].title);
            marker.on('click', function (e) {
                show_marker_informations(e.target.options.marker_index);
            });
            markers.addLayer(marker);
        }
    }
}

// Add marker_cluster to the map
map.addLayer(markers);

// Create free draw
var freeDraw = new L.FreeDraw({
    mode: 1
});
// Create a encoded polygone and redirect to url when a polygon has been drawed
freeDraw.on('markers', function getMarkers(eventData) {
    var list = [];
    for (var i = 0; i < eventData.latLngs[0].length; i++) {
        list.push([eventData.latLngs[0][i].lat, eventData.latLngs[0][i].lng]);
    }
    var encoded = polyline.encode(list);
    window.location = "?polygon=" + encoded;
});
// Add Freedraw to map
map.addLayer(freeDraw);

// Get query string function
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Show marker informatiıns function
function show_marker_informations(marker_index) {
    marker_inf = marker_list[marker_index];
    $html = '<h2>Marker Informations</h2><ul class="list-unstyled">';
    $html += '<li><strong>Title: </strong>' + marker_inf.title + '</li>';
    $html += '<li><strong>Latitude: </strong>' + marker_inf.lat + '</li>';
    $html += '<li><strong>Longitude: </strong>' + marker_inf.lng + '</li>';
    $html += '</ul>';
    $('#markerInformations').html($html);
}

// Point in polygon function
function pnpoly(xp, yp, x, y) {
    var i, j, c = 0, npol = xp.length;
    for (i = 0, j = npol - 1; i < npol; j = i++) {
        if ((((yp[i] <= y) && (y < yp[j])) ||
            ((yp[j] <= y) && (y < yp[i]))) &&
            (x < (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
            c = !c;
        }
    }
    return c;
}

// Clear Draw with redirecting to main page
$('#clear_draw').on('click', function () {
    window.location = "http://erhankilic.github.io/mapPolygonFreeDraw/";
});
// Set Create Draw Mode with button click
$('#create_draw').on('click', function () {
    freeDraw.setMode(2);
});