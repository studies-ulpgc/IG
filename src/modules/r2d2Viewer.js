import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// CDN de jsDelivr idéntico al que usas con éxito en el X-Wing
const CDN_BASE = "https://cdn.jsdelivr.net/gh/studies-ulpgc/mis-assets-starwars@main/";

export class R2D2Viewer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = new THREE.Scene();
    
    // Forzamos un tamaño inicial cuadrado coherente para la ficha
    const width = 140;
    const height = 140;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    // Colocamos la cámara un poco más atrás para que no se corte el modelo
    this.camera.position.set(0, 0, 2.8);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ==========================================
    // ¡AÑADE ESTAS LÍNEAS AQUÍ PARA ARREGLAR EL CSS DEL CANVAS!
    // ==========================================
    const canvasElement = this.renderer.domElement;
    canvasElement.style.width = "100%";
    canvasElement.style.height = "100%";
    canvasElement.style.display = "block";
    canvasElement.style.objectFit = "contain"; // Evita distorsiones
    // ==========================================

    this.container.appendChild(canvasElement);

    // Iluminación robusta de exposición de estudio
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

  // MÉTODO RECUPERADO: Aquí está la función de carga que faltaba
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
    // 1. Creamos un grupo vacío que servirá de pivote central perfecto
    const pivotGroup = new THREE.Group();
    this.scene.add(pivotGroup);

    // 2. Metemos el modelo original de R2-D2 dentro de nuestro grupo
    pivotGroup.add(mesh);

    mesh.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.side = THREE.DoubleSide;
      }
    });

    // 3. Calculamos la caja y el centro real de las mallas internas
    const box = new THREE.Box3().setFromObject(mesh);
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    // 4. Desplazamos el modelo interno en dirección opuesta a su centro descentrado
    mesh.position.sub(center); 

    // 5. Escalamos el grupo contenedor para que mantenga un tamaño óptimo
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    
    if (maxDim > 0) {
      const scale = 1.3 / maxDim; 
      pivotGroup.scale.set(scale, scale, scale);
    }
    
    // 6. Asignamos la referencia de rotación al grupo centralizado, no al modelo desalineado
    this.r2mesh = pivotGroup;
    
    this.resize();
    console.log("¡R2-D2 empaquetado en un pivote y centrado con éxito!");
  }


  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    
    if (this.r2mesh) {
      // Tomamos el tiempo actual en segundos
      const time = Date.now() * 0.001; 
      
      // -2.5 corrige el desvío y lo clava de frente mirando hacia la izquierda
      this.r2mesh.rotation.y = -2.5 + Math.sin(time * 0.6) * 0.08;
      
      // Cabeceo vertical para simular que está leyendo la pantalla
      this.r2mesh.rotation.x = Math.sin(time * 1.2) * 0.015;
    }
    
    this.renderer.render(this.scene, this.camera);
  }

}
