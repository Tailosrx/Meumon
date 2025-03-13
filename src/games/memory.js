import Pet from '../pet.js';

export function iniciarJuegoMemoria(mascota) {
    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = `
        <h2>Juego de Memoria</h2>
        <div id="memory-game" class="memory-game">
            <!-- Cartas generadas aquí -->
        </div>
    `;

    const cardImages = [
        "img1.png", "img2.png", "img3.png", "img4.png",
        "img1.png", "img2.png", "img3.png", "img4.png"
    ];

    cardImages.sort(() => Math.random() - 0.5);

    const memoryGame = document.getElementById("memory-game");

    cardImages.forEach(image => {
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

    const wrongSound = new Audio('../assets/sound/wrong.mp3');
    const correctSound = new Audio('../assets/sound/correct.mp3');

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
        let isMatch = firstCard.dataset.image === secondCard.dataset.image;

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
        const allFlipped = Array.from(allCards).every(card => card.classList.contains("flip"));

        if (allFlipped) {
            alert("¡Has completado el juego de memoria!");


            // Volver al inicio
            window.location.href = "./index.html";
        }
    }

    document.querySelectorAll(".memory-card").forEach(card =>
        card.addEventListener("click", flipCard)
    );
}