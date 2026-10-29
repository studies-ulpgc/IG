<div align="center">

<img src="readme_media/assets/ulpgc.png" alt="Escudo ULPGC" width="160" />

### UNIVERSIDAD DE LAS PALMAS DE GRAN CANARIA
**Grado en Ingeniería Informática — Asignatura: Informática Gráfica**  
*Curso Académico 2026/2027*

---

<!-- Título Principal Estilo Star Wars -->
<h1 style="color: #FFE81F; font-size: 2.2rem; font-weight: bold; letter-spacing: 4px; text-shadow: 0 0 12px rgba(255, 232, 31, 0.6);">
  SISTEMA GALÁCTICO INTERACTIVO STAR WARS
</h1>

<h3 style="color: #00FFE1; font-size: 1.1rem; letter-spacing: 2px;">
  Autora: <a href="https://github.com/studies-ulpgc" style="color: #00FFE1; text-decoration: none; font-weight: bold;">Dácil Santana Ortega</a>
</h3>

![Three.js](https://img.shields.io/badge/Three.js-v0.152.1-yellow?style=flat-square&logo=three.js)
![Estado](https://img.shields.io/badge/Estado-Completado_100%25-brightgreen?style=flat-square)

---

</div>

## Índice de Contenidos

1. [Resumen del Proyecto](#1-resumen-del-proyecto)
2. [Componentes del Sistema Galáctico](#2-componentes-del-sistema-gal%C3%A1ctico)
3. [Demostraciones en Vídeo y Funcionalidades](#3-demostraciones-en-v%C3%ADdeo-y-funcionalidades)
   - [3.1. Vista General y Control de Rejilla](#31-vista-general-y-control-de-rejilla)
   - [3.2. Paneles Informativos y Navegación entre Astros](#32-paneles-informativos-y-navegaci%C3%B3n-entre-astros)
   - [3.3. Mecánica de Destrucción y Conmutación de la Estrella de la Muerte](#33-mec%C3%A1nica-de-destrucci%C3%B3n-y-conmutaci%C3%B3n-de-la-estrella-de-la-muerte)
     - [3.3.1. Secuencia de Disparo y Destrucción](#331-secuencia-de-disparo-y-destrucci%C3%B3n)
     - [3.3.2. Conmutación de Era Imperial (Episodio IV / Episodio VI)](#332-conmutaci%C3%B3n-de-era-imperial-episodio-iv--episodio-vi)
   - [3.4. Gestión y Restauración de Planetas](#34-gesti%C3%B3n-y-restauraci%C3%B3n-de-planetas)
   - [3.5. Navegación en Modo Nave X-Wing y Sistema de Proximidad](#35-navegaci%C3%B3n-en-modo-nave-x-wing-y-sistema-de-proximidad)
4. [Análisis Técnico de Texturas y Capas Gráficas](#4-an%C3%A1lisis-t%C3%A9cnico-de-texturas-y-capas-gr%C3%A1ficas)
5. [Arquitectura del Proyecto y Comparativa Académica](#5-arquitectura-del-proyecto-y-comparativa-acad%C3%A9mica)
6. [Bibliografía, Fuentes y Colaboradores](#6-bibliograf%C3%ADa-fuentes-y-colaboradores)

---

## 1. Resumen del Proyecto

El presente proyecto consiste en la creación de un **sistema galáctico tridimensional interactivo** ambientado en el universo de *Star Wars*, desarrollado mediante la biblioteca **Three.js** e integrado en un entorno web ejecutable en tiempo real.

La aplicación combina modelado astronómico con mecánicas de simulación interactiva. Permite explorar un sistema planetario completo compuesto por una estrella central, seis planetas principales con sus respectivos satélites, un sistema binario independiente (Tatooine con dos soles y tres lunas) y la estación espacial imperial **Estrella de la Muerte** con posibilidad de alternar entre dos eras distintas (Episodio IV y Episodio VI).

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
| **Modelos 3D GLTF** | Estrella de la Muerte (Ep. IV / Ep. VI), Caza X-Wing y R2-D2 | Archivos `.glb` optimizados[^1] e importados dinámicamente mediante `GLTFLoader` desde la carpeta `3D_models/`. |
| **Sistemas de Interfaz** | Datapad Horizontal, Modal de Ayuda y Visor R2-D2 | Paneles HTML/CSS superpuestos con un renderizador secundario e independiente para el visor en vivo del androide. |

---

## 3. Demostraciones en Vídeo y Funcionalidades

En esta sección se presentan los vídeos demostrativos de la aplicación, estructurados por módulos funcionales.

---

### 3.1. Vista General y Control de Rejilla

En este modo de visualización, la cámara orbita libremente alrededor del centro del sistema galáctico mediante controles orbitales interactivos.

<video src="readme_media/demos/01_vista_general.mp4" controls width="100%"></video>

**Funcionalidades mostradas:**
- **Control orbital libre:** Rotación de cámara en 360°, desplazamiento panorámico y zoom mediante el ratón.
- **Conmutación de rejilla:** Activación y desactivación en tiempo real del asistente plano (*GridHelper*) desde el botón "Rejilla" del Datapad.
- **Movimiento orbital:** Traslación elíptica continua e independiente de todos los planetas y satélites.

---

### 3.2. Paneles Informativos y Navegación entre Astros

Al seleccionar cualquier cuerpo celeste con el puntero, se activa el sistema de navegación informativa.

> [!NOTE]
> **Vídeo con audio:** Incluye efectos sonoros originales del androide R2-D2 al seleccionar o conmutar entre planetas.

<video src="readme_media/demos/02_paneles_informacion.mp4" controls width="100%"></video>

**Funcionalidades mostradas:**
- **Barra flotante de resumen:** Muestra el nombre del planeta seleccionado con opciones rápidas de acción.
- **Ficha técnica detallada ("Más Info"):** Despliega el panel lateral con Lore, Región y Clima del astro, desplazando la barra de resumen para no superponer interfaces.
- **Visor 3D en vivo de R2-D2:** Renderizado secundario e interactivo del androide en la esquina de la tarjeta informativa.
- **Navegación secuencial:** Uso de las flechas (`<` y `>`) tanto en la barra flotante como dentro de la propia ficha técnica para saltar directamente entre planetas manteniendo el nivel de detalle seleccionado.

---

### 3.3. Mecánica de Destrucción y Conmutación de la Estrella de la Muerte

Muestra la interacción por proyección de rayos (*raycasting*) para identificar objetivos, desencadenar la secuencia de disparo y la posibilidad de cambiar de era imperial.

#### 3.3.1. Secuencia de Disparo y Destrucción

> [!NOTE]
> **Vídeo con audio:** Contiene los efectos sonoros del disparo del superláser y la detonación del astro, además de los audios de del androide R2-D2 al seleccionar o conmutar entre planetas.

<video src="readme_media/demos/03_destruccion_estrella_muerte.mp4" controls width="100%"></video>

**Funcionalidades mostradas:**
- **Inmovilización del objetivo:** Al iniciar la secuencia de disparo, el planeta congelará inmediatamente su movimiento de traslación en el espacio para permitir el impacto directo del rayo.
- **Identificación de objetivos destructibles:** Los seis planetas principales permiten la orden de disparo tanto desde la barra de resumen como desde la ficha detallada.
- **Protección de astros especiales:** Objetos como el Sol Central, Tatooine o la propia Estrella de la Muerte muestran su información técnica pero deshabilitan automáticamente el botón de disparo.

#### 3.3.2. Conmutación de Era Imperial (Episodio IV / Episodio VI)

> [!NOTE]
> **Vídeo con audio:** Contiene los efectos sonoros del disparo del superláser y la detonación del astro, además de los audios de del androide R2-D2 al seleccionar o conmutar entre planetas.

<video src="readme_media/demos/03_destruccion_estrella_muerte_ii.mp4" controls width="100%"></video>

**Funcionalidades mostradas:**
- **Cambio de modelo 3D en tiempo de ejecución:** Permite alternar desde el Datapad entre la **Estrella de la Muerte completa (Episodio IV)** y la **Estrella de la Muerte II en construcción (Episodio VI)**, actualizando dinámicamente la malla tridimensional en la escena.

---

### 3.4. Gestión y Restauración de Planetas

Demostración de la gestión de inventario de astros tras ser eliminados de la escena.

<video src="readme_media/demos/04_restauracion_planetas.mp4" controls width="100%"></video>

**Funcionalidades mostradas:**
- **Desplegable dinámico:** La lista de selección "Restaurar Planeta" en el Datapad se actualiza automáticamente añadiendo solo los planetas que hayan sido destruidos.
- **Restauración individual:** Selección y recuperación de un planeta específico, devolviéndolo a su órbita con su visibilidad y movimiento reactivados.
- **Restauración global:** Botón "Restaurar Todos" que regenera simultáneamente la totalidad de los planetas destruidos del sistema galáctico.

---

### 3.5. Navegación en Modo Nave X-Wing y Sistema de Proximidad

Cambio de perspectiva hacia la vista subjetiva en tercera persona para pilotar la caza X-Wing por el espacio tridimensional.

> [!NOTE] 
> **Vídeo con audio:** Contiene los efectos sonoros del androide R2-D2 al seleccionar modo nave.

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

| Astro / Planeta | Vista en Detalle | Configuración Técnica de Capas y Materiales |
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

### 5.2. Comparativa con Scripts de Clase

A continuación se muestra la correspondencia técnica entre los conceptos enseñados en las plantillas del profesor ([CodeSandbox S6](https://codesandbox.io/p/sandbox/ig-s6-xtdjrm) / [CodeSandbox S7](https://codesandbox.io/p/sandbox/ig-s7-36r8mq?file=%2Fsrc%2Findex.html)) y su implementación evolucionada en este proyecto:

| Script de Referencia | Concepto Académico Base | Implementación Avanzada en el Proyecto |
| :--- | :--- | :--- |
| **`script01` / `script02`** | Creación de grafo de escena (`Scene`), cámara perspectiva, reproductor `WebGLRenderer` y geometrías primitivas (`SphereGeometry`). | Estructurado dentro de [`sceneSetup.js`](./src/modules/sceneSetup.js), configurando sombras, renderizado responsivo y ajuste de aspecto de pantalla. |
| **`script03` / `script04`** | Asistente de referencia espacial `GridHelper` y control de visibilidad en tiempo real mediante eventos DOM de botones (`addEventListener`). | Integrado en el Datapad horizontal mediante el botón "Rejilla", permitiendo conmutar la visibilidad espacial sin interrumpir el renderizado. |
| **`script06` / `script07`** | Traslación orbital elíptica basada en funciones trigonométricas (`Math.cos` / `Math.sin`) combinadas con la marca de tiempo `timestamp`. | Aplicado en [`main.js`](./src/main.js) dentro del bucle `animationLoop()` para la traslación independiente de todos los planetas con velocidades personalizadas. |
| **`script07`** | Jerarquía de transformación padre-hijo mediante pivotes (`Object3D`) para órbitas de satélites y trazado de trayectorias con `EllipseCurve` y `Line`. | Implementado en [`planetBuilder.js`](./src/modules/planetBuilder.js) creando pivotes para las 18 lunas, añadiendo la función `createSatelliteOrbitLine` con `LineLoop`. |
| **`script08`** | Detección de clics en la escena mediante proyección de rayos (`Raycaster`) y conversión de coordenadas del puntero del ratón a espacio normalizado. | Módulo [`raycasterManager.js`](./src/modules/raycasterManager.js) completo que gestiona la selección precisa de planetas, soles, Tatooine y la Estrella de la Muerte. |
| **`script11` / `script12`** | Iluminación de escena (`AmbientLight`, `DirectionalLight`), materiales Phong (`MeshPhongMaterial`) y sombras (`castShadow` / `receiveShadow`). | Fuentes de luz direccionables con sombras proyectadas en las naves y materiales con mapas de rugosidad (`bumpMap`) y brillo especular (`shininess`). |
| **`script13` / `script15`** | Carga de texturas con `TextureLoader`, capas de nubes concéntricas con mapas de opacidad (`alphaMap`) y mezcla aditiva (`AdditiveBlending`). | Utilizado en los planetas principales y en el Sol Central, optimizando la carga en memoria al reutilizar capas atmosféricas con distintas opacidades. |
| **`script16`** | Control cinemático de cámara en vuelo (`FlyControls`) con actualización mediante diferencia de tiempo *delta* (`clock.getDelta()`). | Desarrollo de un controlador personalizado en [`controlsManager.js`](./src/modules/controlsManager.js) para simular el vuelo del X-Wing en 6 grados de libertad. |

---

## 6. Bibliografía, Fuentes y Colaboradores

---

### 6.1. Bibliografía y Referencias Académicas

1. **Documentación Oficial de Three.js:** [https://threejs.org/docs/](https://threejs.org/docs/)
2. **Plantillas Prácticas de la Asignatura (Prof. Modesto Castrillón — ULPGC):**
   - Repositorio de desarrollo en CodeSandbox: [CodeSandbox IG-S6](https://codesandbox.io/p/sandbox/ig-s6-xtdjrm) y [CodeSandbox IG-S7](https://codesandbox.io/p/sandbox/ig-s7-36r8mq?file=%2Fsrc%2Findex.html).
   - Perfil docente GitHub: [@otsedom](https://github.com/otsedom) (*División de Robótica y Oceanografía Computacional - SIANI - ULPGC*).
3. **Discover Three.js:** [https://discoverthreejs.com/](https://discoverthreejs.com/) — Colección de patrones de diseño para WebGL.
4. **Learning Three.js (Jos Dirksen):** Guía de referencia sobre optimización de materiales Phong y mapas de sombras.

---

### 6.2. Fuentes de Texturas y Recursos Gráficos

#### Texturas Planetarias y Mapas de Nubes:
- **Naboo Map:** Creado por [Reesecandy2003 en DeviantArt](https://www.deviantart.com/reesecandy2003/art/Map-of-Naboo-Star-Wars-1001555183).
- **Mustafar Map 2K:** Creado por [greaterhtrae en DeviantArt](https://www.deviantart.com/greaterhtrae/art/Mustafar-map-2k-1087686644).
- **Coruscant City Lights Map:** Creado por [greaterhtrae en DeviantArt](https://www.deviantart.com/greaterhtrae/art/Coruscant-map-City-Lights-2k-1087697835).
- **Hoth Map:** Creado por [Reesecandy2003 en DeviantArt](https://www.deviantart.com/reesecandy2003/art/Map-of-Hoth-%28Star-Wars%29-1001555236).
- **Endor Moon Map:** Creado por [Reesecandy2003 en DeviantArt](https://www.deviantart.com/reesecandy2003/art/Map-of-Endor-%28Moon%29-%28Star-Wars%29-1001554108).
- **Bespin Map:** Creado por [Reesecandy2003 en DeviantArt](https://www.deviantart.com/reesecandy2003/art/Map-of-Bespin-%28Star-Wars%29-988396898).
- **Tatooine Environment Pack:** Creado por [Ian Vicknair en ArtStation](https://www.artstation.com/marketplace/p/BADM/tatooine-planet-environment-pack-21k-maps-hdri-psd-unreal-sky-setups).
- **Textura de la Luna (8K):** Disponible en [Wikimedia Commons — Solar System Scope](https://commons.wikimedia.org/wiki/File:Solarsystemscope_texture_8k_moon.jpg).
- **Textura del Sol (8K):** Disponible en [Wikimedia Commons — Solar System Scope](https://commons.wikimedia.org/wiki/File:Solarsystemscope_texture_8k_sun.jpg).
- **Mapas de Nubes y Transparencias:** Obtenidos de las plantillas de la asignatura (*BlueMarble / Processing*).
- **Escudo Institucional:** Vector SVG de la [Universidad de Las Palmas de Gran Canaria](https://www.ulpgc.es/).

---

### 6.3. Modelos Tridimensionales (`.glb` / `.gltf`)

Los modelos tridimensionales han sido descargados de la plataforma [Sketchfab](https://sketchfab.com/feed) con licencias de uso no comercial:

- **Estrella de la Muerte (Episodio IV):** Creado por [SebastianSosnowski en Sketchfab](https://sketchfab.com/3d-models/death-star-star-wars-3d5f01485e9e4e8b9d995d7764341afe) — Ubicado en `3D_models/Death_Star.glb`.
- **Estrella de la Muerte II (Episodio VI):** Creado por [N8 en Sketchfab](https://sketchfab.com/3d-models/death-star-ii-17ccca0dbb6b4e338fa999202f9e6685) — Ubicado en `3D_models/Death_Star_II.glb`.
- **Caza Estelar X-Wing:** Creado por [Heataker en Sketchfab](https://sketchfab.com/3d-models/star-wars-x-wing-fighter-e6b85951f85940c1b26505eda7d73ef9) — Ubicado en `3D_models/XWing.glb`.
- **Androide R2-D2:** Creado por [Eduardo Oliveira en Sketchfab](https://sketchfab.com/3d-models/r2d2-e9eca957d4224766b45c5ace176e13be) — Ubicado en `3D_models/R2D2.glb`.

---

### 6.4. Asistencia con Herramientas de Inteligencia Artificial

En cumplimiento de la normativa académica sobre transparencia en el desarrollo de trabajos, se declara la utilización de asistentes de Inteligencia Artificial como herramienta de apoyo colaborativo durante las distintas fases del proyecto.

Las sugerencias recibidas sirvieron como punto de partida técnico, siendo revisadas, adaptadas e integradas de forma independiente dentro del diseño de la aplicación. Las áreas principales de apoyo incluyeron:

- **Lógica e Interacción en Three.js:** Asistencia en la estructuración de la detección por rayos (`Raycaster`) y depuración matemática de los 6 grados de libertad del controlador de vuelo del X-Wing.
- **Diseño e Interfaz Web:** Orientación en estilos CSS para la maquetación del Datapad horizontal, paneles HUD tácticos y modales responsivos.
- **Formato de Documentación:** Estructuración del archivo `README.md`, redacción técnica y maquetación de tablas comparativas.

---

### 6.5. Autora y Colaboradores

<div align="center">

| Desarrolladora | Rol | Perfil |
| :--- | :--- | :---: |
| **Dácil Santana Ortega** | Autora Principal y Programación | [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/studies-ulpgc) |

---

*Proyecto desarrollado para la asignatura de **Informática Gráfica** — Grado en Ingeniería Informática (ULPGC).*

</div>

---

[^1]: Todos los archivos `.glb` incorporados han sido seleccionados y optimizados por debajo del límite de 25 MB por archivo para permitir su seguimiento mediante control de versiones nativo en GitHub sin requerir almacenamiento Git LFS.