function initializeList(buildings, events) {
    updateBuildingList(buildings.features, events);

    events.addEventListener('filter-buildings', (evt) => {
        const filteredBuildings = evt.detail.filteredBuildings;
        updateBuildingList(filteredBuildings, events);
    });

}

function updateBuildingList(buildings, events) {
    const buildingList = document.querySelector('.building-list');
    let html = '';
    let building = buildings.features;

    for (building of buildings) {
        if (Math.round(building.properties["ELECTRIC_USE_KBTU"] / building.properties["TOTAL_FLOOR_AREA_BLD_PK_FT2"]) >= 58) {

            const name = building.properties["PROPERTY_NAME"];
            const address = building.properties["ADDRESS"];
            const euiHigh = Math.round(building.properties["ELECTRIC_USE_KBTU"] / building.properties["TOTAL_FLOOR_AREA_BLD_PK_FT2"]);
            const type = building.properties["PRIMARY_PROP_TYPE_EPA_CALC"];

            const buildingListItemHTML = `
            <li>
                <div class="building-name">${name}</div>
                <div class="building-address">${address}</div>
                <div class="building-EUI-high">${euiHigh + ' KBTU/sqft'}</div>
                <div class="building-type">${type}</div>
            </li>
            `;
            html += buildingListItemHTML;
        } else if (Math.round(building.properties["ELECTRIC_USE_KBTU"] / building.properties["TOTAL_FLOOR_AREA_BLD_PK_FT2"]) >= 15 
        && Math.round(building.properties["ELECTRIC_USE_KBTU"] / building.properties["TOTAL_FLOOR_AREA_BLD_PK_FT2"]) < 58) {
            const name = building.properties["PROPERTY_NAME"];
            const address = building.properties["ADDRESS"];
            const euiMed = Math.round(building.properties["ELECTRIC_USE_KBTU"] /  building.properties["TOTAL_FLOOR_AREA_BLD_PK_FT2"]);
            const type = building.properties["PRIMARY_PROP_TYPE_EPA_CALC"];

            const buildingListItemHTML = `
            <li>
                <div class="building-name">${name}</div>
                <div class="building-address">${address}</div>
                <div class="building-EUI-med">${euiMed + ' KBTU/sqft'}</div>
                <div class="building-type">${type}</div>
            </li>
            `;
            html += buildingListItemHTML;

        } else if (Math.round(building.properties["ELECTRIC_USE_KBTU"] / building.properties["TOTAL_FLOOR_AREA_BLD_PK_FT2"]) < 15) {

            const name = building.properties["PROPERTY_NAME"];
            const address = building.properties["ADDRESS"];
            const euiLow = Math.round(building.properties["ELECTRIC_USE_KBTU"] / building.properties["TOTAL_FLOOR_AREA_BLD_PK_FT2"]);
            const type = building.properties["PRIMARY_PROP_TYPE_EPA_CALC"];

            const buildingListItemHTML = `
            <li>
                <div class="building-name">${name}</div>
                <div class="building-address">${address}</div>
                <div class="building-EUI-low">${euiLow + ' KBTU/sqft'}</div>
                <div class="building-type">${type}</div>
            </li>
            `;
            html += buildingListItemHTML;

        }
  
    }
    buildingList.innerHTML = html;


    for (const li of buildingList.querySelectorAll('li')) {
        li.addEventListener('mouseover', (evt) => {
            const buildingName = evt.target;
            const newEvent = new CustomEvent('focus-building', {
                detail: {buildingName},
            });
            events.dispatchEvent(newEvent);
        });
    }




}


export {
    initializeList,
};