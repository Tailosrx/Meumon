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
    let coins = document.getElementById("monedas");
  
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
      if (mision.progreso > mision.meta) {
        mision.progreso = mision.meta;
      }

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

      if (mision.completado) {
        misionElem.classList.add("mission-completed");
        
      }

      nivelElem.appendChild(misionElem);
    });

    logrosElem.appendChild(nivelElem);
  });
}

function completarMision(id, mascota, button, misiones) {
  console.log("Completando misión", id);
  
  for (const nivel of misiones) {
    const mision = nivel.misiones.find(m => m.id === id);
    if (!mision || mision.completado) return; // Evita duplicaciones
    
    // Agregar recompensa a la mascota
    if (mision.recompensa == 10) {
      mascota.monedas += mision.recompensa;
      actualizarMonedas(mascota);
    } else {
      mascota.agregarRecompensa(mision.recompensa);
      añadirRecompensaAlInventario(mision.recompensa);
    }

    // Marcar misión como completada
    mision.completado = true;

    // Deshabilitar y cambiar el botón en lugar de eliminarlo directamente
    button.textContent = "Reclamado";
    button.disabled = true;
    button.classList.add("disabled");

    // Guardar cambios
    Pet.guardarEstado(mascota, misiones);
    break;
  }
}

function añadirRecompensaAlInventario(recompensa) {
  if (recompensa == 10) return; // No añadir monedas al inventario

  const inventoryGrid = document.getElementById("inventory-grid");
  const itemDiv = document.createElement("div");
  itemDiv.textContent = recompensa;
  inventoryGrid.appendChild(itemDiv);
}

