import Pet from './pet.js';
export { actualizarMonedas };

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('achievements.json'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const achievements = await response.json();

        const mascota = Pet.cargarEstado(achievements);

        actualizarStats(mascota);
        actualizarMonedas(mascota); 
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
    const energiaElem = document.getElementById("energia");
    const felicidadElem = document.getElementById("felicidad");
    const higieneElem = document.getElementById("higiene");
    const nivelElem = document.getElementById("nivel");
    const expElem = document.getElementById("exp");

    if (energiaElem) energiaElem.textContent = mascota.energia;
    if (felicidadElem) felicidadElem.textContent = mascota.felicidad;
    if (higieneElem) higieneElem.textContent = mascota.higiene;
    if (nivelElem) nivelElem.textContent = mascota.nivel;
    if (expElem) expElem.textContent = mascota.exp;
}

function actualizarMonedas(mascota) {
    const monedasElem = document.getElementById("monedas");
    monedasElem.textContent = `Monedas: ${mascota.monedas}`;
}