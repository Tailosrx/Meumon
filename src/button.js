import Pet from './pet.js';

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('misiones/achievements.json'); // Asegúrate de que la ruta sea correcta
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const achievements = await response.json();

        const mascota = Pet.cargarEstado(achievements);

        actualizarStats(mascota);
        actualizarMonedas(mascota); // Asegurarse de que las monedas se actualicen al cargar la página

        document.getElementById("alimentar")?.addEventListener("click", () => {
            mascota.alimentar();
            actualizarStats(mascota);
        });

        document.getElementById("jugar")?.addEventListener("click", () => {
            mascota.jugar();
            actualizarStats(mascota);
        });

        document.getElementById("duchar")?.addEventListener("click", () => {
            mascota.bañar();
            actualizarStats(mascota);
        });

        document.getElementById("descansar")?.addEventListener("click", () => {
            if (mascota.estado === "activo") {
                mascota.descansar();
            } else {
                mascota.despertar();
            }
            actualizarStats(mascota);
        });

        document.getElementById("icon-logo")?.addEventListener("click", () => {
            document.getElementById("game-container").style.display = "none";
            document.getElementById("achievements-container").style.display = "block";
            setTimeout(() => window.location.href = 'logros.html', 0);
        });

        document.getElementById("volver")?.addEventListener("click", () => {
            document.getElementById("achievements-container").style.display = "none";
            document.getElementById("game-container").style.display = "block";
        });
    } catch (error) {
        console.error('Error fetching achievements:', error);
    }
});

function actualizarStats(mascota) {
    document.getElementById("energia").textContent = mascota.energia;
    document.getElementById("felicidad").textContent = mascota.felicidad;
    document.getElementById("higiene").textContent = mascota.higiene;
    document.getElementById("nivel").textContent = mascota.nivel;
    document.getElementById("exp").textContent = mascota.exp;
}

function actualizarMonedas(mascota) {
    const monedasElem = document.getElementById("monedas");
    if (!monedasElem) {
        console.error("No se encontró el elemento con id 'monedas'");
        return;
    }
    monedasElem.textContent = `Monedas: ${mascota.monedas}`;
}