// Perform an API call.
let problemLanguage = "python3";
let problemCode = "for i in range(5):\n\tprint(i, end='')";
let problemAnswer = "01234";

// Set initial remaining guesses
let remainingGuesses = 5;
let maxGuesses = 5;

let gameOver = false;
let playerWin = false;

const langMap = {};
langMap['python3'] = 'python';

update_editor();

window.onload = function() {
    // Retreive guesses from local storage.
    const savedGuesses = localStorage.getItem('remainingGuesses');
    if (savedGuesses !== null) {
        remainingGuesses = parseInt(savedGuesses);
        updateGuessesRemaining();
    }

    // Retreive playerWin from local storage.
    const savedPlayerWin = localStorage.getItem('playerWin');
    if (savedPlayerWin !== null) {
        playerWin = JSON.parse(savedPlayerWin);
    }

    // Retrieve gameOver from local storage.
    const savedGameover = localStorage.getItem('gameOver');
    if (savedGameover !== null) {
        gameOver = JSON.parse(savedGameover);
        if (gameOver === true) {
            handleGameOver();
        }
    }

}

function update_editor() {
    // Update the language label.
    let langLabel = document.getElementById('label-box');
    langLabel.innerText = problemLanguage;

    let editorDiv = document.getElementById('code-editor');
    var editor = ace.edit(editorDiv);
    editor.setTheme("ace/theme/tomorrow_night");
    editor.session.setMode("ace/mode/" + langMap[problemLanguage]);
    editor.setValue(problemCode);
    editor.setReadOnly(true);
    editor.gotoLine(100);
}

function submitAnswer() {
    if (gameOver) { return; }

    // Check if the answer is correct.
    const ansContainer = document.getElementById('answer-ta');
    let ans = ansContainer.value.trim();
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

    // Answer is wrong.
    remainingGuesses--;
    if (remainingGuesses === 0) {
        handleGameOver();
    }
    updateGuessesRemaining();
    shakeAnswerBox();

    // Handle local storage.
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
            // Only animate the current guess.
            if (i === remainingGuesses) {
                circle.classList.add('incorrect-animation');
            }
        }

        guessCirclesContainer.appendChild(circle);
    }
}

// Do this at the start.
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
    // Gray out the submit button.
    const submitBtn = document.getElementById('answer-submit');
    submitBtn.style.backgroundColor = '#444444';
    submitBtn.style.cursor = 'default';

    // Store gameOver in local storage
    localStorage.setItem('gameOver', JSON.stringify(gameOver));

    // If the player one, respond accordingly.
    const ansContainer = document.getElementById('answer-ta');
    if (playerWin === true) {
        ansContainer.style.borderColor = "#6fd45a";
        localStorage.setItem('playerWin', JSON.stringify(playerWin));
        document.getElementById('win-report').innerText = "You solved today's puzzle!";
    } else {
        document.getElementById('win-report').innerText = "Try again tomorrow!";
        ansContainer.style.borderColor = "#880000";
    }
}
