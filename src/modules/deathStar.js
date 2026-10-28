import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { soundManager } from "./soundManager.js";

const CDN_BASE = "https://raw.githubusercontent.com/studies-ulpgc/IG/main/3D_models/";

export class DeathStarManager {
  constructor(scene) {
    this.scene = scene;
    this.currentEra = "ep4";
    this.loader = new GLTFLoader();

    this.dsEp4Mesh = null;
    this.dsEp6Mesh = null;

    this.loadModels();

    this.laserLine = this.createLaserBeam();
    this.scene.add(this.laserLine);

    this.explosions = [];
  }

  loadModels() {
    this.loader.load(
      `${CDN_BASE}death_star.glb`,
      (gltf) => {
        this.dsEp4Mesh = gltf.scene;
        this.fitModelScale(this.dsEp4Mesh, 9.0);
        this.dsEp4Mesh.position.set(0, 20, -130);
        this.dsEp4Mesh.visible = (this.currentEra === "ep4");
        this.scene.add(this.dsEp4Mesh);
      },
      undefined,
      (err) => console.warn("Error cargando death_star.glb:", err)
    );

    this.loader.load(
      `${CDN_BASE}death_star_ii.glb`,
      (gltf) => {
        this.dsEp6Mesh = gltf.scene;
        this.fitModelScale(this.dsEp6Mesh, 9.0);
        this.dsEp6Mesh.position.set(0, 20, -130);
        this.dsEp6Mesh.visible = (this.currentEra === "ep6");
        this.scene.add(this.dsEp6Mesh);
      },
      undefined,
      (err) => console.warn("Error cargando death_star_ii.glb:", err)
    );
  }

  getActiveMesh() {
    if (this.currentEra === "ep4" && this.dsEp4Mesh) return this.dsEp4Mesh;
    if (this.currentEra === "ep6" && this.dsEp6Mesh) return this.dsEp6Mesh;
    return new THREE.Group();
  }

  fitModelScale(mesh, targetSize) {
    const box = new THREE.Box3().setFromObject(mesh);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      const scale = targetSize / maxDim;
      mesh.scale.set(scale, scale, scale);
    }
  }

  createLaserBeam() {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0)
    ]);
    const material = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      linewidth: 6,
      transparent: true,
      opacity: 0
    });
    return new THREE.Line(geometry, material);
  }

  setEra(era) {
    this.currentEra = era;
    if (this.dsEp4Mesh) this.dsEp4Mesh.visible = (era === "ep4");
    if (this.dsEp6Mesh) this.dsEp6Mesh.visible = (era === "ep6");
  }

  fireSuperlaser(targetPlanet, onComplete) {
    const activeMesh = this.getActiveMesh();
    const origin = activeMesh.position.clone();
    const target = targetPlanet.position.clone();

    soundManager.play("laser");

    const positions = new Float32Array([
      origin.x, origin.y, origin.z,
      target.x, target.y, target.z
    ]);
    this.laserLine.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.laserLine.material.opacity = 1;

    setTimeout(() => {
      this.laserLine.material.opacity = 0;
      soundManager.play("explosion");
      this.triggerExplosion(target);

      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
    }, 600);
  }

  triggerExplosion(position) {
    const flashLight = new THREE.PointLight(0xffaa00, 10, 200);
    flashLight.position.copy(position);
    this.scene.add(flashLight);

    const ringGeo = new THREE.SphereGeometry(1, 32, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff3300,
      wireframe: true,
      transparent: true,
      opacity: 1
    });
    const shockwave = new THREE.Mesh(ringGeo, ringMat);
    shockwave.position.copy(position);
    this.scene.add(shockwave);

    const particleCount = 600;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;

      const color = new THREE.Color(Math.random() > 0.3 ? 0xff4400 : 0xffea00);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 25
        )
      );
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2.5,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles);

    this.explosions.push({ particles, velocities, shockwave, flashLight, life: 1.0 });
  }

  update() {
    if (this.dsEp4Mesh && this.dsEp4Mesh.visible) this.dsEp4Mesh.rotation.y += 0.002;
    if (this.dsEp6Mesh && this.dsEp6Mesh.visible) this.dsEp6Mesh.rotation.y += 0.002;

    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const exp = this.explosions[i];
      exp.life -= 0.02;

      if (exp.shockwave) {
        const s = (1.0 - exp.life) * 40;
        exp.shockwave.scale.set(s, s, s);
        exp.shockwave.material.opacity = exp.life;
      }

      if (exp.flashLight) {
        exp.flashLight.intensity = exp.life * 10;
      }

      const positions = exp.particles.geometry.attributes.position.array;
      for (let j = 0; j < exp.velocities.length; j++) {
        positions[j * 3] += exp.velocities[j].x * 0.15;
        positions[j * 3 + 1] += exp.velocities[j].y * 0.15;
        positions[j * 3 + 2] += exp.velocities[j].z * 0.15;
      }

      exp.particles.geometry.attributes.position.needsUpdate = true;
      exp.particles.material.opacity = exp.life;

      if (exp.life <= 0) {
        this.scene.remove(exp.particles);
        if (exp.shockwave) this.scene.remove(exp.shockwave);
        if (exp.flashLight) this.scene.remove(exp.flashLight);
        this.explosions.splice(i, 1);
      }
    }
  }
}