import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const CDN_BASE = "https://cdn.jsdelivr.net/gh/studies-ulpgc/IG@main/3D_models/";

export function loadXWing(scene) {
  return new Promise((resolve) => {
    const loader = new GLTFLoader();

    const modelUrl = `${CDN_BASE}x_wing_fighter.glb`;

    console.log("Intentando cargar X-Wing desde:", modelUrl);

    loader.load(
      modelUrl,
      (gltf) => {
        const xwing = gltf.scene;

        xwing.scale.set(0.2, 0.2, 0.2); 
        xwing.position.set(0, 5, 45);

        xwing.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            if (child.material) {
              child.material.side = THREE.DoubleSide;
            }
          }
        });

        xwing.name = "XWing";
        scene.add(xwing);
        console.log("¡X-Wing GLB cargado con éxito!");
        resolve(xwing);
      },
      (xhr) => {
        if (xhr.total > 0) {
          console.log(`Progreso X-Wing GLB: ${((xhr.loaded / xhr.total) * 100).toFixed(0)}%`);
        }
      },
      (error) => {
        console.warn("No se pudo cargar el GLB desde la URL base. Probando alternativa o activando fallback:", error);

        loader.load(
          `${CDN_BASE}xwing.glb`,
          (gltf2) => {
            const xwing2 = gltf2.scene;
            xwing2.scale.set(0.2, 0.2, 0.2);
            xwing2.position.set(0, 5, 45);
            xwing2.name = "XWing";
            scene.add(xwing2);
            resolve(xwing2);
          },
          undefined,
          () => {
            const fallbackGroup = createFallbackXWing();
            scene.add(fallbackGroup);
            resolve(fallbackGroup);
          }
        );
      }
    );
  });
}

function createFallbackXWing() {
  const group = new THREE.Group();

  const bodyGeo = new THREE.ConeGeometry(0.6, 4, 8);
  const bodyMat = new THREE.MeshPhongMaterial({ color: 0xeeeeee });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.rotation.x = Math.PI / 2;
  group.add(body);

  const wingGeo = new THREE.BoxGeometry(4, 0.1, 1);
  const wingMat = new THREE.MeshPhongMaterial({ color: 0xcc3333 });

  const wing1 = new THREE.Mesh(wingGeo, wingMat);
  wing1.rotation.z = Math.PI / 6;
  group.add(wing1);

  const wing2 = new THREE.Mesh(wingGeo, wingMat);
  wing2.rotation.z = -Math.PI / 6;
  group.add(wing2);

  group.position.set(0, 5, 45);
  group.name = "XWingFallback";
  return group;
}