# Map Polygon With Free Draw
-----------------------------

This is a map polygon with free draw option. I used mapbox.js for map and leaflet.freedraw.js for free draw...
If you want, you can edit it to using leaflet.js. 

# Free Draw Option
---------------------

When you select a polygon area on the map, Javascript function is taking polygon's coordinates array
and encode it. Then it send this encoded array with get request. 

When encoded array come with get request, another function take it and decode it. Then place a polygon area
that used this cordinates array.
