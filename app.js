let buttons = document.querySelectorAll(".keyboard-button");
let wordLine = document.querySelector(".word-line");

let typingButtons = [];
let i = 0;

buttons.forEach(b => {
    if (!(b.getAttribute("data-key") === "enter") && !(b.getAttribute("data-key") === "backSpace")) {
        typingButtons.push(b);
    }
})

typingButtons.forEach(b => {
    b.addEventListener("click", () => {
        wordLine.children[i].innerHTML = `<i>${b.getAttribute("data-key")}</i>`;
        i++;

        if (wordLine.lastElementChild.hasChildNodes()) {
            if (wordLine.nextElementSibling !== null) {
                wordLine = wordLine.nextElementSibling;
                i = 0;
            } else {
                console.log("game over will be handled here");
            }
        }
    });

});
