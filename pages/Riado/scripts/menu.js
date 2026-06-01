const wordSize = document.getElementById("wordSize");
const wordSizeValue = document.getElementById("wordSizeValue");
const btnRandom = document.getElementById("btn-random");
const btnCustom = document.getElementById("btn-custom");
const customSection = document.getElementById("customSection");
const btnStartCustom = document.getElementById("btn-start-custom");
const customWordInput = document.getElementById("customWord");
const loading = document.getElementById("loading")
const main = document.getElementById("menu-container")
const url = "https://api.dicionario-aberto.net/random";
let selectedSize = parseInt(wordSize.value);

wordSize.addEventListener("input", () => {
  selectedSize = parseInt(wordSize.value);
  wordSizeValue.textContent = selectedSize;
});

customWordInput.addEventListener("input", () => {
  customWordInput.value = customWordInput.value.trim();
});

btnCustom.addEventListener("click", () => {
  customSection.classList.toggle("hidden");
});

btnRandom.addEventListener("click", async () => {
  const randomWord = await getRandomWordByLength(selectedSize);
  if (randomWord) iniciarJogo(randomWord);
});

btnStartCustom.addEventListener("click", () => {
  const customWord = customWordInput.value.toLowerCase();
  if (customWord.length > 0) {
    iniciarJogo(customWord);
  }
});

async function getRandomWordByLength(size) {
  let foundWord = "";
  main.classList.add("hide")
  loading.style.display = "flex";

  while (foundWord.length !== size) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Erro na requisição: " + response.status);
      const data = await response.json();
      foundWord = data.word.normalize("NFD").replace(/[^a-z]/gi, "");
    } catch (error) {
      console.error("Erro:", error);
      break;
    }
  }

  console.log("Palavra encontrada:", foundWord);
  return foundWord;
}

function iniciarJogo(word) {
  localStorage.setItem("target", word);
  window.location.href = "pages/game.html";
}
