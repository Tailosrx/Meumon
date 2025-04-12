class AudioController {
    constructor() {
        this.audioActual = null;
        this.audioFiles = {
            menu: new Audio("../assets/sound/soundtrack.mp3"),
            gameCard: new Audio("../assets/sound/gameCard.mp3"),
            sleeping: new Audio("../assets/sound/sleepSong.mp3"),
            alert: new Audio("../assets/sound/alert.wav"),
        };

        Object.values(this.audioFiles).forEach((audio) => { //config initial (if required modified the values)
            audio.loop = true; 
            audio.volume = 0.2; 
          });
    }

    play(audioFile) {
        if (this.currentAudio) {
            this.currentAudio.pause(); 
            this.currentAudio.currentTime = 0; // Restart actual music
    }

    this.currentAudio = this.audioFiles[audioFile];
    if (this.currentAudio) {
        this.currentAudio.play().catch((error) => {
            console.error("Error playing audio:", error);
        });
    }
}

pause() {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
  }


  setVolume(volume) {
    if (this.currentAudio) {
        this.currentAudio.volume = volume;
    }   
}
}
export default new AudioController();

