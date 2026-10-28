import * as THREE from "three";
import { PLANET_DATA } from "../config/planetData.js";
import sunTextureImg from '../assets/textures/sun_map.jpg';
import txCloudsImg from '../assets/textures/earthcloudmaptrans.jpg';
import txCloudsAlphaImg from '../assets/textures/earthcloudmaptrans_invert.jpg';
import tatooineTextureImg from '../assets/textures/tatooine_map.jpg';
import tatooineMoonTextureImg from '../assets/textures/endor_moon_map.jpg';
import endorMoonTextureImg from '../assets/textures/endor_moon_map.jpg';

const textureLoader = new THREE.TextureLoader();

export function createSolarSystem(scene) {
  const planetMeshes = [];
  const satelliteMeshes = [];

  const sunTexture = textureLoader.load(sunTextureImg);
  const sunGeo = new THREE.SphereGeometry(7, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({ map: sunTexture });
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  const txClouds = textureLoader.load(txCloudsImg);
  const txCloudsAlpha = textureLoader.load(txCloudsAlphaImg);
  sunMesh.name = "Sol Central";
  scene.add(sunMesh);

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

  const tatooineSystem = createTatooineSystem(scene);

  PLANET_DATA.forEach((data) => {
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);
  
    const texture = textureLoader.load(data.texture);
    const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
 
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      color: data.planetColor || 0xffffff,
      emissive: data.id === "mustafar" ? 0xff2200 : 0x000000,
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

    if (data.clouds) {
      const cloudGeo = new THREE.SphereGeometry(data.radius * 1.025, 40, 40);

      let cloudMat;

      if (data.isAshCloud) {
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
        cloudMat = new THREE.MeshBasicMaterial({
          map: txCloudsAlpha,          
          alphaMap: txCloudsAlpha,
          color: 0xffffff,             
          transparent: true,
          opacity: 0.7,
          blending: THREE.AdditiveBlending, 
          side: THREE.DoubleSide,
          depthWrite: false
        });
      }

      const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
      cloudMesh.name = `${data.id}_clouds`;
      planetMesh.add(cloudMesh);
    }

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

function createTatooineSystem(scene) {
  const tatooinePivot = new THREE.Group();
  scene.add(tatooinePivot);

  const tatooineGroup = new THREE.Group();
  tatooineGroup.position.set(-260, 50, -300);
  tatooinePivot.add(tatooineGroup);

  const sunTex = textureLoader.load(sunTextureImg);
  const sunPivot = new THREE.Group();
  tatooineGroup.add(sunPivot);

  const sun1 = new THREE.Mesh(new THREE.SphereGeometry(5, 16, 16), new THREE.MeshBasicMaterial({ map: sunTex, color: 0xffaa00 }));
  const sun1Fire = new THREE.Mesh(new THREE.SphereGeometry(5.4, 16, 16), new THREE.MeshBasicMaterial({ map: sunTex, color: 0xff6600, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending }));
  sun1.add(sun1Fire);
  sun1.position.set(-7, 0, 0);

  const sun2 = new THREE.Mesh(new THREE.SphereGeometry(3.2, 16, 16), new THREE.MeshBasicMaterial({ map: sunTex, color: 0xff3300 }));
  const sun2Fire = new THREE.Mesh(new THREE.SphereGeometry(3.5, 16, 16), new THREE.MeshBasicMaterial({ map: sunTex, color: 0xff1100, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending }));
  sun2.add(sun2Fire);
  sun2.position.set(7, 0, 0);

  sunPivot.add(sun1);
  sunPivot.add(sun2);

  const tatTex = textureLoader.load(tatooineTextureImg);
  const tatooine = new THREE.Mesh(new THREE.SphereGeometry(3, 24, 24), new THREE.MeshPhongMaterial({ map: tatTex, bumpMap: tatTex, bumpScale: 0.3 }));

  const tatMoonTex = textureLoader.load(tatooineMoonTextureImg);

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

  const sandStormGeo = new THREE.SphereGeometry(3.08, 24, 24);
  const sandStormMat = new THREE.MeshPhongMaterial({
    map: textureLoader.load(endorMoonTextureImg),
    color: 0xd2b48c,
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