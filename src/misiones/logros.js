import Pet from './pet.js';
import { actualizarMonedas } from './button.js';

document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch('achievements.json');
    const achievements = await response.json();

    const mascota = Pet.cargarEstado(achievements);

    actualizarLogros(mascota);
    actualizarMonedas(mascota);

    document.querySelectorAll(".finalizar").forEach(button => {
        button.addEventListener("click", (event) => {
            const id = event.target.getAttribute("data-id");
            completarLogro(id, mascota, event.target);
        });
    });

    document.getElementById("volver")?.addEventListener("click", () => {
        window.location.href = 'index.html';
    });
});

function actualizarLogros(mascota) {
    const logrosElem = document.getElementById("logros");
    if (!logrosElem) {
        console.error("No se encontró el elemento con id 'logros'");
        return;
    }
    logrosElem.innerHTML = "";
    mascota.achievements.forEach(achievement => {
        const progreso = achievement.unlocked ? 100 : new Function('pet', `return ${achievement.progress}`)(mascota) * 100;
        const logroElem = document.createElement("li");
        logroElem.innerHTML = `
            <div>
                <span>${achievement.name}: ${achievement.unlocked ? "Desbloqueado" : "Pendiente"}</span>
                <div class="progress-bar">
                    <div class="progress" style="width: ${progreso}%"></div>
                </div>
                ${achievement.unlocked ? '<button class="finalizar" data-id="' + achievement.id + '">Completar y ganar monedas</button>' : ''}
            </div>
        `;
        logrosElem.appendChild(logroElem);
    });
}

// Modificar la función completarLogro para actualizar las monedas
function completarLogro(id, mascota, button) {
    const achievement = mascota.achievements.find(a => a.id == id);
    if (achievement && achievement.unlocked) {
        console.log(`¡Logro completado! ${achievement.name}`);
        mascota.monedas = (mascota.monedas || 0) + achievement.reward;
        mascota.guardarEstado();
        button.style.display = "none";
    }
}

