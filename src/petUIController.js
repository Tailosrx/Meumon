import { mostrarMensaje } from "./messageStat.js";

export default class PetUIController {
  static actualizarBoton(button, texto, callback) {
    if (!button) {
      console.error("El botón no existe en el DOM.");
      return;
    }
    button.textContent = texto;
    button.onclick = callback;
  }

  static actualizarImagen(img, src) {
    if (!img) {
      console.error("El elemento de imagen no existe en el DOM.");
      return;
    }
    img.src = src;
  }

  static mostrarMensaje(mensaje, tipo) {
    mostrarMensaje(mensaje, tipo);
  }


  static desactivarBotonTemporalmente(button, tiempo, textoEsperando, textoOriginal) {
    if (!button) {
      console.error("El botón no existe en el DOM.");
      return;
    }
    button.disabled = true;
    button.textContent = textoEsperando;

    setTimeout(() => {
      button.disabled = false;
      button.textContent = textoOriginal;
    }, tiempo);
  }

  static actualizarStatsVisuales(stats) {
    const energiaBar = document.getElementById("energia-bar");
    const felicidadBar = document.getElementById("felicidad-bar");
    const higieneBar = document.getElementById("higiene-bar");

    if (energiaBar) energiaBar.style.width = `${stats.energia}%`;
    if (felicidadBar) felicidadBar.style.width = `${stats.felicidad}%`;
    if (higieneBar) higieneBar.style.width = `${stats.higiene}%`;
  }
}