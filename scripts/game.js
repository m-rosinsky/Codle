// JavaScript code to handle guess count and circle coloring
let remainingGuesses = 3; // Set initial remaining guesses

function updateGuessesRemaining() {
    const circles = document.querySelectorAll('.guess-circles .guess-circle');
    circles.forEach((circle, index) => {
        if (index >= remainingGuesses) {
            circle.classList.add('incorrect');
        } else {
            circle.classList.remove('incorrect');
        }
    });
}

// Example usage to update remaining guesses
// Call this function whenever a guess is made or when the game state changes
updateGuessesRemaining();
