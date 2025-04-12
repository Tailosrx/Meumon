import { actualizarStats } from "./utils.js";
import { actualizarMisiones, mostrarSubidaDeNivel } from "./logros.js";
import { iniciarJuegoMemoria } from "./games/memory.js";
import { mostrarMensaje } from "./messageStat.js";
import AudioController from "./audioController.js";

export default class Pet {
  constructor() {
    this.energia = 20;
    this.felicidad = 30;
    this.higiene = 50;
    this.nivel = 1;
    this.monedas = 0;
    this.misiones = {};
    this.inventario = [];
    this.estado = "activo";
    this.cooldownAlimentar = false;
    this.cooldownJugar = false;
    this.cooldownLimpiar = false;
    this.enDescanso = false;
    this.enJuego = false;

    setInterval(() => this.reducirStats(), 3000); 
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
    mascota.misiones = misiones.niveles;
    const estadoGuardado = JSON.parse(localStorage.getItem("mascota"));
    if (estadoGuardado) {
      Object.assign(mascota, estadoGuardado);
    }
    mascota.misiones = misiones; // Asignar las misiones directamente
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

    let eat = new Audio("../assets/sound/eat.wav");
    eat.play();
    this.energia = Math.min(this.energia + 10, 100);
    this.felicidad = Math.min(this.felicidad + 5, 100);
    this.actualizarProgreso("alimentar");
    this.actualizarAparienciaMascota();
    Pet.guardarEstado(this, this.misiones);
    actualizarStats(this);
    actualizarMisiones(this, this.misiones);

    this.cooldownAlimentar = true;
    const button = document.getElementById("alimentar");
    button.disabled = true;
    button.textContent = "Espera...";

    setTimeout(() => {
      this.cooldownAlimentar = false;
      button.disabled = false;
      button.textContent = "🍎 Alimentar";
    }, 3000);
  }

  jugar() {
    if (this.enDescanso) {
      mostrarMensaje(
        "La mascota está descansando y no puede jugar.",
        "warning"
      );
      return;
    }

    this.enJuego = true;
    this.energia = Math.max(this.energia - 10, 0);
    this.felicidad = Math.min(this.felicidad + 40, 100);
    iniciarJuegoMemoria(this, this.misiones);

    this.actualizarProgreso("jugar");
    Pet.guardarEstado(this, this.misiones);
    actualizarStats(this);
    

    this.cooldownJugar = true;
    const button = document.getElementById("jugar");

   
    setTimeout(() => {
      this.enJuego = false; 
      Pet.guardarEstado(this, this.misiones);
      actualizarStats(this);
      actualizarMisiones(this, this.misiones);
    }, 1000); 
  }

  limpiar() {
    if (this.enDescanso) {
      mostrarMensaje(
        "La mascota está descansando y no puede jugar.",
        "warning"
      );
      return;
    }

    let img = document.getElementById("mascota");
    img.src = "../assets/images/pet_ducha.png";
    let shower = new Audio("../assets/sound/brush.wav");
    shower.play();

    this.higiene = 100;
    this.actualizarProgreso("duchar");
    Pet.guardarEstado(this, this.misiones);
    actualizarStats(this);
    actualizarMisiones(this, this.misiones);

    this.cooldownLimpiar = true;
    const button = document.getElementById("duchar");
    button.disabled = true;
    button.textContent = "Espera...";

    setTimeout(() => {
      this.cooldownLimpiar = false;
      button.disabled = false;
      button.textContent = "🛁 Bañar";
      img.src = "../assets/images/pixels.png";
    }, 3000);
  }

  descansar() {
    if (this.enJuego || this.enDescanso) {
      mostrarMensaje(
        "La mascota está ocupada y no puede descansar ahora.",
        "warning"
      );
      return;
    }

    this.estado = "durmiendo";
    this.enDescanso = true;
    this.energia = 100;
    AudioController.play("sleeping");

    this.actualizarProgreso("descansar");
    this.actualizarAparienciaMascota();
    Pet.guardarEstado(this, this.misiones);
    actualizarStats(this);
    actualizarMisiones(this, this.misiones);

    setTimeout(() => {
      this.despertar();
    }, 30000); // 30 segundos de descanso
  }

