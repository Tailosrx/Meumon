import { actualizarMonedas } from "./utils.js";
import Pet from "./pet.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch('./misiones.json');
    if (!response.ok) throw new Error("No se pudo cargar misiones.json");
    const misionesJSON = await response.json();
    const mascota = Pet.cargarEstado(misionesJSON);
    
    actualizarMisiones(mascota, mascota.misiones);
    actualizarMonedas(mascota);
    let coins = document.getElementById("monedas");
  
    document.getElementById("logros").addEventListener("click", (event) => {
      if (event.target.classList.contains("finalizar") && !event.target.classList.contains("endMission")) {
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

  let misionesReclamadas = JSON.parse(localStorage.getItem("misionesReclamadas")) || [];

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
          (misionesReclamadas.includes(mision.id) 
            ? `<button class="finalizar endMission" disabled>Reclamado</button>`
            : `<button class="finalizar" data-id="${mision.id}">Reclamar (${mision.recompensa})</button>`)
          : ""
        }
      `;

      nivelElem.appendChild(misionElem);
    });

    logrosElem.appendChild(nivelElem);
  });
}



function completarMision(id, mascota, button, misiones) {
  console.log("Completando misión", id);
  
  for (const nivel of misiones) {
    const mision = nivel.misiones.find(m => m.id === id);
    if (!mision || mision.completado) return; 
    
    if (mision.recompensa == 10) { 
      mascota.monedas += mision.recompensa;
      actualizarMonedas(mascota);
    } else {
      mascota.agregarRecompensa(mision.recompensa);
      añadirRecompensaAlInventario(mision.recompensa);
    }
    mision.completado = true;

    // Hace un save en localStorage que esta misión fue reclamada
    let misionesReclamadas = JSON.parse(localStorage.getItem("misionesReclamadas")) || [];
    misionesReclamadas.push(id);
    localStorage.setItem("misionesReclamadas", JSON.stringify(misionesReclamadas));

    button.textContent = "Reclamado";
    button.disabled = true;
    button.classList.add("endMission");

    // hace un save del estado
    Pet.guardarEstado(mascota, misiones);
    break;
  }
}

function añadirRecompensaAlInventario(recompensa) {
  if (recompensa == 10) return; // No añadir monedas al inventario

  const inventoryContainer = document.getElementById("inventory-container");
  const inventoryGrid = document.getElementById("inventory-grid");

  const itemDiv = document.createElement("div");
  itemDiv.textContent = recompensa;
  itemDiv.className = "inventory-item"; 

  itemDiv.addEventListener("click", () => {
    inventoryContainer.innerHTML = `
      <h3>${recompensa}</h3>
      <p>${obtenerDescripcion(recompensa)}</p>
    `;
    inventoryContainer.style.fontSize = "20px";
    inventoryContainer.style.padding = "15px";
    inventoryContainer.style.width = "300px";
    inventoryContainer.style.height = "150px";
    inventoryContainer.style.background = "rgba(0, 0, 0, 0.8)";
    inventoryContainer.style.border = "2px solid gold";
    inventoryContainer.style.borderRadius = "10px";
    inventoryContainer.style.color = "white";
    inventoryContainer.style.textAlign = "center";
  });

  inventoryGrid.appendChild(itemDiv);
}


// Si eso poner mas adelante por lvl
function obtenerDescripcion(item) {
  const descripciones = {
    "Manzana roja": "Recupera un poco de energía.",
    "Pelota de Tenis": "Perfecta para jugar con tu mascota.",
    "Rosa": "Un bonito regalo para alguien especial.",
  };

  return descripciones[item] || "Un objeto misterioso...";
}

// Pilla items iniciales desde button.js
document.addEventListener("DOMContentLoaded", () => {
  const items = ["Manzana roja", "Pelota de Tenis", "Rosa"];
  items.forEach(añadirRecompensaAlInventario);
});



