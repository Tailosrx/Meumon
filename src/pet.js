export default class Pet {
  constructor(nombre, achievements) {
      this.nombre = nombre;
      this.energia = 50;
      this.felicidad = 50;
      this.higiene = 50;
      this.estado = "activo";
      this.exp = 0;
      this.lvl = 1;
      this.juegos = 0;
      this.alimentos = 0;
      this.tiempoHigiene = 0;
      this.monedas = 0;
      this.achievements = achievements;
      this.actualizarEstado();
      this.iniciarTemporizadores();
  }

  alimentar() {
      this.energia += 20;
      this.felicidad += 15;
      this.alimentos += 1;
      if (this.energia > 100) this.energia = 100;
      if (this.felicidad > 100) this.felicidad = 100;
      this.ganarExp(10);
      this.actualizarEstado();
      this.verificarLogros();
      this.guardarEstado();
  }

  jugar() {
      this.energia -= 10;
      this.felicidad += 5;
      if (this.energia < 0) this.energia = 0;
      if (this.felicidad > 100) this.felicidad = 100;
      this.juegos += 1;
      this.actualizarEstado();
      this.ganarExp(15);
      this.verificarLogros();
      this.guardarEstado();
  }

  bañar() {
      this.higiene = 100;
      this.actualizarImagen("assets/images/pet_ducha.png");
      setTimeout(() => {
          this.actualizarImagen("assets/images/pixels.png");
      }, 2000);
      this.ganarExp(5);
      this.actualizarEstado();
      this.verificarLogros();
      this.guardarEstado();
  }

  descansar() {
      if (this.estado !== "durmiendo") {
          this.estado = "durmiendo";
          this.energia = 100;
          this.pararTemporizadores();
          this.actualizarImagen("assets/images/pet_sleep.png");
          document.getElementById("descansar").innerText = "Despertar";
          this.guardarEstado();
      }
  }

  despertar() {
      if (this.estado === "durmiendo") {
          this.estado = "activo";
          this.iniciarTemporizadores();
          this.actualizarImagen("assets/images/pixels.png");
          this.actualizarEstado();
          document.getElementById("descansar").innerText = "Descansar";
          this.guardarEstado();
      }
  }

  actualizarEstado() {
      const energiaElem = document.getElementById("energia");
      const felicidadElem = document.getElementById("felicidad");
      const higieneElem = document.getElementById("higiene");
      const nivelElem = document.getElementById("nivel");
      const expElem = document.getElementById("exp");

      if (energiaElem) energiaElem.innerText = `Energía: ${this.energia}`;
      if (felicidadElem) felicidadElem.innerText = `Felicidad: ${this.felicidad}`;
      if (higieneElem) higieneElem.innerText = `Higiene: ${this.higiene}`;
      if (nivelElem) nivelElem.innerText = `Nivel: ${this.lvl}`;
      if (expElem) expElem.innerText = `EXP: ${this.exp} / 100`;
  }

  actualizarImagen(ruta) {
      const mascotaElem = document.getElementById("mascota");
      if (mascotaElem) mascotaElem.src = ruta;
  }

  ganarExp(cantidad) {
      this.exp += cantidad;
      if (this.exp >= 100) {
          this.lvl++;
          this.exp = 0;
      }
      this.actualizarEstado();
      this.verificarLogros();
      this.guardarEstado();
  }

  verificarLogros() {
      this.achievements.forEach(achievement => {
          const condition = new Function('pet', `return ${achievement.condition}`);
          if (!achievement.unlocked && condition(this)) {
              achievement.unlocked = true;
              this.notificarLogro(achievement);
          }
      });
      this.guardarEstado();
  }

  notificarLogro(achievement) {
      alert(`¡Logro desbloqueado! ${achievement.name}: ${achievement.description}`);
  }

  iniciarTemporizadores() {
      this.temporizadorEnergia = setInterval(() => {
          if (this.estado !== "durmiendo") {
              this.energia -= 1;
          }
          if (this.energia < 0) this.energia = 0;
          this.actualizarEstado();
          this.guardarEstado();
      }, 5000);

      this.temporizadorFelicidad = setInterval(() => {
          if (this.estado !== "durmiendo") {
              this.felicidad -= 1;
          }
          if (this.felicidad < 0) this.felicidad = 0;
          this.actualizarEstado();
          this.guardarEstado();
      }, 7000);

      this.temporizadorHigiene = setInterval(() => {
          if (this.estado !== "durmiendo") {
              this.higiene -= 1;
              if (this.higiene === 100) {
                  this.tiempoHigiene += 1000;
              } else {
                  this.tiempoHigiene = 0;
              }
          }
          if (this.higiene < 0) this.higiene = 0;
          this.actualizarEstado();
          this.guardarEstado();
      }, 10000);
  }

  pararTemporizadores() {
      clearInterval(this.temporizadorEnergia);
      clearInterval(this.temporizadorFelicidad);
      clearInterval(this.temporizadorHigiene);
  }

  guardarEstado() {
      localStorage.setItem('mascota', JSON.stringify(this));
  }

  static cargarEstado(achievements) {
      const estado = localStorage.getItem('mascota');
      if (estado) {
          const datos = JSON.parse(estado);
          const mascota = new Pet(datos.nombre, achievements);
          Object.assign(mascota, datos);
          return mascota;
      }
      return new Pet("Mascota", achievements);
  }


}