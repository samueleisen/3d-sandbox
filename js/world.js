/* ───────────────────────────────────────────────
    WORLD GEOMETRY  (modern 3D lighted version)
    Floor · Border Walls · Obstacles · Ambient Dots
─────────────────────────────────────────────── */

/* ── Floor ─────────────────────────────────── */
// Using a smooth solid color standard material that receives shadow
const floorGeo = new THREE.PlaneGeometry(WORLD_WIDTH, WORLD_DEPTH);
const floorMat = new THREE.MeshStandardMaterial({
    color: PAL.floorA,
    roughness: 0.8,
    metalness: 0.1,
    side: THREE.DoubleSide
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

/* ── Border Walls  (visual + collision) ─────── */
function createBorderWall(width, depth, x, z) {
    const geo = new THREE.BoxGeometry(width, EDGE_WALL_H, depth);
    const mat = new THREE.MeshStandardMaterial({
        color: PAL.wallBorder,
        roughness: 0.7,
        metalness: 0.2,
        transparent: true,
        opacity: 0.6
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, EDGE_WALL_H / 2, z);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
}

const wallThick = 4;
createBorderWall(WORLD_WIDTH + wallThick * 2, wallThick, 0, -HALF_DEPTH - wallThick / 2); // North
createBorderWall(WORLD_WIDTH + wallThick * 2, wallThick, 0, HALF_DEPTH + wallThick / 2); // South
createBorderWall(wallThick, WORLD_DEPTH, -HALF_WIDTH - wallThick / 2, 0);                  // West
createBorderWall(wallThick, WORLD_DEPTH, HALF_WIDTH + wallThick / 2, 0);                  // East

/* ── Obstacles  (empty list preserved for collision helper) ── */
const obstacles = []; // { mesh, box } — consumed by collision.js

