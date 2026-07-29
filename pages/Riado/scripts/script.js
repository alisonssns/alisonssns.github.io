const gameBoard = document.querySelector("main");
const btnHelp = document.getElementById("btn-help");
const btnClose = document.getElementById("btn-close");
const btnConfig = document.getElementById("btn-config");
const configClose = document.getElementById("config-close");
const configPanel = document.getElementById("config");
const dictionaryCheckBox = document.getElementById("dictionary");
const modal = document.getElementById("modal");
const message = document.getElementById("message");
const resultBanner = document.getElementById("result-banner");

let secretWord = localStorage.getItem("target") || "Riado";
localStorage.setItem("target", secretWord);

let dictionaryConfig = localStorage.getItem("dictionary");
dictionaryConfig = dictionaryConfig ? dictionaryConfig === "true" : true;
let helpClosed = localStorage.getItem("help") === "true";
let wordLength = secretWord.length;
let currentGuess = new Array(wordLength).fill("");
let pointer = 0;
let attemptCount = 0;
let guessRows = [];
let gameEnded = false;
let isWaiting = false;

function initGrid() {
    gameBoard.innerHTML = "";

    for (let i = 0; i <= wordLength; i++) {
        const row = document.createElement("div");
        row.className = "guess";

        for (let j = 0; j < wordLength; j++) {
            const cell = document.createElement("div");
            const span = document.createElement("span");

            cell.className = "letter";

            cell.appendChild(span);
            row.appendChild(cell);
        }

        gameBoard.appendChild(row);
    }

    guessRows = document.querySelectorAll(".guess");

    for (let i = 1; i < guessRows.length; ++i) {
        guessRows[i].querySelectorAll(".letter").forEach((cell) => {
            cell.classList.add("down-row");
        });
    }
}

function updateLetters() {
    const letterCells = guessRows[attemptCount].querySelectorAll(".letter");
    letterCells.forEach((cell, i) => {
        cell.querySelector("span").textContent = currentGuess[i] || "";
    });
}

function countLetters(array) {
    return array.reduce((acc, l) => {
        acc[l] = (acc[l] || 0) + 1;
        return acc;
    }, {});
}

async function checkWord(word) {
    const url = `https://api.dicionario-aberto.net/word/${word}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro: ${response.status}`);
        const data = await response.json();
        return Array.isArray(data) && data.length > 0;
    } catch (err) {
        console.warn("Erro ao verificar palavra:", err);
        return false;
    }
}

async function checkGuess() {
    isWaiting = true;
    
    if (currentGuess.filter((el) => el != "").length !== wordLength) {
        isWaiting = false
        return showError(`Somente palavras com ${wordLength} letras.`);
    }
    
    if (dictionaryConfig) {
        const isValid = await checkWord(currentGuess);
        isWaiting = false
        if (!isValid) return showError("Essa palavra não é aceita!");
    }

    const row = guessRows[attemptCount];
    const letterCells = row.querySelectorAll(".letter");
    const secretArray = secretWord.toLowerCase().split("");
    const letterCount = countLetters(secretArray);

    index = 0
    const intervaloOdair = setInterval(() => {
        letterCells[index].classList.add("guessed");
        letterCells[index].classList.remove("selected");
        if (currentGuess[index] === secretArray[index]) {
            setColor(letterCells[index], "correct");
            letterCount[currentGuess[index]]--;
            updateSideBar(currentGuess[index], "correct");
        }
        if (currentGuess[index] !== secretArray[index]) {
            if (letterCount[currentGuess[index]] > 0) {
                setColor(letterCells[index], "partial");
                letterCount[currentGuess[index]]--;
                updateSideBar(currentGuess[index], "partial");
            } else {
                setColor(letterCells[index], "wrong");
                updateSideBar(currentGuess[index], "wrong");
            }
        }
        index += 1
        if (index >= wordLength) {
            clearInterval(intervaloOdair)
            isWaiting = false
        }
    }, 300)

    if (currentGuess.join("") === secretWord.toLowerCase()) {
        return showResult(true);
    }

    attemptCount++;
    if (attemptCount > wordLength) {
        showResult(false);
    } else {
        currentGuess.fill("")
        pointer = 0
        updateRowState();
    }

}

