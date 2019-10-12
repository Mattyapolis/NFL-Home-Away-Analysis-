var teamIcon = L.icon({
    iconUrl: '/static/logos/' + teamname + '.png', //see json for teamname actual colname//

    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [30, 30]
});

//Need to put logos folder into our static folder. "teamame" above is a stand-in for whatever we 
//for variable in stadium.json