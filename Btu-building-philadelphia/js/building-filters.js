// const typeCheckboxes = document.querySelectorAll('[name="school-filter-type"]');



function initializeType (buildings, events) {
    const typeCheckboxes = document.querySelectorAll('[name="building-filter-type"]');
    for (const checkBox of typeCheckboxes) {
        checkBox.addEventListener('change', (evt) => {
            handleCehckboxInput(evt, buildings, events);
        });
    }
    
}

function handleCehckboxInput(evt, buildings, events) {
    filterType(buildings, events);
}


function filterType (buildings, events) {
    const typeCheckboxes = document.querySelectorAll('[name="building-filter-type"]:checked');
    console.log(typeCheckboxes);
    const checkValue = typeCheckboxes.value;

    const filteredBuildings = [];
    for (let i =0; i<buildings.features.length; i++) {
        for (const checkBox of typeCheckboxes) {
            const value = checkBox.value.split(",");
            const type = buildings.features[i].properties["PRIMARY_PROP_TYPE_EPA_CALC"];
            if(value.includes(type)) {
                filteredBuildings.push(buildings.features[i]);
            }
        }
    }

    if (filteredBuildings.length == 0) {
        for (let i =0; i<buildings.features.length; i++) {
            filteredBuildings.push(buildings.features[i]);

        }
    }

    const newEvent = new CustomEvent('filter-buildings', { detail: {filteredBuildings}});
    events.dispatchEvent(newEvent);
}




export {
    initializeType,

};