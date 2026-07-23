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

/* ── Obstacles  (3 distinct cubes with real shadows) ── */
const obstacles = []; // { mesh, box } — consumed by collision.js

function createObstacle(sx, sy, sz, px, py, pz, topColor, sideColor) {
    const geo = new THREE.BoxGeometry(sx, sy, sz);
    const mats = [
        new THREE.MeshStandardMaterial({ color: sideColor, roughness: 0.6, metalness: 0.1 }), // +X
        new THREE.MeshStandardMaterial({ color: sideColor, roughness: 0.6, metalness: 0.1 }), // -X
        new THREE.MeshStandardMaterial({ color: topColor, roughness: 0.5, metalness: 0.15 }), // +Y (top)
        new THREE.MeshStandardMaterial({ color: topColor, roughness: 0.5, metalness: 0.15 }), // -Y (bottom)
        new THREE.MeshStandardMaterial({ color: sideColor, roughness: 0.6, metalness: 0.1 }), // +Z
        new THREE.MeshStandardMaterial({ color: sideColor, roughness: 0.6, metalness: 0.1 }), // -Z
    ];
    const mesh = new THREE.Mesh(geo, mats);
    mesh.position.set(px, py + sy / 2, pz);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // Compute world-space AABB for collision
    const box = new THREE.Box3().setFromObject(mesh);
    obstacles.push({ mesh, box });
}

// Obstacle 1  — tall red pillar
createObstacle(60, 80, 60, -180, 60, -120, PAL.obs1Top, PAL.obs1Side);
// Obstacle 2  — wide blue block
createObstacle(120, 40, 60, 200, 0, 160, PAL.obs2Top, PAL.obs2Side);
// Obstacle 3  — medium gold cube
createObstacle(50, 55, 50, 80, 0, -280, PAL.obs3Top, PAL.obs3Side);

/* ── Ambient Decoration  (scattered ground markers) ── */
const dotGeo = new THREE.CircleGeometry(2.5, 8);
const dotMat = new THREE.MeshBasicMaterial({ color: 0x3a3a5c, transparent: true, opacity: 0.3 });
for (let i = 0; i < 80; i++) {
    const dot = new THREE.Mesh(dotGeo, dotMat);
    dot.rotation.x = -Math.PI / 2;
    dot.position.set(
        (Math.random() - 0.5) * WORLD_WIDTH * 0.9,
        0.3,
        (Math.random() - 0.5) * WORLD_DEPTH * 0.9
    );
    scene.add(dot);
}
