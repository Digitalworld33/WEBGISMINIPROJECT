var map = L.map('map', {
    center: [28.5, 84], // Nepal
    zoom: 6.5
});


var defaultBase = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);


var baseLayers = {
    'OpenStreetMap': defaultBase,
    'ESRI Imagery': L.tileLayer.provider('Esri.WorldImagery'),
    'OpenTopoMap': L.tileLayer.provider('OpenTopoMap'),
};

var provinceBoundary = L.tileLayer.wms('http://localhost:8080/geoserver/WebGIS_Mini_Project/wms', {
    layers: 'WebGIS_Mini_Project:Nepal_province',
    format: 'image/png',
    opacity: 0.7,
    tiled: 'true'
});

var districtBoundary = L.tileLayer.wms('http://localhost:8080/geoserver/WebGIS_Mini_Project/wms', {
    layers: 'WebGIS_Mini_Project:Nepal_districts',
    format: 'image/png',
    opacity: 0.7,
    tiled: 'true'
});

var nepalLocalUnits = L.tileLayer.wms('http://localhost:8080/geoserver/WebGIS_Mini_Project/wms', {
    layers: 'WebGIS_Mini_Project:NepalLocalUnits',
    format: 'image/png',
    opacity: 0.7,
    tiled: 'true'
});


var KUIcon = L.icon({
    iconUrl: 'Images/Kathmandu_University_Logo.png',
    iconSize: [30,30]
});
 var KUMarker =L.marker([27.6194, 85.5388],{
    draggable: false,
    icon: KUIcon
 });

 KUMarker.bindPopup("<h3>Kathmandu University</h3><p> Kathmandu University (KU) is an autonomous, not-for-profit, self-funding public institution established by an Act of Parliament in December 1991.  The mission statement of the University is “to provide quality education for leadership”.The vision is “to become a world-class university devoted to bringing knowledge and technology to the service of mankind”</p> <img src='data/KUPhoto.jpg'/>");

 var TUIcon = L.icon({
    iconUrl: 'data/TU.png',
    iconSize: [30,30]
});
 var TUMarker =L.marker([27.6807, 85.2835],{
    draggable: false,
    icon: TUIcon
 });

 TUMarker.bindPopup("<h3>Tribhuvan University</h3><p> Tribhuvan University  त्रिभुवन विश्वविद्यालय is a public university located in Kirtipur, Kathmandu, Nepal. Established in 1959, TU is the oldest and the largest university in Nepal. The college offers 1000 undergraduate and 500 postgraduate programs across a wide range of disciplines.[4] Additionally, the institution has 62 constituent campuses and over 1080 affiliated colleges across the country.</p> <img src='data/TUPhoto.png'/>");

 var PUIcon = L.icon({
    iconUrl: 'data/PokharaUniLogo.png',
    iconSize: [30,30]
});
 var PUMarker =L.marker([28.1472, 84.0823],{
    draggable: false,
    icon: PUIcon
 });

 PUMarker.bindPopup("<h3>Pokhara University</h3><p>A non-profit autonomous institution, PU is partly funded by the Government of Nepal and partly by revenues from its students and affiliated colleges.</p> <img src='data/PokharaUniPhoto.jpg'/>");
 
 var PurbanchalUIcon = L.icon({
    iconUrl: 'data/PurbanchalUniLogo.png',
    iconSize: [30,30]
});
 var PurbanchalUMarker =L.marker([26.6819, 87.3545],{
    draggable: false,
    icon: PurbanchalUIcon
 });

 PurbanchalUMarker.bindPopup("<h3>Purbanchal University</h3><p>Purbanchal University (PU) is a public university located in Koshi Province, Nepal.[1] It was established in 1993 after the restoration of multi party democracy by the Government of Nepal as the second university of Nepal to preserve, refine, invent, adopt, extend, and transmit knowledge in an environment that fosters free inquiry and open scholarly debate.  </p> <img src='data/PurbanchalUniPhoto.jpg'/>");

 var FUIcon= L.icon({
    iconUrl: 'data/FU Logo.jpg',
    iconSize: [30,30]
});
 var FUMarker =L.marker([28.9555, 80.1777],{
    draggable: false,
    icon: FUIcon
 });

 FUMarker.bindPopup("<h3>Far-Western University</h3><p>Far Western University (FWU) was established in 2010 by the Act of the Parliament as a government funded national university to function as a prime academic institution in the country in terms of academic excellence, research-based education, community engagement and partnership.The central office of the university is located at Bhimdatta Municipality of Kanchanpur district, Far West Province, Nepal.</p> <img src='data/FUPhoto.jpg'/>");

 
 



