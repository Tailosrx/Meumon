const equipables = ["Sombrero del Mago"];
let personaje = { equipado: null };

export function añadirRecompensaAlInventario(recompensa) {
  if (recompensa == 10) return;

  const inventoryGrid = document.getElementById("inventory-grid");

  // Verificar si el objeto ya está en el inventario
  const existe = Array.from(inventoryGrid.children).some(
    (item) => item.textContent === recompensa
  );
  if (existe) return;

  // Crear el elemento del objeto
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

    // Ocultar el botón de equipar/desequipar para objetos no equipables
    const equipButton = document.getElementById("equip-button");
    equipButton.style.display = "none";
  });

  inventoryGrid.appendChild(itemDiv);
}

export function añadirEquipableAlInventario(recompensa) {
  if (recompensa == 10) return;

  const inventoryGrid = document.getElementById("inventory-grid");

  // Verificar si el objeto ya está en el inventario
  const existe = Array.from(inventoryGrid.children).some(
    (item) => item.textContent === recompensa
  );
  if (existe) return;

  // Crear el elemento del objeto
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

    // Mostrar el botón de equipar/desequipar solo si es equipable
        const equipButton = document.getElementById("equip-button");
        if (equipables.includes(recompensa)) {
          equipButton.style.display = "block"; // Mostrar el botón
          equipButton.textContent =
            personaje.equipado === recompensa ? "Desequipar" : "Equipar";
    
          // Agregar evento para equipar/desequipar
          equipButton.onclick = () => toggleEquip(recompensa);
        } else {
          equipButton.style.display = "none"; // Ocultar el botón si no es equipable
        }

    // Agregar evento para equipar/desequipar
    equipButton.onclick = () => toggleEquip(recompensa);
  });

  inventoryGrid.appendChild(itemDiv);
}

function toggleEquip(recompensa) {
  if (personaje.equipado === recompensa) {
    // Desequipar el objeto
    personaje.equipado = null;
  } else {
    // Equipar el objeto
    personaje.equipado = recompensa;
  }

  // Actualizar la apariencia de la mascota
  actualizarAparienciaMascota();

  // Actualizar el botón de equipar/desequipar
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
  }


  if (personaje.equipado) {
    // Verificar si el ítem tiene una apariencia específica
    mascotaImg.src = skins[personaje.equipado] || "../assets/images/pixels.png";
  } else {
    mascotaImg.src = "../assets/images/pixels.png"; // Imagen por defecto
  }
}

function obtenerDescripcion(recompensa) {
  const descripciones = {
    "Manzana roja": "Una jugosa manzana roja.", // Es la comida por defecto (alimenta 10 de energía)
    "Pelota de Tenis": "Una pelota de tenis amarilla.", // Juguete por defecto (aumenta felicidad 10)
    "Jabon de Ducha": "Un jabón lleno de gel.", // Jabón para ducharse (aumenta limpieza 100)
    "Sombrero del Mago": "Un sombrero de un mago verde olvidado.", // Puramente estético
  };

  return descripciones[recompensa] || "Un objeto misterioso.";
}

document.addEventListener("DOMContentLoaded", () => {
  const items = ["Manzana roja", "Pelota de Tenis", "Jabon de Ducha"];
  items.forEach(añadirRecompensaAlInventario);

  // Añadir un objeto equipable como ejemplo
  añadirEquipableAlInventario("Sombrero del Mago");
  const itemImage = document.getElementById("item-image");
  itemImage.src = ""; // No mostrar ninguna imagen por defecto
  itemImage.alt = ""; 
});