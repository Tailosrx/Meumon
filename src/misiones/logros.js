import Pet from '../pet.js';
import { actualizarMonedas } from '../button.js';

document.addEventListener("DOMContentLoaded", () => {
    const mascota = {
        logros: [
            { id: "1", descripcion: "Completar la primera misión", recompensa: 100, nivel: 1, completado: false },
            { id: "2", descripcion: "Alcanzar nivel 5", recompensa: 200, nivel: 1, completado: false },
            { id: "3", descripcion: "Completar la segunda misión", recompensa: 300, nivel: 2, completado: false }
            // Añadir más logros aquí
        ],
        monedas: 0,
        nivel: 1,
        // Otros atributos de mascota
    };

    actualizarLogros(mascota);
    actualizarMonedas(mascota);

    document.querySelectorAll(".finalizar").forEach(button => {
        button.addEventListener("click", (event) => {
            const id = event.target.getAttribute("data-id");
            completarLogro(id, mascota, event.target);
        });
    });

    document.getElementById("volver").addEventListener("click", () => {
        window.location.href = '../index.html';
    });
});

function completarLogro(id, mascota, button) {
    const logro = mascota.logros.find(logro => logro.id === id);
    if (logro && !logro.completado) {
        logro.completado = true;
        mascota.monedas += logro.recompensa;
        actualizarMonedas(mascota);

        const logroElem = button.closest('.logro');
        if (logroElem) {
            logroElem.style.backgroundColor = 'lightgreen';
        }

        button.disabled = true;

        // Verificar si todos los logros del nivel actual están completados
        const logrosNivelActual = mascota.logros.filter(logro => logro.nivel === mascota.nivel);
        const todosCompletados = logrosNivelActual.every(logro => logro.completado);

        if (todosCompletados) {
            mascota.nivel++;
            desbloquearLogros(mascota.nivel);
        }
    }
}

function actualizarLogros(mascota) {
    const logrosElem = document.getElementById("logros");
    if (!logrosElem) {
        console.error("No se encontró el elemento con id 'logros'");
        return;
    }

    mascota.logros.forEach(logro => {
        const logroElem = document.querySelector(`.logro[data-id="${logro.id}"]`);
        if (logroElem) {
            if (logro.completado) {
                logroElem.style.backgroundColor = 'lightgreen';
                const button = logroElem.querySelector('.finalizar');
                if (button) {
                    button.disabled = true;
                }
            } else if (logro.nivel > mascota.nivel) {
                const button = logroElem.querySelector('.finalizar');
                if (button) {
                    button.disabled = true;
                }
            }
        }
    });
}

function desbloquearLogros(nivel) {
    document.querySelectorAll(`.logro[data-nivel="${nivel}"] .finalizar`).forEach(button => {
        button.disabled = false;
    });
}