import { initializeMap } from "./building-map.js";
import { initializeList } from "./building-list.js";
import { initializeSearch } from "./address-entry.js";
import { initializeType } from "./building-filters.js";

const buildingsResp = await fetch('data/buildings_philly.json');
const buildings = await buildingsResp.json();

const events = new EventTarget();

const map = initializeMap(buildings, events);
initializeList(buildings, events);
initializeSearch(buildings, events);
initializeType(buildings, events);

window.map = map;

