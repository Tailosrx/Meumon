const tutorialMensajes = [
    "Este es tu Tamagotchi virtual. Cuida de él para que esté feliz y saludable.",
    "Puedes alimentarlo, jugar con él, bañarlo y dejarlo descansar.",
    "Completa misiones para ganar monedas y desbloquear logros.",
    "¡Explora la tienda para comprar objetos y personalizar tu experiencia!",
    "¡Diviértete jugando a Meumon!"
];

let mensajeActual = 0;

const tutorialModal = document.getElementById("tutorial-modal");
const tutorialTexto = document.getElementById("tutorial-texto");

function siguienteMensajeTutorial() {
    mensajeActual++;
    if (mensajeActual < tutorialMensajes.length) {
        tutorialTexto.textContent = tutorialMensajes[mensajeActual];
    } else {
        borrarTutorial();
    }
}

function borrarTutorial() {
    // Ocultar el modal
    tutorialModal.remove();
}

window.addEventListener("load", () => {
    tutorialModal.classList.remove("hidden");
});

window.siguienteMensajeTutorial = siguienteMensajeTutorial;