const addressEntry = document.querySelector('#address-search');
const addressChoiceList = document.querySelector('#address-options');

function initializeAddressEntry() {
    addressEntry.addEventListener('input',handleAddressEntryChange)
}

async function handleAddressEntryChange() {
    const partialAddress = addressEntry.value;
    const apiKey = 'pk.eyJ1IjoiYWNyZXNhZyIsImEiOiJjbG80cTJ4cDkwM2Y2MmxteWZ2d3Y5bjQ2In0.5FdRNDkBd2ptJ9sOm2PXmQ';
    const bbox = [-74.1673,-64.0033,-74.0396,67.7801].join(',');
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${partialAddress}.json?bbox=${bbox}&access_token=${apiKey}`;
    const resp = await fetch(url);
    const data = await resp.json();

    let html = ''
    for (const feature of data.features) {
        const lihtml = `
        <li>
            ${feature.place_name}
        </li>
        `;
        html += lihtml;
    }
    addressChoiceList.innerHTML = html;
    console.log(data);
}

export {
    initializeAddressEntry,
};
