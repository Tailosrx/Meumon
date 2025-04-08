const mensajesActivos = new Set(); // Conjunto para rastrear mensajes activos

export function mostrarMensaje(mensaje, tipo) {
  const mensajesContainer = document.getElementById("mensajes-container");

  // Verificar si el contenedor existe
  if (!mensajesContainer) {
    console.error("El contenedor de mensajes no existe en el DOM.");
    return;
  }

  

  // Añadir el mensaje al conjunto de mensajes activos
  mensajesActivos.add(mensaje);

  // Crear el elemento del mensaje
  const mensajeDiv = document.createElement("div");
  mensajeDiv.className = `mensaje ${tipo}`; // Añadir clase según el tipo (error, warning, success)
  mensajeDiv.textContent = mensaje;

  // Añadir el mensaje al contenedor
  mensajesContainer.appendChild(mensajeDiv);

  // Eliminar el mensaje automáticamente después de 5 segundos
  setTimeout(() => {
    mensajeDiv.remove();
    mensajesActivos.delete(mensaje); // Eliminar el mensaje del conjunto de mensajes activos
  }, 5000);
}