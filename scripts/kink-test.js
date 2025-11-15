import { kinkCategories, processKinkTestResults } from './database.js';

let currentCategory = 0;
const answers = [];
let isShortVersion = true;
let categoriesToUse = [];

const testSelection = document.getElementById('test-selection');
const shortTestButton = document.getElementById('short-test');
const longTestButton = document.getElementById('long-test');
const questionsContainer = document.getElementById('questions-container');
const nextButton = document.getElementById('next-button');
const testContainer = document.getElementById('test-container');
const resultsContainer = document.getElementById('results-container');
const resultsList = document.getElementById('results-list');
const progressBar = document.getElementById('progress-bar');
const autoFillButton = document.getElementById('auto-fill-button');

const shortVersionCategories = [
    "Rope Bondage", "Restraints", "Dominance", "Submission", "Sensation Play",
    "Exhibitionism", "Voyeurism", "Role-play", "Fetishism", "Group Play",
    "Consensual Non-Monogamy", "Sensory Exploration", "Beast", "CNC"
];

function startTest(short) {
    isShortVersion = short;
    categoriesToUse = isShortVersion 
        ? kinkCategories.filter(category => shortVersionCategories.includes(category.name))
        : kinkCategories;
    
    testSelection.style.display = 'none';
    testContainer.style.display = 'block';
    currentCategory = 0;
    answers.length = 0;
    displayQuestions();
}

shortTestButton.addEventListener('click', () => startTest(true));
longTestButton.addEventListener('click', () => startTest(false));

function displayQuestions() {
    const category = categoriesToUse[currentCategory];
    questionsContainer.classList.add('fade-out');
    
    setTimeout(() => {
        questionsContainer.innerHTML = '';
        const questionsToShow = isShortVersion ? category.questions.slice(0, 2) : category.questions;
        questionsToShow.forEach((question, index) => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('mb-6');
            questionElement.innerHTML = `
                <p class="text-xl font-semibold text-white mb-2">${question}</p>
                <div class="flex flex-wrap gap-2 justify-between">
                    <button class="option flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out" data-value="1" data-question="${index}">Strongly Disagree</button>
                    <button class="option flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out" data-value="2" data-question="${index}">Disagree</button>
                    <button class="option flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out" data-value="3" data-question="${index}">Somewhat Disagree</button>
                    <button class="option flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out" data-value="4" data-question="${index}">Neutral</button>
                    <button class="option flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out" data-value="5" data-question="${index}">Somewhat Agree</button>
                    <button class="option flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out" data-value="6" data-question="${index}">Agree</button>
                    <button class="option flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition duration-300 ease-in-out" data-value="7" data-question="${index}">Strongly Agree</button>
                </div>
            `;
            questionsContainer.appendChild(questionElement);
        });
        questionsContainer.classList.remove('fade-out');
        questionsContainer.classList.add('fade-in');
        updateProgressBar();
        checkAllAnswered();
    }, 300);
}

function handleAnswer(event) {
    const selectedButton = event.target;
    const questionIndex = parseInt(selectedButton.dataset.question);
    const selectedValue = parseInt(selectedButton.dataset.value);
    
    answers[currentCategory * (isShortVersion ? 2 : 4) + questionIndex] = selectedValue;

    const questionOptions = selectedButton.parentElement.querySelectorAll('.option');
    questionOptions.forEach(button => button.classList.remove('selected'));
    selectedButton.classList.add('selected');

    checkAllAnswered();
}

function checkAllAnswered() {
    const currentCategoryAnswers = answers.slice(
        currentCategory * (isShortVersion ? 2 : 4),
        (currentCategory + 1) * (isShortVersion ? 2 : 4)
    );
    nextButton.disabled = currentCategoryAnswers.filter(Boolean).length !== (isShortVersion ? 2 : 4);
}

function displayResults() {
    testContainer.classList.add('animate__animated', 'animate__fadeOut');
    setTimeout(() => {
        testContainer.style.display = 'none';
        resultsContainer.style.display = 'block';
        resultsContainer.classList.add('animate__animated', 'animate__fadeIn');

        const results = processKinkTestResults(answers, isShortVersion, categoriesToUse);
        console.log('Results:', results); // Debugging: Log results to console
        resultsList.innerHTML = '';

        // Create a container for additional metrics
        const additionalMetricsContainer = document.createElement('div');
        additionalMetricsContainer.classList.add('mt-6', 'p-4', 'bg-gray-800', 'rounded-lg');
        additionalMetricsContainer.innerHTML = '<h3 class="text-xl font-semibold mb-3">Additional Metrics</h3>';

        results.forEach(result => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${result.category}:</strong> ${result.score}`;
            li.classList.add('animate__animated', 'animate__fadeInUp');

            // Apply color based on score
            const score = parseFloat(result.rawScore);
            if (score >= 75) {
                li.style.backgroundColor = 'rgba(72, 187, 120, 0.2)'; // High interest
            } else if (score >= 50) {
                li.style.backgroundColor = 'rgba(237, 137, 54, 0.2)'; // Moderate interest
            } else {
                li.style.backgroundColor = 'rgba(229, 62, 62, 0.2)'; // Low interest
            }

            if (["Dominant Tendencies", "Submissive Tendencies", "Experimental Tendencies", "Taboo Tendencies"].includes(result.category)) {
                additionalMetricsContainer.appendChild(li);
            } else {
                resultsList.appendChild(li);
            }
        });

        // Append additional metrics container to results
        resultsContainer.insertBefore(additionalMetricsContainer, document.getElementById('retake-test'));
    }, 500);
}

function updateProgressBar() {
    const progress = (currentCategory / categoriesToUse.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${Math.round(progress)}%`;
}

questionsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('option')) {
        handleAnswer(event);
    }
});

nextButton.addEventListener('click', () => {
    currentCategory++;
    if (currentCategory < categoriesToUse.length) {
        displayQuestions();
    } else {
        displayResults();
    }
});

function autoFillAnswers() {
    categoriesToUse.forEach((category, categoryIndex) => {
        const numberOfQuestions = isShortVersion ? 2 : 4;
        for (let i = 0; i < numberOfQuestions; i++) {
            const randomValue = Math.floor(Math.random() * 7) + 1; // Random value between 1 and 7
            answers[categoryIndex * numberOfQuestions + i] = randomValue;
        }
    });
    displayResults();
}

autoFillButton.addEventListener('click', autoFillAnswers);

function resetTest() {
    testSelection.style.display = 'block';
    testContainer.style.display = 'none';
    resultsContainer.style.display = 'none';
    currentCategory = 0;
    answers.length = 0;
    updateProgressBar();
}

document.getElementById('retake-test').addEventListener('click', resetTest);