  despertar() {
    if (this.estado === "durmiendo") {
      this.estado = "activo";
      this.enDescanso = false;

      AudioController.play("menu");
      this.actualizarAparienciaMascota();
      Pet.guardarEstado(this, this.misiones);
      actualizarStats(this);
      mostrarMensaje(
        "La mascota ha terminado de descansar y está activa nuevamente.",
        "success"
      );
    }
  }

  reducirStats() {

    if (this.enJuego || this.enDescanso) return; // Stats blockeados mientras juega o descansa


    this.energia = Math.max(this.energia - Math.floor(Math.random() * 4), 0);
    this.felicidad = Math.max(
      this.felicidad - Math.floor(Math.random() * 4),
      0
    );
    this.higiene = Math.max(this.higiene - Math.floor(Math.random() * 4), 0);

    this.verificarStats(); //verifica los umbrales
    Pet.guardarEstado(this, this.misiones);
    actualizarStats(this); // Actualizar los stats en el DOM
  }

  verificarStats() {
    const estadoAnterior = this.estado;
  
    /* Efectos Negativos */
    if (this.nivel >= 2 && this.energia === 0 && !this.enDescanso) {
      this.estado = "agotado";
      this.felicidad = Math.max(this.felicidad - 30, 0);
      this.iniciarDescanso();
    } else if (this.felicidad === 0) {
      this.estado = "triste";
      this.energia = Math.max(this.energia - 10, 0);
    } else if (this.higiene === 0) {
      this.estado = "sucio";
      this.felicidad = Math.max(this.felicidad - 10, 0);
    } else if (!this.enDescanso) {
      this.estado = "activo";
    }
  
    /* Efectos Positivos */
    if (this.energia === 100) {
      this.reproducirSonidoAlerta();
      mostrarMensaje(
        "¡Energía al máximo! La mascota está llena de energía.",
        "success"
      );
    }
  
    if (this.felicidad === 100) {
      this.reproducirSonidoAlerta();
      mostrarMensaje(
        "¡Felicidad al máximo! La mascota está muy feliz.",
        "success"
      );
    }
  
    if (this.higiene === 100) {
      this.reproducirSonidoAlerta();
      mostrarMensaje(
        "¡Higiene al máximo! La mascota está completamente limpia.",
        "success"
      );
    }
  
    // Mostrar mensaje solo si el estado cambia
    if (estadoAnterior !== this.estado) {
      switch (this.estado) {
        case "agotado":
          this.reproducirSonidoAlerta();
          mostrarMensaje(
            "Tu mascota está muy agotada. Va a descansar. Dile Buenas Noches.",
            "error"
          );
          break;
        case "triste":
          this.reproducirSonidoAlerta();
          mostrarMensaje("La mascota está triste. Necesita jugar.", "warning");
          break;
        case "sucio":
          this.reproducirSonidoAlerta();
          mostrarMensaje("La mascota está sucia. Necesita un baño.", "warning");
          break;
        case "activo":
          this.reproducirSonidoAlerta();
          mostrarMensaje(
            "Tu mascota está activa y lista para jugar.",
            "success"
          );
          break;
      }
  
      // Actualizar la apariencia de la mascota después de cambiar el estado
      this.actualizarAparienciaMascota();
    }
  }

  actualizarAparienciaMascota() {
    const mascotaImg = document.getElementById("mascota");
  
    const skins = {
      activo: "../assets/images/pixels.png",
      triste: "../assets/images/pet_sad.png",
      sucio: "../assets/images/pet_dirty.png",
      durmiendo: "../assets/images/pet_sleep.png",
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
          if (mision.progreso == mision.meta) {
            mision.completado = true;
            this.verificarNivel();
          }
        }
      });
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
      this.mostrarBotones();
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

  mostrarBotones() {
    let sleep = document.getElementById("descansar");

    if (this.nivel >= 2) {
      sleep.classList.remove("hidden");
    } else {
      console.log("Nivel insuficiente");
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
      "info"
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
