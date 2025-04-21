import Pet from './pet.js';
import { actualizarStats, actualizarMonedas } from './utils.js';

document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Cargar las misiones guardadas desde localStorage
        const misiones = JSON.parse(localStorage.getItem("misiones"));
        if (!misiones) {
            throw new Error("No se encontraron misiones guardadas en localStorage.");
        }

        // Cargar el estado de la mascota
        const mascota = Pet.cargarEstado();

        // Sincronizar las misiones guardadas con la mascota
        mascota.misiones = misiones;

        // Actualizar la interfaz inicial
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

        let closeLogros = document.getElementById("close-logros");
        closeLogros.addEventListener("click", () => {
            document.getElementById("logros-container").classList.add("hidden");
        });

        const close = document.getElementById("closeModal");
        close.addEventListener("click", () => {
            const modal = document.getElementById("nivelUpModal");
            modal.classList.add("hidden");
            modal.style.display = "none";
        });

        // Configurar eventos para las acciones de la mascota
        document.getElementById("alimentar")?.addEventListener("click", (event) => {
            mascota.alimentar();
            actualizarStats(mascota);
            Pet.guardarEstado(mascota, mascota.misiones); 
        });

        document.getElementById("jugar")?.addEventListener("click", () => {
            mascota.jugar();
            actualizarStats(mascota);
            Pet.guardarEstado(mascota, mascota.misiones); 
        });

        document.getElementById("duchar")?.addEventListener("click", () => {
            mascota.limpiar();
            actualizarStats(mascota);
            Pet.guardarEstado(mascota, mascota.misiones); 
        });

        document.getElementById("descansar")?.addEventListener("click", () => {
            if (mascota.estado === "activo") {
                mascota.descansar();
            }
            actualizarStats(mascota);
            Pet.guardarEstado(mascota, mascota.misiones); 
        });

        document.getElementById("icon-logo")?.addEventListener("click", () => {
            alert("En construcción, por favor espere.");
        });

        document.getElementById("volver")?.addEventListener("click", () => {
            document.getElementById("achievements-container").style.display = "none";
            document.getElementById("game-container").style.display = "block";
        });

    } catch (error) {
        console.error('Error inicializando el juego:', error);
    }
});