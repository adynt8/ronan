const populationStats = {
    global: {
        cm: {erectLength: { avg: 13.12, stdDev: 2.66 }, flaccidLength: { avg: 9.16, stdDev: 1.57 }, erectGirth: { avg: 11.66, stdDev: 1.10 }, flaccidGirth: { avg: 9.31, stdDev: 0.90 }},
        in: {erectLength: { avg: 5.17, stdDev: 1.05 }, flaccidLength: { avg: 3.61, stdDev: 0.62 }, erectGirth: { avg: 4.59, stdDev: 0.43 }, flaccidGirth: { avg: 3.67, stdDev: 0.35 }}
    },
    western: {
        cm: {erectLength: { avg: 14.0, stdDev: 2.7 }, flaccidLength: { avg: 9.5, stdDev: 1.6 }, erectGirth: { avg: 12.0, stdDev: 1.2 }, flaccidGirth: { avg: 9.5, stdDev: 1.0 }},
        in: {erectLength: { avg: 5.51, stdDev: 1.06 }, flaccidLength: { avg: 3.74, stdDev: 0.63 }, erectGirth: { avg: 4.72, stdDev: 0.47 }, flaccidGirth: { avg: 3.74, stdDev: 0.39 }}
    },
    asian: {
        cm: {erectLength: { avg: 13.0, stdDev: 1.8 }, flaccidLength: { avg: 8.2, stdDev: 1.1 }, erectGirth: { avg: 11.5, stdDev: 1.0 }, flaccidGirth: { avg: 8.5, stdDev: 0.9 }},
        in: {erectLength: { avg: 5.12, stdDev: 0.71 }, flaccidLength: { avg: 3.23, stdDev: 0.43 }, erectGirth: { avg: 4.53, stdDev: 0.39 }, flaccidGirth: { avg: 3.35, stdDev: 0.35 }}
    },
    african: {
        cm: {erectLength: { avg: 14.5, stdDev: 2.8 }, flaccidLength: { avg: 10.0, stdDev: 1.8 }, erectGirth: { avg: 12.5, stdDev: 1.3 }, flaccidGirth: { avg: 10.0, stdDev: 1.1 }},
        in: {erectLength: { avg: 5.71, stdDev: 1.10 }, flaccidLength: { avg: 3.94, stdDev: 0.71 }, erectGirth: { avg: 4.92, stdDev: 0.51 }, flaccidGirth: { avg: 3.94, stdDev: 0.43 }}
    },
    european: {
        cm: {erectLength: { avg: 14.3, stdDev: 2.7 }, flaccidLength: { avg: 9.7, stdDev: 1.8 }, erectGirth: { avg: 12.2, stdDev: 1.3 }, flaccidGirth: { avg: 9.6, stdDev: 1.1 }},
        in: {erectLength: { avg: 5.63, stdDev: 1.06 }, flaccidLength: { avg: 3.82, stdDev: 0.71 }, erectGirth: { avg: 4.80, stdDev: 0.51 }, flaccidGirth: { avg: 3.78, stdDev: 0.43 }}
    },
    latinAmerican: {
        cm: {erectLength: { avg: 13.6, stdDev: 2.2 }, flaccidLength: { avg: 9.1, stdDev: 1.5 }, erectGirth: { avg: 11.8, stdDev: 1.1 }, flaccidGirth: { avg: 9.3, stdDev: 0.9 }},
        in: {erectLength: { avg: 5.35, stdDev: 0.87 }, flaccidLength: { avg: 3.58, stdDev: 0.59 }, erectGirth: { avg: 4.65, stdDev: 0.43 }, flaccidGirth: { avg: 3.66, stdDev: 0.35 }}
    }
};

let stats = populationStats.global;
window.stats = stats;

async function updateStats() {
    const population = document.getElementById('population-selector').value;

    console.log(`Updating stats for population: ${population}`);

    if (population === 'plssize-me') {
        console.log('Fetching PlsSize.Me stats...');
        try {
            stats = await getPlsSizeMeStats();
            console.log('PlsSize.Me stats fetched:', stats);
        } catch (error) {
            console.error('Error fetching PlsSize.Me stats:', error);
            stats = getDefaultStats();
        }
    } else {
        stats = populationStats[population] || populationStats.global;
    }

    window.stats = stats;

    console.log('Current stats:', stats);
    updateGeneralStats();
    
    // Trigger recalculation after updating stats
    if (typeof window.calculateAdvanced === 'function') {
        window.calculateAdvanced();
    }
    
    return stats;
}

