# 3D Interactive Portfolio Script & Content Blueprint

A strategic content structure, visual intro sequence, and storytelling blueprint for building an interactive 3D web developer portfolio.

---

## Phase 1: The Fancy Intro Loading & Landing Sequence ("The Spreading Domain")

### 1. Initial State (Loading Phase — 0.0s)
* **The Void**: The player starts suspended in dark atmospheric space above a single small floating circular stone pedestal.
* **Glowing Beacon**: A pulsing neon circular ring outlines the landing pad.
* **Loading Indicator**: A sleek progress ring on the screen overlay displays loading status (`0% → 100%`).

### 2. The "Spread Out" Domain Reveal (0.5s – 2.0s Transition)
* **Radial Energy Wave**: Upon load completion (or clicking "Enter World"), a glowing circular light wave expands outward from the center pedestal across the terrain.
* **Grass Population Ripple**: Instanced grass blades un-roll / scale up from zero in a smooth radial wave expanding from $(0,0)$ outward to the world boundary.
* **Monuments & World Rise**: Distant monoliths, arches, and project pedestals rise gracefully up from beneath the ground plane into their standing positions.
* **Hero Character Touchdown**: The character drops gently onto the center spawn pad, landing with a soft impact crouch and activating live ground shadows.

---

## Phase 2: Exact World Scene Layout (What the Player Sees)

```
                            [ NORTH SECTOR ]
                       Project Showcase Gallery
                      (Interactive Mini-Stages)
                                 ▲
                                 │
 [ WEST SECTOR ] ◄───── [ CENTER SPAWN PAD ] ─────► [ EAST SECTOR ]
Physics Playground           Coordinates (0,0)        Tech Stack & Skills Grove
(Ramps & Crates)          Welcome Sign & Compass        (Glowing Crystal Spires)
                                 │
                                 ▼
                            [ SOUTH SECTOR ]
                         Contact Portal Archway
                        (Email, GitHub, Resume)
```

---

### 1. Center Spawn Pad (Coordinates 0,0)
* **Visuals**: A polished circular stone podium with glowing compass lines embedded in the floor (`N`, `S`, `E`, `W`).
* **Header**: Floating low-poly 3D banner above: `"SAM — CREATIVE 3D WEB DEVELOPER"`.
* **Sub-banner**: *"Walk with WASD / Touch or use top menu to teleport instantly."*

---

### 2. North Sector ($Z = -2500$): The Main Project Gallery
A curved arrangement of 3 interactive low-poly project pedestals / mini-stages:

1. **Station 1 (Left - 3D Web Sandbox)**:
   * Low-poly mini stage featuring a spinning 3D engine icon.
   * Floating Billboard: *"80,000 Blade Instanced Foliage Engine (120 FPS)"*.
   * Buttons: `[ Live Demo ]` | `[ GitHub ]`.
2. **Station 2 (Center - Featured Web Application)**:
   * Sleek glowing monitor frame displaying live project preview.
   * Floating Billboard: Key features, tech stack badges (`React`, `TypeScript`, `Three.js`).
   * Buttons: `[ Launch App ]` | `[ GitHub ]`.
3. **Station 3 (Right - Shader & WebGL Experiments)**:
   * Stage showcasing custom GLSL shader animations (dissolve, refraction, ocean waves).
   * Buttons: `[ View Shaders ]` | `[ Code ]`.

---

### 3. East Sector ($X = +2500$): Tech Stack & Skills Grove
A cluster of floating energy monoliths (styled like the spires in `world.js`), each representing a core technical domain:

* **Cyan Crystal Spire**: `Three.js` & `WebGL` (Instancing, Shaders, Scene Optimization).
* **Purple Crystal Spire**: `JavaScript (ES6+)` & `TypeScript` (Clean Architecture, Performance).
* **Golden Crystal Spire**: `Frontend & UI` (React, Next.js, HTML5/CSS3, Canvas API).
* **Orbiting Badges**: Floating text pills slowly orbit around each crystal spire.

---

### 4. West Sector ($X = -2500$): The Interactive Physics Playground
A fun interactive area where visitors can play with the game physics:
* **Speed Ramp**: Accelerates the player forward when stepped on.
* **Knockdown Wall**: Low-poly crate stacks or bowling pins that break apart when collided with.
* **Elevation Platforms**: Stepped stone blocks leading up to a vantage point viewing the whole island.

---

### 5. South Sector ($Z = +2500$): Contact Shrine & Departure Portal
* **Visuals**: A sleek low-poly archway portal with a glowing cyan light core.
* **Signboard**: *"Let's build something extraordinary together."*
* **Interactive Station**:
  * 📧 **Email Button**: Direct `mailto:` opener.
  * 💻 **GitHub & LinkedIn Buttons**: Opens profile pages in new tabs.
  * 📄 **Resume Button**: Direct PDF download.
