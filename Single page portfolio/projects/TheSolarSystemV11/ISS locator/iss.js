document.addEventListener('DOMContentLoaded', function () {
    const map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const issImage = document.getElementById('issImage');
    const issMarker = L.marker([0, 0], {
        icon: L.divIcon({
            className: 'iss-icon',
            iconSize: [50, 50],
            html: '<img src="iss.jpeg" alt="ISS" style="width: 100%; height: 100%;">'
        })
    }).addTo(map);

    const locationInfo = document.getElementById('locationInfo');

    function showISSLocation() {
        fetch('https://api.wheretheiss.at/v1/satellites/25544')
            .then(response => response.json())
            .then(data => {
                const { latitude, longitude } = data;
                map.setView([latitude, longitude], 3);

                // Update marker position
                issMarker.setLatLng([latitude, longitude]);

                // Update ISS image
                const apiKey = "Xs0EXbcbpgxB2ueRsAhnweYs96hPNrueTOXNzzYp";
                const imageUrl = `https://api.nasa.gov/planetary/earth/imagery?lon=${longitude}&lat=${latitude}&dim=0.1&api_key=${apiKey}`;
                issImage.src = imageUrl;

                // Display country information
                const country = getCountryName(latitude, longitude);
                locationInfo.textContent = `Location: ${country || 'Unknown'}`;
            })
            .catch(error => console.error('Error fetching ISS location:', error));
    }

    function getCountryName(latitude, longitude) {
        const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=1`;
    
        return fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                console.log('Geocoding data:', data); // Log the geocoding data for debugging
                const country = data.address ? data.address.country : 'Unknown';
                return country;
            })
            .catch(error => {
                console.error('Error fetching country information:', error);
                return 'Unknown';
            });
    }
    
    // Initial load
    showISSLocation();

    // Refresh every 10 seconds
    setInterval(showISSLocation, 10000);

    // Button event listener
    const refreshButton = document.getElementById('refreshButton');
    refreshButton.addEventListener('click', showISSLocation);
});
