import { actualizarStats } from "./utils.js";
import { actualizarMisiones, mostrarSubidaDeNivel } from "./logros.js";
import { iniciarJuegoMemoria } from "./games/memory.js";
import { mostrarMensaje } from "./messageStat.js";
import AudioController from "./audioController.js";
import PetUIController from "./petUIController.js";

const valors = {
  MAX_STAT: 100,
  MIN_STAT: 0,
  REDUCCION_MAXIMA: 4,
  INTERVALO_STATS: 3000,
  INCREMENTO_STAT: 5,
};

export default class Pet {
  constructor() {
    this.energia = valors.MAX_STAT;
    this.felicidad = valors.MAX_STAT;
    this.higiene = valors.MAX_STAT;
    this.nivel = 1;
    this.monedas = 0;
    this.misiones = {};
    this.inventario = [];
    this.estado = "activo";
    this.cooldownAlimentar = false;
    this.cooldownLimpiar = false;
    this.enDescanso = false;
    this.enJuego = false;
    this.congelarStats = false;
    this.mensajeMostrado = false;

    // Cargar el estado guardado
    const estadoGuardado = JSON.parse(localStorage.getItem("mascota"));
    if (estadoGuardado) {
      Object.assign(this, estadoGuardado);
    }

    setInterval(() => this.reducirStats(), valors.INTERVALO_STATS);
  }

  reproducirSonidoAlerta() {
    const sonidoAlerta = new Audio("../assets/sound/alert.wav");
    sonidoAlerta.volume = 0.3; // Ajustar el volumen del sonido
    sonidoAlerta.play().catch((error) => {
      console.error("Error al reproducir el sonido de alerta:", error);
    });
  }

  static cargarEstado(misiones) {
    const mascota = new Pet();
    const estadoGuardado = JSON.parse(localStorage.getItem("mascota"));
    const misionesGuardadas = JSON.parse(localStorage.getItem("misiones"));

    //mascota.misiones = misiones.niveles;
    if (estadoGuardado) {
      Object.assign(mascota, estadoGuardado);

      mascota.energia = Math.max(mascota.energia, 10);
      mascota.felicidad = Math.max(mascota.felicidad, 10);
      mascota.higiene = Math.max(mascota.higiene, 10);

      mascota.enDescanso = false;
      mascota.congelarStats = false;
    }


    

    mascota.misiones = misionesGuardadas || misiones.niveles;
    return mascota;
  }

  static guardarEstado(mascota, misiones) {
    // Guardar el estado de la mascota en el almacenamiento local
    localStorage.setItem("mascota", JSON.stringify(mascota));
    localStorage.setItem("misiones", JSON.stringify(misiones));
  }

  alimentar() {
    if (this.enDescanso) {
      mostrarMensaje(
        "La mascota está descansando y no puede ser alimentada.",
        "warning"
      );
      return;
    }

    if (this.enJuego) {
      mostrarMensaje(
        "La mascota está jugando y no puede ser alimentada ahora.",
        "warning"
      );
      return;
    }

    if (this.estadoBloqueado()) {
      mostrarMensaje(
        "La mascota está ocupada y no puede ser alimentada ahora.",
        "warning"
      );
      return;
    }

    let eat = new Audio("../assets/sound/eat.wav");
    eat.play();
    this.energia = Math.min(this.energia + 10, valors.MAX_STAT);
    this.felicidad = Math.min(this.felicidad + 5, valors.MAX_STAT);
    this.actualizarProgreso("alimentar");
    this.actualizarAparienciaMascota();
    Pet.guardarEstado(this, this.misiones);
    actualizarStats(this);
    actualizarMisiones(this, this.misiones);

    this.cooldownAlimentar = true;
    const button = document.getElementById("alimentar");
    PetUIController.desactivarBotonTemporalmente(
      button,
      3000,
      "Espera...",
      "🍎 Alimentar"
    );
  }

