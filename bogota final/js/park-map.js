function initializeMap(parks,events) {
    const map = L.map('park-map').setView([4.637591, -74.062350], 11.5);
    const mapboxAccount = 'mapbox';
    const mapboxStyle = 'light-v10';
    const mapboxToken = 'pk.eyJ1IjoiYWNyZXNhZyIsImEiOiJjbGsyc3BtNjMwMjJ2M3JzMXY3N2swajN5In0.WY9CoCVHncrxmju-gnWLFA';
      L.tileLayer(`https://api.mapbox.com/styles/v1/${mapboxAccount}/${mapboxStyle}/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxToken}`, {
          maxZoom: 19,
          attribution: ' < a href=" ">Mapbox</ a>  < a href="http://www.openstreetmap.org/copyright">OpenStreetMap</ a> <strong>< a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</ a></strong>',
      }).addTo(map);
  
    const dataLayer = L.layerGroup();
    dataLayer.addTo(map);
  
    updateMapParks(parks, dataLayer);
  
    events.addEventListener('filter-parks', (evt) => {
      const filteredParks = evt.detail.filteredParks;
      updateMapParks(filteredParks, dataLayer);
    });
  
    return map;
  }
  
  function updateMapParks(parks, dataLayer) {
    dataLayer.clearLayers();
    console.log(`Adding ${parks.length} parks to the map.`);
    
    const customIcon = L.icon({
      iconUrl: './icons8-herb-96.png', 
      iconSize: [18, 18], 
      iconAnchor: [7, 7], 
      popupAnchor: [0, -16] 
  });
    for (const park of parks) {
      const coordinates = park.geometry.coordinates;
      const name = park.properties.NOMBRE;
  

      const marker = L.circleMarker([coordinates[1], coordinates[0]], {
        radius:2.5,
        color: "#98BF64",
        title: name,
        alt: name
      });
      marker.bindPopup(name);
      dataLayer.addLayer(marker);
    }
  }
  
  export {
    initializeMap,
  };