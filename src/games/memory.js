import Pet from "../pet.js";
import AudioController from "../audioController.js";

export function iniciarJuegoMemoria(mascota, misiones, modoDesafio = false) {
  const gameContainer = document.getElementById("game-container");
  gameContainer.style.display = "none";

  const newGameContainer = document.createElement("div");
  newGameContainer.id = "game-container-memory";
  newGameContainer.innerHTML = `
    <h2>Juego de Memoria</h2>
    ${
      modoDesafio
        ? '<p id="timer" style="font-size: 1.2rem;">Tiempo restante: 60s</p>'
        : ""
    }
    <div id="memory-game" class="memory-game"></div>
  `;

  document.body.appendChild(newGameContainer);

  const cardImages = [
    "img1.png",
    "img2.png",
    "img3.png",
    "img4.png",
    "img1.png",
    "img2.png",
    "img3.png",
    "img4.png",
  ];

  const cardImagesChallenge = [
    "img1.png",
    "img2.png",
    "img3.png",
    "img4.png",
    "img5.png",
    "img6.png",
    "img1.png",
    "img2.png",
    "img3.png",
    "img4.png",
    "img5.png",
    "img6.png",
  ];

  const selectedImages = modoDesafio ? cardImagesChallenge : cardImages;
  selectedImages.sort(() => Math.random() - 0.5);

  const memoryGame = document.getElementById("memory-game");

  selectedImages.forEach((image) => {
    const card = document.createElement("div");
    card.classList.add("memory-card");
    card.dataset.image = image;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front" style="background-image: url('../assets/images/${image}')"></div>
        <div class="card-back" style="background-image: url('../assets/images/back.png')"></div>
      </div>
    `;
    memoryGame.appendChild(card);
  });

  let hasFlippedCard = false;
  let lockBoard = false; 
  let firstCard, secondCard;
  let timerInterval;
  let timeLeft = 50;

  const wrongSound = new Audio("../assets/sound/wrong.mp3");
  const correctSound = new Audio("../assets/sound/correct.mp3");

  function iniciarTimer() {
    const timerElem = document.getElementById("timer");
    timerInterval = setInterval(() => {
      timeLeft--;
      timerElem.textContent = `Tiempo restante: ${timeLeft}s`;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        AudioController.play("menu");
        alert("¡Tiempo agotado! No has completado el desafío.");
        finalizarJuego();
      }
    }, 1000);
  }

  function flipCard() {
    if (lockBoard || this.classList.contains("flip")) return;

    this.classList.add("flip");

    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;
    checkForMatch();
  }

  function checkForMatch() {
    const isMatch = firstCard.dataset.image === secondCard.dataset.image;
    isMatch ? disableCards() : unflipCards();
  }

  function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    correctSound.play();
    resetBoard();
    checkForCompletion();
  }

  function unflipCards() {
    lockBoard = true;
    wrongSound.play();

    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetBoard();
    }, 1000);
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  function checkForCompletion() {
    const allCards = document.querySelectorAll(".memory-card");
    const allFlipped = Array.from(allCards).every((card) =>
      card.classList.contains("flip")
    );

    if (allFlipped) {
      if (modoDesafio) clearInterval(timerInterval);

      alert("¡Has completado el juego de memoria!");
      AudioController.play("menu");
      mascota.congelarStats = false;

      Pet.guardarEstado(mascota, misiones);
      finalizarJuego();
    }
  }

  function finalizarJuego() {
    const memoryGameContainer = document.getElementById(
      "game-container-memory"
    );
    if (memoryGameContainer) memoryGameContainer.remove();

    const gameContainer = document.getElementById("game-container");
    if (gameContainer) gameContainer.style.display = "flex";
  }

  document
    .querySelectorAll(".memory-card")
    .forEach((card) => card.addEventListener("click", flipCard));

  if (modoDesafio) iniciarTimer();
}
