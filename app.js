let buttons = document.querySelectorAll(".keyboard-button");
let wordLine = document.querySelector(".word-line");
let enterBtn = document.getElementById("enterBtn");
let backSpaceBtn = document.getElementById("backSpaceBtn");

let typingButtons = [];
let i = 0;

let answer = "";
let correctAnswer = "hello";
let isCorrect = false;
letGameOver = false;

const keyChars = /^[A-Za-z-ğüşöçıİĞÜŞÖÇ]$/

buttons.forEach(b => {
    if (!(b.getAttribute("data-key") === "enter") && !(b.getAttribute("data-key") === "backSpace")) {
        typingButtons.push(b);
    }
})

typingButtons.forEach(b => {
    b.addEventListener("click", typingVirtualKeyboar)
});

enterBtn.addEventListener("click", submitWord);

backSpaceBtn.addEventListener("click", deleteLetter);

document.addEventListener('keyup', (event) => {
    if (keyChars.test(event.key)) {
        if (i > 4) return;
        if (isCorrect) return;
        wordLine.children[i].innerHTML = `<div>${event.key}</div>`;
        i++;
    } else if (event.key === "Enter") {
        submitWord();
    } else if (event.key === "Backspace") {
        deleteLetter();
    }
});

function typingVirtualKeyboar(e) {
    if (i > 4) return;
    if (isCorrect) return;
    wordLine.children[i].innerHTML = `<div>${e.target.getAttribute("data-key")}</div>`;
    i++;
}

function submitWord() {
    if (!wordLine.lastElementChild.hasChildNodes()) return;
    if (isCorrect) return;

    checkScore(wordLine);

    if (wordLine.nextElementSibling !== null) {
        wordLine = wordLine.nextElementSibling;
        i = 0;
    } else if (!isCorrect) {
        alert("GAME OVER!");
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            element.replaceWith(element.cloneNode(true));
        });
    }
}

function deleteLetter() {
    if (i < 1) return;
    if (isCorrect) return;
    wordLine.children[i - 1].innerHTML = "";
    i--
}

function checkScore(word) {
    for (let j = 0; j < 5; j++) {
        answer = answer + word.children[j].firstElementChild.innerText;
        answer = answer.toLowerCase();
        if (correctAnswer.charAt(j) === answer.charAt(j)) {
            word.children[j].classList.add("correctLocation")
        } else if (correctAnswer.includes(answer.charAt(j))) {
            word.children[j].classList.add("wrongLocation")
        } else {
            word.children[j].classList.add("notIncluded")
        }
    }
    
    if (answer === correctAnswer) {
        alert("congrats");
        isCorrect = true;

     }
    answer = "";
}
