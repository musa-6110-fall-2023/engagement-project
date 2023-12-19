const parkList = document.querySelector('.park-list');

function initializeList(parks, events){
    addParkToList(parks); 
    events.addEventListener('filter-parks', (evt) => {
        addParkToList(evt.detail.filteredParks);
    });
}

function addParkToList(parks) {
    let html = '';
    for (const park of parks) {
        const name = park.properties.NOMBRE;
        const type = park.properties.VOCACION;
        const area = park.properties.Area;

        const parkListItemHTML = `
        <li>
            <div class = 'park-name'>${name}</div>
            <div class = 'park-type'>${type}</div>
            <div class = 'park-area'>Park Area: ${area}</div>
        </li>
        `;
        html += parkListItemHTML;
    }
    parkList.innerHTML = html;
}

export {
    initializeList,
};