/* ───────────────────────────────────────────────
    FLOWER BEDS  (modern 3D lighted version)
    createFlowerBed
─────────────────────────────────────────────── */

/* Flower animation array — read by loop.js each frame */
const animFlowers = [];

function createFlowerBed(px, pz, scale = 1.0) {
    // Soil base
    const soilGeo  = new THREE.CircleGeometry(20 * scale, 12);
    const soilMat  = new THREE.MeshStandardMaterial({
        color: PAL.flowerSoil,
        roughness: 0.9,
        metalness: 0.05
    });
    const soilMesh = new THREE.Mesh(soilGeo, soilMat);
    soilMesh.rotation.x = -Math.PI / 2;
    soilMesh.position.set(px, 0.52, pz);
    soilMesh.receiveShadow = true;
    scene.add(soilMesh);

    // Small flowers
    const flowerColors = [PAL.flowerRed, PAL.flowerYellow, PAL.flowerPink];
    const numFlowers   = 7;
    const flowerGeo    = new THREE.BoxGeometry(2.5 * scale, 5 * scale, 2.5 * scale);

    for (let i = 0; i < numFlowers; i++) {
        const angle  = Math.random() * Math.PI * 2;
        const radius = Math.random() * 14 * scale;
        const fx     = px + Math.cos(angle) * radius;
        const fz     = pz + Math.sin(angle) * radius;
        const fy     = 0.52 + (5 * scale) / 2;

        const fColor    = flowerColors[Math.floor(Math.random() * flowerColors.length)];
        const flowerMat  = new THREE.MeshStandardMaterial({
            color: fColor,
            roughness: 0.5,
            metalness: 0.1
        });
        const flowerMesh = new THREE.Mesh(flowerGeo, flowerMat);
        flowerMesh.position.set(fx, fy, fz);
        flowerMesh.castShadow = true;
        flowerMesh.receiveShadow = true;
        scene.add(flowerMesh);

        // Register for sway
        animFlowers.push({
            mesh: flowerMesh,
            line: null,
            baseX: fx,
            baseZ: fz,
            y: fy,
            phaseOffset: Math.random() * Math.PI * 2,
            speed: 2.2 + Math.random() * 1.5,
            scale: scale
        });
    }
}
