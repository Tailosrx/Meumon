import { actualizarMonedas } from "./utils.js";
import Pet from "./pet.js";
import AudioController from "./audioController.js";
import { añadirRecompensaAlInventario } from "./inventory.js";

const equipables = ["Sombrero de Mago"]; //Array de items equipables

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("./misiones.json");
    if (!response.ok) throw new Error("No se pudo cargar misiones.json");
    const misionesJSON = await response.json();
    const mascota = Pet.cargarEstado(misionesJSON);

    actualizarMisiones(mascota, mascota.misiones);
    actualizarMonedas(mascota);
    let coins = document.getElementById("monedas");

    AudioController.play("menu");

    document.getElementById("jugar").addEventListener("click", () => {
      AudioController.play("gameCard");
    });

    document.getElementById("logros").addEventListener("click", (event) => {
      if (
        event.target.classList.contains("finalizar") &&
        !event.target.classList.contains("endMission")
      ) {
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

  let misionesReclamadas =
    JSON.parse(localStorage.getItem("misionesReclamadas")) || [];

  misiones.forEach((nivel, nivelIndex) => {
    if (!nivel.misiones) return;

    const nivelElem = document.createElement("div");
    nivelElem.className = `mission ${
      nivelIndex + 1 > mascota.nivel ? "blurred" : ""
    }`;
    nivelElem.innerHTML = `<h2>Nivel ${nivel.nivel}</h2>`;

    nivel.misiones.forEach((mision) => {
      if (mision.progreso > mision.meta) {
        mision.progreso = mision.meta;
      }

      let progresoPorcentaje = (mision.progreso / mision.meta) * 100;
      const misionElem = document.createElement("div");
      misionElem.className = `mision ${mision.completado ? "completed" : ""} ${
        nivelIndex + 1 > mascota.nivel ? "blurred" : ""
      }`;
      misionElem.innerHTML = `
        <h3 style="color: black">${mision.descripcion}</h3>
        <div class="mission-progress">
          <p style="color: black">${mision.progreso} / ${mision.meta}</p>
          <div class="progress-bar">
            <div class="progress" style="width: ${progresoPorcentaje}%"></div>
          </div>
        </div>
        ${
          mision.completado
            ? misionesReclamadas.includes(mision.id)
              ? `<button class="finalizar endMission" disabled>Reclamado</button>`
              : `<button class="finalizar" data-id="${mision.id}">Reclamar (${mision.recompensa})</button>`
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
    const mision = nivel.misiones.find((m) => m.id === id);
    if (!mision || mision.completado) return;

    if (mision.recompensa == 10) {
      mascota.monedas += mision.recompensa;
      actualizarMonedas(mascota);
    } else if (equipables.includes(mision.recompensa)) {
      // Si la recompensa es un objeto equipable
      añadirRecompensaAlInventario(mision.recompensa);
    } else {
      mascota.agregarRecompensa(mision.recompensa);
      añadirRecompensaAlInventario(mision.recompensa);
    }
    mision.completado = true;

    // Hace un save en localStorage que esta misión fue reclamada
    let misionesReclamadas =
      JSON.parse(localStorage.getItem("misionesReclamadas")) || [];
    misionesReclamadas.push(id);
    localStorage.setItem(
      "misionesReclamadas",
      JSON.stringify(misionesReclamadas)
    );

    button.textContent = "Reclamado";
    button.disabled = true;
    button.classList.add("endMission");

    

    // hace un save del estado
    Pet.guardarEstado(mascota, misiones);
    break;
  }
}



export function mostrarSubidaDeNivel(nivel, desbloqueos) {
  const modal = document.getElementById("nivelUpModal");
  const nivelElem = document.getElementById("nuevoNivel");
  const desbloqueosElem = document.getElementById("desbloqueos");
  let levelUpSound = new Audio("../assets/sound/levelUp.mp3");

  modal.classList.toggle("hidden");
  levelUpSound.play();


  



  nivelElem.textContent = `¡Has subido al nivel ${nivel}! 🎉`;
  desbloqueosElem.innerHTML =
    desbloqueos.length > 0
      ? desbloqueos.map((d) => `<li>${d}</li>`).join("")
      : "No hay desbloqueos en este nivel.";

  modal.style.display = "block";
}

function cerrarModal(params) {
  const modal = document.getElementById("nivelUpModal");
  modal.classList.add("hidden");
  modal.style.display = "none";
}
