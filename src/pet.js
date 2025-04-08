import { actualizarStats } from "./utils.js";
import { actualizarMisiones, mostrarSubidaDeNivel } from "./logros.js";
import { iniciarJuegoMemoria } from "./games/memory.js";
import { mostrarMensaje } from "./messageStat.js";

export default class Pet {
  constructor() {
    this.energia = 10;
    this.felicidad = 0;
    this.higiene = 0;
    this.nivel = 1;
    this.monedas = 0;
    this.misiones = {};
    this.inventario = [];
    this.estado = "activo";
    this.cooldownAlimentar = false;
    this.cooldownJugar = false;
    this.cooldownLimpiar = false;
    this.enDescanso = false; 

    setInterval(() => this.reducirStats(), 3000); // Reducir los stats cada 3 segundos
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
      mostrarMensaje("La mascota está descansando y no puede ser alimentada.", "warning");
        return;
    }

    let img = document.getElementById("mascota");
    let eat = new Audio("../assets/sound/eat.wav");
    eat.play();
    this.energia = Math.min(this.energia + 10, 100);
    this.felicidad = Math.min(this.felicidad + 5, 100);
    this.actualizarProgreso("alimentar");
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
      mostrarMensaje("La mascota está descansando y no puede jugar.", "warning");
      return;
  }


    this.energia = Math.max(this.energia - 10, 0);
    this.felicidad = Math.min(this.felicidad + 10, 100);
    iniciarJuegoMemoria(this, this.misiones);

    this.actualizarProgreso("jugar");
    Pet.guardarEstado(this, this.misiones);
    actualizarStats(this);
    actualizarMisiones(this, this.misiones);

    this.cooldownJugar = true;
    const button = document.getElementById("jugar");
  }

  limpiar() {

    if (this.enDescanso) {
      mostrarMensaje("La mascota está descansando y no puede jugar.", "warning");
      return;
  }


    let img = document.getElementById("mascota");
    img.src = "../assets/images/pet_ducha.png";
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
    if (this.estado !== "durmiendo") {
      this.estado = "durmiendo";
      this.energia = 100;
      this.actualizarProgreso("descansar");
      Pet.guardarEstado(this, this.misiones);
      actualizarStats(this); 
      actualizarMisiones(this, this.misiones);
    }
  }

  despertar() {
    if (this.estado === "durmiendo") {
      this.estado = "activo";
      Pet.guardarEstado(this, this.misiones);
      actualizarStats(this); 
    }
  }

  reducirStats() {
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
  
    /* Efectos Negativos
     ------------------- */
    if (this.energia === 0) {
      this.estado = "agotado";
      this.felicidad = Math.max(this.felicidad - 30, 0);
      this.iniciarDescanso(); // descanso automatico
    } else if (this.felicidad === 0) {
      this.estado = "triste";
    } else if (this.higiene === 0) {
      this.estado = "sucia";
    } else {
      this.estado = "activo"; // Estado por defecto si no hay problemas
    }
  
    /* Efectos Positivos
     ------------------- */
    if (this.energia === 100) {
      mostrarMensaje("¡Energía al máximo! La mascota está llena de energía.", "success");
    }
  
    if (this.felicidad === 100) {
      mostrarMensaje("¡Felicidad al máximo! La mascota está muy feliz.", "success");
    }
  
    if (this.higiene === 100) {
      mostrarMensaje("¡Higiene al máximo! La mascota está completamente limpia.", "success");
    }
  
    // Mostrar mensaje solo si el estado cambia
    if (estadoAnterior !== this.estado) {
      switch (this.estado) {
        case "agotado":
          mostrarMensaje("Tu mascota está muy agotada. Va a descansar. Dile Buenas Noches.", "error");
          break;
        case "triste":
          mostrarMensaje("La mascota está triste. Necesita jugar.", "warning");
          break;
        case "sucia":
          mostrarMensaje("La mascota está sucia. Necesita un baño.", "warning");
          break;
        case "activo":
          mostrarMensaje("Tu mascota está activa y lista para jugar.", "success");
          break;
      }
    }
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

  mostrarBotones(){
    let sleep = document.getElementById("descansar");

    if (this.nivel >= 2) {
      sleep.classList.remove("hidden");
    }
    else{
      console.log("Nivel insuficiente");
    }
  }

  agregarRecompensa(recompensa) {
    this.inventario.push(recompensa);
    Pet.guardarEstado(this, this.misiones);
  }


  iniciarDescanso() {
    if (this.enDescanso) return; // Evitar múltiples descansos

    this.enDescanso = true; // Bloquear acciones
    const tiempoDescanso = 30000; // 30 segundos de descanso

    mostrarMensaje(`La mascota está descansando. Volverá a estar activa en ${tiempoDescanso / 1000} segundos.`, "info");

    // Temporizador para finalizar el descanso
    setTimeout(() => {
        this.enDescanso = false; // Desbloquear acciones
        this.energia = 50; // Restaurar algo de energía
        this.estado = "activo"; // Cambiar el estado a activo
        mostrarMensaje("La mascota ha terminado de descansar y está activa nuevamente.", "success");
        actualizarStats(this); // Actualizar los stats en el DOM
    }, tiempoDescanso); 
  }
}
