import { mostrarMensaje } from "./messageStat.js";
import { completarMisionID } from "./logros.js";

const equipables = [
  "Sombrero del Mago",
  "Paleta Acuática",
  "Capa de Invisibilidad",
];
let personaje = { equipado: localStorage.getItem("equipoActual") || null };
let inventarioDesbloqueado =
  JSON.parse(localStorage.getItem("inventarioDesbloqueado")) || [];

export function añadirRecompensaAlInventario(recompensa) {
  if (typeof recompensa === "number") return;

  const inventoryGrid = document.getElementById("inventory-grid");

  // Verificar si el objeto ya está en el inventario
  const existe = Array.from(inventoryGrid.children).some(
    (item) => item.textContent === recompensa
  );
  if (existe) return;

  const itemDiv = document.createElement("div");
  itemDiv.textContent = recompensa;
  itemDiv.className = "inventory-item";
  itemDiv.style.color = "yellow";

  // Agregar evento de clic para seleccionar el objeto
  itemDiv.addEventListener("click", () => {
    document.getElementById("item-name").textContent = recompensa;
    document.getElementById("item-image").src = `../assets/images/${recompensa
      .toLowerCase()
      .replace(/ /g, "_")}.png`;
    document.getElementById("item-description").textContent =
      obtenerDescripcion(recompensa);

    const equipButton = document.getElementById("equip-button");

    // Mostrar el botón de equipar/desequipar solo si es equipable
    if (equipables.includes(recompensa)) {
      equipButton.style.display = "block"; // Mostrar el botón
      equipButton.textContent =
        personaje.equipado === recompensa ? "Desequipar" : "Equipar";

      // Agregar evento para equipar/desequipar
      equipButton.onclick = () => toggleEquip(recompensa);
    } else {
      equipButton.style.display = "none"; // Ocultar el botón si no es equipable
    }
  });

  inventoryGrid.appendChild(itemDiv);

  if (!inventarioDesbloqueado.includes(recompensa)) {
    inventarioDesbloqueado.push(recompensa);
    localStorage.setItem(
      "inventarioDesbloqueado",
      JSON.stringify(inventarioDesbloqueado)
    );
  }
}

function toggleEquip(recompensa) {
  let soundEquip = new Audio("../assets/sound/item.wav");
  soundEquip.play();

  if (personaje.equipado === recompensa) {
    personaje.equipado = null;
    localStorage.removeItem("equipoActual");
    mostrarMensaje(`Desequipaste ${recompensa}`, "info");
  
    if (esPaletaVisual(recompensa)) {
      eliminarTema(); // <- vuelve al estilo por defecto
    }
  
  } else {
    personaje.equipado = recompensa;
    localStorage.setItem("equipoActual", recompensa);
    mostrarMensaje(`Equipaste ${recompensa}`, "success");
  
    if (esPaletaVisual(recompensa)) {
      aplicarTema("agua");
    }
    
  
    completarMisionID(`equipar_${recompensa.toLowerCase().replace(/ /g, "_")}`);
  }

  actualizarAparienciaMascota();
  actualizarInventario();
}

function actualizarInventario() {
  const inventoryGrid = document.getElementById("inventory-grid");
  const items = Array.from(inventoryGrid.children);

  items.forEach((itemDiv) => {
    const recompensa = itemDiv.textContent;
    const equipButton = document.getElementById("equip-button");

    if (equipables.includes(recompensa)) {
      equipButton.textContent =
        personaje.equipado === recompensa ? "Desequipar" : "Equipar";
    }
  });
}

function actualizarAparienciaMascota() {
  const mascotaImg = document.getElementById("mascota");

  const skins = {
    "Sombrero del Mago": "../assets/images/pet_hat.png",
    "Capa de Invisibilidad": "../assets/images/pixels.png", // Mantiene sprite base
  };

  if (personaje.equipado) {
    mascotaImg.src = skins[personaje.equipado] || "../assets/images/pixels.png";

    // Aplica efecto de invisibilidad solo si se equipó la capa
    if (personaje.equipado === "Capa de Invisibilidad") {
      mascotaImg.classList.add("invisible-effect");
    } else {
      mascotaImg.classList.remove("invisible-effect");
    }
  } else {
    mascotaImg.src = "../assets/images/pixels.png"; // Imagen por defecto
    mascotaImg.classList.remove("invisible-effect");
  }
}

function obtenerDescripcion(recompensa) {
  const descripciones = {
    "Manzana roja": "Una jugosa manzana roja.", // Es la comida por defecto (alimenta 10 de energía)
    "Pelota de Tenis": "Una pelota de tenis amarilla.", // Juguete por defecto (aumenta felicidad 10)
    "Jabon de Ducha": "Un jabón lleno de gel.", // Jabón para ducharse (aumenta limpieza 100)
    "Cama de Madera": "Una cama de madera para descansar.", // Cama para dormir (aumenta energía 100)
    "Sombrero del Mago": "Un sombrero de un mago verde olvidado.", // Puramente estético
    "Paleta Acuática": "Dale un estilo maritimo.",
    "Capa de Invisibilidad": "Una capa que desaparece quien se lo pone", // Efecto invisible
  };

  return descripciones[recompensa] || "Un objeto misterioso.";
}

function aplicarTema(nombreTema) {
  eliminarTema();

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.id = "tema-actual";
  link.href = `../src/style/paleta-${nombreTema}.css`; // ← nombreTema debe ser "agua"
  document.head.appendChild(link);

  localStorage.setItem("temaActivo", nombreTema);
}



function eliminarTema() {
  const temaActual = document.getElementById("tema-actual");
  if (temaActual) {
    temaActual.remove();
    localStorage.removeItem("temaActivo");
  }
}

function esPaletaVisual(nombre) {
  return nombre.startsWith("Paleta");
}


document.addEventListener("DOMContentLoaded", () => {
  const inventoryGrid = document.getElementById("inventory-grid");

  const temaGuardado = localStorage.getItem("temaActivo");
  if (temaGuardado) {
    aplicarTema(temaGuardado);
  }

  // Cargar inventario guardado
  const items =
    inventarioDesbloqueado.length > 0
      ? inventarioDesbloqueado
      : [
          "Manzana roja",
          "Pelota de Tenis",
          "Jabon de Ducha",
          "Cama de Madera",
          "Paleta Acuática",
        ];

  items.forEach(añadirRecompensaAlInventario);

  actualizarAparienciaMascota();

  const itemImage = document.getElementById("item-image");
  itemImage.src = ""; // No mostrar ninguna imagen por defecto
  itemImage.alt = "";
});
