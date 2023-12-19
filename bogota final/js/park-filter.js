function shouldShowPark(park, filterTypes) {
  return filterTypes.some(type => park.properties.VOCACION === type);
}

function filterParks(parks, searchQuery, filterTypes) {
  return parks.filter(park =>
    park.properties.NOMBRE.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterTypes.length === 0 || shouldShowPark(park, filterTypes))
  );
}

function dispatchParkFilterEvent(events, filteredParks) {
  const newEvent = new CustomEvent('filter-parks', { detail: { filteredParks } });
  events.dispatchEvent(newEvent);
}

function handleSearchBoxInput(evt, parks, events) {
    const searchBoxValue = evt.target.value;
    const filterTypes = getFilterTypes();
    const filteredParks = filterParks(parks, searchBoxValue, filterTypes);
    dispatchParkFilterEvent(events, filteredParks);
}


function getFilterTypes() {
  return Array.from(document.querySelectorAll('[name="filter-type"]'))
             .filter(checkbox => checkbox.checked)
             .map(checkbox => checkbox.value);
}


function updateShownParks(parks, searchBoxValue, events) {
  const filterTypes = getFilterTypes();
  const filteredParks = filterParks(parks, searchBoxValue, filterTypes);
  dispatchParkFilterEvent(events, filteredParks);
}

function setupFilterEvents(parks, events) {
  const searchBox = document.querySelector('#park-filter-name');
  searchBox.addEventListener('input', (evt) => handleSearchBoxInput(evt, parks, events));

  const filterInputs = document.querySelectorAll('#park-filters input');
  filterInputs.forEach(filter => {
    filter.addEventListener('change', () => updateShownParks(parks, searchBox.value, events));
  });

  events.addEventListener('addresschanged', (evt) => {
   
    updateShownParks(parks, searchBox.value, events);
  });
}


export {
  setupFilterEvents,
};