  jugar() {
    if (this.enDescanso) {
      mostrarMensaje(
        "La mascota está descansando y no puede jugar.",
        "warning"
      );
      return;
    }

    if (this.estadoBloqueado()) {
      mostrarMensaje(
        "La mascota está ocupada y no puede jugar ahora.",
        "warning"
      );
      return;
    }

    this.enJuego = true;
    this.congelarStats = true;

    this.energia = Math.max(this.energia - 10, valors.MIN_STAT);
    this.felicidad = Math.min(this.felicidad + 40, valors.MAX_STAT);

    if (!this.cambiarEstado("jugando")) return;

    mostrarMensaje("¡La mascota está jugando y divirtiéndose!", "success");

    iniciarJuegoMemoria(this, this.misiones);

    this.actualizarProgreso("jugar");

    Pet.guardarEstado(this, this.misiones);
    actualizarStats(this);

    const button = document.getElementById("jugar");
    PetUIController.desactivarBotonTemporalmente(
      button,
      3000,
      "Espera...",
      "🎮 Jugar"
    );

    setTimeout(() => {
      this.enJuego = false;
      this.cambiarEstado("activo");
      this.congelarStats = false;
      Pet.guardarEstado(this, this.misiones);
      actualizarStats(this);
      actualizarMisiones(this, this.misiones);
    }, 1000);
  }

  limpiar() {
    if (this.enDescanso) {
      mostrarMensaje(
        "La mascota está descansando y no puede ducharse.",
        "warning"
      );
      return;
    }

    if (this.enJuego) {
      mostrarMensaje("La mascota está jugando y no puede ducharse.", "warning");
      return;
    }

    if (this.estadoBloqueado()) {
      mostrarMensaje(
        "La mascota está ocupada y no puede ducharse ahora.",
        "warning"
      );
      return;
    }

    if (!this.cambiarEstado("duchandose")) return;

    this.enDescanso = true; // Bloquear otras acciones mientras se ducha
    this.congelarStats = true;
    this.actualizarAparienciaMascota();
    const shower = new Audio("../assets/sound/brush.wav");
    shower.loop = true;
    shower.play();

    const button = document.getElementById("duchar");
    button.textContent = "🛁 Cancelar ducha";

    const intervaloDucha = setInterval(() => {
      this.higiene = Math.min(
        this.higiene + 10, // Incrementar higiene
        valors.MAX_STAT
      );
      actualizarStats(this);

      if (this.higiene === valors.MAX_STAT) {
        clearInterval(intervaloDucha);
        this.terminarDucha(shower, button);
        mostrarMensaje("¡La mascota está completamente limpia!", "success");

        // Restablecer estados
        this.enDescanso = false;
        this.congelarStats = false;
        this.cambiarEstado("activo");
        Pet.guardarEstado(this, this.misiones);
        actualizarStats(this);
        actualizarMisiones(this, this.misiones);
      }
    }, 1000);

    button.onclick = () => {
      clearInterval(intervaloDucha);
      this.terminarDucha(shower, button);
      mostrarMensaje("La ducha ha sido cancelada.", "warning");

      // Restablecer estados
      this.enDescanso = false;
      this.congelarStats = false;
      this.cambiarEstado("activo");
      Pet.guardarEstado(this, this.misiones);
      actualizarStats(this);
      actualizarMisiones(this, this.misiones);
    };
  }

  terminarDucha(shower, button) {
    this.enDescanso = false;
    this.estado = "activo";
    this.congelarStats = false;
    shower.pause();
    shower.currentTime = 0;
    button.textContent = "🛁 Bañar";
    button.onclick = () => this.limpiar(); // Restaurar el evento original

    this.actualizarAparienciaMascota();

    Pet.guardarEstado(this, this.misiones);
    actualizarStats(this);
    actualizarMisiones(this, this.misiones);
  }

  descansar() {
    // Verificar si la mascota ya está ocupada
    if (this.enJuego || this.enDescanso) {
      mostrarMensaje(
        "La mascota está ocupada y no puede descansar ahora.",
        "warning"
      );
      return;
    }

    // Cambiar el estado a "durmiendo"
    if (!this.cambiarEstado("durmiendo")) return;

    this.enDescanso = true;
    this.congelarStats = true;
    this.actualizarAparienciaMascota();
    AudioController.play("sleeping");

    mostrarMensaje("La mascota está descansando. 💤", "success");

    const button = document.getElementById("descansar");
    PetUIController.actualizarBoton(button, "😴 Cancelar descanso", () => {
      this.terminarDescanso(button, true);
    });

    const intervaloDescanso = setInterval(() => {
      this.energia = Math.min(
        this.energia + valors.INCREMENTO_STAT,
        valors.MAX_STAT
      );
      actualizarStats(this);

      // Finalizar descanso automáticamente si la energía está al máximo
      if (this.energia === valors.MAX_STAT) {
        clearInterval(intervaloDescanso);
        this.terminarDescanso(button, false); // Finalizar descanso automáticamente
        mostrarMensaje(
          "¡La mascota ha descansado completamente! 🌟",
          "success"
        );
      }
    }, 1000);
  }

