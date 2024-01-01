function initializeSearch(buildings, events) {
    const searchBox = document.querySelector('#address-entry');
    searchBox.addEventListener('input', (evt) => {
        handleSearchBoxInput(evt, buildings, events);
    });
}

function handleSearchBoxInput(evt, buildings, events) {
    updateFilteredBuildings(buildings, events);
}


function updateFilteredBuildings(buildings, events) {
    const searchBox = document.querySelector('#address-entry');
    const lowercaseValue = searchBox.value.toLowerCase();

    const filteredBuildings = [];
    for (let i =0; i<buildings.features.length; i++) {
        const address = buildings.features[i].properties["ADDRESS"];
        if (address.toLowerCase().includes(lowercaseValue)) {
            filteredBuildings.push(buildings.features[i]);
        }
    }
    //console.log(filteredBuildings);

    const newEvent = new CustomEvent('filter-buildings', { detail: {filteredBuildings}});
    events.dispatchEvent(newEvent);
}


export {
    initializeSearch,
};
