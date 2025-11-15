function saveCurrentMeasurements() {
    const measurements = {
        date: new Date().toISOString(),
        erectLength: parseFloat(document.getElementById('erect-length').value),
        erectGirth: parseFloat(document.getElementById('erect-girth').value),
        flaccidLength: parseFloat(document.getElementById('flaccid-length').value),
        flaccidGirth: parseFloat(document.getElementById('flaccid-girth').value)
    };

    let history = JSON.parse(localStorage.getItem('measurementHistory')) || [];
    history.push(measurements);
    localStorage.setItem('measurementHistory', JSON.stringify(history));

    alert('Measurements saved successfully!');
}

function viewProgressHistory() {
    const history = JSON.parse(localStorage.getItem('measurementHistory')) || [];

    if (history.length === 0) {
        alert('No measurement history available.');
        return;
    }

    let tableHTML = `
        <h3>Measurement History</h3>
        <table>
            <tr>
                <th>Date</th>
                <th>Erect Length</th>
                <th>Erect Girth</th>
                <th>Flaccid Length</th>
                <th>Flaccid Girth</th>
            </tr>
    `;

    history.forEach(entry => {
        tableHTML += `
            <tr>
                <td>${new Date(entry.date).toLocaleDateString()}</td>
                <td>${entry.erectLength}</td>
                <td>${entry.erectGirth}</td>
                <td>${entry.flaccidLength}</td>
                <td>${entry.flaccidGirth}</td>
            </tr>
        `;
    });

    tableHTML += '</table>';

    const resultDiv = document.getElementById('advanced-result');
    resultDiv.innerHTML = tableHTML;
}