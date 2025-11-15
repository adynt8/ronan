// Ensure helper functions defined in populationStats are available
window.viewSizeChart = viewSizeChart;
window.viewCalculations = viewCalculations;
window.checkForHorse = checkForHorse;
window.loadStoredValues = loadStoredValues;

function loadStoredValues() {
    const unit = localStorage.getItem('penisCalcUnit');
    if (unit) {
        document.getElementById('unit-selector').value = unit;
        updateLabels();
    }

    const erectLength = localStorage.getItem('penisCalcErectLength');
    const flaccidLength = localStorage.getItem('penisCalcFlaccidLength');
    const erectGirth = localStorage.getItem('penisCalcErectGirth');
    const flaccidGirth = localStorage.getItem('penisCalcFlaccidGirth');

    if (erectLength) document.getElementById('erect-length').value = erectLength;
    if (flaccidLength) document.getElementById('flaccid-length').value = flaccidLength;
    if (erectGirth) document.getElementById('erect-girth').value = erectGirth;
    if (flaccidGirth) document.getElementById('flaccid-girth').value = flaccidGirth;

    if (erectLength || flaccidLength || erectGirth || flaccidGirth) {
        calculateAdvanced();
    }
}

function viewSizeChart() {
    const unit = document.getElementById('unit-selector').value;
    const erectLength = document.getElementById('erect-length').value;
    const erectGirth = document.getElementById('erect-girth').value;

    const encodedParams = btoa(`${unit},${erectLength},,${erectGirth},`);
    window.location.href = `size-chart.html?d=${encodedParams}`;
}

function viewCalculations() {
    window.location.href = 'calculations.html';
}

function showFirstVisitPopup() {
    if (!localStorage.getItem('firstVisitPopupShown')) {
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.style.display = 'block';
        popup.innerHTML = `
            <div class="popup-content">
                <h2>Share Your Anonymous Measurements?</h2>
                <p>Your data can help improve our understanding of penis size diversity.</p>
                <ul>
                    <li>Support research on size variations across populations</li>
                    <li>Help others feel more confident about their bodies</li>
                </ul>
                <p>100% anonymous. Your privacy is our top priority.</p>
                <button id="shareButton" class="button button-share">Yes, Count Me In!</button>
                <button id="optOutButton" class="button button-opt-out">Maybe Later</button>
                <p class="small-text">You can change your mind anytime in settings.</p>
            </div>
        `;
        document.body.appendChild(popup);

        document.getElementById('shareButton').addEventListener('click', function() {
            handleSharingChoice(true);
        });

        document.getElementById('optOutButton').addEventListener('click', function() {
            handleSharingChoice(false);
        });

        // Add styles for the new popup
        const style = document.createElement('style');
        style.textContent += `
            .popup {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.5);
            }
            .popup-content {
                background-color: #ffffff;
                margin: 10% auto;
                padding: 30px;
                border-radius: 10px;
                width: 90%;
                max-width: 500px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                text-align: center;
            }
            .popup-content h2 {
                color: #2c3e50;
                margin-bottom: 20px;
                font-size: 24px;
            }
            .popup-content p {
                color: #34495e;
                margin-bottom: 15px;
                font-size: 16px;
            }
            .popup-content ul {
                text-align: left;
                margin-bottom: 20px;
                color: #34495e;
                font-size: 16px;
            }
            .button-share {
                background-color: #27ae60;
                color: #ffffff;
                padding: 15px 30px;
                font-size: 18px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.3s;
                margin-bottom: 15px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .button-share:hover {
                background-color: #2ecc71;
                transform: translateY(-2px);
                box-shadow: 0 6px 8px rgba(0,0,0,0.15);
            }
            .button-opt-out {
                background-color: transparent;
                color: #95a5a6;
                padding: 10px 20px;
                font-size: 16px;
                border: none;
                cursor: pointer;
                transition: color 0.3s;
            }
            .button-opt-out:hover {
                color: #7f8c8d;
            }
            .small-text {
                font-size: 14px;
                color: #7f8c8d;
                margin-top: 20px;
            }
        `;
        document.head.appendChild(style);
    }
}

function handleSharingChoice(share) {
    localStorage.setItem('firstVisitPopupShown', 'true');
    localStorage.setItem('shareMeasurements', share.toString());
    const popup = document.querySelector('.popup');
    popup.classList.add('fade-out');
    setTimeout(() => {
        popup.remove();
    }, 500);
}

async function getUserCountry() {
    try {
        const response = await fetch('https://ip-api.com/json/');
        if (!response.ok) {
            throw new Error('Failed to fetch country information');
        }
        const geoData = await response.json();
        console.log('User country:', geoData.country); // Print the country to log
        return geoData.country;
    } catch (error) {
        console.error('Error fetching country information:', error);
        return 'Unknown';
    }
}

function checkForHorse() {
    const erectLength = parseFloat(document.getElementById('erect-length').value);
    const unit = document.getElementById('unit-selector').value;
    
    // Convert to cm if in inches
    const lengthInCm = unit === 'in' ? erectLength * 2.54 : erectLength;

    if (lengthInCm >= 22) {
        const horse = document.createElement('img');
        horse.src = 'horse.png';
        horse.style.position = 'fixed';
        horse.style.top = '50%';
        horse.style.left = '-100px';
        horse.style.transform = 'translateY(-50%)';
        horse.style.width = '100px';
        horse.style.zIndex = '9999';
        document.body.appendChild(horse);

        let position = -100;
        const animate = () => {
            position += 5;
            horse.style.left = `${position}px`;
            if (position < window.innerWidth + 100) {
                requestAnimationFrame(animate);
            } else {
                document.body.removeChild(horse);
            }
        };
        animate();
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    window.updateLabels();
    await window.updateStats(); // Use the global updateStats function
    loadStoredValues();
    showFirstVisitPopup(); // Make sure this line is here

    // Fetch and store the user's country
    const country = await getUserCountry();
    localStorage.setItem('userCountry', country);

    // Add event listener for erect length input
    document.getElementById('erect-length').addEventListener('input', checkForHorse);

    // Add event listeners for population and unit selectors
    document.getElementById('population-selector').addEventListener('change', async () => {
        await window.updateStats();
        window.calculateAdvanced(); // Call calculateAdvanced after updating stats
    });
    document.getElementById('unit-selector').addEventListener('change', () => {
        window.updateLabels();
        window.calculateAdvanced(); // Call calculateAdvanced after changing units
    });
});

// Add this function at the end of the file
function printJokeToConsole() {
    const jokes = [
        "Why did the ruler feel inadequate? It was never quite up to the measure!",
        "What do you call a mathematician who's always talking about penis size? An algeBRO!",
        "Why was the statistician embarrassed? His sample size was too small!",
        "What did one tape measure say to the other? 'Don't worry, size isn't everything!'",
        "Why did the penis go to therapy? It had too many hang-ups!"
    ];
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    console.log(randomJoke);
}

// Call this function after all other initializations
window.addEventListener('load', () => {
    // ... any existing load event listeners ...
    
    // Add this line at the end
    setTimeout(printJokeToConsole, 1000); // Print joke after a 1-second delay
});
