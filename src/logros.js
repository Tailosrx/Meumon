import { actualizarMonedas } from './utils.js';
import Pet from './pet.js';

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('./misiones.json'); // Asegúrate de que la ruta sea correcta
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const misiones = await response.json();

        const mascota = Pet.cargarEstado(misiones);

        actualizarMisiones(mascota, misiones);
        actualizarMonedas(mascota); // Asegurarse de que las monedas se actualicen al cargar la página

        document.querySelectorAll(".finalizar").forEach(button => {
            button.addEventListener("click", (event) => {
                const id = event.target.getAttribute("data-id");
                completarMision(id, mascota, event.target, misiones);
            });
        });

        document.getElementById("volver")?.addEventListener("click", () => {
            window.location.href = './index.html';
        });
    } catch (error) {
        console.error('Error fetching achievements:', error);
    }
});

function actualizarMisiones(mascota, misiones) {
    const logrosElem = document.getElementById("logros");
    if (!logrosElem) {
        console.error("No se encontró el elemento con id 'logros'");
        return;
    }
    logrosElem.innerHTML = ""; // Limpia el contenedor

    Object.keys(misiones.niveles).forEach(nivelKey => {
        const nivel = misiones.niveles[nivelKey];
        const nivelElem = document.createElement("div");
        nivelElem.classList.add("nivel");
        if (parseInt(nivelKey) > mascota.nivel) {
            nivelElem.classList.add("blurred"); // Añadir clase para desenfocar niveles superiores
        }
        nivelElem.innerHTML = `<h2>Nivel ${parseInt(nivelKey) + 1}</h2>`;
        nivel.misiones.forEach((mision, index) => {
            const misionElem = document.createElement("div");
            misionElem.className = `mision ${mision.completado ? "completed" : ""}`;
            if (parseInt(nivelKey) > mascota.nivel) {
                misionElem.classList.add("blurred"); // Añadir clase para desenfocar misiones de niveles superiores
            }
            misionElem.innerHTML = `
                <h3 style="color: black">${mision.descripcion}</h3>
                <div class="mission-progress">
                    <p style="color: black">${mision.progreso} / ${mision.meta}</p>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${(mision.progreso / mision.meta) * 100}%"></div>
                    </div>
                </div>
                <button ${mision.completado ? "disabled" : ""} onclick="completarMision(${index}, mascota, this, misiones)">
                    ${mision.completado ? "Completada" : `Reclamar (${mision.recompensa} monedas)`}
                </button>
            `;
            logrosElem.appendChild(misionElem);

            // Si la misión está completada, aplica la animación
            if (mision.completado) {
                setTimeout(() => {
                    misionElem.querySelector('.progress').style.width = '100%';
                }, 100); // Retraso para animar la barra de progreso
            }
        });
        logrosElem.appendChild(nivelElem);
    });
}

function completarMision(index, mascota, button, misiones) {
    const nivel = mascota.nivel - 1; // Nivel actual de la mascota
    const mision = misiones.niveles[nivel].misiones[index];
    if (mision && mision.progreso >= mision.meta) {
        alert(`¡Misión completada! ${mision.descripcion}`);
        mascota.monedas = (mascota.monedas || 0) + mision.recompensa; // Sumar monedas
        mision.completado = true;
        mascota.guardarEstado();
        button.disabled = true;
        actualizarMonedas(mascota);
        actualizarMisiones(mascota, misiones); // Refrescar niveles
    }
}