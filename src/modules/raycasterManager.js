import * as THREE from "three";
import { soundManager } from "./soundManager.js";

export class InteractionManager {
  constructor(camera, renderer, planetMeshes, controls, deathStarManager, cameraController, sunMesh, tatooineSystem) {
    this.camera = camera;
    this.renderer = renderer;
    this.planetMeshes = planetMeshes;
    this.controls = controls;
    this.deathStarManager = deathStarManager;
    this.cameraController = cameraController;
    this.sunMesh = sunMesh;
    this.tatooineSystem = tatooineSystem;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.selectedObject = null;
    this.selectedPlanetIndex = -1;
    this.isShowingMoreInfo = false;

    this.setupUI();
    this.setupEvents();
  }

  setupUI() {
    this.infoPanel = document.getElementById("planet-info");
    this.navPanel = document.getElementById("planet-nav");
    this.summaryNameEl = document.getElementById("summary-planet-name");

    this.planetNameEl = document.getElementById("planet-name");
    this.planetLoreEl = document.getElementById("planet-lore");
    this.planetRegionEl = document.getElementById("planet-region");
    this.planetClimateEl = document.getElementById("planet-climate");

    this.destroyBtn = document.getElementById("destroy-planet-btn");
    this.moreInfoBtn = document.getElementById("more-info-btn");

    const bindClick = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("click", fn);
    };

    const infoDestroyBtn = document.getElementById("info-destroy-btn");
    if (infoDestroyBtn) {
      infoDestroyBtn.addEventListener("click", () => this.destroyCurrentPlanet());
    }

    bindClick("close-info", () => this.hideDetailedInfo());
    bindClick("prev-planet-btn", () => this.navigatePlanet(-1));
    bindClick("next-planet-btn", () => this.navigatePlanet(1));
    bindClick("close-summary-btn", () => this.deselectAll());
    bindClick("info-prev-btn", () => this.navigatePlanet(-1));
    bindClick("info-next-btn", () => this.navigatePlanet(1));

    if (this.moreInfoBtn) this.moreInfoBtn.addEventListener("click", () => this.showDetailedInfo());
    if (this.destroyBtn) this.destroyBtn.addEventListener("click", () => this.destroyCurrentPlanet());

    bindClick("restore-single-btn", () => {
      const select = document.getElementById("restore-select");
      if (select && select.value !== "") {
        this.restoreSinglePlanet(select.value);
      }
    });
  
