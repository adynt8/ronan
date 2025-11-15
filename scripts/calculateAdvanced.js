function calculateAdvanced() {
    const unit = document.getElementById('unit-selector').value;
    const erectLength = parseFloat(document.getElementById('erect-length').value);
    const flaccidLength = parseFloat(document.getElementById('flaccid-length').value);
    const erectGirth = parseFloat(document.getElementById('erect-girth').value);
    const flaccidGirth = parseFloat(document.getElementById('flaccid-girth').value);
    const result = document.getElementById('advanced-result');
    const comparison = document.getElementById('size-comparison');
    const pornstarComparison = document.getElementById('pornstar-comparison');

    console.log('Starting calculations...');
    console.log(`Unit: ${unit}`);
    console.log(`Erect Length: ${erectLength}`);
    console.log(`Flaccid Length: ${flaccidLength}`);
    console.log(`Erect Girth: ${erectGirth}`);
    console.log(`Flaccid Girth: ${flaccidGirth}`);

    // Show loading symbol
    result.innerHTML = `
        <div class="float-notification" style="display: flex; justify-content: center; align-items: center; height: 100px;">
            <div class="spinner" style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite;"></div>
        </div>
    `;

    // Add keyframe animation for spinner
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Simulate delay for demonstration purposes
    setTimeout(() => {
        // Store input values in localStorage
        localStorage.setItem('penisCalcUnit', unit);
        localStorage.setItem('penisCalcErectLength', erectLength);
        localStorage.setItem('penisCalcFlaccidLength', flaccidLength);
        localStorage.setItem('penisCalcErectGirth', erectGirth);
        localStorage.setItem('penisCalcFlaccidGirth', flaccidGirth);

        console.log('Stored values in localStorage');

        if ([erectLength, flaccidLength, erectGirth, flaccidGirth].some(isNaN) || [erectLength, flaccidLength, erectGirth, flaccidGirth].some(v => v < 0)) {
            console.log('Error: Invalid measurements');
            result.innerHTML = "<div class='result-box'><h3>Error</h3><p>Please enter valid measurements.</p></div>";
            comparison.innerHTML = "";
            pornstarComparison.innerHTML = "";
            return;
        }

        const statsForUnit = window.stats && window.stats[unit];
        if (!statsForUnit) {
            console.error(`Stats not available for unit: ${unit}`);
            result.innerHTML = "<div class='result-box'><h3>Stats Unavailable</h3><p>We couldn't load the comparison data. Please try again later.</p></div>";
            comparison.innerHTML = "";
            pornstarComparison.innerHTML = "";
            return;
        }

        const measurements = {erectLength, flaccidLength, erectGirth, flaccidGirth};

        let resultHTML = '';
        for (let [key, value] of Object.entries(measurements)) {
            if (!isNaN(value)) {
                // Use the latest stats from window.stats
                const { avg, stdDev } = statsForUnit[key];
                const percentile = calculatePercentile(value, avg, stdDev);
                const difference = value - avg;
                console.log(`Calculating ${key}:`);
                console.log(`  Average: ${avg}`);
                console.log(`  Standard Deviation: ${stdDev}`);
                console.log(`  Percentile: ${percentile.toFixed(1)}%`);
                console.log(`  Difference from Average: ${difference.toFixed(2)} ${unit}`);
                resultHTML += `<div class='result-box'>`;
                resultHTML += `<h3>${capitalizeFirstLetter(key.replace(/([A-Z])/g, ' $1').toLowerCase())}</h3>`;
                resultHTML += `<p>Your Measurement: ${value.toFixed(2)} ${unit}</p>`;
                resultHTML += `<p>Percentile: ${percentile.toFixed(1)}%</p>`;
                resultHTML += `<p>Difference from Average: ${Math.abs(difference).toFixed(2)} ${unit} ${difference >= 0 ? 'Above' : 'Below'}</p>`;
                resultHTML += `</div>`;
            }
        }

        // Calculate nominal width in mm
        let nominalWidthMM = 0;
        if (!isNaN(erectGirth)) {
            nominalWidthMM = Math.round(erectGirth * (unit === 'cm' ? 4.5 : 11.5));
            console.log(`Calculated Nominal Width: ${nominalWidthMM} mm`);
            resultHTML += `<div class='result-box'>
                <h3>Nominal width</h3>
                <p>${nominalWidthMM} mm</p>
                <button onclick="showCondomRecommendations(${nominalWidthMM})">Get Condom Recommendations</button>
            </div>`;
        }

        // Calculate volume (assuming cylindrical shape)
        if (!isNaN(erectLength) && !isNaN(erectGirth)) {
            const radius = erectGirth / (2 * Math.PI);
            const volume = Math.PI * Math.pow(radius, 2) * erectLength;
            const volumeUnit = unit === 'cm' ? 'ml' : 'fl oz';
            let volumeValue;
            if (unit === 'in') {
                volumeValue = volume * 16.3871; // Convert cubic inches to ml
            } else {
                volumeValue = volume; // Already in ml if using cm
            }
            // Subtract 30 from volume (only for ml)
            if (unit === 'cm') {
                volumeValue = Math.max(0, volumeValue - 30);
            }
            // Convert ml to fl oz if necessary and subtract 1
            if (unit === 'in') {
                volumeValue = Math.max(0, (volumeValue / 29.5735) - 1); // Convert ml to fl oz and subtract 1
            }
            console.log(`Calculated Volume: ${volumeValue.toFixed(2)} ${volumeUnit}`);
            resultHTML += `<div class='result-box'><h3>Approximate volume</h3><p>${volumeValue.toFixed(2)} ${volumeUnit}</p></div>`;
        }

        // Calculate surface area (assuming cylindrical shape)
        if (!isNaN(erectLength) && !isNaN(erectGirth)) {
            const radius = erectGirth / (2 * Math.PI);
            const surfaceArea = 2 * Math.PI * radius * (radius + erectLength);
            console.log(`Calculated Surface Area: ${surfaceArea.toFixed(2)} ${unit}²`);
            resultHTML += `<div class='result-box'><h3>Approximate surface area</h3><p>${surfaceArea.toFixed(2)} ${unit}²</p></div>`;
        }

        // Compare to female preference
        if (!isNaN(erectLength)) {
            const { avg, stdDev } = femalePreferences[unit];
            const percentile = calculatePercentile(erectLength, avg, stdDev);
            const difference = erectLength - avg;
            console.log('Comparing to Female Preference:');
            console.log(`  Percentile: ${percentile.toFixed(1)}%`);
            console.log(`  Difference: ${difference.toFixed(2)} ${unit}`);
            resultHTML += `<div class='result-box'>`;
            resultHTML += `<h3>Comparison to Female Preference</h3>`;
            resultHTML += `<p>${percentile.toFixed(1)} percentile</p>`;
            resultHTML += `<p>${Math.abs(difference).toFixed(2)} ${unit} ${difference >= 0 ? 'above' : 'below'} average preferred size</p>`;
            resultHTML += `</div>`;
        }

        result.innerHTML = resultHTML;

        // Add most relevant object size comparison
        let closestObject = objectComparisons[unit].reduce((prev, curr) => {
            const prevDiff = Math.abs(curr.length - erectLength) + Math.abs(curr.girth - erectGirth);
            const currDiff = Math.abs(prev.length - erectLength) + Math.abs(prev.girth - erectGirth);
            return prevDiff < currDiff ? curr : prev;
        });

        console.log('Object Size Comparison:');
        console.log(`  Closest Object: ${closestObject.name} (Length: ${closestObject.length} ${unit}, Girth: ${closestObject.girth} ${unit})`);

        let comparisonHTML = '<div class="result-box"><h3>Most Relevant Size Comparison</h3>';
        comparisonHTML += `<p>${closestObject.name}</p>`;
        comparisonHTML += `<p>Length: ${closestObject.length} ${unit}, Girth: ${closestObject.girth} ${unit}</p>`;
        if (erectLength >= closestObject.length && erectGirth >= closestObject.girth) {
            comparisonHTML += `<p>Your Erect Length and Girth are Slightly Larger</p>`;
        } else if (erectLength >= closestObject.length) {
            comparisonHTML += `<p>Your Erect Length is Slightly Longer</p>`;
        } else if (erectGirth >= closestObject.girth) {
            comparisonHTML += `<p>Your Erect Girth is Slightly Larger</p>`;
        } else {
            comparisonHTML += `<p>Your Erect Length and Girth are Slightly Smaller</p>`;
        }
        comparisonHTML += '</div>';
        comparison.innerHTML = comparisonHTML;

        // Update pornstar comparisons (show only 2)
        setTimeout(() => {
            let pornstarHTML = '<div class="result-box"><h3>Comparisons to Adult Film Actors:</h3>';
            let sortedPornstars = pornstarComparisons[unit].sort((a, b) => Math.abs(erectLength - a.length) - Math.abs(erectLength - b.length));
            console.log('Pornstar Comparisons:');
            sortedPornstars.slice(0, 2).forEach(star => {
                const difference = Math.abs(erectLength - star.length);
                console.log(`  ${star.name}: ${star.length} ${unit} (Difference: ${difference.toFixed(2)} ${unit})`);
                pornstarHTML += `
                    <div class="pornstar-card">
                        <h4>${star.name}</h4>
                        <p>${star.length} ${unit}</p>
                        <p>You Are ${difference.toFixed(2)} ${unit} ${erectLength >= star.length ? 'Longer' : 'Shorter'}</p>
                    </div>
                `;
            });
            pornstarHTML += '</div>';
            pornstarComparison.innerHTML = pornstarHTML;
        }, 1500);

        // Move the most relevant size comparison above the buttons
        comparison.innerHTML = comparisonHTML;
        result.insertBefore(comparison, result.firstChild);

        console.log('Calculations complete');

        // Add share button
        const shareButton = document.createElement('button');
        shareButton.textContent = 'Share Results';
        shareButton.className = 'button';
        shareButton.onclick = shareResults;
        result.appendChild(shareButton);

        // Fetch and display similar images from r/penis
        fetchSimilarImages(erectLength, unit);

        // After calculations, save the data
        const visitorId = generateVisitorId();
        const country = localStorage.getItem('userCountry');
        const shareMeasurements = localStorage.getItem('shareMeasurements') === 'true';
        const dataToSave = {
            visitorId: visitorId,
            unit: unit,
            erectLength: erectLength || null,
            flaccidLength: flaccidLength || null,
            erectGirth: erectGirth || null,
            flaccidGirth: flaccidGirth || null,
            country: country,
            timestamp: new Date().toISOString()
        };

        console.log('Preparing to save data:', dataToSave);

        if (shareMeasurements) {
            console.log('Sharing measurements');
            window.processData(dataToSave);
        } else {
            console.log('Not sharing measurements, only saving visitor ID');
            window.processData({ visitorId: visitorId, timestamp: new Date().toISOString() });
        }

        // After calculating results and updating the DOM
        const userMeasurements = {
            erectLength: parseFloat(document.getElementById('erect-length').value) || 0,
            erectGirth: parseFloat(document.getElementById('erect-girth').value) || 0,
            flaccidLength: parseFloat(document.getElementById('flaccid-length').value) || 0,
            flaccidGirth: parseFloat(document.getElementById('flaccid-girth').value) || 0
        };

        const populationAverage = {
            erectLength: statsForUnit.erectLength.avg,
            erectGirth: statsForUnit.erectGirth.avg,
            flaccidLength: statsForUnit.flaccidLength.avg,
            flaccidGirth: statsForUnit.flaccidGirth.avg
        };

        updateVisualization(userMeasurements, populationAverage, unit);

    }, 1000); // Simulated 1-second delay
}

// Make this function available globally
window.calculateAdvanced = calculateAdvanced;
