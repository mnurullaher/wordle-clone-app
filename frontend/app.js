const webSocket = new WebSocket("ws://localhost:8080");
const enterForm = document.querySelector("#enterFormDiv")
const connectBtn = document.querySelector("#connectBtn")
const usernameInp = document.querySelector("#usernameInp")
const gameContainerDiv = document.querySelector("#gameContainer")
const keyChars = /^[A-Za-z-ğüşöçıİĞÜŞÖÇ]$/
const typingButtons = [...document.querySelectorAll('[data-key]')];
const enterBtn = document.getElementById("enterBtn");
const backSpaceBtn = document.getElementById("backSpaceBtn");
const congratsText = document.getElementById("congratsText");
const scorBoard = document.querySelector(".scorboard")

let wordLine = document.querySelector(".word-line");
let columnIndex = 0;
let gameFinished = false;
let isCorrect = false;
let username;
let resp = [];
let correctAnswer = "";

function sendMsgToServer(type, payload) {
    webSocket.send(JSON.stringify({ type: type, payload }))
}

webSocket.onmessage = (event => {
    console.log(event);
    const data = JSON.parse(event.data)

    if (!!data.type && data.type == "CONNECT_SUCCESS") {
        console.log("Successfully connected!")
        enterForm.classList.add("d-none")
        gameContainerDiv.classList.replace("d-none", "d-flex")
        document.addEventListener('keyup', (event) => {
            if (keyChars.test(event.key)) {
                handleLetter(event.key)
            } else if (event.key === "Enter") {
                submitWord();
            } else if (event.key === "Backspace") {
                deleteLetter();
            }
        });
    }

    if (!!data.type && data.type == "CORRECT_ANSWER") {
        correctAnswer = data.payload
    }

    if (!!data.type && data.type == "SUBMIT_RESPONSE") {
        resp = data.payload
        const userAnswer = getUserAnswer()
        for (let i = 0; i < resp.length; i++) {
            let cellResult = resp[i];
            const className = cellResult == "CL" ? "correctLocation" : cellResult == "WL" ? "wrongLocation" : "notIncluded"
            wordLine.children[i].classList.add(className);
            typingButtons.filter(b => b.getAttribute("data-key") === userAnswer.charAt(i))
                .forEach(cb => addClassToElement(cb, className));
        }
        if (resp.every(cl => cl == "CL")) {
            congratsText.style.display = "block";
            isCorrect = true
            gameFinished = true
            return
        }
        if (wordLine.nextElementSibling !== null) {
            wordLine = wordLine.nextElementSibling;
            columnIndex = 0;
            return;
        } else {
            gameFinished = false
            alert("GAME OVER! Correct answer was " + correctAnswer)
        }
    }

    if (!!data.type && data.type == "USER_LIST") {
        scorBoard.innerHTML = ""
        data.payload.forEach(user => {
            let pointTable = document.createElement("p")
            pointTable.innerText = user.username + " = " + user.point
            scorBoard.appendChild(pointTable);
        })
    }
})

connectBtn.onclick = () => {
    username = usernameInp.value
    sendMsgToServer('CONNECT', username)
}

typingButtons.forEach((btn) => btn.onclick = (e) => handleLetter(e.target.getAttribute("data-key")));
enterBtn.addEventListener("click", submitWord);
backSpaceBtn.addEventListener("click", deleteLetter);

function handleLetter(letter) {
    if (columnIndex > 4) return;
    if (gameFinished) return;
    wordLine.children[columnIndex].innerHTML = `<div>${letter}</div>`;
    columnIndex++;
}

function getUserAnswer() {
    return [...wordLine.children]
        .map(e => e.firstElementChild.innerText)
        .reduce((l, r) => l + r)
        .toLocaleLowerCase('TR-tr');
}

function submitWord() {
    if (!wordLine.lastElementChild.hasChildNodes()) return;
    if (gameFinished) return;

    sendMsgToServer('USER_SUBMIT', getUserAnswer())
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

