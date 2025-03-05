import { actualizarMonedas } from "./utils.js";
import Pet from "./pet.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Cargar misiones desde el JSON externo
    const response = await fetch('./misiones.json');
    if (!response.ok) throw new Error("No se pudo cargar misiones.json");
    const misionesJSON = await response.json();
    const mascota = Pet.cargarEstado(misionesJSON);
    
    actualizarMisiones(mascota, mascota.misiones);
    actualizarMonedas(mascota);

  
    document.getElementById("logros").addEventListener("click", (event) => {
      if (event.target.classList.contains("finalizar")) {
        const id = event.target.getAttribute("data-id");
        completarMision(id, mascota, event.target, mascota.misiones);
      }
    });

    document.getElementById("volver")?.addEventListener("click", () => {
      window.location.href = "./index.html";
    });
  } catch (error) {
    console.error("Error al inicializar:", error);
  }
});

export function actualizarMisiones(mascota, misiones) {
  const logrosElem = document.getElementById("logros");
  logrosElem.innerHTML = "";

  misiones.forEach((nivel, nivelIndex) => {
    if (!nivel.misiones) return;

    const nivelElem = document.createElement("div");
    nivelElem.className = `mission ${nivelIndex + 1 > mascota.nivel ? "blurred" : ""}`;
    nivelElem.innerHTML = `<h2>Nivel ${nivel.nivel}</h2>`;

    nivel.misiones.forEach(mision => {
      let progresoPorcentaje = (mision.progreso / mision.meta) * 100;
      const misionElem = document.createElement("div");
      misionElem.className = `mision ${mision.completado ? "completed" : ""} ${nivelIndex + 1 > mascota.nivel ? "blurred" : ""}`;
      misionElem.innerHTML = `
        <h3 style="color: black">${mision.descripcion}</h3>
        <div class="mission-progress">
          <p style="color: black">${mision.progreso} / ${mision.meta}</p>
          <div class="progress-bar">
            <div class="progress" style="width: ${progresoPorcentaje}%"></div>
          </div>
        </div>
        ${mision.completado ? 
          `<button class="finalizar" data-id="${mision.id}">Reclamar (${mision.recompensa})</button>` : 
          ""
        }
      `;
      
      

      nivelElem.appendChild(misionElem);
    });

    logrosElem.appendChild(nivelElem);
  });
}

function completarMision(id, mascota, button, misiones) {
  for (const nivel of misiones) {
    const mision = nivel.misiones.find(m => m.id === id);
    if (mision && mision.completado) {
      // Otorgar recompensa
      if (mision.recompensa.includes("10 Monedas")) {
        const cantidad = parseInt(mision.recompensa.match(/\d+/)[0]);
        mascota.monedas += cantidad;
        actualizarMonedas(mascota);
      } else {
        mascota.agregarRecompensa(mision.recompensa);
      }
      
      // Marcar misión como completada y actualizar misiones
      mision.completado = true;
      actualizarMisiones(mascota, misiones);
      
      // Eliminar botón y guardar estado
      button.remove();
      Pet.guardarEstado(mascota, misiones);
      break;
    }
  }
}
