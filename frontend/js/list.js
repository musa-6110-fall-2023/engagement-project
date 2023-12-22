// =============================================================================> 1.
function initializeList(stationInfo, events) {
  updateStationList(stationInfo.data.stations, events);

  events.addEventListener('filter-stations', (evt) => {
    const filteredStations = evt.detail.filteredStations;
    updateStationList(filteredStations, events);
  });
}

// =============================================================================> 2.
function updateStationList(stations, events) {
  // ===========================================================> 2.1 ??? need to learn DOM again
  const stationList = document.querySelector('#station-list');
  
  // ===========================================================> 2.1 initialize an empty html
  let html = '';

  // ===========================================================> 2.1 add all stations into the html
  for (const station of stations) {
    html += `
      <li data-station-id=${station.station_id}>${station.name}</li>
    `;
  }
  stationList.innerHTML = html;

  // ===========================================================> 2.1 do not understand
  for (const li of stationList.querySelectorAll('li')) {
    li.addEventListener('mouseover', (evt) => {
      const stationId = evt.target.dataset.stationId;
      const newEvent = new CustomEvent('focus-station', {
        detail: { stationId },
      });
      events.dispatchEvent(newEvent);
    });
  }
}

export {
  initializeList,
};





