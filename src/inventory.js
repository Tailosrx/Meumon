document.getElementById("icon-shop").addEventListener("click", () => {
    const inventoryContainer = document.getElementById("inventory-container");
    inventoryContainer.classList.add("show");
    inventoryContainer.classList.remove("hide");
});

document.getElementById("close-inventory").addEventListener("click", () => {
    const inventoryContainer = document.getElementById("inventory-container");
    inventoryContainer.classList.add("hide");
    setTimeout(() => {
        inventoryContainer.classList.remove("show");
    }, 300); // Tiempo de la transición
});