// Create a map object
var mymap = L.map('map', {
    center: [39.82, -98.58],
    zoom: 4,
    maxZoom: 10,
    minZoom: 3,
    detectRetina: true});

// Add a base map.
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(mymap);

// Add cell towers GeoJSON Data
// Null variable that will hold cell tower data
var airports = null;

// Build up a set of colors from colorbrewer's dark2 category
var colors = chroma.scale('Dark2').mode('lch').colors(2);

// Dynamically append style classes to this page. This style classes will be used for colorize the markers.
for (i = 0; i < 2; i++) {
    $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
}

// Get GeoJSON and put on it on the map when it loads
airports= L.geoJson.ajax("assets/airports.geojson", {
    // assign a function to the onEachFeature parameter of the cellTowers object.
    // Then each (point) feature will bind a popup window.
    // The content of the popup window is the value of `feature.properties.company`
    onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.AIRPT_NAME);
        return feature.properties.LOCCOUNTY;
    },
    pointToLayer: function (feature, latlng) {
        var id = 0;
        if(feature.properties.CNTL_TWR == "Y") {id = 0;}
        else {id = 1}
        return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-plane marker-color-' + (id + 1).toString() })});
    },
    attribution: 'https://catalog.data.gov/dataset/usgs-small-scale-dataset-airports-of-the-united-states-201207-shapefile'
}).addTo(mymap);

// Set function for color ramp
colors = chroma.scale('YlOrRd').colors(4);

// Set function for color ramp
function setColor(density) {
    var id = 0;
    if (density > 45) { id = 3; }
    else if (density > 30 && density <= 44) { id = 2; }
    else if (density > 15 && density <= 29) { id = 1; }
    else  { id = 0; }
    return colors[id];
}

// Set style function that sets fill color.md property equal to cell tower density
function style(feature) {
    return {
        fillColor: setColor(feature.properties.count),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#b4b4b4',
        dashArray: '4'
    };
}

// Add state polygons
// create state variable, and assign null to it.
var states = null;
states = L.geoJson.ajax("assets/us-states.geojson", {
    style: style,
    attribution: 'This data is acquired from Mike Bostock of D3'
}).addTo(mymap);

// Create Leaflet Control Object for Legend
var legend = L.control({position: 'topright'});

// Function that runs when legend is added to map
legend.onAdd = function () {
    // Create Div Element and Populate it with HTML
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<b>Number of Aiports</b><br />';
    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p> > 45 </p>';
    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p> 30-44 </p>';
    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 15-29 </p>';
    div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> 0-14 </p>';
    div.innerHTML += '<hr><b>Control Tower or Not<b><br />';
    div.innerHTML += '<i class="fa fa-signal marker-color-1"></i><p> Has Control Tower</p>';
    div.innerHTML += '<i class="fa fa-signal marker-color-2"></i><p> Does Not Have Control Tower </p>';
    // Return the Legend div containing the HTML content
    return div;
};

// Add a legend to map
legend.addTo(mymap);

// Add a scale bar to map
L.control.scale({position: 'bottomleft'}).addTo(mymap);
