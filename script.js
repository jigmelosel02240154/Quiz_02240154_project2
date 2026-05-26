// App state variables
let quizData = [];           // Will be populated with 20 items from the server
let shuffledQuestions = [];  // Will hold exactly 10 randomized items
let currentIdx = 0;
let score = 0;
let lives = 3;               // CHANGED: Starting with 3 lives
let userName = "";

// Select HTML elements
const setupScreen = document.getElementById('setup-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const userForm = document.getElementById('user-form');

// Initialize the application
async function init() {
    userForm.addEventListener('submit', handleStart);
    
    // Fetch quiz data from our Express backend API
    try {
        const response = await fetch('/api/questions');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        quizData = await response.json();
        console.log("Successfully loaded 20 questions from backend server.");
    } catch (error) {
        console.error("Critical Error: Could not fetch quiz questions from backend:", error);
    }
}

// Fisher-Yates Shuffle Algorithm + Slice Limit
function shuffleQuestions() {
    // 1. Clone the complete 20-question data bank
    let tempArray = [...quizData]; 
    
    // 2. Randomly shuffle the entire list
    for (let i = tempArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
    }
    
    // 3. CHANGED: Take only the first 10 questions from the shuffled pool
    shuffledQuestions = tempArray.slice(0, 10);
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
    lives = 3; // Reset to 3 lives for a fresh attempt
    updateLivesUI();
    document.getElementById('score-display').textContent = `Score: 0`;

    if (quizData.length === 0) {
        alert("Server has no questions ready! Please check backend connection.");
        return;
    }
    
    shuffleQuestions(); // Randomly picks 10 questions
    setupScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    renderQuestion();
}

// Draw question slide to DOM
function renderQuestion() {
    const currentQuestion = shuffledQuestions[currentIdx];
    
    // Displays progress tracker smoothly out of 10
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

    buttons.forEach(btn => btn.disabled = true);

    if (choice === currentQuestion.c) {
        score++;
        document.getElementById('score-display').textContent = `Score: ${score}`;
        buttons[choice].classList.add('correct');
    } else {
        lives--;
        updateLivesUI();
        buttons[choice].classList.add('incorrect');
        buttons[currentQuestion.c].classList.add('correct');
    }

    currentIdx++;

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
    
    // Percentage calculated accurately based on 10 items
    const percent = Math.round((score / shuffledQuestions.length) * 100);

    document.getElementById('percent-text').textContent = `${percent}%`;

    document.getElementById('result-status').textContent =
        lives === 0 ? "Out of Lives!" : "Quiz Complete!";

    document.getElementById('final-msg').textContent =
        `Great effort ${userName}! You answered ${score} out of 10 questions correctly.`;

    // Send final history records back to SQLite server
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

document.addEventListener('DOMContentLoaded', init);