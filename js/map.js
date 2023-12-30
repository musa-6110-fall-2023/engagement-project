const icons = {
  'Premier League': 'images/PremierLeague.png',
  'Championship': 'images/Championship.png',
  'League One': 'images/League1.png',
  'League Two': 'images/League2.png',
  'Manchester United': 'images/manunited.png'
};

function initializeMap(stadiumInfo, events) {
  const map = L.map('map').setView([52.980822,-1.929994], 7);

  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: 'mapbox/streets-v12',
    accessToken: 'pk.eyJ1IjoibWp1bWJlLXRlc3QiLCJhIjoiY2wwb3BudmZ3MWdyMjNkbzM1c2NrMGQwbSJ9.2ATDPobUwpa7Ou5jsJOGYA',
  }).addTo(map);

  const stadiumsLayer = L.layerGroup();
  stadiumsLayer.addTo(map);

  updateMapStadiums(stadiumInfo.features, stadiumsLayer); // Use features from GeoJSON

  events.addEventListener('filter-stadiums', (evt) => {
    const filteredStadiums = evt.detail.filteredStadiums;
    updateMapStadiums(filteredStadiums, stadiumsLayer);
  });

  return map;
}

const stadiumIcon = L.icon({
  iconUrl: 'images/stadium_icon.png',
  iconSize: [22, 31.5], // size of the icon
  iconAnchor: [11, 31.5], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -35],
});

function updateMapStadiums(stadiumsGeoJSON, stadiumsLayer) {
  stadiumsLayer.clearLayers();


function updateInfoPanel(stadium) {
  const infoPanel = document.getElementById('info-panel');
  infoPanel.innerHTML = `
    <h2 class="stadium-name">${stadium.Team}</h2>
    <p class="stadium-info">League: ${stadium.Division}</p>
    <p class="stadium-info">Stadium: ${stadium.Stadium}</p>
    <p class="stadium-info">Year Built: ${stadium.Year_Open}</p>
    <p class="stadium-info">Capacity: ${stadium.Capacity}</p>
  `;
}

stadiumsGeoJSON.forEach((feature) => {
    const stadium = feature.properties;
    const coordinates = feature.geometry.coordinates;

    let iconUrl;
    let iconSize;
    let iconAnchor;
    
    if (stadium.Team === 'Manchester United') {
      // Special icon for Manchester United
      iconUrl = 'images/manunited.png';
      iconSize = [45, 45]; // 2x size for Manchester United
      iconAnchor = [22.5, 45]; // Adjust iconAnchor accordingly
    } else {
      // Use the league icon for other teams
      iconUrl = icons[stadium.Division] || 'images/default_icon.png';
      iconSize = [30, 30]; // Default size for other teams
      iconAnchor = [15, 30]; // Default anchor for other teams
    }

    const customIcon = L.icon({
      iconUrl: iconUrl,
      iconSize: iconSize,
      iconAnchor: iconAnchor,
      popupAnchor: [0, -30]
    });

    const marker = L.marker([coordinates[1], coordinates[0]], {
      alt: stadium.Team,
      icon: customIcon,
    });

    marker.bindTooltip(stadium.Team);
    // marker.bindPopup(`
    //   <h2 class="stadium-name">${stadium.Team}</h2>
    //   <p class="stadium-address">${stadium.Division}</p>
    //   <p class="stadium-address">${stadium.Stadium}</p>
    //   <p class="stadium-address">${stadium.Year_Open}</p>
    //   <p class="stadium-address">${stadium.Capacity}</p>
    // `);
    
    marker.on('click', () => {
      displayCommentsPanel(stadium.Team);
    });

    marker.on('click', () => {
      updateInfoPanel(stadium); // Update the info panel with stadium info
      displayCommentsPanel(stadium.Team); // Display comments panel
    });

    marker.addTo(stadiumsLayer);
  });
}

function saveCommentForTeam(teamName, comment) {
  // Retrieve existing comments from session storage or initialize an empty array
  const comments = JSON.parse(sessionStorage.getItem(teamName)) || [];
  
  // Add the new comment
  comments.push(comment);

  // Save back to session storage
  sessionStorage.setItem(teamName, JSON.stringify(comments));
}

function getCommentsForTeam(teamName) {
  // Retrieve comments from session storage or return an empty array if none found
  return JSON.parse(sessionStorage.getItem(teamName)) || [];
}

document.getElementById('new-comment').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const comment = event.target.value;
    const teamName = getCurrentTeam(); // Implement getCurrentTeam to know which team is currently selected

    // Save the comment for the team
    // For demonstration, let's assume you have a function saveCommentForTeam that handles comment saving
    saveCommentForTeam(teamName, comment);

    // Refresh the comments panel
    displayCommentsPanel(teamName);

    // Clear the input field
    event.target.value = '';
  }
});
document.getElementById('submit-comment').addEventListener('click', () => {
  const commentInput = document.getElementById('new-comment');
  const comment = commentInput.value;
  const teamName = getCurrentTeam();

  if (comment.trim() !== '') {
    saveCommentForTeam(teamName, comment);
    displayCommentsPanel(teamName);
    commentInput.value = ''; // Clear the input field after submission
  }
});

let currentTeam = null;

function displayCommentsPanel(teamName) {
  currentTeam = teamName;
  const panel = document.getElementById('comments-panel');
  const commentsList = document.getElementById('comments-list');

  // Clear previous comments
  commentsList.innerHTML = '';

  // Fetch and display comments for the selected team
  // For demonstration, let's assume you have a function getCommentsForTeam that returns an array of comments
  const comments = getCommentsForTeam(teamName);

  comments.forEach((comment, index) => {
    const commentContainer = document.createElement('div');
    commentContainer.classList.add('comment-container');

    const commentElement = document.createElement('div');
    commentElement.textContent = comment;
    commentElement.classList.add('comment-text');

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-comment');
    deleteButton.onclick = () => deleteComment(teamName, index);

    commentContainer.appendChild(commentElement);
    commentContainer.appendChild(deleteButton);
    commentsList.appendChild(commentContainer);
  });

  // Show the panel
  panel.classList.remove('hidden');
  }

function deleteComment(teamName, index) {
  const comments = getCommentsForTeam(teamName);
  comments.splice(index, 1); // Remove the comment at the specified index
  sessionStorage.setItem(teamName, JSON.stringify(comments)); // Update session storage
  displayCommentsPanel(teamName); // Refresh the comments panel
}

document.getElementById('clear-comments').addEventListener('click', () => {
  const teamName = getCurrentTeam();
  sessionStorage.setItem(teamName, JSON.stringify([])); // Clear all comments for the team
  displayCommentsPanel(teamName); // Refresh the comments panel
});

function getCurrentTeam() {
  return currentTeam;
}

function initializeEventListeners() {
  const submitBtn = document.getElementById('submit-comment');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const commentInput = document.getElementById('new-comment');
      const comment = commentInput.value;
      const teamName = getCurrentTeam();

      if (comment.trim() !== '') {
        saveCommentForTeam(teamName, comment);
        displayCommentsPanel(teamName);
        commentInput.value = '';
      }
    });
  }

  const commentInput = document.getElementById('new-comment');
  if (commentInput) {
    commentInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        const comment = event.target.value;
        const teamName = getCurrentTeam();

        if (comment.trim() !== '') {
          saveCommentForTeam(teamName, comment);
          displayCommentsPanel(teamName);
          event.target.value = '';
        }
      }
    });
  }
}

export { initializeMap, getCurrentTeam, initializeEventListeners };