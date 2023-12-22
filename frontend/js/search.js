// ==================================================================> 1. the main function to interact with user's searching behavior
function initializeSearch(stationInfo, events) {
  const searchBox = document.querySelector('#station-name-filter');
  searchBox.addEventListener('input', () => {
    updateFilteredStations(stationInfo, events);
  });
}

// ==================================================================> 2. detail process 
function updateFilteredStations(stationInfo, events) {
  // =======================================================> 2.1 ??? why needs to const again
  const searchBox = document.querySelector('#station-name-filter');

  // =======================================================> 2.2 case sensitivity
  const lowercaseValue = searchBox.value.toLowerCase();

  // =======================================================> 2.3 search match mechanism
  const filteredStations = [];
  for (const station of stationInfo.data.stations) {
    if (station.name.toLowerCase().includes(lowercaseValue)) {
      filteredStations.push(station);
    }
  }

  // =======================================================> 2.4 create newEvent which containing filtered stations and trigger the next event which designed to deal with these stations
  const newEvent = new CustomEvent('filter-stations', { detail: { filteredStations }});
  events.dispatchEvent(newEvent);
}


// ==================================================================> 3. 
export {
  initializeSearch,
};