  terminarDescanso(button, cancelado) {
    // Desbloquear acciones y descongelar stats
    this.enDescanso = false;
    this.congelarStats = false;
    this.cambiarEstado("activo");
    AudioController.play("menu");
    this.actualizarAparienciaMascota();

    // Restaurar el botón al estado original
    PetUIController.actualizarBoton(button, "😴 Descansar", () =>
      this.descansar()
    );

    // Guardar el estado y actualizar los stats
    Pet.guardarEstado(this, this.misiones);
    actualizarStats(this);

    // Mostrar mensaje si el descanso fue cancelado manualmente
    if (cancelado) {
      mostrarMensaje("El descanso ha sido cancelado. 🛑", "warning");
    }
  }

  reducirStats() {
    if (this.congelarStats || this.estadoBloqueado()) return;

    this.energia = Math.max(
      this.energia - Math.floor(Math.random() * valors.REDUCCION_MAXIMA),
      valors.MIN_STAT
    );
    this.felicidad = Math.max(
      this.felicidad - Math.floor(Math.random() * valors.REDUCCION_MAXIMA),
      valors.MIN_STAT
    );
    this.higiene = Math.max(
      this.higiene - Math.floor(Math.random() * valors.REDUCCION_MAXIMA),
      valors.MIN_STAT
    );

    if (this.energia === valors.MIN_STAT) {
      this.limpiar();
      mostrarMensaje("La mascota está agotada y necesita descansar.", "error");
    }

    if (this.higiene < 10) {
      mostrarMensaje("La mascota está sucia y necesita un baño.", "warning");
    }

    this.verificarStats(); // Verifica los umbrales
    Pet.guardarEstado(this, this.misiones);
    actualizarStats(this); // Actualizar los stats en el DOM
  }

  congelarStatsDuranteAccion(accion, callback) {
    if (this.congelarStats) return;

    this.congelarStats = true;
    accion();

    setTimeout(() => {
      this.congelarStats = false;
      callback();
    }, 1000);
  }

  verificarStats() {
    this.handleEstadosPositivos();
    this.handleEstadosNegativos();
  }

  handleEstadosPositivos() {
    if (this.energia === valors.MAX_STAT) {
      this.reproducirSonidoAlerta();
      mostrarMensaje(
        "¡Energía al máximo! La mascota está llena de energía.",
        "success"
      );
    }

    if (this.felicidad === valors.MAX_STAT) {
      this.reproducirSonidoAlerta();
      mostrarMensaje(
        "¡Felicidad al máximo! La mascota está muy feliz.",
        "success"
      );
    }

    if (this.higiene === valors.MAX_STAT) {
      this.reproducirSonidoAlerta();
      mostrarMensaje(
        "¡Higiene al máximo! La mascota está completamente limpia.",
        "success"
      );
    }
  }

  handleEstadosNegativos() {
    const estadoAnterior = this.estado; // Guardar el estado actual antes de realizar cambios

    if (this.energia === 0 && !this.enDescanso) {
      this.estado = "agotado";
      this.felicidad = Math.max(this.felicidad - 30, 0);
      this.reproducirSonidoAlerta();
    } else if (this.felicidad === 0) {
      this.estado = "triste";
      this.energia = Math.max(this.energia - 10, 0);
      this.reproducirSonidoAlerta();
    } else if (this.higiene === 0) {
      this.estado = "sucio";
      this.felicidad = Math.max(this.felicidad - 10, 0);
      this.reproducirSonidoAlerta();
    } else if (!this.enDescanso) {
      this.estado = "activo";
    }

    // Mostrar mensaje solo si el estado ha cambiado
    if (estadoAnterior !== this.estado) {
      switch (this.estado) {
        case "activo":
          this.reproducirSonidoAlerta();
          mostrarMensaje(
            "Tu mascota está activa y lista para jugar.",
            "success"
          );
          break;
        case "agotado":
          mostrarMensaje(
            "Tu mascota está muy agotada. Va a descansar. Dile Buenas Noches.",
            "error"
          );
          this.iniciarDescanso();
          break;
        case "triste":
          mostrarMensaje("La mascota está triste. Necesita jugar.", "warning");
          this.actualizarAparienciaMascota();
          break;
        case "sucio":
          mostrarMensaje("La mascota está sucia. Necesita un baño.", "warning");
          this.actualizarAparienciaMascota();
          break;
      }
    }
  }

