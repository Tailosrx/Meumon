export function actualizarStats(mascota) {
    const energiaElem = document.getElementById("energia");
    const felicidadElem = document.getElementById("felicidad");
    const higieneElem = document.getElementById("higiene");
    const nivelElem = document.getElementById("nivel");

    if (energiaElem) energiaElem.textContent = mascota.energia;
    if (felicidadElem) felicidadElem.textContent = mascota.felicidad;
    if (higieneElem) higieneElem.textContent = mascota.higiene;
    if (nivelElem) nivelElem.textContent = mascota.nivel;
}

export function actualizarMonedas(mascota) {
    const monedasElem = document.getElementById("monedas");
    if (!monedasElem) {
        console.error("No se encontró el elemento con id 'monedas'");
        return;
    }
    monedasElem.textContent = `Monedas: ${mascota.monedas}`;
}