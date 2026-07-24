# Light and Shadow Architecture & Technical Flaw Analysis

## 1. Executive Summary

This document provides a comprehensive analysis of the **Light & Shadow System** in `3d-Human`. The system utilizes a hybrid lighting approach combining ambient fill lighting, a dynamic directional key light with real-time soft shadow mapping (PCFSoftShadowMap), emissive material highlights, and a platformer-style ground blob shadow.

---

## 2. Architecture & Components

```
                  ┌────────────────────────┐
                  │   DirectionalLight     │
                  │ (Sun - 0.85 Intensity) │
                  └───────────┬────────────┘
                              │ Dynamic Shadow Map (1024x1024 PCFSoft)
                              ▼
┌──────────────────┐    ┌──────────┐    ┌───────────────────────────┐
│  AmbientLight    │ ──►│  Scene   │◄── │ Emissive Standard Materials│
│ (0.6 Intensity)  │    └────┬─────┘    │   (Glowing Obelisk & Core)│
└──────────────────┘         │          └───────────────────────────┘
                             ▼
                ┌──────────────────────────┐
                │ Shadow Reception & Cast  │
                │  Floor · Player · Rocks  │
                │  Instanced Grass Blades  │
                └──────────────────────────┘
```

### Key Modules & Files
- **[`js/scene.js`](file:///c:/Users/sam/Code/3d-Human/js/scene.js)**: Configures `WebGLRenderer` shadow maps, `AmbientLight`, `DirectionalLight`, and shadow camera projection bounds.
- **[`js/loop.js`](file:///c:/Users/sam/Code/3d-Human/js/loop.js)**: Updates shadow camera position relative to player/camera view direction every frame and performs texel snapping.
- **[`js/world.js`](file:///c:/Users/sam/Code/3d-Human/js/world.js)**: Configures `castShadow` and `receiveShadow` properties for terrain floor, rocks, and obelisks.
- **[`js/grass.js`](file:///c:/Users/sam/Code/3d-Human/js/grass.js)**: Implements custom GPU depth material for instanced grass shadow distance culling (>1400 units).
- **[`js/player.js`](file:///c:/Users/sam/Code/3d-Human/js/player.js)** & **[`js/playerController.js`](file:///c:/Users/sam/Code/3d-Human/js/playerController.js)**: Configures hero mesh shadows and manages the dynamic `pShadow` ground blob disc.

---

## 3. Lighting & Shadow Parameters

| Parameter | Location | Value | Description |
| :--- | :--- | :--- | :--- |
| **Ambient Light** | [`js/scene.js:L16`](file:///c:/Users/sam/Code/3d-Human/js/scene.js#L16) | `0x000000`, `0.6` | White base fill light |
| **Directional Light** | [`js/scene.js:L19`](file:///c:/Users/sam/Code/3d-Human/js/scene.js#L19) | `0xffffff`, `0.85` | Sun key light |
| **Shadow Map Type** | [`js/scene.js:L9`](file:///c:/Users/sam/Code/3d-Human/js/scene.js#L9) | `THREE.PCFSoftShadowMap` | Soft shadow edge filtering |
| **Map Resolution** | [`js/scene.js:L24`](file:///c:/Users/sam/Code/3d-Human/js/scene.js#L24) | `1024 × 1024` | Shadow texture resolution |
| **Frustum Span** | [`js/scene.js:L26-L29`](file:///c:/Users/sam/Code/3d-Human/js/scene.js#L26-L29) | `X: [-1000, 1400]`, `Z: [-1000, 1400]` | Orthographic camera box (2400 units wide) |
| **Depth Bounds** | [`js/scene.js:L30-L31`](file:///c:/Users/sam/Code/3d-Human/js/scene.js#L30-L31) | `near: 50`, `far: 2800` | Shadow depth range |
| **Shadow Bias** | [`js/scene.js:L32`](file:///c:/Users/sam/Code/3d-Human/js/scene.js#L32) | `-0.0003` | Offsets self-shadowing acne |
| **Forward Offset** | [`js/loop.js:L89`](file:///c:/Users/sam/Code/3d-Human/js/loop.js#L89) | `500 units` | Forward shift along camera view angle |

---

## 4. Technical Flaws & Flaw Analysis

### 🚨 Flaw 1: Light Direction Rotation Jitter (Broken Texel Snapping)
- **Location**: [`js/loop.js:L95-L107`](file:///c:/Users/sam/Code/3d-Human/js/loop.js#L95-L107)
- **Root Cause**: `dirLight.position` (`shadowCamX`, `shadowCamZ`) is floor-snapped to texel size steps (~2.34 units), while `dirLight.target.position` (`shadowTargetX`, `shadowTargetZ`) continues to update smoothly as a floating-point number every frame.
- **Consequence**: Because the position steps discretely while the target moves smoothly, the directional vector `(dirLight.position - dirLight.target.position)` fluctuates its angle every frame. Instead of stabilizing shadow edges, this causes shadows to wobble and rotate slightly during player movement.

### 🚨 Flaw 2: Debug Wireframe Leak in Production
- **Location**: [`js/scene.js:L38-L39`](file:///c:/Users/sam/Code/3d-Human/js/scene.js#L38-L39)
- **Root Cause**: `const shadowHelper = new THREE.CameraHelper(dirLight.shadow.camera); scene.add(shadowHelper);` is permanently added to the main scene.
- **Consequence**: A giant 2400x2400 yellow/red wireframe box renders inside the game world. Furthermore, `shadowHelper.update()` is not called in [`js/loop.js`](file:///c:/Users/sam/Code/3d-Human/js/loop.js), leaving the wireframe static at origin while the light camera moves away.

### 🚨 Flaw 3: Severely Low Texel Resolution for Hero Character
- **Location**: [`js/scene.js:L24-L29`](file:///c:/Users/sam/Code/3d-Human/js/scene.js#L24-L29)
- **Root Cause**: An orthographic shadow camera spanning 2400 units is mapped to a `1024x1024` texture (`2400 / 1024 ≈ 2.34 units/pixel`).
- **Consequence**: The main player model (`PLAYER_HEIGHT = 14`, `PLAYER_RADIUS = 6`) spans only **~5 pixels** on the shadow map, causing hero real-time shadows to look blocky and pixelated.

### ⚠️ Flaw 4: Wasted Depth Buffer Range & Precision Loss
- **Location**: [`js/scene.js:L30-L31`](file:///c:/Users/sam/Code/3d-Human/js/scene.js#L30-L31)
- **Root Cause**: `near = 50`, `far = 2800`. The vertical light distance to ground is ~531 units along vector `(200, 450, 200)`.
- **Consequence**: Over 80% of shadow map depth precision is wasted on empty space beyond the ground plane, increasing shadow acne risks.

---

## 5. Proposed Fixes & Code Snippets

### Fix 1: Synchronized Texel Snapping ([`js/loop.js`](file:///c:/Users/sam/Code/3d-Human/js/loop.js))
```javascript
// Calculate raw target position
const rawTargetX = px + fwdX * SHADOW_FORWARD_OFFSET;
const rawTargetZ = pz + fwdZ * SHADOW_FORWARD_OFFSET;

// Calculate texel size
const shadowWidth = dirLight.shadow.camera.right - dirLight.shadow.camera.left;
const texelSize = shadowWidth / dirLight.shadow.mapSize.width;

// Snap target position to texel grid FIRST
const shadowTargetX = Math.floor(rawTargetX / texelSize) * texelSize;
const shadowTargetZ = Math.floor(rawTargetZ / texelSize) * texelSize;

// Apply fixed relative light direction offset (200, 450, 200)
dirLight.position.set(shadowTargetX + 200, 450, shadowTargetZ + 200);
dirLight.target.position.set(shadowTargetX, 0, shadowTargetZ);
dirLight.target.updateMatrixWorld();
```

### Fix 2: Remove Production Debug Camera Helper ([`js/scene.js`](file:///c:/Users/sam/Code/3d-Human/js/scene.js))
```javascript
// Comment out debug camera helper
// const shadowHelper = new THREE.CameraHelper(dirLight.shadow.camera);
// scene.add(shadowHelper);
```

### Fix 3: Optimize Shadow Frustum Bounds & Depth Planes ([`js/scene.js`](file:///c:/Users/sam/Code/3d-Human/js/scene.js))
```javascript
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.left = -600;
dirLight.shadow.camera.right = 800;
dirLight.shadow.camera.top = 800;
dirLight.shadow.camera.bottom = -600;
dirLight.shadow.camera.near = 100;
dirLight.shadow.camera.far = 1400;
```
