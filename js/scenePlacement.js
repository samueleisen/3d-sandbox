/* ───────────────────────────────────────────────
    SCENE PLACEMENT
    All top-level spawn calls — one place to add,
    remove, or reposition every object in the world.
    Depends on: trees.js, flowers.js, houses.js
─────────────────────────────────────────────── */

// Trees  (varying scales/heights)
createTree(-250,  100, 1.1);
createTree(-100, -180, 0.7);  // young small tree
createTree( 320, -100, 1.5);  // giant ancient tree
createTree( 150, -220, 1.0);
createTree(-380, -150, 0.85); // medium-small tree

// Bushes
createBush(-180,  150, 1.2);
createBush( -80, -120, 0.9);
createBush( 240,   60, 1.1);
createBush(  80, -200, 1.0);
createBush(-280,  -60, 1.3);

// Flower beds
createFlowerBed( -50,   50, 1.2);
createFlowerBed( 200,  -60, 1.0);
createFlowerBed(-220, -260, 1.1);

// Houses
createHouse( 420,   30, 1.1);  // Large village house on the right
createHouse(-280,  -50, 0.85); // Small cozy cottage on the left

// Interactive Grass Field (InstancedMesh landscape)
if (typeof createGrassLandscape === 'function') {
    createGrassLandscape(5000);
}
