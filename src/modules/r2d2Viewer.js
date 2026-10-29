import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const CDN_BASE = "https://cdn.jsdelivr.net/gh/studies-ulpgc/IG_S6-7@main/3D_models/";

export class R2D2Viewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = new THREE.Scene();

    const width = 140;
    const height = 140;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 2.8);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const canvasElement = this.renderer.domElement;
    canvasElement.style.width = "100%";
    canvasElement.style.height = "100%";
    canvasElement.style.display = "block";
    canvasElement.style.objectFit = "contain";

    this.container.appendChild(canvasElement);

    const light = new THREE.DirectionalLight(0xffffff, 3.0);
    light.position.set(2, 4, 3);
    this.scene.add(light);
    
    const light2 = new THREE.DirectionalLight(0xffffff, 1.5);
    light2.position.set(-2, 2, -3); 
    this.scene.add(light2);

    this.scene.add(new THREE.AmbientLight(0xffffff, 2.0));

    this.r2mesh = null;
    this.animationFrameId = null;

    this.loadR2D2();
    this.animate();
  }

  resize() {
    if (!this.container) return;
    const width = this.container.clientWidth || 150;
    const height = this.container.clientHeight || 150;
    
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  loadR2D2() {
    const loader = new GLTFLoader();
    const modelUrl = `${CDN_BASE}r2d2.glb`;
    console.log("Intentando cargar R2-D2 desde:", modelUrl);

    loader.load(
      modelUrl,
      (gltf) => {
        this.setupModel(gltf.scene);
      },
      undefined,
      (err) => {
        console.warn("Falló r2d2.glb, probando nombre alternativo (r2-d2.glb)...", err);
        
        loader.load(
          `${CDN_BASE}r2-d2.glb`,
          (gltfAlt) => {
            this.setupModel(gltfAlt.scene);
          },
          undefined,
          (errAlt) => console.error("No se pudo cargar el modelo de R2-D2 en ninguna variante:", errAlt)
        );
      }
    );
  }

  setupModel(mesh) {
    const pivotGroup = new THREE.Group();
    this.scene.add(pivotGroup);

    pivotGroup.add(mesh);

    mesh.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.side = THREE.DoubleSide;
      }
    });

    const box = new THREE.Box3().setFromObject(mesh);
    const center = new THREE.Vector3();
    box.getCenter(center);

    mesh.position.sub(center); 

    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    
    if (maxDim > 0) {
      const scale = 1.3 / maxDim; 
      pivotGroup.scale.set(scale, scale, scale);
    }
    
    this.r2mesh = pivotGroup;
    
    this.resize();
    console.log("¡R2-D2 empaquetado en un pivote y centrado con éxito!");
  }


  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    
    if (this.r2mesh) {
      const time = Date.now() * 0.001; 

      this.r2mesh.rotation.y = -2.5 + Math.sin(time * 0.6) * 0.08;
      this.r2mesh.rotation.x = Math.sin(time * 1.2) * 0.015;
    }
    
    this.renderer.render(this.scene, this.camera);
  }

}
