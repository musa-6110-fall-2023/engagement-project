// =================================================================================================================> 1. initializeMap
function initializeMap(landmarkData, events) {
  // ==> 1.1 initialize the basic map with center configured
  const map = L.map('map').setView([39.95, -75.16], 12);

  // ==> 1.2 configure layer 1: tile layer from mapbox
  const mapboxToken = "pk.eyJ1IjoidmFuYXJjaCIsImEiOiJjbHBwbDhvejMwMXR3MmttazltNWVqYzNoIn0.c29HryOvTsGTu268w2uclw"; 
  const mapboxAccount = "vanarch"; 
  const mapboxStyleID = "clpr4jcme00on01p78i7zh45a"; 
  const baseTileLayer = L.tileLayer(`https://api.mapbox.com/styles/v1/${mapboxAccount}/${mapboxStyleID}/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxToken}`, {  
        minZoom: 0,
        maxZoom: 20,
        attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        // ext: 'png'
    });
    baseTileLayer.addTo(map);


  // ==> 1.3 configure layer 2: marker layer configuration
  const landmarkLayer = L.layerGroup();
  landmarkLayer.addTo(map);


  // ==> 1.4 add makers into layer 2 by calling function `updateMapLandmarks()`

  updateMapLandmarks(landmarkData.data.stations, landmarkLayer);

  // ==> 1.5 configured three events to face specific events
  // => 1.5.1 update map with filtered landmarks
  events.addEventListener('filter-stations', (evt) => {
    const filteredStations = evt.detail.filteredStations;
    updateMapLandmarks(filteredStations, landmarkLayer);
  });

  // => 1.5.2 zoom the map to display three nearest landmarks to user's current landmarks
  events.addEventListener('geolocated', (evt) => {
    // This listener will zoom to contain the three nearest landmarks to the
    // user's current position.

    const pos = evt.detail;
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;

    // Create a turf point from the user's position. turf is a really cool library
    const userPoint = turf.point([lon, lat]);

    // Create a comparison function for sorting landmarks by their distance from
    // the users position.
    function compareDists(stationA, stationB) {
      const stationAPoint = turf.point([stationA.lon, stationA.lat]);
      const distA = turf.distance(userPoint, stationAPoint);
      const stationBPoint = turf.point([stationB.lon, stationB.lat]);
      const distB = turf.distance(userPoint, stationBPoint);

      return distA - distB;
    }

    // Make a copy of the landmarks array with the slice function, and sort it.
    // We make a copy first here because the JS array sort function sorts the
    // array in place, rather than returning a new array, and we want to keep
    // the original landmarks array unchanged.
    const sortedStations = landmarkData.data.stations.slice();
    sortedStations.sort(compareDists);

    // Get the three closest landmarks from the sorted array, and use the map
    // function to create a multipoint containing the coordinates of those
    // landmarks.
    const closestStations = sortedStations.slice(0, 3);
    const closestPoints = turf.multiPoint(closestStations.map((station) => [station.lon, station.lat]));

    // Get the bounding box around the closest points. Turf will return this in
    // an array of [minX, minY, maxX, maxY], so we have to convert that to a
    // form that Leaflet is happy with (a LatLngBounds) by flipping around the X
    // and Y (longitude and latitude) components.
    const bbox = turf.bbox(closestPoints);
    const leafletBbox = L.latLngBounds([bbox[1], bbox[0]], [bbox[3], bbox[2]]);

    // Finally, fit the map view to the landmarks.
    map.fitBounds(leafletBbox);
  });

  // =>  1.5.3 open a pop up for a specific marker
  events.addEventListener('focus-station', (evt) => {
    const stationId = evt.detail.stationId;
    landmarkLayer.eachLayer((layer) => {
      if (layer.stationId === stationId) {
        layer.bindPopup('hello');
        layer.openPopup();
      }
    });
  });

  return map;
}

// =================================================================================================================> 2. updateMapLandmarks
function updateMapLandmarks(stations, landmarkLayer) {
  // ==> 2.1 clear all existing markers from landmarkLayer 
  landmarkLayer.clearLayers();

  // ==> 2.2 debug helper
  // console.log(`Adding ${stations.length} stations to the map.`);

  // ==> 2.3 marker configuration including shape, size and anchor
  const stationIcon = L.icon({
    iconUrl: '_images/landmarker.png',
    iconSize: [32, 40], // size of the icon
    iconAnchor: [16, 20], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -35], // point from which the popup should open relative to the iconAnchor
  });

  // ==> 2.4 tailor each marker via `for` loop

  for (const station of stations) {
    const marker = L.marker([station.lat, station.lon], {    // use data's lat and lon
      alt: station.name,                                     // use data's lat and lon
      icon: stationIcon,
    });
    marker.bindTooltip(station.name);                        // set up tooltip
    marker.bindPopup(`                                        
      <h2 class="station-name">${station.name}</h2>
      <p class="station-address">${station.address}</p>
    `);                                                      // set up popup (connected with html)
    marker.stationId = station.station_id;                   // set up id
    marker.addTo(landmarkLayer);                             // add all these data into the landmarkLayer
  }
}

// =================================================================================================================> 3. export the function
export {
  initializeMap,
};
