import r2d2Sound from '../assets/audios/r2d2.mp3';
import laserSound from '../assets/audios/laser.mp3';
import explosionSound from '../assets/audios/explosion.mp3';

class SoundManager {
  constructor() {
    this.sounds = {
      r2d2: new Audio(r2d2Sound),
      laser: new Audio(laserSound),
      explosion: new Audio(explosionSound)
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