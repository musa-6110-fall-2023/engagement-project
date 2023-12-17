function initializeSearch(stadiumInfo, events) {
  const searchBox = document.querySelector('#stadium-name-filter');
  const divisionCheckboxes = document.querySelectorAll('#division-filter input[type="checkbox"]');

  searchBox.addEventListener('input', () => {
    updateFiltersAndList(stadiumInfo, events);
  });

  divisionCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      updateFiltersAndList(stadiumInfo, events);
    });
  });
}

function handleSearchBoxInput(evt, stadiumInfo, events) {
  updateFilteredStadiums(stadiumInfo, events);
}

function updateFiltersAndList(stadiumGeoJSON, events) {
  const searchBox = document.querySelector('#stadium-name-filter');
  const divisionCheckboxes = document.querySelectorAll('#division-filter input[type="checkbox"]:checked');
  const searchText = searchBox.value.toLowerCase();
  const selectedDivisions = Array.from(divisionCheckboxes).map(cb => cb.value);

  const filteredStadiums = stadiumGeoJSON.features.filter((feature) => {
    const stadium = feature.properties;
    const matchesDivision = selectedDivisions.length === 0 || selectedDivisions.includes(stadium.Division);
    const matchesSearchText = stadium.Team.toLowerCase().includes(searchText);
    return matchesDivision && matchesSearchText;
  });

  updateTeamList(filteredStadiums);
  const newEvent = new CustomEvent('filter-stadiums', { detail: { filteredStadiums } });
  events.dispatchEvent(newEvent);
}

function updateTeamList(stadiums) {
  const listElement = document.querySelector('#team-list');
  listElement.innerHTML = ''; // Clear existing list

  stadiums.forEach((stadium, index) => {
    const li = document.createElement('li');
    li.textContent = stadium.properties.Team;
    li.dataset.index = index; // Add index to each list item
    li.addEventListener('click', () => focusOnMap(stadium, index));
    listElement.appendChild(li);
  });
}

export {
  initializeSearch,
};
