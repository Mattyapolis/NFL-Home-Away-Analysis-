// API link 
var link = "https://raw.githubusercontent.com/Mattyapolis/NFL-Home-Away-Analysis-/nlf-stadium-map/Json%20files/nflStadium.geojson"
function markersize(stadium_capacity) {
  return stadium_capacity * 300000;
}
//Define colors
// function markercolor(mag) {
//   if (mag <= 1) {
//       return "#ADFF2F";
//   } else if (mag <= 2) {
//       return "#9ACD32";
//   } else if (mag <= 3) {
//       return "#FFFF00";
//   } else if (mag <= 4) {
//       return "#ffd700";
//   } else if (mag <= 5) {
//       return "#FFA500";
//   } else {
//       return "#FF0000";
//   };
// }
// query URL and convert to json 
d3.json(link, function(data) {

  createFeatures(data.features);
});
function createFeatures(NFLdata) {
  var NFLstadiums = L.geoJSON(NFLdata, {

  // Create popup 
 onEachFeature : function (feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.stadium_location +
      "</h3><hr><p>" + feature.properties.team + "</p>" + "<p> Stadium Name: " +  feature.properties.stadium_name + "</p>")
    },     pointToLayer: function (feature, latitude, longitude) {
      return new L.circle(latitude, longitude,
        {radius: markersize(feature.properties.stadium_capacity),
//         fillColor: markercolor(feature.properties.mag),
        fillOpacity: 1,
        stroke: false,
    })
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
//   var legend = L.control({position: 'bottomright'});
//   legend.onAdd = function () {
//   
//       var div = L.DomUtil.create('div', ' info legend'),
//           grades = [0, 1, 2, 3, 4, 5];

//   var colors = ["#ADFF2F","#9ACD32","#FFFF00","#ffd700","#FFA500","#FF0000"]

    
// for (var i = 0; i < grades.length; i++) {
//     div.innerHTML +=
//       "<i style='background: " + colors[i] + "'></i> " +
//       grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
//   }
//   return div;
// };

//   legend.addTo(myMap);
}
