import * as THREE from "three";
import { PLANET_DATA } from "../config/planetData.js";

const textureLoader = new THREE.TextureLoader();

export function createSolarSystem(scene) {
  const planetMeshes = [];
  const satelliteMeshes = [];

  // 1. SOL CENTRAL + CORONA SOLAR (CAPA DE FUEGO)
  const sunTexture = textureLoader.load("src/assets/textures/sun_map.jpg");
  const sunGeo = new THREE.SphereGeometry(7, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({ map: sunTexture });
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  // 1. Cargamos las dos texturas de nubes (la del mapa y la del mapa de transparencia invertido)
  const txClouds = textureLoader.load("src/assets/textures/earthcloudmaptrans.jpg");
  const txCloudsAlpha = textureLoader.load("src/assets/textures/earthcloudmaptrans_invert.jpg");
  sunMesh.name = "Sol Central";
  scene.add(sunMesh);

  // Capa exterior de Fuego / Corona Solar
  const fireGeo = new THREE.SphereGeometry(7.5, 32, 32);
  const fireMat = new THREE.MeshBasicMaterial({
    map: sunTexture,
    color: 0xff9900,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending
  });
  const sunFireMesh = new THREE.Mesh(fireGeo, fireMat);
  sunFireMesh.name = "sun_fire";
  sunMesh.add(sunFireMesh);

  // 2. SISTEMA BINARIO TATOOINE ANIMADO
  const tatooineSystem = createTatooineSystem(scene);

  // 3. GENERACIÓN DE PLANETAS Y SATÉLITES
  PLANET_DATA.forEach((data) => {
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);
  
    const texture = textureLoader.load(data.texture);
    const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
  
    // En planetBuilder.js, al crear el material del planeta:
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      color: data.planetColor || 0xffffff,
      emissive: data.id === "mustafar" ? 0xff2200 : 0x000000, // Hace que Mustafar brille en rojo intenso
      emissiveIntensity: data.id === "mustafar" ? 0.6 : 0,
      bumpMap: texture,
      bumpScale: data.bumpScale || 0.4,
      shininess: data.shininess || 10
    });
  
    const planetMesh = new THREE.Mesh(geometry, material);
    planetMesh.castShadow = true;
    planetMesh.receiveShadow = true;
    planetMesh.userData = { ...data };
    planetMesh.position.x = data.distance;
  
    planetGroup.add(planetMesh);
    planetMeshes.push(planetMesh);

    // 2. Generación de Nubes / Cenizas
    if (data.clouds) {
      const cloudGeo = new THREE.SphereGeometry(data.radius * 1.025, 40, 40);

      let cloudMat;

      if (data.isAshCloud) {
        // Para Mustafar: Ceniza volcánica oscura
        cloudMat = new THREE.MeshStandardMaterial({
          map: txClouds,
          alphaMap: txCloudsAlpha,
          color: 0x111111,
          transparent: true,
          opacity: 0.85,
          side: THREE.DoubleSide,
          depthWrite: false
        });
      } else {
        // Nubes Blancas Brillantes Puras (Naboo, Hoth, etc.)
        cloudMat = new THREE.MeshBasicMaterial({
          map: txCloudsAlpha,          // Usamos el mapa alpha para extraer la forma blanca limpia
          alphaMap: txCloudsAlpha,
          color: 0xffffff,             // Blanco puro
          transparent: true,
          opacity: 0.7,
          blending: THREE.AdditiveBlending, // Suma la luz convirtiendo cualquier borde en blanco brillante
          side: THREE.DoubleSide,
          depthWrite: false
        });
      }

      const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
      cloudMesh.name = `${data.id}_clouds`;
      planetMesh.add(cloudMesh);
    }
      
    // 3. SATÉLITES / LUNAS
    if (data.hasSatellites && data.satellites) {
      data.satellites.forEach((satData) => {
        const satPivot = new THREE.Group();
        planetMesh.add(satPivot);
  
        const satTex = textureLoader.load(satData.texture);
        const satGeo = new THREE.SphereGeometry(satData.radius, 16, 16);
        const satMat = new THREE.MeshPhongMaterial({
          map: satTex,
          color: satData.color || 0xffffff,
          bumpMap: satTex,
          bumpScale: 0.2
        });
        const satMesh = new THREE.Mesh(satGeo, satMat);
        satMesh.position.x = satData.distance;
  
        satPivot.add(satMesh);
        satelliteMeshes.push({ mesh: satMesh, pivot: satPivot, speed: satData.speed });
      });
    }
  
    createOrbitLine(scene, data.distance, data.distance * 1.05);
  });

  return { sunMesh, planetMeshes, satelliteMeshes, tatooineSystem };
}

