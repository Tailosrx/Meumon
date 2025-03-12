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

<<<<<<< Updated upstream
    // Hace un save en localStorage que esta misión fue reclamada
=======
    // Guardar en localStorage que esta misión fue reclamada
>>>>>>> Stashed changes
    let misionesReclamadas = JSON.parse(localStorage.getItem("misionesReclamadas")) || [];
    misionesReclamadas.push(id);
    localStorage.setItem("misionesReclamadas", JSON.stringify(misionesReclamadas));

<<<<<<< Updated upstream
=======
    // Deshabilitar y cambiar el botón
>>>>>>> Stashed changes
    button.textContent = "Reclamado";
    button.disabled = true;
    button.classList.add("endMission");

    // hace un save del estado
    Pet.guardarEstado(mascota, misiones);
    break;
  }
}
<<<<<<< Updated upstream
=======



>>>>>>> Stashed changes
function añadirRecompensaAlInventario(recompensa) {
  if (recompensa == 10) return; 

  const inventoryGrid = document.getElementById("inventory-grid");
  const itemInfo = document.getElementById("item-info"); // Elemento para mostrar info

  const itemDiv = document.createElement("div");
  itemDiv.textContent = recompensa;
  
  itemDiv.className = "inventory-item"; 

  itemDiv.style.color = "yellow";

  itemDiv.addEventListener("click", () => {
    itemInfo.innerHTML = `
      <h3 style= "color: yellow">${recompensa}</h3>
      <p>${obtenerDescripcion(recompensa)}</p>
    `;
    itemInfo.style.width = "200px";
  });

  inventoryGrid.appendChild(itemDiv);
}

function obtenerDescripcion(recompensa) {
  const descripciones = {
    "Manzana roja": "Una jugosa manzana roja.", // Es la comida por defecto (alimenta 10 de energía)
    "Pelota de Tenis": "Una pelota de tenis amarilla.", // Juguete por defecto (aumenta fel 10)
    "Jabon de Ducha": "Un jabon lleno de gel.", // Jabon para ducharse (aumenta limpieza 100)
  };

  return descripciones[recompensa] || "Un objeto misterioso.";
}


// Pilla items iniciales desde button.js
document.addEventListener("DOMContentLoaded", () => {
  const items = ["Manzana roja", "Pelota de Tenis", "Jabon de Ducha"];
  items.forEach(añadirRecompensaAlInventario);
});


export function mostrarSubidaDeNivel(nivel, desbloqueos) {
  const modal = document.getElementById("nivelUpModal");
  const nivelElem = document.getElementById("nuevoNivel");
  const desbloqueosElem = document.getElementById("desbloqueos");

  modal.classList.toggle("hidden");

  nivelElem.textContent = `¡Has subido al nivel ${nivel}! 🎉`;
 desbloqueosElem.innerHTML = desbloqueos.length > 0
      ? desbloqueos.map(d => `<li>${d}</li>`).join("")
      : "No hay desbloqueos en este nivel.";

  modal.style.display = "block";
}



function cerrarModal(params) {
  const modal = document.getElementById("nivelUpModal");
  modal.classList.add("hidden");
  modal.style.display = "none";
}