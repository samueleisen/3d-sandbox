/* ───────────────────────────────────────────────
    SCENE PLACEMENT
    Spawns grass landscape.
    Depends on: grass.js
─────────────────────────────────────────────── */

// Interactive Grass Field (InstancedMesh landscape)
if (typeof createGrassLandscape === 'function') {
    createGrassLandscape(200000);
}
