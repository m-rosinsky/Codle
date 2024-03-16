// JavaScript code to handle guess count and circle coloring

// Perform an API call.
let problemLanguage = "python3";
let problemCode = "for i in range(5):\n\tprint(i, end='')";
let problemAnswer = "01234";

// Set initial remaining guesses
let remainingGuesses = 5;
let maxGuesses = 5;

let gameOver = false;

const langMap = {};
langMap['python3'] = 'python';

update_editor();

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
    if (remainingGuesses <= 0) { return; }
    remainingGuesses--;
    updateGuessesRemaining();
    shakeAnswerBox();
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
                circle.classList.add('animation');
            }
        }

        guessCirclesContainer.appendChild(circle);
    }
}



function shakeAnswerBox() {
    const answerBox = document.getElementById("answer-ta");
    answerBox.classList.add('shake-animation');
    setTimeout(() => {
        answerBox.classList.remove('shake-animation');
    }, 200);
}

updateGuessesRemaining();
