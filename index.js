var userPos = [51.505, -0.09];


const map = L.map('map').setView(userPos, 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function updateMap(position) {
    map.setView(position, 13);
}

var beaches = [];

var filterDistance = document.getElementById('filter-select').value * 1000;

document.getElementById('filter-select').addEventListener('change', () => {
    filterDistance = document.getElementById('filter-select').value * 1000;
    console.log(filterDistance);
});

async function getBeaches() {
    return await fetch(
        "https://overpass-api.de/api/interpreter",
        {
            method: "POST",
            body: "data=" + encodeURIComponent(`
                [out:json];
                node
                ["natural"="beach"]
                (around:${filterDistance},${userPos[0]},${userPos[1]});
                out body;
                `)
        },
    ).then(
        (data) => { return data.json(); }
    )
}

window.showBeach = function (id) {
    console.log(id)
    const beach = beaches.find(beach => beach.id === id);
    if (beach) {
        map.flyTo([beach.lat, beach.lon], 13);
    }
}

window.showBeachDetails = function (id) {
    console.log(id)
    const beach = beaches.find(beach => beach.id === id);
    if (beach) {
        //TODO: Show details
    }
}

window.showOnGoogleMaps = function (lat, lon) {
    console.log(lat, lon)
    window.open(`https://www.google.com/maps?q=${lat},${lon}`, '_blank');
}

async function showBeaches() {

    var result = await getBeaches();
    beaches = result.elements;
    console.log(beaches)

    if (beaches && beaches.length > 0) {
        for (const beach of beaches) {
            L.marker([beach.lat, beach.lon]).addTo(map)
                .bindPopup(beach.tags.name ?? "Unbekannter Strand");
        }

        document.getElementById('beach-list').innerHTML =
            beaches.map(beach => `<li id="beach-${beach.id}">${beach.tags.name ?? "Unbekannter Strand"}<div> 
            <button class="show-beach" onClick="showBeach(${beach.id})">Wo</button>
            <button class="show-beach-details" onClick="showBeachDetails(${beach.id})">Details</button>
            <button class="show-on-google-maps" onClick="showOnGoogleMaps(${beach.lat},${beach.lon})">Google Maps</button></div></li>`);
    }
}


document.getElementById('get-location').addEventListener('click', () => {
    document.getElementById('get-location').disabled = true;
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                document.getElementById('standort').textContent = `Standort: ${latitude}, ${longitude}`;
                userPos = [latitude, longitude];

                updateMap(userPos);
            });
        }
        else if (result.state === "prompt") {
            showButtonToEnableMap();
        }
        document.getElementById('get-location').disabled = false;
    });
})

document.getElementById('show-beaches').addEventListener('click', async () => {
    document.getElementById('show-beaches').disabled = true;
    await showBeaches();
    document.getElementById('side').style.display = 'block';
    map.fitBounds(L.latLngBounds(beaches.map(beach => [beach.lat, beach.lon]), [userPos[0], userPos[1]]));
    document.getElementById('show-beaches').disabled = false;
});


/* document.getElementById('filter').addEventListener('click', () => {
    console.log('filter');
});
 */
document.getElementById('search').addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        const address = document.getElementById('search').value;
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const { lat, lon } = data[0];
                    document.getElementById('standort').textContent = `Standort: ${lat}, ${lon}`;
                    userPos = [lat, lon];
                    updateMap(userPos);
                } else {
                    document.getElementById('standort').textContent = 'Adresse nicht gefunden';
                }
            })
            .catch(error => {
                console.error('Fehler bei der Adresssuche:', error);
                document.getElementById('standort').textContent = 'Fehler bei der Adresssuche';
            });
    }
});
