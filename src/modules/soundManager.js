class SoundManager {
  constructor() {
    this.sounds = {
      r2d2: new Audio("src/assets/audios/r2d2.mp3"),
      laser: new Audio("src/assets/audios/laser.mp3"),
      explosion: new Audio("src/assets/audios/explosion.mp3")
    };

    this.sounds.r2d2.volume = 0.5;
    this.sounds.laser.volume = 0.5;
    this.sounds.explosion.volume = 0.7;
  }

  play(name) {
    if (this.sounds[name]) {
      this.sounds[name].currentTime = 0;
      this.sounds[name].play().catch(() => {});
    }
  }
}
  
export const soundManager = new SoundManager();