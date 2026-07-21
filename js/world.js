/* ───────────────────────────────────────────────
    WORLD GEOMETRY
    Floor · Border Walls · Obstacles · Ambient Dots
─────────────────────────────────────────────── */

/* ── Floor ─────────────────────────────────── */
const textureLoader = new THREE.TextureLoader();
const floorTex = textureLoader.load('');
floorTex.magFilter = THREE.NearestFilter;
floorTex.minFilter = THREE.NearestFilter;

const floorGeo = new THREE.PlaneGeometry(WORLD_WIDTH, WORLD_DEPTH);
const floorMat = new THREE.MeshBasicMaterial({ map: floorTex, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
scene.add(floor);

/* ── Border Walls  (visual + collision) ─────── */
function createBorderWall(width, depth, x, z) {
    const geo = new THREE.BoxGeometry(width, EDGE_WALL_H, depth);
    const mat = new THREE.MeshBasicMaterial({ color: PAL.wallBorder, transparent: true, opacity: 0.35 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, EDGE_WALL_H / 2, z);
    scene.add(mesh);

    // Edge wireframe
    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x6a5a8a, transparent: true, opacity: 0.5 }));
    line.position.copy(mesh.position);
    scene.add(line);
}

const wallThick = 4;
createBorderWall(WORLD_WIDTH + wallThick * 2, wallThick, 0, -HALF_DEPTH - wallThick / 2); // North
createBorderWall(WORLD_WIDTH + wallThick * 2, wallThick, 0,  HALF_DEPTH + wallThick / 2); // South
createBorderWall(wallThick, WORLD_DEPTH, -HALF_WIDTH - wallThick / 2, 0);                  // West
createBorderWall(wallThick, WORLD_DEPTH,  HALF_WIDTH + wallThick / 2, 0);                  // East

/* ── Obstacles  (3 distinct cubes with edge outlines) ── */
const obstacles = []; // { mesh, box, shadow } — consumed by collision.js

function createObstacle(sx, sy, sz, px, py, pz, topColor, sideColor) {
    // Multi-material: top/bottom get topColor, sides get sideColor
    const geo = new THREE.BoxGeometry(sx, sy, sz);
    const mats = [
        new THREE.MeshBasicMaterial({ color: sideColor }), // +X
        new THREE.MeshBasicMaterial({ color: sideColor }), // -X
        new THREE.MeshBasicMaterial({ color: topColor }),  // +Y (top)
        new THREE.MeshBasicMaterial({ color: topColor }),  // -Y (bottom)
        new THREE.MeshBasicMaterial({ color: sideColor }), // +Z
        new THREE.MeshBasicMaterial({ color: sideColor }), // -Z
    ];
    const mesh = new THREE.Mesh(geo, mats);
    mesh.position.set(px, py + sy / 2, pz);
    scene.add(mesh);

    // Wireframe edges for pixel-art crispness
    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x111122 }));
    line.position.copy(mesh.position);
    scene.add(line);

    // Shadow blob on ground
    const shadowGeo = new THREE.PlaneGeometry(sx + 10, sz + 10);
    const shadowMat = new THREE.MeshBasicMaterial({ color: PAL.shadow, transparent: true, opacity: 0.45 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(px, 0.5, pz);
    scene.add(shadow);

    // Compute world-space AABB
    const box = new THREE.Box3().setFromObject(mesh);
    obstacles.push({ mesh, box, shadow });
}

// Obstacle 1  — tall red pillar
createObstacle(60, 80, 60, -180, 0, -120, PAL.obs1Top, PAL.obs1Side);
// Obstacle 2  — wide blue block
createObstacle(120, 40, 60, 200, 0, 160, PAL.obs2Top, PAL.obs2Side);
// Obstacle 3  — medium gold cube
createObstacle(50, 55, 50, 80, 0, -280, PAL.obs3Top, PAL.obs3Side);

/* ── Ambient Decoration  (scattered ground markers) ── */
const dotGeo = new THREE.CircleGeometry(2, 6);
const dotMat = new THREE.MeshBasicMaterial({ color: 0x3a3a5c, transparent: true, opacity: 0.4 });
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
