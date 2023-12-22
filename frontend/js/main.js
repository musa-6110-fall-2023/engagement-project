// ==========================================================================================> 1.0 Import
import { initializeMap } from './map.js';
import { initializeList } from './list.js';
import { initializeSearch } from './search.js';
import { initIssueReporter } from './issue_reporter.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js';
import { getFirestore, getDocs, collection } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js';

// ==========================================================================================> 2.0 Configuration
// ==> 2.1 Configure Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB1-IpV8mRcLyXgsf3ZfDwhKJdizxkeQp4",
  authDomain: "js-hw3.firebaseapp.com",
  projectId: "js-hw3",
  storageBucket: "js-hw3.appspot.com",
  messagingSenderId: "746587643981",
  appId: "1:746587643981:web:5eb7744f3934234698bc04",
  measurementId: "G-SKB5EGKS7M"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ==> 2.2 Configure Global Constants and Variables
const events = new EventTarget();
const issuesCollection = collection(db, 'trail_waze_issues');

// ==> 2.3 Configure Functions
function handleGeolocationSuccess(pos) {
  console.log(pos);
  const newEvent = new CustomEvent('geolocated', { detail: pos }); 
  events.dispatchEvent(newEvent);
}

function handleGeolocationError(err) {
  console.log(err);
}

async function loadLandmake() {
  const landmarkLayer = L.geoJSON(landmarkData, {
    style: {
      weight: 6,
      opacity: 0,
    },
  });
  landmarkLayer.bindTooltip(
    (l) => l.feature.properties['TRAIL_NAME'],
    { sticky: true },
  );
  landmarkLayer.addTo(map);
  return landmarkLayer;
}

async function loadIssues() {
  const issuesQuery = await getDocs(issuesCollection);
  const issues = issuesQuery.docs.map((doc) => doc.data());
  
  const data = {
    type: 'FeatureCollection',
    features: issues,
  };
  console.log(data);
  
  const issuesLayer = L.geoJSON(data, {
    pointToLayer: (feature, latlng) => {
      const icon = L.icon({
        iconUrl: `_images/markers/${feature.properties.category}-marker.png`,
        iconSize: [35, 41],
        iconAnchor: [18, 41],
        shadowUrl: '_images/markers/marker-shadow.png',
        shadowSize: [35, 41],
        shadowAnchor: [13, 41],
      });
      return L.marker(latlng, { icon });
    },
  });
  issuesLayer.addTo(map);
  return issuesLayer;
}

// ==========================================================================================> 3.0 Operation
// 3.1 Fetch Landmark Data
const landmarkResp = await fetch('https://raw.githubusercontent.com/watsonva/MUSA_6110_story-map-project/main/philly_landmark.json');
const landmarkData = await landmarkResp.json();
console.log(landmarkData);

// 3.2 Initialize Map and Related Functionalities
const map = initializeMap(landmarkData, events); 
initializeList(landmarkData, events); 
initializeSearch(landmarkData, events);

// 3.3 Handle Geolocation
navigator.geolocation.getCurrentPosition(handleGeolocationSuccess, handleGeolocationError);

// 3.4 Load Data and Initialize Issue Reporter
const [landmarkLayer, issuesLayer] = await Promise.all([
  loadLandmake(),
  loadIssues(),
]);
initIssueReporter(map, landmarkLayer, issuesLayer, issuesCollection);

// ==========================================================================================> 4.0 Export
window.map = map;
