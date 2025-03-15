import Pet from './pet.js';
import { actualizarStats, actualizarMonedas } from './utils.js';

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('./misiones.json'); 
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const misiones = await response.json();

        const mascota = Pet.cargarEstado(misiones);
        mascota.misiones = misiones;

        actualizarStats(mascota);
        actualizarMonedas(mascota);

    const inventoryContainer = document.getElementById("inventory-container");
    const iconShop = document.getElementById("icon-shop");
    const closeInventory = document.getElementById("close-inventory");

    iconShop.addEventListener("click", () => {
        inventoryContainer.classList.toggle("hidden");
        if (!inventoryContainer.classList.contains("hidden")) {
            inventoryContainer.classList.add("show");
            inventoryContainer.classList.remove("hide");
        } else {
            inventoryContainer.classList.add("hide");
            setTimeout(() => {
                inventoryContainer.classList.remove("show");
            }, 300); // Tiempo de la transición
        }
    });

    closeInventory.addEventListener("click", () => {
        inventoryContainer.classList.add("hide");
        setTimeout(() => {
            inventoryContainer.classList.add("hidden");
            inventoryContainer.classList.remove("show");
            // Restablecer el contenido del contenedor item-selected
            document.getElementById("item-name").textContent = "";
            document.getElementById("item-image").src = "../assets/images/fondo.png";
            document.getElementById("item-description").textContent = "";
        }, 300); // Tiempo de la transición
    });

    const close = document.getElementById("closeModal");
    close.addEventListener("click", () => {
        const modal = document.getElementById("nivelUpModal");
        modal.classList.add("hidden");
        modal.style.display = "none";
    });

        document.getElementById("alimentar")?.addEventListener("click", (event) => {
            mascota.alimentar();
            actualizarStats(mascota);
        });

        document.getElementById("jugar")?.addEventListener("click", () => {
            mascota.jugar();
            actualizarStats(mascota);
        });

        document.getElementById("duchar")?.addEventListener("click", () => {
            mascota.limpiar();
            actualizarStats(mascota);
        });

        document.getElementById("descansar")?.addEventListener("click", () => {
            if (mascota.estado === "activo") {
                mascota.descansar();
            } else {
                mascota.despertar();
            }
            actualizarStats(mascota);
        });

        

        document.getElementById("icon-logo")?.addEventListener("click", () => {
            alert("Construyendo la funcionalidad... Porfavor espere");
        });

        document.getElementById("volver")?.addEventListener("click", () => {
            document.getElementById("achievements-container").style.display = "none";
            document.getElementById("game-container").style.display = "block";
        });


    } catch (error) {
        console.error('Error fetching achievements:', error);
    }
});