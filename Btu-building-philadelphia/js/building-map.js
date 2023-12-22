function initializeMap(buildings, events) {

    const map = L.map('map').setView([39.955, -75.16], 14);
    const baseTileLayer = L.tileLayer('https://api.mapbox.com/styles/v1/0907ka/cloc9gbh200rd01qpgsfh19lt/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiMDkwN2thIiwiYSI6ImNsb2M5Ym9pbzBmZXYya3BsYjhzcnNvazYifQ.2njwyBAaGOMFyfbUEX_S_A')
    baseTileLayer.addTo(map);

    const buildingsLayer = L.layerGroup();
    buildingsLayer.addTo(map);

    updateMapBuildings(buildings.features, buildingsLayer);

    events.addEventListener('filter-buildings', (evt) => {
        const filteredBuildings = evt.detail.filteredBuildings;
        updateMapBuildings(filteredBuildings, buildingsLayer);
    });

    events.addEventListener('focus-building', (evt) => {
        const buildingName = evt.detail;
        buildingsLayer.eachLayer((layer) => {
            if (layer.buildingName === buildingName) {
            layer.bindPopup('Here!');
                layer.openPopup();
            }
        });
    });


    return map;
}



function updateMapBuildings(buildings, buildingsLayer) {
    buildingsLayer.clearLayers();
    console.log(`Adding ${buildings.length} buildings to the map.`);
   

    const buildingIconOffice = L.icon({
        iconUrl: 'images/building-marker-office.png',
        iconSize: [12, 12],
        iconAnchor: [6, 12],
        popupAnchor: [5, -5],
    });

    const buildingIconSchool = L.icon({
        iconUrl: 'images/building-marker-school.png',
        iconSize: [12, 12],
        iconAnchor: [6, 12],
        popupAnchor: [5, -5],
    });

    const buildingIconCommercial = L.icon({
        iconUrl: 'images/building-marker-commercial.png',
        iconSize: [12, 12],
        iconAnchor: [6, 12],
        popupAnchor: [5, -5],
    });
    
    const buildingIconResidence = L.icon({
        iconUrl: 'images/building-marker-residence.png',
        iconSize: [12, 12],
        iconAnchor: [6, 12],
        popupAnchor: [5, -5],
    });

    const buildingIconHospital = L.icon({
        iconUrl: 'images/building-marker-hospital.png',
        iconSize: [12, 12],
        iconAnchor: [6, 12],
        popupAnchor: [5, -5],
    });

    const buildingIconCultural = L.icon({
        iconUrl: 'images/building-marker-cultural.png',
        iconSize: [12, 12],
        iconAnchor: [6, 12],
        popupAnchor: [5, -5],
    });

    const buildingIconOther = L.icon({
        iconUrl: 'images/building-marker-other.png',
        iconSize: [12, 12],
        iconAnchor: [6, 12],
        popupAnchor: [5, -5],
    });



    let building = buildings.features;

    

    for (building of buildings) {
        const buildingProperty = building.properties["PRIMARY_PROP_TYPE_EPA_CALC"];
        
        if (buildingProperty.includes("Office")) {

            const marker = L.marker([building.properties["Y_COORD"], building.properties["X_COORD"]], {
                alt: building.properties["PROPERTY_NAME"],
                icon: buildingIconOffice,
            });
    
            marker.bindTooltip(building.properties["PROPERTY_NAME"]  + ' (' + buildingProperty + ")");
            marker.addTo(buildingsLayer);

        } else if (buildingProperty.includes("University") || buildingProperty.includes("School")
        || buildingProperty.includes("Education")) {

            const marker = L.marker([building.properties["Y_COORD"], building.properties["X_COORD"]], {
                alt: building.properties["PROPERTY_NAME"],
                icon: buildingIconSchool,
            });
    
            marker.bindTooltip(building.properties["PROPERTY_NAME"]  + ' (' + buildingProperty + ")");
            marker.addTo(buildingsLayer);

        } else if (buildingProperty.includes("Store") || buildingProperty.includes("Mall")
        || buildingProperty.includes("Wholesale") || buildingProperty.includes("Food")
        || buildingProperty.includes("Restaurant")) {

            const marker = L.marker([building.properties["Y_COORD"], building.properties["X_COORD"]], {
                alt: building.properties["PROPERTY_NAME"],
                icon: buildingIconCommercial,
            });
    
            marker.bindTooltip(building.properties["PROPERTY_NAME"]  + ' (' + buildingProperty + ")");
            marker.addTo(buildingsLayer);

        } else if (buildingProperty.includes("Residence") || buildingProperty.includes("Housing") 
        || buildingProperty.includes("Living")) {

            const marker = L.marker([building.properties["Y_COORD"], building.properties["X_COORD"]], {
                alt: building.properties["PROPERTY_NAME"],
                icon: buildingIconResidence,
            });
    
            marker.bindTooltip(building.properties["PROPERTY_NAME"]  + ' (' + buildingProperty + ")");
            marker.addTo(buildingsLayer);
        
        } else if (buildingProperty.includes("Hospital")) {

            const marker = L.marker([building.properties["Y_COORD"], building.properties["X_COORD"]], {
                alt: building.properties["PROPERTY_NAME"],
                icon: buildingIconHospital,
            });
    
            marker.bindTooltip(building.properties["PROPERTY_NAME"]  + ' (' + buildingProperty + ")");
            marker.addTo(buildingsLayer);

        } else if (buildingProperty.includes("Hotel") || buildingProperty.includes("Art") 
        || buildingProperty.includes("Museum") || buildingProperty.includes("Convention")) {

            const marker = L.marker([building.properties["Y_COORD"], building.properties["X_COORD"]], {
                alt: building.properties["PROPERTY_NAME"],
                icon: buildingIconCultural,
            });
    
            marker.bindTooltip(building.properties["PROPERTY_NAME"]  + ' (' + buildingProperty + ")");
            marker.addTo(buildingsLayer);

        }else {

            const marker = L.marker([building.properties["Y_COORD"], building.properties["X_COORD"]], {
                alt: building.properties["PROPERTY_NAME"],
                icon: buildingIconOther,
            });
    
            marker.bindTooltip(building.properties["PROPERTY_NAME"]  + ' (' + buildingProperty + ")");
            marker.addTo(buildingsLayer);


        }

        
    }
}

export {
    initializeMap,
};