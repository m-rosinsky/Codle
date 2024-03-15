/*
 * This function gets a random problem string.
 */
function get_string() {
    const sentence = "The quick brown ~ jumps over the lazy ~";

    // Split the sentence.
    const words = sentence.split(' ');

    let html_string = '';

    words.forEach(word => {
        if (word.includes('~')) {
            html_string += '<input type="text" placeholder="${placeholder}" />'
        } else {
            html_string += word + ' ';
        }
    });

    return html_string.trim();
}

function highlight_code(code) {
    return Prism.highlight(code, Prism.languages.python, 'python');
}

window.onload = function() {
    const problem_code = get_string();
    problem_code = highlight_code(problem_code);
    const content_div = document.getElementById("code-editor");
    content_div.innerHTML = problem_code;
}
