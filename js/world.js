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

/* ── Border Walls removed for infinite procedural world ── */

/* ── Obstacles ── */
const obstacles = []; // { mesh, box } — consumed by collision.js

/* ── Low-Poly Tall Monument Landmark at X = 0 Z = -3000 ── */
function createTallMonolith(x, z) {
    const group = new THREE.Group();

    // 1. Base Pedestal (Low-poly hexagonal base)
    const baseGeo = new THREE.CylinderGeometry(90, 120, 50, 6);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x4a4a5a, roughness: 0.85, flatShading: true });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 25;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    // 2. Main Shaft (Tall Low-Poly Hexagonal Column, Height = 480)
    const shaftGeo = new THREE.CylinderGeometry(35, 75, 480, 6);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x6c5b7b, roughness: 0.7, flatShading: true });
    const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
    shaftMesh.position.y = 50 + 240;
    shaftMesh.castShadow = true;
    shaftMesh.receiveShadow = true;
    group.add(shaftMesh);

    // 3. Spire Tip (Glowing Low-Poly Pyramid Cap, Height = 100)
    const tipGeo = new THREE.ConeGeometry(35, 100, 6);
    const tipMat = new THREE.MeshStandardMaterial({ color: 0xf0c830, roughness: 0.3, metalness: 0.2, flatShading: true });
    const tipMesh = new THREE.Mesh(tipGeo, tipMat);
    tipMesh.position.y = 50 + 480 + 50;
    tipMesh.castShadow = true;
    tipMesh.receiveShadow = true;
    group.add(tipMesh);

    group.scale.set(3.0, 3.0, 3.0);
    group.position.set(x, 0, z);
    scene.add(group);

    // Register collision box & horizon sink tracking
    group.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(baseMesh);
    obstacles.push({ mesh: baseMesh, box });

    if (typeof registerHorizonObject === 'function') {
        registerHorizonObject(group);
    }
}

// Spawn Big Tall Monument at X = 0, Z = -3000
createTallMonolith(0, -3000);

