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
    const questionSection = document.querySelector('.question-section');
    const answerImageContainer = document.querySelector('.answer-image-container');
    
    // Hide answer image container and remove all classes first
    answerImageContainer.style.display = 'none';
    answerImageContainer.classList.remove('reveal', 'fade-out');
    
    // Preload the image first
    const imagePath = getQuestionImagePath(questionNum);
    const img = new Image();
    
    img.onload = function() {
        // Image loaded, set source
        questionImage.src = imagePath;
        
        // Reset question section - start hidden, then fade in
        questionSection.style.display = 'flex';
        questionSection.classList.remove('fade-out'); // Remove any fade-out class
        questionSection.classList.add('fade-out'); // Start with fade-out (hidden)
        
        // Show options section
        document.querySelector('.options-section').style.display = 'flex';
        
        // Reset button back to "Go"
        const goBtn = document.getElementById('go-btn');
        if (goBtn) {
            goBtn.textContent = 'Go';
            goBtn.disabled = false;
            goBtn.style.opacity = '1';
        }
        
        selectedOption = null;
        
        // Fade in the question after a brief moment
        requestAnimationFrame(function() {
            setTimeout(function() {
                questionSection.classList.remove('fade-out');
            }, 50);
        });
    };
    
    // Start loading the image
    img.src = imagePath;
    
    // If image is already cached, onload might not fire, so check
    if (img.complete) {
        img.onload();
    }
}

// Handle button click (Go or Next)
function handleButtonClick() {
    const goBtn = document.getElementById('go-btn');
    const buttonText = goBtn.textContent.trim();
    
    if (buttonText === 'Go') {
        // Reveal answer
        revealAnswer();
    } else if (buttonText === 'Next') {
        // Go to next question
        nextQuestion();
    }
}

// Reveal answer
function revealAnswer() {
    if (selectedOption !== null) return; // Already answered
    
    selectedOption = true;
    // Get the actual question number from the shuffled order
    const questionNum = questionOrder[currentQuestionIndex];
    
    const goBtn = document.getElementById('go-btn');
    const questionSection = document.querySelector('.question-section');
    const answerImage = document.getElementById('answer-image');
    const answerImageContainer = document.querySelector('.answer-image-container');
    
    // Change button to "Next"
    goBtn.textContent = 'Next';
    goBtn.disabled = false; // Re-enable for next click
    
    // Preload answer image first
    const answerPath = getAnswerImagePath(questionNum);
    const img = new Image();
    
    img.onload = function() {
        // Image loaded, now set source
        answerImage.src = answerPath;
        
        // Fade out question first
        questionSection.classList.add('fade-out');
        
        // After question starts fading, prepare answer container
        setTimeout(function() {
            // Set display and ensure it starts hidden
            answerImageContainer.style.display = 'block';
            answerImageContainer.classList.remove('reveal');
            
            // Force a reflow to ensure the element is rendered before transition
            answerImageContainer.offsetHeight;
            
            // Now fade in the answer
            requestAnimationFrame(function() {
                answerImageContainer.classList.add('reveal');
            });
        }, 150); // Start showing answer halfway through question fade
    };
    
    // Start loading the image
    img.src = answerPath;
    
    // If image is already cached, onload might not fire
    if (img.complete) {
        img.onload();
    }
}

// Move to next question
function nextQuestion() {
    const questionSection = document.querySelector('.question-section');
    const answerImageContainer = document.querySelector('.answer-image-container');
    
    // Fade out current question and answer
    questionSection.classList.add('fade-out');
    answerImageContainer.classList.add('fade-out');
    
    // Wait for fade out to complete, then load next question
    setTimeout(function() {
        currentQuestionIndex++;
        
        // Check if all questions in current cycle have been shown
        if (currentQuestionIndex >= totalQuestions || questionsShown.size >= totalQuestions) {
            // All questions shown - reshuffle for next cycle
            questionOrder = shuffleArray(Array.from({length: totalQuestions}, (_, i) => i + 1));
            currentQuestionIndex = 0;
            questionsShown.clear();
        }
        
        loadQuestion();
    }, 300); // Reduced wait time to match transition duration
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Go/Next button (handles both states)
    document.getElementById('go-btn').addEventListener('click', handleButtonClick);
    
    // Initialize game
    initGame();
});
