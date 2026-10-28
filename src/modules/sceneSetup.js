import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function setupScene() {
  const scene = new THREE.Scene();

  // Cámaras
  const aspect = window.innerWidth / window.innerHeight;
  const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 2000);
  camera.position.set(0, 30, 90);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.localClippingEnabled = true;

  const container = document.getElementById("app");
  container.innerHTML = ""; // Limpiar canvas previo si existía
  container.appendChild(renderer.domElement);

  // Controles de Órbita
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 500;
  controls.minDistance = 5;

  // Iluminación
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
  scene.add(ambientLight);

  const sunLight = new THREE.PointLight(0xffffff, 2.0, 1000, 0.5);
  sunLight.position.set(0, 0, 0);
  sunLight.castShadow = true;
  scene.add(sunLight);

  // Campo de Estrellas Realista en 3D (Generación por Partículas)
  createStarfield(scene);

  // Rejilla de Referencia
  const grid = new THREE.GridHelper(150, 50, 0x00ffe1, 0x333333);
  grid.position.y = -0.1;
  grid.visible = false;
  scene.add(grid);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { scene, camera, renderer, controls, grid };
}

// Generador de Campo de Estrellas con Partículas
function createStarfield(scene) {
  const starsGeometry = new THREE.BufferGeometry();
  const starsCount = 4000;
  const positions = new Float32Array(starsCount * 3);

  for (let i = 0; i < starsCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 1200;
    positions[i + 1] = (Math.random() - 0.5) * 1200;
    positions[i + 2] = (Math.random() - 0.5) * 1200;
  }

  starsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.2,
    sizeAttenuation: true
  });

  const starField = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starField);
}