function updateRowState() {
    const row = guessRows[attemptCount];
    if (row) {
        row.querySelectorAll(".letter").forEach((cell) =>
            cell.classList.remove("down-row")
        );
    }
}

function setColor(cell, color) {
    cell.classList.add(color);
}

function setSelectedCell(index) {
    const row = guessRows[attemptCount]
    row.querySelectorAll(".letter").forEach((cell, i) => {
        if (i == index) {
            cell.classList.add("selected")
        } else {
            cell.classList.remove("selected")
        }
    });
}

function changePointer(value) {
    const row = guessRows[attemptCount]
    if (row) {
        let movedPointer = pointer + value
        if (movedPointer >= 0 && movedPointer < wordLength) {
            pointer = pointer + value
            setSelectedCell(pointer)
        }
    }
}

function handleKey(event) {
    if (gameEnded || isWaiting) return;
    const key = event.key.toLowerCase();
    hideMessage();

    if (/^[a-z]$/.test(key) && pointer < wordLength) {
        currentGuess[pointer] = key
        for (let i = pointer; i < wordLength; ++i) {
            if (currentGuess[i] == "") {
                changePointer(i - pointer);
                updateLetters();
                break;
            }
        }
        updateLetters();
    } else if (key === "backspace") {
        if (currentGuess[pointer]) {
            currentGuess[pointer] = ""
        } else if (pointer > 0) {
            currentGuess[pointer - 1] = ""
        }

        changePointer(-1)
        updateLetters();
    } else if (key === "enter") {
        guessRows[attemptCount].classList.remove("shake");
        checkGuess();
    } else if (key === "arrowleft") {
        changePointer(-1)
    } else if (key === "arrowright") {
        changePointer(1)
    } else {
        console.log(key)
    }
}

function updateSideBar(letter, status) {
    const li = document.getElementById(`letter-${letter}`);
    if (!li) return;
    li.classList.remove("correct", "partial", "wrong");
    li.classList.add(status);
}

function showMessage(txt, type) {
    message.className = type;
    message.querySelector("h3").textContent = txt;
    message.style.transform = "scale(1)";
}

function hideMessage() {
    message.style.transform = "scale(0)";
}

function showError(txt) {
    const row = guessRows[attemptCount];
    if (row) row.classList.add("shake");
    showMessage(txt, "error");
}

function showResult(win) {
    gameEnded = true;
    setTimeout(() => {
        const title = resultBanner.querySelector("#banner-title");
        const msg = resultBanner.querySelector("#banner-message");
        const btnMenu = resultBanner.querySelector("#btn-menu");

        resultBanner.classList.remove("hidden", "win", "lose");
        resultBanner.classList.add(win ? "win" : "lose");

        title.textContent = win ? "Você venceu!" : "Você perdeu!";
        msg.textContent = win
            ? "Parabéns! Você adivinhou a palavra correta!"
            : `A palavra era: ${secretWord}`;

        btnMenu.onclick = () => (window.location.href = "../index.html");
    }, 300 * wordLength);
}

function openHelp() {
    modal.classList.remove("hidden");
    localStorage.setItem("help", false)
}

function closeHelp() {
    modal.classList.add("hidden");
    localStorage.setItem("help", true)
}

function openConfig() {
    configPanel.classList.remove("hidden");
}

function closeConfig() {
    configPanel.classList.add("hidden");
}

function changeDictionary(event) {
    dictionaryConfig = event.target.checked;
    localStorage.setItem("dictionary", dictionaryConfig);
}

if (helpClosed) {
    closeHelp();
}

function initGame() {
    initGrid();
    setSelectedCell(0);
    document.addEventListener("keydown", handleKey);

    btnHelp.addEventListener("click", openHelp);
    btnClose.addEventListener("click", closeHelp);
    btnConfig.addEventListener("click", openConfig);
    configClose.addEventListener("click", closeConfig);
    dictionaryCheckBox.addEventListener("change", changeDictionary);

    dictionaryCheckBox.checked = dictionaryConfig;
}

initGame();