function createOrbitLine(scene, radiusX, radiusY) {
  const curve = new THREE.EllipseCurve(0, 0, radiusX, radiusY, 0, 2 * Math.PI, false, 0);
  const points = curve.getPoints(100);
  const geometry = new THREE.BufferGeometry().setFromPoints(
    points.map((p) => new THREE.Vector3(p.x, 0, p.y))
  );
  const material = new THREE.LineBasicMaterial({ color: 0x00ffe1, transparent: true, opacity: 0.15 });
  scene.add(new THREE.Line(geometry, material));
}

// Dentro de createTatooineSystem(scene):
function createTatooineSystem(scene) {
  const tatooinePivot = new THREE.Group();
  scene.add(tatooinePivot);

  const tatooineGroup = new THREE.Group();
  tatooineGroup.position.set(-260, 50, -300);
  tatooinePivot.add(tatooineGroup);

  const sunTex = textureLoader.load("src/assets/textures/sun_map.jpg");
  const sunPivot = new THREE.Group();
  tatooineGroup.add(sunPivot);

  // Sol 1 + Capa de Fuego
  const sun1 = new THREE.Mesh(new THREE.SphereGeometry(5, 16, 16), new THREE.MeshBasicMaterial({ map: sunTex, color: 0xffaa00 }));
  const sun1Fire = new THREE.Mesh(new THREE.SphereGeometry(5.4, 16, 16), new THREE.MeshBasicMaterial({ map: sunTex, color: 0xff6600, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending }));
  sun1.add(sun1Fire);
  sun1.position.set(-7, 0, 0);

  // Sol 2 + Capa de Fuego
  const sun2 = new THREE.Mesh(new THREE.SphereGeometry(3.2, 16, 16), new THREE.MeshBasicMaterial({ map: sunTex, color: 0xff3300 }));
  const sun2Fire = new THREE.Mesh(new THREE.SphereGeometry(3.5, 16, 16), new THREE.MeshBasicMaterial({ map: sunTex, color: 0xff1100, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending }));
  sun2.add(sun2Fire);
  sun2.position.set(7, 0, 0);

  sunPivot.add(sun1);
  sunPivot.add(sun2);

  // Tatooine + Capa de Tormenta de Arena
  const tatTex = textureLoader.load("src/assets/textures/tatooine_map.jpg");
  const tatooine = new THREE.Mesh(new THREE.SphereGeometry(3, 24, 24), new THREE.MeshPhongMaterial({ map: tatTex, bumpMap: tatTex, bumpScale: 0.3 }));

  // Dentro de createTatooineSystem(scene), tras definir 'tatooine':
  const tatMoonTex = textureLoader.load("src/assets/textures/endor_moon_map.jpg");

  // Lunas de Tatooine: Ghomrassen, Guermessa y Chenini
  const moonsData = [
    { name: "Ghomrassen", dist: 5.0, radius: 0.25, speed: 0.03, color: 0xd2b48c },
    { name: "Guermessa", dist: 6.5, radius: 0.2, speed: 0.02, color: 0xaaaaaa },
    { name: "Chenini", dist: 8.0, radius: 0.15, speed: 0.015, color: 0x887766 }
  ];

  moonsData.forEach((m) => {
    const pivot = new THREE.Group();
    tatooine.add(pivot);
    const mMesh = new THREE.Mesh(
      new THREE.SphereGeometry(m.radius, 12, 12),
      new THREE.MeshPhongMaterial({ map: tatMoonTex, color: m.color })
    );
    mMesh.position.x = m.dist;
    pivot.add(mMesh);
  });
    
  // Capa de tormenta de arena
  const sandStormGeo = new THREE.SphereGeometry(3.08, 24, 24);
  const sandStormMat = new THREE.MeshPhongMaterial({
    map: textureLoader.load("src/assets/textures/endor_moon_map.jpg"),
    color: 0xd2b48c, // Tono arena / café claro
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
  });
  const sandStormMesh = new THREE.Mesh(sandStormGeo, sandStormMat);
  sandStormMesh.name = "tatooine_sandstorm";
  tatooine.add(sandStormMesh);

  tatooine.position.set(0, -15, 12);
  tatooineGroup.add(tatooine);

  return { tatooinePivot, tatooineGroup, sunPivot, tatooine };
}