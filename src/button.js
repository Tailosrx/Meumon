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

    iconShop.addEventListener("click", () => {
        inventoryContainer.classList.toggle("hidden");
    });

    const inventoryGrid = document.getElementById("inventory-grid");
    const items = ["Manzana roja", "Pelota de Tenis", "Rosa"];

    items.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.textContent = item;
        inventoryGrid.appendChild(itemDiv);
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