  estadoBloqueado() {
    return this.enDescanso || this.enJuego;
  }

  cambiarEstado(nuevoEstado) {
    const estadosValidos = ["activo", "durmiendo", "duchandose", "jugando"];

    if (!estadosValidos.includes(nuevoEstado)) {
      console.error(`Estado inválido: ${nuevoEstado}`);
      return false;
    }

    if (
      this.estadoBloqueado() &&
      nuevoEstado !== "durmiendo" &&
      nuevoEstado !== "jugando"
    ) {
      console.warn(
        "No se puede cambiar el estado mientras la mascota está ocupada."
      );
      return false;
    }

    this.estado = nuevoEstado;
    console.log(`Estado cambiado a: ${nuevoEstado}`);
    return true;
  }

  actualizarAparienciaMascota() {
    const mascotaImg = document.getElementById("mascota");

    const skins = {
      activo: "../assets/images/pixels.png",
      triste: "../assets/images/pet_sad.png",
      sucio: "../assets/images/pet_dirty.png",
      durmiendo: "../assets/images/pet_sleep.png",
      duchandose: "../assets/images/pet_ducha.png",
    };

    mascotaImg.src = skins[this.estado] || "../assets/images/pixels.png";
  }

  actualizarProgreso(accion) {
    const nivelActual = this.misiones.find(
      (nivel) => nivel.nivel === this.nivel
    );
    if (nivelActual) {
      nivelActual.misiones.forEach((mision) => {
        if (mision.id.startsWith(accion) && !mision.completado) {
          mision.progreso += 1;
          if (mision.progreso >= mision.meta) {
            mision.progreso = mision.meta; // Asegurarse de que no exceda la meta
            mision.completado = true;
            mostrarMensaje(
              `¡Has completado la misión: ${mision.titulo}!`,
              "success"
            );
          }
        }
      });
  
      // Guardar el estado después de actualizar el progreso
      Pet.guardarEstado(this, this.misiones);
    }
  }

  verificarNivel() {
    const nivelActual = this.misiones.find(
      (nivel) => nivel.nivel === this.nivel
    );
    if (
      nivelActual &&
      nivelActual.misiones.every((mision) => mision.completado)
    ) {
      this.nivel = nivelActual.recompensas.nivel;
      mostrarSubidaDeNivel(this.nivel, nivelActual.recompensas.desbloqueos);
      this.cambiarJuegoSegunNivel();
    }
  }

  cambiarJuegoSegunNivel() {
    if (this.nivel >= 3 && this.nivel < 6) {
      iniciarJuegoMemoria(this);
    } else if (this.nivel >= 6 && this.nivel < 9) {
      // Lógica para iniciar el juego de atrapar la pelota
    } else if (this.nivel >= 9 && this.nivel < 10) {
      // Lógica para iniciar el juego de carrera de obstáculos
    } else if (this.nivel >= 10) {
      // Lógica para iniciar el juego de búsqueda del tesoro
    }
  }

  agregarRecompensa(recompensa) {
    this.inventario.push(recompensa);
    Pet.guardarEstado(this, this.misiones);
  }

  iniciarDescanso() {
    if (this.enDescanso) return;
    let img = document.getElementById("mascota");
    this.estado = "durmiendo";
    this.enDescanso = true;
    AudioController.play("sleeping");

    this.actualizarAparienciaMascota();
    const tiempoDescanso = 30000;

    mostrarMensaje(
      `La mascota está descansando. Volverá a estar activa en ${
        tiempoDescanso / 1000
      } segundos.`,
      "warning"
    );

    setTimeout(() => {
      this.enDescanso = false;
      this.energia = 50;
      this.estado = "activo";
      AudioController.play("menu");
      this.actualizarAparienciaMascota();
      mostrarMensaje(
        "La mascota ha terminado de descansar y está activa nuevamente.",
        "success"
      );
      actualizarStats(this);
    }, tiempoDescanso);
  }
}