//define Drawing toolbar options
/*var options = {
    position: 'topleft', // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
    drawMarker: true, // adds button to draw markers
    drawPolyline: true, // adds button to draw a polyline
    fullScreenControls:true,
    drawRectangle: true, // adds button to draw a rectangle
    drawPolygon: true, // adds button to draw a polygon
    drawCircle: false, // adds button to draw a cricle
    cutPolygon: false, // adds button to cut a hole in a polygon
    editMode: false, // adds button to toggle edit mode for all layers
    removalMode: true, // adds a button to remove layers
};

// add leaflet.pm controls to the map
map.pm.addControls(options);*/


// Create a marker cluster group
var markers = L.markerClusterGroup();

// Load earthquake data from the USGS Earthquake API
fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson')
    .then(response => response.json())
    .then(data => {
        data.features.forEach(feature => {
            // Extract earthquake information
            var lat = feature.geometry.coordinates[1];
            var lon = feature.geometry.coordinates[0];
            var magnitude = feature.properties.mag;
            var place = feature.properties.place;

            // Create a marker with a popup
            var marker = L.marker([lat, lon])
                .bindPopup(`<strong>Location:</strong> ${place}<br><strong>Magnitude:</strong> ${magnitude}`)
                .addTo(markers);
        });map.addLayer(markers);
    });

    var groupOverLays = {
        "Nepal Boundary":{
            "Nepal Province": provinceBoundary,
            "Nepal Districts": districtBoundary,
            "Nepal Local Units": nepalLocalUnits,     
        },
       "Engineering Universities":{
            "Kathmandu University ": KUMarker,
            "Tribhuvan University": TUMarker,
            "Pokhara University": PUMarker,
            "Purbanchal University": PurbanchalUMarker,
            "Far-Western University": FUMarker,
        },
        "Earthquake":{
            "Earthquake": markers,
        },
    };
    
    L.control.groupedLayers(baseLayers, groupOverLays).addTo(map);

// Create a div element to display coordinates
var coordDiv = document.createElement('div');
coordDiv.id = 'coords';
coordDiv.style.cssText = `
    position:absolute;
    bottom: 10px;
    left: 650px;
    background-color: #fff;
    padding: 5px;
    border: 1px solid #ccc;
    font-size: 12px;
`;

document.body.appendChild(coordDiv);

map.on('mousemove', function(e) {
    var lat = e.latlng.lat.toFixed(3);
    var lng = e.latlng.lng.toFixed(3);
    coordDiv.innerText = `Latitude: ${lat}, Longitude: ${lng}`;
});

// Hide coordinates on mouseout
map.on('mouseout', function() {
    coordDiv.innerText = '';
});

//add scale bar to map
L.control.scale({
    position: 'bottomleft'
}).addTo(map);

// Overview mini map
var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
});



var miniMap = new L.Control.MiniMap(Esri_WorldTopoMap, {
    toggleDisplay: true,
    minimized: false,
    position: 'bottomleft'
}).addTo(map);

L.Control.geocoder().addTo(map);

var ctlMeasure = L.control.polylineMeasure({
    position: "topleft",
    measureControlTitle: "Measure Length"
}).addTo(map);

// Add Leaflet Draw controls
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
    draw: {
        polyline: false,
        polygon: true,
        circle: false,
        rectangle: false,
        marker: false,
    },
    edit: {
        featureGroup: drawnItems,
        remove: true,
    },
});
map.addControl(drawControl);

map.on('draw:created', function (e) {
    var type = e.layerType;
    var layer = e.layer;

    if (type === 'polygon') {
        // Calculate and display the area when a polygon is drawn
        var area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
        
        // Create a popup and display the area information
        var popupContent = 'Area: ' + area.toFixed(2) + ' square meters';
        layer.bindPopup(popupContent).openPopup();
    }

    drawnItems.addLayer(layer);
});



 