    this.updateRestoreDropdown();
  }

  updateRestoreDropdown() {
    const select = document.getElementById("restore-select");
    if (!select) return;
  
    select.innerHTML = '<option value="">-- Restaurar Planeta --</option>';
  
    this.planetMeshes.forEach((planet) => {
      if (!planet.visible) {
        const opt = document.createElement("option");
        opt.value = planet.userData.id;
        opt.innerText = planet.userData.name;
        select.appendChild(opt);
      }
    });
  }

  setupEvents() {
    window.addEventListener("pointerdown", (event) => {
      if (
        event.target.tagName === "BUTTON" ||
        event.target.closest("#ui-panel") ||
        event.target.closest("#planet-info") ||
        event.target.closest("#planet-nav")
      ) {
        return;
      }

      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      const clickables = [...this.planetMeshes.filter((p) => p.visible)];

      if (this.sunMesh) clickables.push(this.sunMesh);
      if (this.tatooineSystem && this.tatooineSystem.tatooine) {
        clickables.push(this.tatooineSystem.tatooine);
      }

      const activeDS = this.deathStarManager ? this.deathStarManager.getActiveMesh() : null;
      if (activeDS && activeDS.visible) clickables.push(activeDS);

      const intersects = this.raycaster.intersectObjects(clickables, true);

      if (intersects.length > 0) {
        let hitObj = intersects[0].object;

        while (hitObj.parent && !hitObj.userData.name && hitObj !== this.sunMesh && hitObj !== activeDS) {
          hitObj = hitObj.parent;
        }

        const index = this.planetMeshes.indexOf(hitObj);
        if (index !== -1) {
          this.selectPlanet(index);
        } else if (hitObj === this.sunMesh) {
          this.selectCustomObject("Sol Central", "Estrella de clase G en el centro del sistema galáctico.", "Núcleo", "Plasma Hirviente", hitObj, false);
        } else if (this.tatooineSystem && hitObj === this.tatooineSystem.tatooine) {
          this.selectCustomObject("Tatooine", "Mundo desértico binario orbita dos soles. Hogar de los Skywalker.", "Borde Exterior", "Árido / Desértico", hitObj, false);
        } else if (hitObj === activeDS || (hitObj.parent && hitObj.parent === activeDS)) {
          this.selectCustomObject("Estrella de la Muerte", "Estación espacial superarma del Imperio Galáctico.", "Órbita Imperial", "Artificial / Frío", activeDS, false);
        }
      }
    });
  }

  selectPlanet(index) {
    if (this.selectedPlanetIndex !== -1 && this.planetMeshes[this.selectedPlanetIndex]) {
      this.planetMeshes[this.selectedPlanetIndex].userData.isPaused = false;
    }

    this.selectedPlanetIndex = index;
    const planet = this.planetMeshes[index];
    const data = planet.userData;

    planet.userData.isPaused = true;
    this.selectedObject = planet;

    this.updateDataFields(data.name, data.lore, data.region, data.climate);

    if (this.destroyBtn) this.destroyBtn.style.display = "inline-block";

    this.navPanel.classList.remove("hidden");
    if (this.isShowingMoreInfo) {
      this.focusObjectFront(planet, data.radius || 2);
    }
    soundManager.play("r2d2");
  }

  selectCustomObject(name, lore, region, climate, mesh, canDestroy = false) {
    this.deselectAll();
    this.selectedObject = mesh;

    this.updateDataFields(name, lore, region, climate);

    if (this.destroyBtn) this.destroyBtn.style.display = canDestroy ? "inline-block" : "none";

    this.navPanel.classList.remove("hidden");

    const infoDestroyBtn = document.getElementById("info-destroy-btn");
    if (infoDestroyBtn) infoDestroyBtn.style.display = canDestroy ? "inline-block" : "none";
  }

  updateDataFields(name, lore, region, climate) {
    if (this.summaryNameEl) this.summaryNameEl.innerText = name;
    if (this.planetNameEl) this.planetNameEl.innerText = name;
    if (this.planetLoreEl) this.planetLoreEl.innerText = lore;
    if (this.planetRegionEl) this.planetRegionEl.innerText = region;
    if (this.planetClimateEl) this.planetClimateEl.innerText = climate;
    const infoDestroyBtn = document.getElementById("info-destroy-btn");
    if (infoDestroyBtn) infoDestroyBtn.style.display = "inline-block";
  }

  focusObjectFront(mesh, radius) {
    const worldPos = new THREE.Vector3();
    mesh.getWorldPosition(worldPos);

    const offset = new THREE.Vector3(0, 1.5, radius * 3.5);
    const targetPos = worldPos.clone().add(offset);

    this.controls.target.copy(worldPos);
    this.camera.position.copy(targetPos);
    this.controls.update();
  }

  showDetailedInfo() {
    if (!this.selectedObject) return;
    this.isShowingMoreInfo = true;

    const radius = this.selectedObject.userData.radius || 3;
    this.focusObjectFront(this.selectedObject, radius);

    this.navPanel.classList.add("hidden"); 
    this.infoPanel.classList.remove("hidden"); 

    if (window.r2d2Viewer) {
      window.r2d2Viewer.resize();
    }
  }

  hideDetailedInfo() {
    this.isShowingMoreInfo = false;
    this.infoPanel.classList.add("hidden");
    this.navPanel.classList.add("hidden"); 
    this.deselectAll();
  }

  deselectAll() {
    if (this.selectedPlanetIndex !== -1 && this.planetMeshes[this.selectedPlanetIndex]) {
      this.planetMeshes[this.selectedPlanetIndex].userData.isPaused = false;
    }

    this.selectedPlanetIndex = -1;
    this.selectedObject = null;
    this.isShowingMoreInfo = false;

    this.infoPanel.classList.add("hidden");
    this.navPanel.classList.add("hidden");

    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  navigatePlanet(direction) {
    const visiblePlanets = this.planetMeshes
      .map((p, idx) => ({ p, idx }))
      .filter((item) => item.p.visible);

    if (visiblePlanets.length === 0) return;

    let currentPos = visiblePlanets.findIndex((item) => item.idx === this.selectedPlanetIndex);
    if (currentPos === -1) currentPos = 0;

    let nextPos = (currentPos + direction + visiblePlanets.length) % visiblePlanets.length;
    this.selectPlanet(visiblePlanets[nextPos].idx);
    soundManager.play("r2d2");
  }

  destroyCurrentPlanet() {
    if (this.selectedPlanetIndex === -1) return;
    const targetPlanet = this.planetMeshes[this.selectedPlanetIndex];

    if (this.cameraController) {
      this.cameraController.setMode("orbit");
      document.getElementById("camera-mode").value = "orbit";
    }

    this.controls.target.copy(targetPlanet.position);
    this.camera.position.set(targetPlanet.position.x + 30, targetPlanet.position.y + 40, targetPlanet.position.z + 90);
    this.controls.update();

    this.deathStarManager.fireSuperlaser(targetPlanet, () => {
      targetPlanet.visible = false;
      this.deselectAll();
    });
  }

  restoreAllPlanets() {
    this.planetMeshes.forEach((p) => {
      p.visible = true;
      p.userData.isPaused = false;
    });
  }
}