let buttons = document.querySelectorAll(".keyboard-button");
let wordLine = document.querySelector(".word-line");
let enterBtn = document.getElementById("enterBtn");
let backSpaceBtn = document.getElementById("backSpaceBtn");

let typingButtons = [];
let i = 0;

let answer = "";
let correctAnswer = "hello";

buttons.forEach(b => {
    if (!(b.getAttribute("data-key") === "enter") && !(b.getAttribute("data-key") === "backSpace")) {
        typingButtons.push(b);
    }
})

typingButtons.forEach(b => {
    b.addEventListener("click", typing)
});

enterBtn.addEventListener("click", submitWord);

backSpaceBtn.addEventListener("click", deleteLetter);

function typing(e) {
    if(i > 4) return;
    wordLine.children[i].innerHTML = `<div>${e.target.getAttribute("data-key")}</div>`;
    i++;
}

function submitWord() {
    if (!wordLine.lastElementChild.hasChildNodes()) return;

    checkScore(wordLine);

    if (wordLine.nextElementSibling !== null) {
        wordLine = wordLine.nextElementSibling;
        i = 0;
    } else {
        console.log("game over will be handled here");
    }
}

function deleteLetter() {
    if(i < 1) return;
    wordLine.children[i-1].innerHTML = "";
    i--
}

function checkScore(word) {
    for (let j = 0; j < 5; j++) {
        answer = answer + word.children[j].firstElementChild.innerText;
    }
    if (answer.toLowerCase() === correctAnswer) {
        alert("Congrats!")
    }
    answer = "";
}
