document.getElementById("icon-shop").addEventListener("click", () => {
    mostrarInventario();
  });
  
  document.getElementById("close-inventory").addEventListener("click", () => {
    const inventoryContainer = document.getElementById("inventory-container");
    inventoryContainer.classList.add("hide");
    setTimeout(() => {
      inventoryContainer.classList.remove("show");
    }, 300); // Tiempo de la transición
  });
  
  function mostrarInventario() {
    const inventoryGrid = document.getElementById("inventory-grid");
    inventoryGrid.innerHTML = ""; // Limpiar el contenido actual
  
    mascota.inventario.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("inventory-item");
      itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}" title="${item.name}">
        <p>${item.name}</p>
        <button onclick="seleccionarItem('${item.id}')">
          ${item.equipped ? "Desequipar" : "Equipar"}
        </button>
      `;
      inventoryGrid.appendChild(itemElement);
    });
  
    document.getElementById("inventory-container").classList.remove("hidden");
  }
  
  function seleccionarItem(itemId) {
    const selectedItem = mascota.inventario.find((item) => item.id === itemId);
  
    if (selectedItem) {
      document.getElementById("item-name").textContent = selectedItem.name;
      document.getElementById("item-image").src = selectedItem.image;
      document.getElementById("item-description").textContent =
        selectedItem.description;
  
      const equipButton = document.getElementById("equip-button");
      equipButton.textContent = selectedItem.equipped ? "Desequipar" : "Equipar";
      equipButton.classList.remove("hidden");
  
      // Agregar evento para equipar/desequipar
      equipButton.onclick = () => toggleEquipItem(selectedItem.id);
    }
  }
  
  function toggleEquipItem(itemId) {
    const item = mascota.inventario.find((item) => item.id === itemId);
  
    if (item) {
      // Desequipar todos los ítems si el nuevo ítem se equipa
      if (!item.equipped) {
        mascota.inventario.forEach((i) => (i.equipped = false));
      }
  
      // Cambiar el estado del ítem seleccionado
      item.equipped = !item.equipped;
  
      // Actualizar la apariencia de la mascota
      actualizarAparienciaMascota();
  
      // Actualizar el botón de equipar/desequipar
      seleccionarItem(itemId);
  
      // Guardar el estado de la mascota
      Pet.guardarEstado(mascota, mascota.misiones);
    }
  }
  
  function actualizarAparienciaMascota() {
    const mascotaImg = document.getElementById("mascota");
    const itemEquipado = mascota.inventario.find((item) => item.equipped);
  
    if (itemEquipado) {
      mascotaImg.src = itemEquipado.image; // Cambiar la imagen de la mascota
    } else {
      mascotaImg.src = "../assets/images/pixels.png"; // Imagen por defecto
    }
  }