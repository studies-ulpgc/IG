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

    this.keys = {};
    window.addEventListener("keydown", (e) => (this.keys[e.code] = true));
    window.addEventListener("keyup", (e) => (this.keys[e.code] = false));

    if (this.xwing) {
      this.xwing.rotation.y = Math.PI;
    }
  }

  setMode(mode) {
    this.activeMode = mode;
  
    if (mode === "orbit") {
      if (this.mainCamera.parent) {
        this.mainCamera.parent.remove(this.mainCamera);
      }
      this.scene.add(this.mainCamera); 
      this.mainCamera.scale.set(1, 1, 1);
  
      this.mainCamera.position.copy(this.savedCameraPos);
      this.orbitControls.enabled = true;
      this.orbitControls.target.set(0, 0, 0);
      this.orbitControls.update();

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

      if (this.keys["KeyW"] || this.keys["ArrowUp"]) {
        this.xwing.translateZ(speed);
      }
      if (this.keys["KeyS"] || this.keys["ArrowDown"]) {
        this.xwing.translateZ(-speed);
      }

      if (this.keys["KeyA"] || this.keys["ArrowLeft"]) {
        this.xwing.rotation.y += rotSpeed;
      }
      if (this.keys["KeyD"] || this.keys["ArrowRight"]) {
        this.xwing.rotation.y -= rotSpeed;
      }
      if (this.keys["KeyQ"]) {
        this.xwing.position.y += speed;
      }
      if (this.keys["KeyE"]) {
        this.xwing.position.y -= speed;
      }
    }
  }
}