// JavaScript code to handle guess count and circle coloring

// Perform an API call.
let problemLanguage = "python3";
let problemCode = "for i in range(5):\n\tprint(i, end='')";
let problemAnswer = "01234";

// Set initial remaining guesses
let remainingGuesses = 3;
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
    if (gameOver) { return; }
    let answer = document.getElementById('answer-ta').value;
    if (answer === problemAnswer) {
        alert("Correct");
        return;
    }
    remainingGuesses--;
    updateGuessesRemaining();
    if (remainingGuesses === 0) {
        alert("Loser u suck");
        gameOver = true;
    }
}

function updateGuessesRemaining() {
    const circleParent = document.querySelector('.guess-circles');
    circleParent.innerHTML = '';
    for (let i = 0; i < maxGuesses; i++)
    {
        const newCircle = document.createElement('div');
        newCircle.classList.add('guess-circle');
        if (i >= remainingGuesses) {
            newCircle.classList.add('incorrect');
        } else {
            newCircle.classList.remove('incorrect');
        }
        circleParent.appendChild(newCircle);
    }
}

updateGuessesRemaining();
