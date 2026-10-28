import * as THREE from "three";
import { soundManager } from "./soundManager.js";

export class CameraController {
  constructor(scene, camera, renderer, orbitControls, xwingMesh) {
    this.scene = scene;
    this.mainCamera = camera;
    this.renderer = renderer;
    this.orbitControls = orbitControls;
    this.xwing = xwingMesh;

    this.activeMode = "orbit";
    this.savedCameraPos = new THREE.Vector3(0, 30, 90);

    // Estado de teclas presionadas
    this.keys = {};
    window.addEventListener("keydown", (e) => (this.keys[e.code] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.code] = false));

    if (this.xwing) {
      this.xwing.rotation.y = Math.PI; // Corrección de frente al Sol
    }
  }

  setMode(mode) {
    this.activeMode = mode;
  
    if (mode === "orbit") {
      // 1. Desenganchar cámara del X-Wing de forma limpia
      if (this.mainCamera.parent) {
        this.mainCamera.parent.remove(this.mainCamera);
      }
      this.scene.add(this.mainCamera); // Volver a añadirla directo a la escena raíz
      
      // 2. Resetear escala local de la cámara (evita deformaciones de proyección)
      this.mainCamera.scale.set(1, 1, 1);
  
      // 3. Restaurar posición original e iluminación
      this.mainCamera.position.copy(this.savedCameraPos);
      this.orbitControls.enabled = true;
      this.orbitControls.target.set(0, 0, 0);
      this.orbitControls.update();
  
      // 4. Forzar actualización de la matriz para que reaparezcan las estrellas
      this.mainCamera.updateProjectionMatrix();
  
    } else if (mode === "xwing") {
      soundManager.play("r2d2");
      this.savedCameraPos.copy(this.mainCamera.position);
      this.orbitControls.enabled = false;
  
      if (this.xwing) {
        this.xwing.add(this.mainCamera);
        this.mainCamera.position.set(0, 2.0, -8);
        this.mainCamera.rotation.set(0, Math.PI, 0);
      }
    }
  }

  update(delta) {
    if (this.activeMode === "xwing" && this.xwing) {
      const speed = 30.0 * delta;
      const rotSpeed = 1.5 * delta;

      // Avanzar / Retroceder (W / S o Flechas Arriba/Abajo)
      if (this.keys["KeyW"] || this.keys["ArrowUp"]) {
        this.xwing.translateZ(speed);
      }
      if (this.keys["KeyS"] || this.keys["ArrowDown"]) {
        this.xwing.translateZ(-speed);
      }

      // Girar Nave (A / D o Flechas Izquierda/Derecha)
      if (this.keys["KeyA"] || this.keys["ArrowLeft"]) {
        this.xwing.rotation.y += rotSpeed;
      }
      if (this.keys["KeyD"] || this.keys["ArrowRight"]) {
        this.xwing.rotation.y -= rotSpeed;
      }

      // Elevar / Descender (Q / E)
      if (this.keys["KeyQ"]) {
        this.xwing.position.y += speed;
      }
      if (this.keys["KeyE"]) {
        this.xwing.position.y -= speed;
      }
    }
  }
}