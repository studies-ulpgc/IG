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
    let pointerStart = { x: 0, y: 0 };

    window.addEventListener("pointerdown", (event) => {
      pointerStart.x = event.clientX;
      pointerStart.y = event.clientY;
    });

    window.addEventListener("pointerup", (event) => {
      const dist = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
      if (dist > 5) return;

      if (
        event.target.tagName === "BUTTON" ||
        event.target.tagName === "SELECT" ||
        event.target.closest("#ui-panel") ||
        event.target.closest("#planet-info") ||
        event.target.closest("#planet-nav") ||
        event.target.closest("#help-modal")
      ) {
        return;
      }

      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      const clickables = [...this.planetMeshes.filter((p) => p.visible)];

      if (this.sunMesh) clickables.push(this.sunMesh);
      if (this.tatooineSystem && this.tatooineSystem.tatooineGroup) {
        clickables.push(this.tatooineSystem.tatooineGroup);
      }

      const activeDS = this.deathStarManager ? this.deathStarManager.getActiveMesh() : null;
      if (activeDS && activeDS.visible) {
        clickables.push(activeDS);
      }

      const intersects = this.raycaster.intersectObjects(clickables, true);

      if (intersects.length > 0) {
        let hitObj = intersects[0].object;

        let isDS = false;
        if (activeDS) {
          let curr = hitObj;
          while (curr) {
            if (curr === activeDS) {
              isDS = true;
              break;
            }
            curr = curr.parent;
          }
        }

        let isTatooine = false;
        if (this.tatooineSystem && this.tatooineSystem.tatooineGroup) {
          let curr = hitObj;
          while (curr) {
            if (curr === this.tatooineSystem.tatooineGroup || curr === this.tatooineSystem.tatooine) {
              isTatooine = true;
              break;
            }
            curr = curr.parent;
          }
        }

        if (isDS) {
          this.selectCustomObject(
            "Estrella de la Muerte",
            "Estación espacial superarma del Imperio Galáctico capaz de destruir planetas enteros.",
            "Órbita Imperial",
            "Artificial / Frío",
            activeDS,
            false
          );
          return;
        }

        if (isTatooine) {
          this.selectCustomObject(
            "Tatooine",
            "Mundo desértico binario que orbita dos soles. Hogar de los Skywalker.",
            "Borde Exterior",
            "Árido / Desértico",
            this.tatooineSystem.tatooine,
            false
          );
          return;
        }

        while (hitObj.parent && !hitObj.userData.name && hitObj !== this.sunMesh) {
          hitObj = hitObj.parent;
        }

        const index = this.planetMeshes.indexOf(hitObj);
        if (index !== -1) {
          if (this.selectedPlanetIndex !== index) {
            this.selectPlanet(index);
          }
        } else if (hitObj === this.sunMesh || hitObj.parent === this.sunMesh) {
          this.selectCustomObject(
            "Sol Central",
            "Estrella de clase G en el centro del sistema galáctico.",
            "Núcleo Galáctico",
            "Plasma Hirviente",
            this.sunMesh,
            false
          );
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

    this.updateDataFields(data.name, data.lore, data.region, data.climate, true);

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

    // Ocultamos el botón para astros no destruibles (Sol, Tatooine, Estrella de la Muerte)
    this.updateDataFields(name, lore, region, climate, canDestroy);

    if (this.destroyBtn) this.destroyBtn.style.display = canDestroy ? "inline-block" : "none";

    this.navPanel.classList.remove("hidden");
    soundManager.play("r2d2");
  }

  updateDataFields(name, lore, region, climate, canDestroy = true) {
    if (this.summaryNameEl) this.summaryNameEl.innerText = name;
    if (this.planetNameEl) this.planetNameEl.innerText = name;
    if (this.planetLoreEl) this.planetLoreEl.innerText = lore;
    if (this.planetRegionEl) this.planetRegionEl.innerText = region;
    if (this.planetClimateEl) this.planetClimateEl.innerText = climate;

    const infoDestroyBtn = document.getElementById("info-destroy-btn");
    if (infoDestroyBtn) {
      infoDestroyBtn.style.display = canDestroy ? "inline-block" : "none";
    }
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
    const wasShowingMoreInfo = this.isShowingMoreInfo;

    this.selectPlanet(visiblePlanets[nextPos].idx);

    if (wasShowingMoreInfo) {
      this.showDetailedInfo();
    }
  }

  destroyCurrentPlanet() {
    if (this.selectedPlanetIndex === -1) return;
    const targetPlanet = this.planetMeshes[this.selectedPlanetIndex];

    this.infoPanel.classList.add("hidden");
    this.navPanel.classList.add("hidden");

    targetPlanet.userData.isPaused = true;

    if (this.cameraController) {
      this.cameraController.setMode("orbit");
      const camSelect = document.getElementById("camera-mode");
      if (camSelect) camSelect.value = "orbit";
    }

    this.controls.target.copy(targetPlanet.position);
    this.camera.position.set(targetPlanet.position.x + 30, targetPlanet.position.y + 40, targetPlanet.position.z + 90);
    this.controls.update();

    this.deathStarManager.fireSuperlaser(targetPlanet, () => {
      targetPlanet.visible = false;
      this.deselectAll();
      this.updateRestoreDropdown();
    });
  }

  restoreSinglePlanet(planetId) {
    const planet = this.planetMeshes.find((p) => p.userData.id === planetId);
    if (planet) {
      planet.visible = true;
      planet.userData.isPaused = false;
      this.updateRestoreDropdown();
    }
  }

  restoreAllPlanets() {
    this.planetMeshes.forEach((p) => {
      p.visible = true;
      p.userData.isPaused = false;
    });
    this.updateRestoreDropdown();
  }

  checkXWingProximity(xwingMesh) {
    const hudEl = document.getElementById("xwing-hud");
    const nearTextEl = document.getElementById("xwing-planet-near");

    if (!hudEl || !nearTextEl) return;

    const isXWingActive = this.cameraController && this.cameraController.activeMode === "xwing";

    if (!isXWingActive || !xwingMesh) {
      hudEl.classList.add("hidden");
      return;
    }

    hudEl.classList.remove("hidden");

    const xwingPos = new THREE.Vector3();
    xwingMesh.getWorldPosition(xwingPos);

    const targets = [
      ...this.planetMeshes.filter((p) => p.visible),
      { position: new THREE.Vector3(0, 0, 0), userData: { name: "Sol Central" } }
    ];

    if (this.tatooineSystem && this.tatooineSystem.tatooine) {
      const tatPos = new THREE.Vector3();
      this.tatooineSystem.tatooine.getWorldPosition(tatPos);
      targets.push({ position: tatPos, userData: { name: "Tatooine" } });
    }

    const activeDS = this.deathStarManager ? this.deathStarManager.getActiveMesh() : null;
    if (activeDS && activeDS.visible) {
      const dsPos = new THREE.Vector3();
      activeDS.getWorldPosition(dsPos);
      targets.push({ position: dsPos, userData: { name: "Estrella de la Muerte" } });
    }

    let closestName = null;
    let minDistance = 30;

    targets.forEach((target) => {
      const targetPos = target.position || target.getWorldPosition(new THREE.Vector3());
      const dist = xwingPos.distanceTo(targetPos);

      if (dist < minDistance) {
        minDistance = dist;
        closestName = target.userData ? target.userData.name : target.name;
      }
    });

    if (closestName) {
      nearTextEl.innerText = `ACERCÁNDOSE A: ${closestName.toUpperCase()}`;
    } else {
      nearTextEl.innerText = "ACERCÁNDOSE A: PLANETA";
    }
  }
}