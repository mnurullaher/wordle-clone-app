const nthWord = Math.floor(Math.random() * 1669);
const keyChars = /^[A-Za-z-ğüşöçıİĞÜŞÖÇ]$/
const typingButtons = [...document.querySelectorAll('[data-key]')];
const enterBtn = document.getElementById("enterBtn");
const backSpaceBtn = document.getElementById("backSpaceBtn");
const congratsText = document.getElementById("congratsText");

let wordLine = document.querySelector(".word-line");
let columnIndex = 0;
let gameFinished = false;
let isCorrect = false;

function correctAnswer() {
    return window.__words[nthWord].toLocaleLowerCase('TR-tr');
}

typingButtons.forEach((btn) => btn.onclick = (e) => handleLetter(e.target.getAttribute("data-key")));
enterBtn.addEventListener("click", submitWord);
backSpaceBtn.addEventListener("click", deleteLetter);

document.addEventListener('keyup', (event) => {
    if (keyChars.test(event.key)) {
        handleLetter(event.key)
    } else if (event.key === "Enter") {
        submitWord();
    } else if (event.key === "Backspace") {
        deleteLetter();
    }
});

function handleLetter(letter) {
    if (columnIndex > 4) return;
    if (gameFinished) return;
    wordLine.children[columnIndex].innerHTML = `<div>${letter}</div>`;
    columnIndex++;
}

function typingVirtualKeyboar(e) {
    if (columnIndex > 4) return;
    if (gameFinished) return;
    wordLine.children[columnIndex].innerHTML = `<div>${e.target.getAttribute("data-key")}</div>`;
    columnIndex++;
}

function submitWord() {
    if (!wordLine.lastElementChild.hasChildNodes()) return;
    if (gameFinished) return;

    checkGivenAnswer(wordLine);

    if (wordLine.nextElementSibling !== null) {
        wordLine = wordLine.nextElementSibling;
        columnIndex = 0;
        return;
    }
    gameFinished = true;
    if (!isCorrect) {
        alert("GAME OVER!");
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            element.replaceWith(element.cloneNode(true));
        });
    }
}

function deleteLetter() {
    if (columnIndex < 1) return;
    if (gameFinished) return;
    wordLine.children[columnIndex - 1].innerHTML = "";
    columnIndex--
}

function addClassToElement(elem, className) {
    if (className == "correctLocation") {
        elem.classList.replace("wrongLocation", className);
    }

    if (className == "wrongLocation" && elem.classList.contains("correctLocation")) {
        return;
    }
    elem.classList.add(className);
}

function checkGivenAnswer(word) {
    let answer = ""
    for (let j = 0; j < 5; j++) {
        answer = answer + word.children[j].firstElementChild.innerText;
        answer = answer.toLocaleLowerCase('TR-tr');
        const className = correctAnswer().charAt(j) === answer.charAt(j) ?
            "correctLocation" : correctAnswer().includes(answer.charAt(j)) ?
            "wrongLocation" : "notIncluded";
        
        word.children[j].classList.add(className);
        typingButtons.filter(b => b.getAttribute("data-key") === answer.charAt(j))
                .forEach(cb => addClassToElement(cb, className));
    }

    if (answer === correctAnswer()) {
        congratsText.style.display = "block";
        isCorrect = true;
        gameFinished = true
    }
}
