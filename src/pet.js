import { actualizarStats } from './utils.js';
import { actualizarMisiones, mostrarSubidaDeNivel} from './logros.js';

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

        setInterval(() => this.reducirStats(), 3000); // Reducir los stats cada 3 segundos
    }

    static cargarEstado(misiones) {
        const mascota = new Pet();
        mascota.misiones = misiones.niveles;
        const estadoGuardado = JSON.parse(localStorage.getItem('mascota'));
        if (estadoGuardado) {
            Object.assign(mascota, estadoGuardado);
        }
        mascota.misiones = misiones; // Asignar las misiones directamente
        return mascota;
    }
    
    static guardarEstado(mascota, misiones) {
        // Guardar el estado de la mascota en el almacenamiento local
        localStorage.setItem('mascota', JSON.stringify(mascota));
        localStorage.setItem('misiones', JSON.stringify(misiones));
    }
    
    alimentar() {

        this.energia = Math.min(this.energia + 10, 100);
        this.felicidad = Math.min(this.felicidad + 5, 100);
        this.actualizarProgreso("alimentar");
        Pet.guardarEstado(this.misiones);
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
    }, 3000); // Cooldown de 3 segundos
    }

    jugar() {
        this.energia = Math.max(this.energia - 10, 0);
        this.felicidad = Math.min(this.felicidad + 10, 100);
        this.actualizarProgreso("jugar");
        Pet.guardarEstado(this.misiones);
        actualizarStats(this); // Actualizar los stats en el DOM
        actualizarMisiones(this, this.misiones);

        this.cooldownJugar = true;
        const button = document.getElementById("jugar");
        button.disabled = true;
        button.textContent = "Espera...";

        setTimeout(() => {
            this.cooldownJugar = false;
            button.disabled = false;
            button.textContent = "🎾 Jugar";
        }, 3000); // Cooldown de 3 segundos
    }

    limpiar() {
        this.higiene = 100;
        this.actualizarProgreso("duchar");
        Pet.guardarEstado(this.misiones);
        actualizarStats(this); // Actualizar los stats en el DOM
        actualizarMisiones(this, this.misiones);

        this.cooldownLimpiar = true;
        const button = document.getElementById("duchar");
        button.disabled = true;
        button.textContent = "Espera...";

        setTimeout(() => {
            this.cooldownLimpiar = false;
            button.disabled = false;
            button.textContent = "🛁 Bañar";
        }, 3000); // Cooldown de 3 segundos
    }

    descansar() {
        if (this.estado !== "durmiendo") {
            this.estado = "durmiendo";
            this.energia = 100;
            this.actualizarProgreso("descansar");
            Pet.guardarEstado(this, this.misiones);
            actualizarStats(this); // Actualizar los stats en el DOM
            actualizarMisiones(this, this.misiones);
        }
    }

    despertar() {
        if (this.estado === "durmiendo") {
            this.estado = "activo";
            Pet.guardarEstado(this.misiones);
            actualizarStats(this); // Actualizar los stats en el DOM
        }
    }

    reducirStats() {
        this.energia = Math.max(this.energia - Math.floor(Math.random() * 4), 0);
        this.felicidad = Math.max(this.felicidad - Math.floor(Math.random() * 4), 0);
        this.higiene = Math.max(this.higiene - Math.floor(Math.random() * 4), 0);
        Pet.guardarEstado(this.misiones);
        actualizarStats(this); // Actualizar los stats en el DOM
    }

    actualizarProgreso(accion) {
        const nivelActual = this.misiones.find(nivel => nivel.nivel === this.nivel);
        if (nivelActual) {
            nivelActual.misiones.forEach(mision => {
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
        const nivelActual = this.misiones.find(nivel => nivel.nivel === this.nivel);
        if (nivelActual && nivelActual.misiones.every(mision => mision.completado)) {
            this.nivel = nivelActual.recompensas.nivel;
            mostrarSubidaDeNivel(this.nivel, nivelActual.recompensas.desbloqueos);
        }
    }

    agregarRecompensa(recompensa) {
        this.inventario.push(recompensa);
        Pet.guardarEstado(this.misiones);
    }

}