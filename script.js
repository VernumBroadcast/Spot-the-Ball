// Game state
let currentQuestionIndex = 0;
const totalQuestions = 14;
let selectedOption = null;
let questionOrder = []; // Will hold shuffled question numbers
let questionsShown = new Set(); // Track which questions have been shown in current cycle

// Shuffle array function (Fisher-Yates algorithm)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Question image paths
function getQuestionImagePath(questionNum) {
    if (questionNum === 1) {
        return 'Pics/GUESS THE BALL QUESTION 1.png';
    } else {
        return `Pics/GUESS THE BALL Q${questionNum}.png`;
    }
}

// Answer image paths
function getAnswerImagePath(questionNum) {
    return `Pics/GUESS THE BALL ANSWER Q${questionNum}.png`;
}

// Initialize the game
function initGame() {
    // Create array of question numbers [1, 2, 3, ..., 14] and shuffle it
    questionOrder = shuffleArray(Array.from({length: totalQuestions}, (_, i) => i + 1));
    currentQuestionIndex = 0;
    questionsShown.clear(); // Reset tracking
    loadQuestion();
}

// Load a question
function loadQuestion() {
    // Ensure we don't go beyond the shuffled array
    if (currentQuestionIndex >= questionOrder.length) {
        // All questions shown - reshuffle for next cycle
        questionOrder = shuffleArray(Array.from({length: totalQuestions}, (_, i) => i + 1));
        currentQuestionIndex = 0;
        questionsShown.clear();
    }
    
    // Get the actual question number from the shuffled order
    const questionNum = questionOrder[currentQuestionIndex];
    
    // Safety check: ensure this question hasn't been shown in current cycle
    if (questionsShown.has(questionNum)) {
        // This shouldn't happen, but if it does, reshuffle
        questionOrder = shuffleArray(Array.from({length: totalQuestions}, (_, i) => i + 1));
        currentQuestionIndex = 0;
        questionsShown.clear();
        return loadQuestion(); // Recursively call to get a fresh question
    }
    
    // Mark this question as shown
    questionsShown.add(questionNum);
    
    const questionImage = document.getElementById('question-image');
    questionImage.src = getQuestionImagePath(questionNum);
    
    // Reset UI - show question section, hide result section
    const questionSection = document.querySelector('.question-section');
    const resultSection = document.getElementById('result-section');
    const resultMessage = document.getElementById('result-message');
    const answerImageContainer = document.querySelector('.answer-image-container');
    
    // Reset all classes and displays
    resultSection.style.display = 'none';
    resultSection.classList.remove('show');
    resultMessage.classList.remove('show');
    questionSection.style.display = 'flex';
    // Show options section
    document.querySelector('.options-section').style.display = 'flex';
    // Hide answer image container and remove reveal class
    answerImageContainer.style.display = 'none';
    answerImageContainer.classList.remove('reveal');
    
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
    });
    
    selectedOption = null;
}

// Handle option selection
function selectOption(option) {
    if (selectedOption !== null) return; // Already answered
    
    selectedOption = option;
    // Get the actual question number from the shuffled order
    const questionNum = questionOrder[currentQuestionIndex];
    // correctAnswers array is 0-indexed, so subtract 1
    const correctAnswer = correctAnswers[questionNum - 1];
    const isCorrect = option === correctAnswer;
    
    // Disable all buttons
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
    });
    
    // Hide options
    document.querySelector('.options-section').style.display = 'none';
    
    const questionSection = document.querySelector('.question-section');
    const resultSection = document.getElementById('result-section');
    const resultMessage = document.getElementById('result-message');
    const answerImage = document.getElementById('answer-image');
    const answerImageContainer = document.querySelector('.answer-image-container');
    
    // Set image source first
    const answerPath = getAnswerImagePath(questionNum);
    answerImage.src = answerPath;
    answerImageContainer.style.display = 'block';
    answerImageContainer.classList.remove('reveal');
    
    // Set up result message
    resultMessage.textContent = isCorrect ? '✓ CORRECT!' : '✗ WRONG!';
    resultMessage.className = 'result-message ' + (isCorrect ? 'correct' : 'wrong');
    
    // Show result section (but keep it transparent initially)
    resultSection.style.display = 'flex';
    resultSection.classList.remove('show');
    resultMessage.classList.remove('show');
    
    // Keep question image visible - don't fade it out
    // Show result message immediately
    resultSection.classList.add('show');
    resultMessage.classList.add('show');
    
    // After showing message, reveal the answer image (which will overlay the question)
    setTimeout(function() {
        answerImageContainer.classList.add('reveal');
    }, 1500); // Show message for 1.5 seconds before revealing answer
    
    // Hide the result message after 2 seconds
    setTimeout(function() {
        resultMessage.classList.remove('show');
    }, 2000); // Hide message after 2 seconds
}

// Move to next question
function nextQuestion() {
    currentQuestionIndex++;
    
    // Check if all questions in current cycle have been shown
    if (currentQuestionIndex >= totalQuestions || questionsShown.size >= totalQuestions) {
        // All questions shown - reshuffle for next cycle
        questionOrder = shuffleArray(Array.from({length: totalQuestions}, (_, i) => i + 1));
        currentQuestionIndex = 0;
        questionsShown.clear();
    }
    
    loadQuestion();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Option buttons
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const option = parseInt(this.getAttribute('data-option'));
            selectOption(option);
        });
    });
    
    // Next button
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    
    // Initialize game
    initGame();
});
