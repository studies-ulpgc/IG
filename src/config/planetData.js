import nabooTextureImg from '../assets/textures/naboo_map.jpg';
import mustafarTextureImg from '../assets/textures/mustafar_map.jpg';
import hothTextureImg from '../assets/textures/hoth_map.jpg';
import coruscantTextureImg from '../assets/textures/coruscant_map.jpg';
import endorTextureImg from '../assets/textures/endor_map.jpg';
import bespinTextureImg from '../assets/textures/bespin_map.jpg';
import endorMoonTextureImg from '../assets/textures/endor_moon_map.jpg';
import ohmaDunTextureImg from '../assets/textures/endor_moon_map.jpg';
import verunaTextureImg from '../assets/textures/endor_moon_map.jpg';
import roriTextureImg from '../assets/textures/endor_moon_map.jpg';
import jetbaTextureImg from '../assets/textures/endor_moon_map.jpg';
import lefraniTextureImg from '../assets/textures/endor_moon_map.jpg';
import centax1TextureImg from '../assets/textures/endor_moon_map.jpg';
import centax2TextureImg from '../assets/textures/endor_moon_map.jpg';
import centax3TextureImg from '../assets/textures/endor_moon_map.jpg';
import hesperidiumTextureImg from '../assets/textures/endor_moon_map.jpg';
import hratthTextureImg from '../assets/textures/endor_moon_map.jpg'; 
import miserTextureImg from '../assets/textures/endor_moon_map.jpg';
import bSub1TextureImg from '../assets/textures/endor_moon_map.jpg';
import bSub2TextureImg from '../assets/textures/endor_moon_map.jpg';
import bSub3TextureImg from '../assets/textures/endor_moon_map.jpg';  

export const PLANET_DATA = [
  {
    id: "naboo",
    name: "Naboo",
    region: "Borde Medio",
    climate: "Templado / Acuático",
    lore: "Mundo próspero y pacífico con vastos océanos, llanuras y ciudades bajo el agua.",
    radius: 2.2,
    distance: 25,
    speed: 0.8,
    texture: nabooTextureImg,
    clouds: true,
    cloudTexture: endorMoonTextureImg,
    cloudOpacity: 0.35, 
    hasSatellites: true,
    satellites: [
      { id: "ohma-dun", name: "Ohma-D'un", radius: 0.25, distance: 3.2, speed: 2.0, texture: endorMoonTextureImg, color: 0x44aaff },
      { id: "veruna", name: "Veruna", radius: 0.2, distance: 4.2, speed: 1.5, texture: endorMoonTextureImg, color: 0xcccccc },
      { id: "rori", name: "Rori", radius: 0.22, distance: 5.2, speed: 1.2, texture: endorMoonTextureImg, color: 0x88aa88 }
    ]
  },
  {
    id: "mustafar",
    name: "Mustafar",
    region: "Borde Exterior",
    climate: "Volcánico / Ceniza",
    lore: "Un planeta minúsculo y candente dominado por ríos de lava y densa ceniza volcánica.",
    radius: 1.6,
    distance: 38,
    speed: 0.5,
    texture: mustafarTextureImg,
    bumpScale: 2.5,
    planetColor: 0xff2200, 
    clouds: true,
    cloudTexture: endorMoonTextureImg,
    isAshCloud: true, 
    hasSatellites: true,
    satellites: [
      { id: "jetba", name: "Jetba", radius: 0.18, distance: 2.8, speed: 2.2, texture: endorMoonTextureImg, color: 0x553333 },
      { id: "lefrani", name: "Lefrani", radius: 0.15, distance: 3.6, speed: 1.8, texture: endorMoonTextureImg, color: 0x444444 }
    ]
  },
  {
    id: "hoth",
    name: "Hoth",
    region: "Borde Exterior",
    climate: "Glacial / Helado",
    lore: "Mundo desértico de hielo y nieve en temperaturas extremas.",
    radius: 1.9,
    distance: 52,
    speed: 0.35,
    texture: hothTextureImg,
    shininess: 80,
    clouds: true,
    cloudTexture: endorMoonTextureImg,
    cloudOpacity: 0.4,
    hasSatellites: false
  },
  {
    id: "coruscant",
    name: "Coruscant",
    region: "Núcleo Galáctico",
    climate: "Controlado Artificialmente",
    lore: "Planeta-ciudad ecumenópolis y centro político de la galaxia.",
    radius: 2.5,
    distance: 68,
    speed: 0.25,
    texture: coruscantTextureImg,
    hasSatellites: true,
    satellites: [
      { id: "c-moon1", name: "Centax-1", radius: 0.3, distance: 3.5, speed: 2.5, texture: endorMoonTextureImg, color: 0x8b5a2b },
      { id: "c-moon2", name: "Centax-2", radius: 0.25, distance: 4.8, speed: 2.0, texture: endorMoonTextureImg, color: 0xaaaaaa },
      { id: "c-moon3", name: "Centax-3", radius: 0.2, distance: 6.0, speed: 1.5, texture: endorMoonTextureImg, color: 0x666666 },
      { id: "c-moon4", name: "Hesperidium", radius: 0.35, distance: 7.5, speed: 1.0, texture: endorMoonTextureImg, color: 0x333333 }
    ]
  },
  {
    id: "endor",
    name: "Endor (Gigante Gaseoso)",
    region: "Borde Exterior",
    climate: "Gaseoso",
    lore: "Gigante gaseoso que da nombre al sistema.",
    radius: 3.2,
    distance: 88,
    speed: 0.18,
    texture: endorTextureImg,
    hasSatellites: true,
    satellites: [
      { id: "endor-moon", name: "Luna Forestal", radius: 0.6, distance: 5.0, speed: 2.0, texture: endorMoonTextureImg }
    ]
  },
  {
    id: "bespin",
    name: "Bespin",
    region: "Borde Exterior",
    climate: "Gaseoso / Nubes",
    lore: "Gigante gaseoso célebre por la Ciudad de las Nubes.",
    radius: 3.8,
    distance: 110,
    speed: 0.12,
    texture: bespinTextureImg,
    hasSatellites: true,
    satellites: [
      { id: "hratth", name: "H'ratth", radius: 0.3, distance: 5.0, speed: 1.8, texture: endorMoonTextureImg, color: 0xddccaa },
      { id: "miser", name: "Miser", radius: 0.25, distance: 6.2, speed: 1.4, texture: endorMoonTextureImg, color: 0x99aabb },
      { id: "b-sub1", name: "Luna Menor Alpha", radius: 0.08, distance: 7.0, speed: 3.0, texture: endorMoonTextureImg, color: 0x888888 },
      { id: "b-sub2", name: "Luna Menor Beta", radius: 0.09, distance: 7.5, speed: 2.7, texture: endorMoonTextureImg, color: 0xaaaaaa },
      { id: "b-sub3", name: "Luna Menor Gamma", radius: 0.07, distance: 8.1, speed: 2.3, texture: endorMoonTextureImg, color: 0x666666 }
    ]
  }
];