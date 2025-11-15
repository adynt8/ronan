function calculatePercentile(value, mean, standardDeviation) {
    const zScore = (value - mean) / standardDeviation;
    return 100 * (0.5 * (1 + Math.erf(zScore / Math.sqrt(2))));
}

// Add erf function if not supported by browser
if (!Math.erf) {
    Math.erf = function(x) {
        const t = 1 / (1 + 0.5 * Math.abs(x));
        const tau = t * Math.exp(-x * x - 1.26551223 + 
                    1.00002368 * t + 0.37409196 * t * t + 
                    0.09678418 * t * t * t - 
                    0.18628806 * t * t * t * t + 
                    0.27886807 * t * t * t * t * t - 
                    1.13520398 * t * t * t * t * t * t + 
                    1.48851587 * t * t * t * t * t * t * t - 
                    0.82215223 * t * t * t * t * t * t * t * t + 
                    0.17087277 * t * t * t * t * t * t * t * t * t);
        return x >= 0 ? 1 - tau : tau - 1;
    };
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showCondomRecommendations(nominalWidth) {
    window.location.href = `condom-recommendations.html?nominalWidth=${nominalWidth}`;
}

function generateShareId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}