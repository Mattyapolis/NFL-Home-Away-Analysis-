// API link 
var link = "https://raw.githubusercontent.com/Mattyapolis/NFL-Home-Away-Analysis-/nlf-stadium-map/Json%20files/nflStadium.geojson"
function markersize(stadium_capacity) {
  return stadium_capacity * 15000000000;
}

// query URL and convert to json 
d3.json(link, function(data) {

  createFeatures(data.features);
});
function createFeatures(NFLdata) {
  var NFLstadiums = L.geoJSON(NFLdata, {

  // Create popup 
 onEachFeature : function (feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.stadium_location +
      "</h3><hr><p>" + feature.properties.team + "</p>" + "<p> Stadium Name: " +  feature.properties.stadium_name + "</p>"+ "<img src=' static/js/logos/"+ feature.properties.abrv +".png' />")
    },     pointToLayer: function (feature, latitude, longitude) {
      return new L.circleMarker(latitude, longitude)},
    style: 
        {radius: 10,
        fillColor: "#2d22a1",
        fillOpacity: 1,
        stroke: false
    }
  });
    
  createMap(NFLstadiums);
}
function createMap(NFLstadiums) {
  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
  var graymap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });
  // save layers
  var basemaps = {
    "Satellite": satellitemap,
    "Grayscale": graymap
  };
  var overmaps = {
    Stadiums: NFLstadiums
  };
  // create map
  var myMap = L.map("map", {
    center: [35,-100.0],
    zoom: 4.5,
    layers: [satellitemap, NFLstadiums]
  });
  // layers 
  L.control.layers(basemaps, overmaps, {
    collapsed: false
  }).addTo(myMap);
;
}
