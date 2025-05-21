console.log("script.js loaded");
let url = "";

function write_to_html(data) {
    console.log("write_to_html called");
    const container = document.getElementById("container");
    
    
    // Create a new div for the data
    const dataDiv = document.createElement("div");
    dataDiv.className = "data";
    dataDiv.innerHTML = JSON.stringify(data, null, 2); // Format JSON with indentation
    
    // Append the new div to the container
    container.appendChild(dataDiv);
}


function getLocation() {
    const location = document.getElementById("location").value;
    console.log(location);
    url = "https://findcheapfuel.com/fuel/" + location;
    
    // Send the URL to Flask backend
    fetch('/receive-url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url }), // Send the URL as JSON
    })
    .then(response => response.json())
    
    .then(data => {
        console.log("Server response:", data);
        const results_html = document.getElementById("results");
        results_html.innerHTML = "";
        
        let html = `
        <div class="fuel-price-container">
            <h3 class="fuel-price-header">Fuel Prices in ${document.getElementById("location").value}</h3>
            <div class="table-responsive">
                <table class="fuel-price-table">
                    <thead>
                        <tr>
                            <th class="station-col">Station</th>
                            <th class="price-col">Price (p)</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
        document.getElementById("location").value = "";
        data.forEach(station => {
            html += `
            <tr class="station-row">
                <td class="station-name">${station.name || 'Unknown'}</td>
                <td class="price-value">${station.price ? station.price + 'p' : 'N/A'}</td>
            </tr>
        `;
        });
        
        html += `</tbody></table></div></div>`;
        results_html.innerHTML = html;
    })
    .catch(error => {
        console.error("Error:", error);
    });
}