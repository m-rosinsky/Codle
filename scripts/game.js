// Perform an API call.
let problemLanguage = "python3";
let problemCode = "for i in range(5):\n\tprint(i, end='')";
let problemAnswer = "01234";

// Set initial remaining guesses
let remainingGuesses = 5;
let maxGuesses = 5;

let gameOver = false;
let playerWin = false;

const langMap = {
    'python3': 'python'
};

updateEditor();

window.onload = function() {
    // Retrieve game state from local storage or reset if it's a new day
    resetGameState();
}

function resetGameState() {
    // Retrieve the last accessed date from Local Storage
    const savedLastAccessedDate = localStorage.getItem('lastAccessedDate');

    // If there's no saved date or if it's a new day, reset the game state
    if (!savedLastAccessedDate || isNewDay(savedLastAccessedDate)) {
        localStorage.clear(); // Clear local storage
        localStorage.setItem('lastAccessedDate', new Date().toString()); // Store current date
    } else {
        // Retrieve game state from Local Storage
        const savedRemainingGuesses = localStorage.getItem('remainingGuesses');
        if (savedRemainingGuesses !== null) {
            remainingGuesses = parseInt(savedRemainingGuesses);
            updateGuessesRemaining();
        }

        const savedPlayerWin = localStorage.getItem('playerWin');
        if (savedPlayerWin !== null) {
            playerWin = JSON.parse(savedPlayerWin);
        }

        const savedGameOver = localStorage.getItem('gameOver');
        if (savedGameOver !== null) {
            gameOver = JSON.parse(savedGameOver);
            if (gameOver) {
                handleGameOver();
            }
        }
    }
}

// Function to check if it's a new day
function isNewDay(savedDate) {
    const currentDate = new Date();
    const savedDateObj = new Date(savedDate);
    return currentDate.toDateString() !== savedDateObj.toDateString();
}

function updateEditor() {
    // Update the language label
    const langLabel = document.getElementById('label-box');
    langLabel.innerText = problemLanguage;

    const editorDiv = document.getElementById('code-editor');
    const editor = ace.edit(editorDiv);
    editor.setTheme("ace/theme/tomorrow_night");
    editor.session.setMode("ace/mode/" + langMap[problemLanguage]);
    editor.setValue(problemCode);
    editor.setReadOnly(true);
    editor.gotoLine(100);
}

function submitAnswer() {
    if (gameOver) { return; }

    // Check if the answer is correct
    const ansContainer = document.getElementById('answer-ta');
    const ans = ansContainer.value.trim();
    if (ans.length === 0) {
        ansContainer.style.borderColor = "#880000";
        return;
    }
    ansContainer.style.borderColor = "#8d8d8d";

    if (ans === problemAnswer) {
        playerWin = true;
        startConfetti();
        setTimeout(stopConfetti, 2000);
        handleGameOver();
        return;
    }

    // Answer is wrong
    remainingGuesses--;
    if (remainingGuesses === 0) {
        handleGameOver();
    }
    updateGuessesRemaining();
    shakeAnswerBox();

    // Update local storage
    localStorage.setItem('remainingGuesses', remainingGuesses);
}

function updateGuessesRemaining() {
    const guessCirclesContainer = document.querySelector('.guess-circles');
    guessCirclesContainer.innerHTML = ''; // Clear previous circles

    for (let i = 0; i < maxGuesses; i++) {
        const circle = document.createElement('div');
        circle.classList.add('guess-circle');

        if (i >= remainingGuesses) {
            circle.classList.add('incorrect');
            if (i === remainingGuesses) {
                circle.classList.add('incorrect-animation');
            }
        }

        guessCirclesContainer.appendChild(circle);
    }
}

// Do this at the start
updateGuessesRemaining();

function shakeAnswerBox() {
    const answerBox = document.getElementById("answer-ta");
    answerBox.classList.add('shake-animation');
    setTimeout(() => {
        answerBox.classList.remove('shake-animation');
    }, 200);
}

function handleGameOver() {
    gameOver = true;

    // Gray out the submit button
    const submitBtn = document.getElementById('answer-submit');
    submitBtn.style.backgroundColor = '#444444';
    submitBtn.style.cursor = 'default';

    // Store game over in local storage
    localStorage.setItem('gameOver', JSON.stringify(gameOver));

    // If the player won, respond accordingly
    const ansContainer = document.getElementById('answer-ta');
    if (playerWin) {
        ansContainer.style.borderColor = "#6fd45a";
        localStorage.setItem('playerWin', JSON.stringify(playerWin));
        document.getElementById('win-report').innerText = "You solved today's puzzle!";
    } else {
        document.getElementById('win-report').innerText = "Try again tomorrow!";
        ansContainer.style.borderColor = "#880000";
    }
}
