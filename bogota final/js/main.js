import { initializeMap } from './park-map.js';
import { initializeList } from './park-list.js';
import { initializeAddressEntry } from './address-entry.js';
import { setupFilterEvents } from './park-filter.js';
import { addComment } from './comments.js';

const parksResp = await fetch ("data/parks.json");
const parks = await parksResp.json();

const events = new EventTarget();

initializeMap(parks.features,events);
initializeList(parks.features,events);
initializeAddressEntry(parks);
setupFilterEvents(parks.features, events);
addComment(ev)
