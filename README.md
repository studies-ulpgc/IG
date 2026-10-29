<div align="center">

<img src="readme_media/assets/ulpgc.svg" alt="Escudo ULPGC" width="160" />

### UNIVERSIDAD DE LAS PALMAS DE GRAN CANARIA
**Grado en Ingeniería Informática — Asignatura: Informática Gráfica**  
*Curso Académico 2026/2027*

---

<!-- Título Principal Estilo Star Wars -->
<h1 style="color: #FFE81F; font-size: 2.2rem; font-weight: bold; letter-spacing: 4px; text-shadow: 0 0 12px rgba(255, 232, 31, 0.6);">
  SISTEMA GALÁCTICO INTERACTIVO STAR WARS
</h1>

<h3 style="color: #00FFE1; font-size: 1.1rem; letter-spacing: 2px;">
  Desarrollado por: <a href="https://github.com/tu-usuario" style="color: #00FFE1; text-decoration: none; font-weight: bold;">Dácil Santana Ortega</a>
</h3>

![Three.js](https://img.shields.io/badge/Three.js-v0.152.1-yellow?style=flat-square&logo=three.js)
![Parcel](https://img.shields.io/badge/Empaquetador-Parcel_v1.6-blue?style=flat-square)
![Estado](https://img.shields.io/badge/Estado-Completado_100%25-brightgreen?style=flat-square)

---

</div>

## Índice de Contenidos

1. [Resumen del Proyecto](#1-resumen-del-proyecto)
2. [Componentes del Sistema Galáctico](#2-componentes-del-sistema-gal%C3%A1ctico)
3. [Demostraciones en Vídeo y Funcionalidades](#3-demostraciones-en-v%C3%ADdeo-y-funcionalidades)
   - [3.1. Vista General y Control de Rejilla](#31-vista-general-y-control-de-rejilla)
   - [3.2. Paneles Informativos y Navegación entre Astros](#32-paneles-informativos-y-navegaci%C3%B3n-entre-astros)
   - [3.3. Mecánica de Destrucción con la Estrella de la Muerte](#33-mec%C3%A1nica-de-destrucci%C3%B3n-con-la-estrella-de-la-muerte)
   - [3.4. Variante Estacional: Estrella de la Muerte II](#34-variante-estacional-estrella-de-la-muerte-ii)
   - [3.5. Gestión y Restauración de Planetas](#35-gesti%C3%B3n-y-restauraci%C3%B3n-de-planetas)
   - [3.6. Navegación en Modo Nave X-Wing y Sistema de Proximidad](#36-navegaci%C3%B3n-en-modo-nave-x-wing-y-sistema-de-proximidad)
4. [Análisis Técnico de Texturas y Capas Gráficas](#4-an%C3%A1lisis-t%C3%A9cnico-de-texturas-y-capas-gr%C3%A1ficas)
5. [Arquitectura del Proyecto y Comparativa Académica](#5-arquitectura-del-proyecto-y-comparativa-acad%C3%A9mica)
6. [Bibliografía, Fuentes y Colaboradores](#6-bibliograf%C3%ADa-fuentes-y-colaboradores)

---

## 1. Resumen del Proyecto

El presente proyecto consiste en la creación de un **sistema galáctico tridimensional interactivo** ambientado en el universo de *Star Wars*, desarrollado mediante la biblioteca **Three.js** e integrado en un entorno web ejecutable en tiempo real.

La aplicación combina modelado astronómico con mecánicas de simulación interactiva. Permite explorar un sistema planetario completo compuesto por una estrella central, seis planetas principales con sus respectivos satélites, un sistema binario independiente (Tatooine con dos soles y tres lunas) y la estación espacial imperial **Estrella de la Muerte** en dos eras distintas (Episodio IV y Episodio VI).

Todo el código ha sido estructurado siguiendo criterios de modularidad, optimización del bucle de animación e interacción mediante intersección de rayos (*raycasting*) y control cinemático de cámara.

---

## 2. Componentes del Sistema Galáctico

En la siguiente tabla se detallan los elementos gráficos y modelos tridimensionales que conforman la escena:

| Categoría | Elementos | Ubicación y Detalles Técnicos |
| :--- | :--- | :--- |
| **Estrella Central** | Sol Central | Centro de coordenadas `(0,0,0)` con capa interna de plasma y malla externa de fuego solar con mezcla aditiva. |
| **Planetas Principales** | Naboo, Mustafar, Hoth, Coruscant, Endor y Bespin | Cuerpos orbitales elípticos con materiales Phong, mapas de rugosidad (*bump mapping*) y capas de nubes dinámicas. |
| **Satélites / Lunas** | 18 lunas distribuidas entre los planetas | Mallas jerárquicas vinculadas a los pivotes de los planetas, con trazado visual de sus órbitas en pantalla. |
| **Sistema Binario** | Tatooine (2 Soles + 3 Lunas) | Ubicado en coordenadas remotas `(-260, 50, -300)` con rotación propia, tormenta de arena y sistema solar doble. |
| **Modelos 3D GLTF** | Estrella de la Muerte (Ep. IV / Ep. VI), Caza X-Wing y R2-D2 | Archivos `.glb` cargados dinámicamente mediante `GLTFLoader` desde la carpeta `3D_models/`[^1]. |
| **Sistemas de Interfaz** | Datapad Horizontal, Modal de Ayuda y Visor R2-D2 | Paneles HTML/CSS superpuestos con un renderizador secundario e independiente para el visor en vivo del androide. |

---

## 3. Demostraciones en Vídeo y Funcionalidades

En esta sección se presentan los vídeos demostrativos de la aplicación, estructurados por módulos funcionales. 

> **Nota sobre el audio:** Los vídeos que incluyen sonido relevante (efectos sonoros del androide R2-D2 y secuencia del superláser) vienen indicados expresamente.

---

### 3.1. Vista General y Control de Rejilla

En este modo de visualización, la cámara orbita libremente alrededor del centro del sistema galáctico mediante controles orbitales interactivos.

https://github.com/user-attachments/assets/3ecd90e3-5b56-4661-a736-08bba8085819



**Funcionalidades mostradas:**
- **Control orbital libre:** Rotación de cámara en 360°, desplazamiento panorámico y zoom mediante el ratón.
- **Conmutación de rejilla:** Activación y desactivación en tiempo real del asistente plano (*GridHelper*) desde el botón "Rejilla" del Datapad.
- **Movimiento orbital:** Traslación elíptica continua e independiente de todos los planetas y satélites.

---

### 3.2. Paneles Informativos y Navegación entre Astros

Al seleccionar cualquier cuerpo celeste con el puntero, se activa el sistema de navegación informativa.

> [!NOTE]
> **Vídeo con audio:** Incluye sonidos originales del androide R2-D2 al seleccionar o conmutar de planeta.

<video src="readme_media/demos/02_paneles_informacion.mp4" controls width="100%"></video>

**Funcionalidades mostradas:**
- **Barra flotante de resumen:** Muestra el nombre del planeta seleccionado con opciones rápidas de acción.
- **Ficha técnica detallada ("Más Info"):** Despliega el panel lateral con Lore, Región y Clima del astro, desplazando la barra de resumen para no superponer interfaces.
- **Visor 3D en vivo de R2-D2:** Renderizado secundario e interactivo del androide en la esquina de la tarjeta informativa.
- **Navegación secuencial:** Uso de las flechas (`<` y `>`) tanto en la barra flotante como dentro de la propia ficha técnica para saltar directamente entre planetas manteniendo el nivel de detalle seleccionado.

---

### 3.3. Mecánica de Destrucción con la Estrella de la Muerte

Muestra la interacción por proyección de rayos (*raycasting*) para identificar objetivos y desencadenar la secuencia de disparo de la estación espacial.

> [!NOTE]
> **Vídeo con audio:** Contiene los efectos sonoros del disparo del superláser y la detonación del astro.

<video src="readme_media/demos/03_destruccion_estrella_muerte.mp4" controls width="100%"></video>

**Funcionalidades mostradas:**
- **Inmovilización del objetivo:** Al iniciar la secuencia de disparo, el planeta congelará inmediatamente su movimiento de traslación en el espacio para permitir el impacto directo del rayo.
- **Identificación de objetivos destructibles:** Los seis planetas principales permiten la orden de disparo tanto desde la barra de resumen como desde la ficha detallada.
- **Protección de astros especiales:** Objetos como el Sol Central, Tatooine o la propia Estrella de la Muerte muestran su información técnica pero deshabilitan automáticamente el botón de disparo.

---

### 3.4. Variante Estacional: Estrella de la Muerte II

Demostración de la conmutación de modelos tridimensionales en tiempo real para representar la estación espacial en su fase de construcción (Episodio VI).

<video src="readme_media/demos/06_estrella_muerte_2.mp4" controls width="100%"></video>

**Funcionalidades mostradas:**
- **Intercambio dinámico de geometrías:** Sustitución asíncrona del modelo `.glb` de la Estrella de la Muerte por el modelo de la Estrella de la Muerte II sin reiniciar la escena.
- **Mantenimiento de la jerarquía de colisiones:** Conservación de los puntos de pivote del superláser y la lógica de proyección de rayos para los disparos tácticos.

---

### 3.5. Gestión y Restauración de Planetas

Demostración de la gestión de inventario de astros tras ser eliminados de la escena.

<video src="readme_media/demos/04_restauracion_planetas.mp4" controls width="100%"></video>

**Funcionalidades mostradas:**
- **Desplegable dinámico:** La lista de selección "Restaurar Planeta" en el Datapad se actualiza automáticamente añadiendo solo los planetas que hayan sido destruidos.
- **Restauración individual:** Selección y recuperación de un planeta específico, devolviéndolo a su órbita con su visibilidad y movimiento reactivados.
- **Restauración global:** Botón "Restaurar Todos" que regenera simultáneamente la totalidad de los planetas destruidos del sistema galáctico.

---

### 3.6. Navegación en Modo Nave X-Wing y Sistema de Proximidad

Cambio de perspectiva hacia la vista subjetiva en tercera persona para pilotar la caza X-Wing por el espacio tridimensional.

<video src="readme_media/demos/05_modo_xwing_proximidad.mp4" controls width="100%"></video>

**Funcionalidades mostradas:**
- **Panel de Ayuda (`?`):** Ventana emergente (*modal*) con la guía completa de controles de vuelo (W, A, S, D, Q, E).
- **Control cinemático:** Movimiento libre en 6 grados de libertad con seguimiento suave de la cámara tras la nave.
- **Aviso táctico de proximidad (*HUD*):** Sistema de detección por distancia 3D en tiempo real. Muestra `ACERCÁNDOSE A: PLANETA` en espacio abierto, y conmuta al nombre específico en cuanto la nave entra en el radio de detección de cualquier planeta, del Sol Central, de Tatooine o de la Estrella de la Muerte.
- **Ocultación automática:** El indicador HUD se oculta inmediatamente si el usuario regresa a la Vista General (Órbita).

---

## 4. Análisis Técnico de Texturas y Capas Gráficas

En esta sección se analiza en detalle la configuración gráfica de los astros del sistema, haciendo uso de bucles animados cortos (GIFs) para apreciar las propiedades ópticas, mapas de relieve y capas atmosféricas.

---

### 4.1. Configuración de Materiales e Iluminación

Todos los planetas del sistema utilizan el material `MeshPhongMaterial` para reaccionar a la iluminación de la escena (simulada mediante fuentes direccionales y ambientales). Se han aplicado diferentes mapas gráficos para lograr un acabado realista:

- **Mapas de color/difusos (`map`):** Aportan la textura base en alta definición de la superficie planetaria.
- **Mapas de rugosidad (*bump mapping*, `bumpMap`):** Simulan el relieve tridimensional de cordilleras y cráteres mediante el cálculo de normales, controlado minuciosamente con la propiedad `bumpScale`.
- **Efecto de emisión térmica (`emissive`):** Aplicado en la superficie de Mustafar con una intensidad de `0.6` para reflejar el calor de la lava sin depender únicamente de las luces externas.

---

### 4.2. Galería Técnica de Astros y Capas Atmosféricas

A continuación se detallan las características visuales específicas de los cuerpos celestes más representativos:

<div align="center">

| astro / Planeta | Vista en Detalle | Configuración Técnica de Capas y Materiales |
| :--- | :---: | :--- |
| **Sol Central y Fuego Solar** | <img src="readme_media/shorts/01_sol.gif" width="220" /> | Malla central con textura básica combinada con una segunda esfera concéntrica exterior (`sun_fire`) animada en rotación inversa con transparencia aditiva (`AdditiveBlending`). |
| **Naboo (Planeta + Lunas)** | <img src="readme_media/shorts/02_naboo.gif" width="220" /> | Superficie con tonos acuáticos, capa de nubes translúcidas (`opacity: 0.35`) y tres satélites en órbitas independientes con sus líneas orbitales trazadas. |
| **Mustafar (Mundo Volcánico)** | <img src="readme_media/shorts/03_mustafar.gif" width="220" /> | Elevado mapa de rugosidad (`bumpScale: 2.5`), emisión de luz roja en la textura base y una capa especial de **ceniza volcánica** con material `MeshStandardMaterial` de tono oscuro. |
| **Hoth (Glacial)** | <img src="readme_media/shorts/04_hoth.gif" width="220" /> | Material de alto brillo especular (`shininess: 80`) para simular la reflexión sobre el hielo y nubes tenues de nieve. |
| **Sistema Binario Tatooine** | <img src="readme_media/shorts/05_tatooine.gif" width="220" /> | Sistema remoto con dos soles (amarillo y rojo), tres lunas en órbita y una capa superior en rotación que simula una **tormenta de arena** global. |

</div>

---

### 4.3. Estrategia de Optimización de Capas de Nubes y Comparativa Técnica

Durante las sesiones prácticas de la asignatura, se estudiaron modelos completos como la recreación de la Tierra mediante el uso de hasta **5 mapas de texturas simultáneos** (mapa base, *bumpMap*, mapa especular *specularMap*, mapa de nubes y mapa de transparencia *alphaMap*). 

Para este proyecto se optó por un enfoque de **optimización de rendimiento y eficiencia en tiempo de ejecución**:

1. **Reutilización inteligente de mapas de transparencia:** En lugar de cargar múltiples archivos de imagen de gran tamaño para cada planeta, se reutilizó una misma textura de mapa alfanumérico de nubes (`earthcloudmaptrans_invert.jpg`) en Naboo, Mustafar y Hoth.
2. **Diferenciación mediante propiedades de material:** Variando el color base (`color`), la opacidad (`opacity`) y el modo de mezcla (*blend mode*), se obtuvieron resultados visuales completamente distintos manteniendo un consumo de memoria GPU mínimo:
   - **Naboo:** Nubes blancas tenues con `AdditiveBlending` para fusionarse suavemente con el océano.
   - **Mustafar:** Nubes de ceniza oscurecidas (`color: 0x111111`) y opacas (`opacity: 0.85`) para simular contaminación volcánica.
   - **Hoth:** Capa de tormenta de nieve con densidad intermedia (`opacity: 0.4`).
3. **Pivotes jerárquicos para el movimiento solidario:** Las capas atmosféricas se instancian como hijas (`.add()`) de la malla principal del planeta. Esto garantiza que la rotación diferencial de las nubes sume la velocidad del planeta sin requerir cálculos de coordenadas manuales en cada fotograma.

---

## 5. Arquitectura del Proyecto y Comparativa Académica

En esta sección se detalla la estructura modular de archivos del proyecto y se analiza la evolución técnica respecto a las plantillas y scripts de ejemplo proporcionados durante las clases prácticas de la asignatura.

---

### 5.1. Estructura de Módulos y Organización de Archivos

Para garantizar la escalabilidad y facilitar el mantenimiento del código, la aplicación se ha organizado de forma modular, separando la lógica de renderizado, la construcción geométrica, la física de interacción y los componentes de interfaz:

<pre><code><b>IG_Semana_6_7/</b>
├── <a href="./3D_models/">3D_models/</a>                    # Archivos de modelos tridimensionales (.glb)
│   ├── <a href="./3D_models/Death_Star.glb">Death_Star.glb</a>            # Modelo de la Estrella de la Muerte (Episodio IV)
│   ├── <a href="./3D_models/Death_Star_II.glb">Death_Star_II.glb</a>         # Modelo de la Estrella de la Muerte (Episodio VI)
│   ├── <a href="./3D_models/XWing.glb">XWing.glb</a>                 # Modelo de la caza estelar X-Wing
│   └── <a href="./3D_models/R2D2.glb">R2D2.glb</a>                  # Modelo del androide R2-D2 para el visor secundario
├── <a href="./readme_media/">readme_media/</a>                 # Archivos multimedia para la documentación
│   ├── <a href="./readme_media/assets/">assets/</a>                   # Recursos estáticos (escudo ULPGC)
│   ├── <a href="./readme_media/demos/">demos/</a>                    # Vídeos demostrativos en alta definición
│   └── <a href="./readme_media/shorts/">shorts/</a>                   # Bucles animados cortos (GIFs) de astros y texturas
├── <a href="./src/">src/</a>                          # Código fuente principal de la aplicación
│   ├── <a href="./src/assets/textures/">assets/textures/</a>          # Mapas de textura de superficies, soles y nubes
│   ├── <a href="./src/config/">config/</a>
│   │   └── <a href="./src/config/planetData.js">planetData.js</a>         # Configuración JSON con la física y datos de cada planeta
│   ├── <a href="./src/modules/">modules/</a>
│   │   ├── <a href="./src/modules/controlsManager.js">controlsManager.js</a>    # Controlador de modos de cámara (Órbita y Nave X-Wing)
│   │   ├── <a href="./src/modules/deathStar.js">deathStar.js</a>          # Gestión de Eras Imperiales y animación del superláser
│   │   ├── <a href="./src/modules/modelLoader.js">modelLoader.js</a>        # Carga asíncrona de modelos GLTF mediante GLTFLoader
│   │   ├── <a href="./src/modules/planetBuilder.js">planetBuilder.js</a>      # Creación de geometrías, materiales y trazado de órbitas
│   │   ├── <a href="./src/modules/r2d2Viewer.js">r2d2Viewer.js</a>         # Renderizador auxiliar independiente para la vista de R2-D2
│   │   ├── <a href="./src/modules/raycasterManager.js">raycasterManager.js</a>   # Lógica de selección con ratón, pop-ups y HUD táctico
│   │   └── <a href="./src/modules/sceneSetup.js">sceneSetup.js</a>         # Configuración base de Escena, Cámara, Renderer y Rejilla
│   ├── <a href="./src/index.html">index.html</a>                # Estructura del DOM, botones, Datapad y modales
│   ├── <a href="./src/main.js">main.js</a>                   # Módulo principal y bucle de animación (animationLoop)
│   └── <a href="./src/styles.css">styles.css</a>                # Estilos del Datapad, HUD, modales y botones sci-fi
├── <a href="./package.json">package.json</a>                  # Dependencias del proyecto (Three.js v0.152.1)
└── <a href="./README.md">README.md</a>                     # Documentación técnica principal del proyecto
</code></pre>

---

### 5.2. Scripts de Clase y Entornos CodeSandbox

A continuación se muestra la correspondencia técnica entre los conceptos enseñados en los entornos de prueba del profesor Modesto Castrillón ([`otsedom`](https://github.com/otsedom)) y su implementación evolucionada en este proyecto:

- **Entorno CodeSandbox Semana 6:** [ig-s6-xtdjrm](https://codesandbox.io/p/sandbox/ig-s6-xtdjrm)
- **Entorno CodeSandbox Semana 7:** [ig-s7-36r8mq](https://codesandbox.io/p/sandbox/ig-s7-36r8mq?file=%2Fsrc%2Findex.html)

| Script de Referencia | Concepto Académico Base | Implementación Avanzada en el Proyecto |
| :--- | :--- | :--- |
| **`script01` / `script02`** | Creación de grafo de escena (`Scene`), cámara perspectiva, reproductor `WebGLRenderer` y geometrías primitivas (`BoxGeometry`, `SphereGeometry`). | Estructurado de forma limpia dentro del módulo `sceneSetup.js`, configurando sombras, renderizado responsivo y ajuste automático de aspecto de pantalla. |
| **`script03` / `script04`** | Asistente de referencia espacial `GridHelper` y control de visibilidad en tiempo real mediante eventos DOM de botones (`addEventListener`). | Integrado en el Datapad horizontal mediante el botón "Rejilla", permitiendo conmutar la visibilidad espacial sin interrumpir la animación. |
| **`script06` / `script07`** | Traslación orbital elíptica basada en funciones trigonométricas (`Math.cos` / `Math.sin`) combinadas con la marca de tiempo `timestamp`. | Aplicado en `main.js` dentro del bucle principal `animationLoop()` para la traslación independiente de todos los planetas con parámetros de velocidad personalizados. |
| **`script07`** | Jerarquía de transformación padre-hijo mediante pivotes (`Object3D`) para órbitas de satélites y trazado de trayectorias con `EllipseCurve` y `Line`. | Implementado en `planetBuilder.js` creando grupos pivote para las 18 lunas, añadiendo además la función `createSatelliteOrbitLine` con bucles de líneas (`LineLoop`) transparentes. |
| **`script08`** | Detección de clics en la escena mediante proyección de rayos (`Raycaster`) y conversión de coordenadas del puntero del ratón a espacio normalizado. | Módulo `raycasterManager.js` completo que gestiona la selección precisa de planetas, soles, Tatooine y la Estrella de la Muerte en movimiento, evitando falsos clics al arrastrar la cámara. |
| **`script11` / `script12`** | Iluminación de escena (`AmbientLight`, `DirectionalLight`), materiales con respuesta a la luz (`MeshPhongMaterial`) y sombras (`castShadow` / `receiveShadow`). | Combinación de fuentes de luz direccionables con sombras proyectadas en los modelos de las naves y materiales con mapas de rugosidad (`bumpMap`) y brillo especular (`shininess`). |
| **`script13` / `script15`** | Carga de texturas con `TextureLoader`, capas de nubes concéntricas con mapas de opacidad (`alphaMap`) y transparencia aditiva (`AdditiveBlending`). | Utilizado en los 6 planetas principales y en el Sol Central, optimizando la carga en memoria al reutilizar capas atmosféricas con distintas tonalidades y opacidades. |
| **`script16`** | Control cinemático de cámara en primera persona / vuelo (`FlyControls`) con actualización mediante diferencia de tiempo *delta* (`clock.getDelta()`). | Desarrollo de un controlador personalizado (`CameraController`) en `controlsManager.js` que simula la física de vuelo de la caza X-Wing en 6 grados de libertad con seguimiento suave de cámara. |

---

## 6. Bibliografía, Fuentes y Colaboradores

---

### 6.1. Bibliografía y Referencias Académicas

1. **Documentación Oficial de Three.js:** [https://threejs.org/docs/](https://threejs.org/docs/)
2. **Repositorios del Profesor Modesto Castrillón (`otsedom`):**
   - Perfil oficial en GitHub: [https://github.com/otsedom](https://github.com/otsedom)
   - Ejemplos prácticos en CodeSandbox: [Semana 6](https://codesandbox.io/p/sandbox/ig-s6-xtdjrm) y [Semana 7](https://codesandbox.io/p/sandbox/ig-s7-36r8mq)
3. **Discover Three.js:** [https://discoverthreejs.com/](https://discoverthreejs.com/) — Patrones de diseño gráficos en WebGL.
4. **Learning Three.js (Jos Dirksen):** Referencia sobre iluminación, materiales Phong y mapas de sombras.

---

### 6.2. Fuentes de Texturas y Recursos Gráficos

Las texturas utilizadas han sido obtenidas de repositorios artísticos públicos y de las plantillas de la asignatura:

| Recurso / Planeta | Autor / Fuente | Enlace Directo |
| :--- | :--- | :--- |
| **Naboo** | Reesecandy2003 | [DeviantArt - Map of Naboo](https://www.deviantart.com/reesecandy2003/art/Map-of-Naboo-Star-Wars-1001555183) |
| **Mustafar** | greaterhtrae | [DeviantArt - Mustafar Map 2K](https://www.deviantart.com/greaterhtrae/art/Mustafar-map-2k-1087686644) |
| **Coruscant** | greaterhtrae | [DeviantArt - Coruscant City Lights 2K](https://www.deviantart.com/greaterhtrae/art/Coruscant-map-City-Lights-2k-1087697835) |
| **Hoth** | Reesecandy2003 | [DeviantArt - Map of Hoth](https://www.deviantart.com/reesecandy2003/art/Map-of-Hoth-%28Star-Wars%29-1001555236) |
| **Endor** | Reesecandy2003 | [DeviantArt - Map of Endor Moon](https://www.deviantart.com/reesecandy2003/art/Map-of-Endor-%28Moon%29-%28Star-Wars%29-1001554108) |
| **Bespin** | Reesecandy2003 | [DeviantArt - Map of Bespin](https://www.deviantart.com/reesecandy2003/art/Map-of-Bespin-%28Star-Wars%29-988396898) |
| **Tatooine** | Ian Vicknair | [ArtStation - Tatooine Planet Pack](https://www.artstation.com/marketplace/p/BADM/tatooine-planet-environment-pack-21k-maps-hdri-psd-unreal-sky-setups) |
| **Sol Central** | SolarSystemScope | [Wikimedia Commons - Texture 8K Sun](https://commons.wikimedia.org/wiki/File:Solarsystemscope_texture_8k_sun.jpg) |
| **Lunas / Satélites** | SolarSystemScope | [Wikimedia Commons - Texture 8K Moon](https://commons.wikimedia.org/wiki/File:Solarsystemscope_texture_8k_moon.jpg) |

---

### 6.3. Modelos Tridimensionales (`.glb` / `.gltf`)

Los modelos estelares han sido seleccionados desde [Sketchfab](https://sketchfab.com/feed) buscando optimización geométrica y licencias no comerciales:

| Modelo 3D | Archivo Local | Creador / Autor | Enlace en Sketchfab |
| :--- | :--- | :--- | :--- |
| **Estrella de la Muerte (Ep. IV)** | [`Death_Star.glb`](./3D_models/Death_Star.glb) | SebastianSosnowski | [Sketchfab - Death Star](https://sketchfab.com/3d-models/death-star-star-wars-3d5f01485e9e4e8b9d995d7764341afe) |
| **Estrella de la Muerte II (Ep. VI)** | [`Death_Star_II.glb`](./3D_models/Death_Star_II.glb) | N8 | [Sketchfab - Death Star II](https://sketchfab.com/3d-models/death-star-ii-17ccca0dbb6b4e338fa999202f9e6685) |
| **Caza Estelar X-Wing** | [`XWing.glb`](./3D_models/XWing.glb) | Heataker | [Sketchfab - Star Wars X-Wing Fighter](https://sketchfab.com/3d-models/star-wars-x-wing-fighter-e6b85951f85940c1b26505eda7d73ef9) |
| **Androide R2-D2** | [`R2D2.glb`](./3D_models/R2D2.glb) | Eduardo Oliveira | [Sketchfab - R2D2](https://sketchfab.com/3d-models/r2d2-e9eca957d4224766b45c5ace176e13be) |

---

### 6.4. Declaración de Asistencia con Herramientas de Inteligencia Artificial

En cumplimiento de las directrices académicas de la asignatura sobre transparencia en el desarrollo de software, se detalla el uso de modelos de IA (Google Gemini / Anthropic Claude) como asistentes de soporte técnico durante el proyecto:

- **Resolución de errores de carga `.glb` y sintaxis Three.js:** [Consulta sobre excepciones en GLTFLoader](https://gemini.google.com/app/0ab6ebc7296cb850?hl=es)
- **Implementación de efectos sonoros y gestión de modelos estáticos:** [Consulta sobre audios y carga de recursos](https://gemini.google.com/app/703bfed1d764da7d?hl=es)
- **Diseño de estilos CSS y fuentes personalizadas de Star Wars:** Consultas sobre tipografía y maquetación del Datapad mediante [Búsquedas Asistidas de Google](https://www.google.com/search?q=star+wars+custom+title+download+free).
- **Refactorización modular:** Asistencia puntual en el comentado de funciones dentro de `main.js` y depuración de la matriz de transformación del superláser.

---

### 6.5. Autora y Colaboradores

<div align="center">

| Desarrolladora | Rol | Perfil |
| :--- | :--- | :---: |
| **Dácil Santana Ortega** | Autora Principal y Programación | [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/tu-usuario) |

---

*Proyecto desarrollado para la asignatura de **Informática Gráfica** — Grado en Ingeniería Informática (ULPGC).*  
*Bajo licencia de [Creative Commons Reconocimiento - No Comercial 4.0 Internacional (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/deed.es).*

</div>

---

[^1]: Todos los modelos `.glb` incluidos en el directorio `3D_models/` han sido seleccionados respetando el límite estricto de GitHub de 25 MB por archivo individual para permitir *commits* y despliegues directos sin requerir extensiones Git LFS.
