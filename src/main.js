import * as THREE from "three";
import { setupScene } from "./modules/sceneSetup.js";
import { createSolarSystem } from "./modules/planetBuilder.js";
import { loadXWing } from "./modules/modelLoader.js";
import { CameraController } from "./modules/controlsManager.js";
import { DeathStarManager } from "./modules/deathStar.js";
import { InteractionManager } from "./modules/raycasterManager.js";
import { R2D2Viewer } from "./modules/r2d2Viewer.js";

// Inicializar la escena gráfica
const { scene, camera, renderer, controls, grid } = setupScene();

// Crear Sistema Solar
const { sunMesh, planetMeshes, satelliteMeshes, tatooineSystem } = createSolarSystem(scene);

// Instanciar Estrella de la Muerte
const deathStarManager = new DeathStarManager(scene);

let cameraController = null;
let xwingMesh = null;

// Instanciar InteractionManager de inmediato
const interactionManager = new InteractionManager(
  camera,
  renderer,
  planetMeshes,
  controls,
  deathStarManager,
  null,
  sunMesh,
  tatooineSystem
);

// Inicializar visor 3D de R2-D2
window.r2d2Viewer = new R2D2Viewer("r2d2-canvas-container");

const clock = new THREE.Clock();

// Cargar X-Wing
loadXWing(scene).then((loadedXWing) => {
  xwingMesh = loadedXWing;
  cameraController = new CameraController(scene, camera, renderer, controls, xwingMesh);
  interactionManager.cameraController = cameraController;

  document.getElementById("camera-mode").addEventListener("change", (e) => {
    if (cameraController) cameraController.setMode(e.target.value);
  });
});

// Selector de Era Galáctica (Episodio IV vs VI)
document.getElementById("era-selector").addEventListener("change", (e) => {
  deathStarManager.setEra(e.target.value);
});

// Listener para Restaurar Planetas Todos
document.getElementById("reset-planets").addEventListener("click", () => {
  interactionManager.restoreAllPlanets();
});

// Visualización Rejilla
document.getElementById("toggle-grid").addEventListener("click", () => {
  grid.visible = !grid.visible;
});

// Desplegar / Ocultar Datapad
const uiPanel = document.getElementById("ui-panel");
const toggleUiBtn = document.getElementById("toggle-ui-btn");

toggleUiBtn.addEventListener("click", () => {
  uiPanel.classList.toggle("collapsed");
  toggleUiBtn.innerText = uiPanel.classList.contains("collapsed") ? "▲" : "▼";
});

// Lógica de Modal de Ayuda (Help)
const helpBtn = document.getElementById("help-btn");
const helpModal = document.getElementById("help-modal");
const closeHelpBtn = document.getElementById("close-help-btn");

if (helpBtn && helpModal) {
  helpBtn.addEventListener("click", () => helpModal.classList.remove("hidden"));
  closeHelpBtn.addEventListener("click", () => helpModal.classList.add("hidden"));
}

// Bucle de Animación principal
let t0 = Date.now();
const speedFactor = 0.0005;

function animationLoop() {
  requestAnimationFrame(animationLoop);

  const delta = clock.getDelta();
  const timestamp = (Date.now() - t0) * speedFactor;

  if (cameraController) cameraController.update(delta);
  if (deathStarManager) deathStarManager.update();

  if (interactionManager && xwingMesh) {
    interactionManager.checkXWingProximity(xwingMesh);
  }

  // Animación del Sol Central y Fuego Solar
  if (sunMesh) {
    sunMesh.rotation.y += 0.002;
    const fireMesh = sunMesh.getObjectByName("sun_fire");
    if (fireMesh) fireMesh.rotation.y -= 0.004;
  }

  // Animación de Tatooine y sus dos soles
  if (tatooineSystem) {
    tatooineSystem.tatooinePivot.rotation.y += 0.0001;
    tatooineSystem.sunPivot.rotation.y += 0.01;
    tatooineSystem.tatooine.rotation.y += 0.005;
  }

  // Actualizar movimiento de planetas
  planetMeshes.forEach((planet) => {
    if (!planet.visible) return;
    const data = planet.userData;

    if (!data.isPaused) {
      planet.position.x = Math.cos(timestamp * data.speed) * data.distance;
      planet.position.z = Math.sin(timestamp * data.speed) * (data.distance * 1.05);
    }

    planet.rotation.y += 0.01;

    const clouds = planet.getObjectByName(`${data.id}_clouds`);
    if (clouds) clouds.rotation.y += 0.012;
  });

  // Actualizar Satélites
  satelliteMeshes.forEach(({ mesh, pivot, speed }) => {
    pivot.rotation.y += speed * 0.01;
    mesh.rotation.y += 0.02;
  });

  if (!cameraController || cameraController.activeMode === "orbit") {
    controls.update();
  }

  renderer.render(scene, camera);
}

animationLoop();