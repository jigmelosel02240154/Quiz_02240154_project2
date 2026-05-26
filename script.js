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

// Transition from Welcome to Quiz screen
function handleStart(e) {
    e.preventDefault();
    const nameInput = document.getElementById('username');
    const errorMsg = document.getElementById('error-message');

    userName = nameInput.value.trim();

    if (!userName) {
        errorMsg.classList.remove('hidden');
        nameInput.classList.add('input-error');
        return;
    }

    // Reset game state
    currentIdx = 0;
    score = 0;
    lives = 5;
    updateLivesUI();
    document.getElementById('score-display').textContent = `Score: 0`;

    // Shuffle data and start
    if (quizData.length === 0) {
        alert("Server has no questions ready! Please check backend connection.");
        return;
    }
    
    shuffleQuestions();
    setupScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    renderQuestion();
}

// Draw question slide to DOM
function renderQuestion() {
    const currentQuestion = shuffledQuestions[currentIdx];
    
    // Update progress tracker text
    document.getElementById('progress').textContent = `Q${currentIdx + 1} / ${shuffledQuestions.length}`;

    const container = document.getElementById('question-container');
    container.innerHTML = `
        <h3 class="question-text">${currentQuestion.q}</h3>
        <div class="options-grid">
            ${currentQuestion.o.map((option, index) => `
                <button class="option-btn" onclick="handleChoice(${index})">${option}</button>
            `).join('')}
        </div>
    `;
}

// Process selection answer checks
function handleChoice(choice) {
    const currentQuestion = shuffledQuestions[currentIdx];
    const buttons = document.querySelectorAll('.option-btn');

    // Disable all choice buttons immediately to block click spamming
    buttons.forEach(btn => btn.disabled = true);

    // Validate choice logic
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

    // Pause for 1.2 seconds so user absorbs the feedback before loading next slide
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
        `Great effort ${userName}! You answered ${score} questions correctly.`;

    // Send final exam records back to SQLite server
    fetch('/api/attempts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: userName,
            score: score,
            percentage: percent
        })
    })
    .then(res => res.json())
    .then(data => console.log("Server logged result successfully:", data))
    .catch(err => console.error("Could not save score history to server:", err));
}

// Run application listener execution hooks
document.addEventListener('DOMContentLoaded', init);