async function getPlsSizeMeStats() {
    try {
        console.log('Fetching PlsSize.Me data from Supabase...');
        const { data, error } = await supabase
            .from('measurements')
            .select('erect_length, erect_girth, flaccid_length, flaccid_girth');

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            console.log('No data available. Using default values.');
            return getDefaultStats();
        }

        console.log(`Number of data points: ${data.length}`);

        // Calculate averages and standard deviations
        const stats = {
            cm: {
                erectLength: calculateStats(data.map(d => d.erect_length)),
                erectGirth: calculateStats(data.map(d => d.erect_girth)),
                flaccidLength: calculateStats(data.map(d => d.flaccid_length)),
                flaccidGirth: calculateStats(data.map(d => d.flaccid_girth))
            },
            dataPoints: data.length,
            lastUpdated: new Date().toISOString()
        };

        // Convert cm stats to inches
        stats.in = {
            erectLength: convertToInches(stats.cm.erectLength),
            erectGirth: convertToInches(stats.cm.erectGirth),
            flaccidLength: convertToInches(stats.cm.flaccidLength),
            flaccidGirth: convertToInches(stats.cm.flaccidGirth)
        };

        console.log('PlsSize.Me stats calculated:', stats);
        return stats;
    } catch (error) {
        console.error('Error fetching data from Supabase:', error);
        return getDefaultStats();
    }
}

function getDefaultStats() {
    return {
        cm: {
            erectLength: { avg: 0, stdDev: 0 },
            erectGirth: { avg: 0, stdDev: 0 },
            flaccidLength: { avg: 0, stdDev: 0 },
            flaccidGirth: { avg: 0, stdDev: 0 }
        },
        in: {
            erectLength: { avg: 0, stdDev: 0 },
            erectGirth: { avg: 0, stdDev: 0 },
            flaccidLength: { avg: 0, stdDev: 0 },
            flaccidGirth: { avg: 0, stdDev: 0 }
        }
    };
}

function convertToInches(cmStats) {
    return {
        avg: cmStats.avg / 2.54,
        stdDev: cmStats.stdDev / 2.54
    };
}

function calculateStats(values) {
    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) / values.length);
    return { avg, stdDev };
}

function updateLabels() {
    const unit = document.getElementById('unit-selector').value;
    const unitLabels = document.getElementsByClassName('unit');
    for (let label of unitLabels) {
        label.textContent = unit;
    }
    updateGeneralStats();
}

function updateGeneralStats() {
    const unit = document.getElementById('unit-selector').value;
    const statsList = document.getElementById('general-stats');
    const statsForUnit = stats && stats[unit];
    if (!statsList) {
        console.warn('general-stats element not found.');
        return;
    }
    if (!statsForUnit) {
        statsList.innerHTML = '<li>Statistics are currently unavailable. Please try again later.</li>';
        return;
    }

    statsList.innerHTML = '';
    for (let [key, value] of Object.entries(statsForUnit)) {
        const li = document.createElement('li');
        li.textContent = `Average ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}: ${value.avg.toFixed(2)} ${unit} (±${value.stdDev.toFixed(2)} ${unit})`;
        statsList.appendChild(li);
    }
    if (stats.dataPoints) {
        const li = document.createElement('li');
        li.textContent = `Number of data points: ${stats.dataPoints}`;
        statsList.appendChild(li);
    }
    if (stats.lastUpdated) {
        const li = document.createElement('li');
        li.textContent = `Last updated: ${new Date(stats.lastUpdated).toLocaleString()}`;
        statsList.appendChild(li);
    }
}

// Expose helpers globally for non-module usage
window.updateStats = updateStats;
window.updateLabels = updateLabels;
window.updateGeneralStats = updateGeneralStats;
window.getPlsSizeMeStats = getPlsSizeMeStats;
