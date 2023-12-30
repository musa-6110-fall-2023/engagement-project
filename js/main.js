import { initializeMap, initializeEventListeners } from './map.js';
import { initializeSearch } from './search.js';

async function populateTeamList(stadiumInfo) {
  const teamList = document.getElementById('team-list');
  stadiumInfo.features.forEach(feature => {
    const teamName = feature.properties.Team;
    const listItem = document.createElement('li');
    listItem.textContent = teamName;
    teamList.appendChild(listItem);
  });
}

const stadiumGeoJSON = await fetch('./data/stadium.geojson');
const stadiumInfo = await stadiumGeoJSON.json();

const events = new EventTarget();

// Populate the team list with all teams
populateTeamList(stadiumInfo);

initializeMap(stadiumInfo, events);
initializeSearch(stadiumInfo, events);
initializeEventListeners();