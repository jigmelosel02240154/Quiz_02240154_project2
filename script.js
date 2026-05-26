// App state variables
let quizData = [];           // Will be populated from the server
let shuffledQuestions = [];  // Holds the randomized pool
let currentIdx = 0;
let score = 0;
let lives = 5; 
let userName = "";

// Select HTML elements
const setupScreen = document.getElementById('setup-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const userForm = document.getElementById('user-form');

// Initialize the application
async function init() {
    userForm.addEventListener('submit', handleStart);
    
    // Fetch quiz data from our Express backend API immediately on page load
    try {
        const response = await fetch('/api/questions');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        quizData = await response.json();
        console.log("Successfully loaded questions from backend server.");
    } catch (error) {
        console.error("Critical Error: Could not fetch quiz questions from backend:", error);
    }
}

// Fisher-Yates Shuffle Algorithm to randomize questions
function shuffleQuestions() {
    shuffledQuestions = [...quizData]; // Clone the data fetched from the server
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }
}

// Validate student name and transition screens
function handleStart(e) {
    e.preventDefault();

    const nameInput = document.getElementById('username');
    const errorMsg = document.getElementById('error-message');

    // Edge case safety: prevent starting if data didn't load from server yet
    if (quizData.length === 0) {
        alert("Quiz data is still loading from the server. Please try again in a brief second!");
        return;
    }

    if (nameInput.value.trim().length < 2) {
        errorMsg.classList.remove('hidden');
    } else {
        userName = nameInput.value;

        // Shuffle questions before rendering the first one
        shuffleQuestions();

        setupScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');

        renderQuestion();
    }
}

// Display question and answer choices
function renderQuestion() {
    const container = document.getElementById('question-container');
    
    // Safety check: ensure our shuffled sequence is ready
    if (!shuffledQuestions || shuffledQuestions.length === 0) {
        console.error("Render aborted: shuffledQuestions array is empty.");
        return;
    }

    const data = shuffledQuestions[currentIdx]; 
    
    // Update question progress tracker UI
    document.getElementById('progress').textContent = `Q${currentIdx + 1} / ${shuffledQuestions.length}`;
    
    container.textContent = "";

    // Render Question Title
    const h2 = document.createElement('h2');
    h2.textContent = data.q;
    container.appendChild(h2);

    // Render Option Buttons
    data.a.forEach((text, index) => {
        const btn = document.createElement('button');
        btn.className = "option-btn";
        btn.textContent = text;

        // Click handler with instant visual feedback evaluation
        btn.addEventListener('click', () => checkAnswer(index, container));

        container.appendChild(btn);
    });
}

// Evaluate answer and apply visual styling instantly
function checkAnswer(choice, container) {
    const currentQuestion = shuffledQuestions[currentIdx];
    const buttons = container.querySelectorAll('.option-btn');

    // 1. Instantly freeze inputs to avoid multi-click point cheating
    buttons.forEach(btn => btn.disabled = true);

    // 2. Apply color styles conditionally
    if (choice === currentQuestion.c) {
        score++;
        document.getElementById('score-display').textContent = `Score: ${score}`;
        buttons[choice].classList.add('correct'); // Highlights chosen option green
    } else {
        lives--;
        updateLivesUI();
        buttons[choice].classList.add('incorrect'); // Highlights incorrect selection red
        buttons[currentQuestion.c].classList.add('correct'); // Highlights real answer green
    }

    currentIdx++;

    // 3. Pause for 1.2 seconds so user absorbs the feedback before loading next slide
    setTimeout(() => {
        if (currentIdx < shuffledQuestions.length && lives > 0) {
            renderQuestion();
        } else {
            endQuiz();
        }
    }, 1200); 
}

// Update heart display
function updateLivesUI() {
    const hearts = "❤️".repeat(lives);
    document.getElementById('lives-display').textContent = lives > 0 ? hearts : "💀 Game Over";
}

// Finish assessment and display results
function endQuiz() {
    quizScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');
    
    const percent = Math.round((score / shuffledQuestions.length) * 100);

    document.getElementById('percent-text').textContent = `${percent}%`;

    document.getElementById('result-status').textContent =
        lives === 0 ? "Out of Lives!" : "Quiz Complete!";

    document.getElementById('final-msg').textContent =
        `${userName}, you answered ${score} out of ${shuffledQuestions.length} correctly.`;
}

// Fire up app setup
init();