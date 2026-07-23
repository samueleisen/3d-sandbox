/* ───────────────────────────────────────────────
    TREES & BUSHES  (modern 3D lighted version)
    createTree · createBush
─────────────────────────────────────────────── */

/* Shared animation / particle arrays written here,
   read by loop.js each frame.                      */
const animLeafMeshes = [];
const leafParticles  = [];
const particleGeo    = new THREE.BoxGeometry(1.5, 1.5, 1.5);

/* ────────────────────────────────────────────────
    DIORAMA BOX TREE
    Trunk  : narrow 4-sided BoxGeometry with tiled wood texture
    Foliage: stacked flat horizontal leaf disc plates
             + intersecting vertical cross-planes
──────────────────────────────────────────────── */
function createTree(px, pz, scale = 1.0) {
    // ── Trunk ──────────────────────────────────────
    const trunkW = 8 * scale;
    const trunkD = 8 * scale;
    const trunkHeight = 38 * scale;

    const trunkGeo = new THREE.BoxGeometry(trunkW, trunkHeight, trunkD);

    // Per-face materials: sides get wood texture, top/bottom get solid color
    const woodMat = new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.8, metalness: 0.1 });
    const topMat  = new THREE.MeshStandardMaterial({ color: PAL.treeTrunkTop, roughness: 0.7, metalness: 0.15 });
    const trunkMats = [
        woodMat, // +X side
        woodMat, // -X side
        topMat,  // +Y top
        topMat,  // -Y bottom
        woodMat, // +Z side
        woodMat, // -Z side
    ];
    const trunkMesh = new THREE.Mesh(trunkGeo, trunkMats);
    trunkMesh.position.set(px, trunkHeight / 2, pz);
    trunkMesh.castShadow = true;
    trunkMesh.receiveShadow = true;
    scene.add(trunkMesh);

    // ── Leaf Disc Layers ────────────────────────────
    const numDiscs       = 4;
    const discBaseRadius = 24 * scale;
    const discSpacing    = 11 * scale; // vertical gap between discs
    const discBaseY      = trunkHeight * 0.62; // start at 62% of trunk height

    for (let i = 0; i < numDiscs; i++) {
        // Each disc shrinks and rises: bottom widest, top narrowest
        const taper = 1.0 - i * 0.18;
        const discR = discBaseRadius * taper;
        const discY = discBaseY + i * discSpacing;

        const discGeo = new THREE.PlaneGeometry(discR * 2, discR * 2, 1, 1);

        const discMat = new THREE.MeshStandardMaterial({
            map: leafTextures[i],
            transparent: true,
            alphaTest: 0.15,
            side: THREE.DoubleSide,
            shadowSide: THREE.DoubleSide,
            roughness: 0.6,
            metalness: 0.1
        });

        const discMesh = new THREE.Mesh(discGeo, discMat);
        discMesh.castShadow = true;
        discMesh.receiveShadow = true;

        // Horizontal plane (rotate -90° around X), then slight random tilt
        discMesh.rotation.x = -Math.PI / 2;
        discMesh.rotation.z = (i % 2 === 0 ? 1 : -1) * 0.06 * scale;
        discMesh.rotation.y = (i * Math.PI) / 5;

        discMesh.position.set(px, discY, pz);
        scene.add(discMesh);

        // Register discs for gentle swaying rustle animation
        animLeafMeshes.push({
            mesh: discMesh,
            line: null,
            baseScale: scale,
            phaseOffset: Math.random() * Math.PI * 2 + i * 1.1,
            speed: 1.3 + Math.random() * 0.8,
            ox: 0,
            oy: discY,
            oz: 0,
            px: px,
            pz: pz,
            trunkHeight: 0,
            isDisc: true,
            baseRotZ: discMesh.rotation.z,
            baseRotY: discMesh.rotation.y,
        });
    }

    // ── Vertical Intersecting Canopy Planes (X Shape) ──
    const vertW = discBaseRadius * 2 * 0.95;
    const vertH = discSpacing * (numDiscs + 0.5);
    const vertY = discBaseY + (discSpacing * (numDiscs - 1)) / 2;

    const vertGeo = new THREE.PlaneGeometry(vertW, vertH, 1, 1);
    const vertMat = new THREE.MeshStandardMaterial({
        map: leafVertTex,
        transparent: true,
        alphaTest: 0.15,
        side: THREE.DoubleSide,
        shadowSide: THREE.DoubleSide,
        roughness: 0.6,
        metalness: 0.1
    });

    // Plane 1 (facing North-South)
    const vertMesh1 = new THREE.Mesh(vertGeo, vertMat);
    vertMesh1.position.set(px, vertY, pz);
    vertMesh1.castShadow = true;
    vertMesh1.receiveShadow = true;
    scene.add(vertMesh1);

    // Plane 2 (facing East-West, rotated 90 degrees around Y)
    const vertMesh2 = new THREE.Mesh(vertGeo, vertMat);
    vertMesh2.position.set(px, vertY, pz);
    vertMesh2.rotation.y = Math.PI / 2;
    vertMesh2.castShadow = true;
    vertMesh2.receiveShadow = true;
    scene.add(vertMesh2);

    // Register vertical planes for sway animation
    const vertSpeed = 1.1 + Math.random() * 0.5;
    const vertPhase = Math.random() * Math.PI * 2;

    animLeafMeshes.push({
        mesh: vertMesh1,
        line: null,
        baseScale: scale,
        phaseOffset: vertPhase,
        speed: vertSpeed,
        ox: 0,
        oy: vertY,
        oz: 0,
        px: px,
        pz: pz,
        isVertPlane: true,
        baseRotZ: vertMesh1.rotation.z,
        baseRotY: vertMesh1.rotation.y,
    });

    animLeafMeshes.push({
        mesh: vertMesh2,
        line: null,
        baseScale: scale,
        phaseOffset: vertPhase,
        speed: vertSpeed,
        ox: 0,
        oy: vertY,
        oz: 0,
        px: px,
        pz: pz,
        isVertPlane: true,
        baseRotZ: vertMesh2.rotation.z,
        baseRotY: vertMesh2.rotation.y,
    });

    // Spawn falling leaf particles for this tree (reduced to 3 for performance)
    const numParticles = 3;
    for (let i = 0; i < numParticles; i++) {
        const py    = discBaseY + Math.random() * numDiscs * discSpacing;
        const pxOff = (Math.random() - 0.5) * discBaseRadius * 1.4;
        const pzOff = (Math.random() - 0.5) * discBaseRadius * 1.4;

        const color = Math.random() > 0.5 ? PAL.treeLeavesTop : PAL.treeLeavesSide;
        const mat   = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
        const pMesh = new THREE.Mesh(particleGeo, mat);
        pMesh.position.set(px + pxOff, py, pz + pzOff);
        pMesh.castShadow = true;
        scene.add(pMesh);

        leafParticles.push({
            mesh: pMesh,
            baseX: px,
            baseZ: pz,
            scale: scale,
            trunkHeight: discBaseY,
            vx: (Math.random() - 0.5) * 10,
            vy: -(12 + Math.random() * 12),
            vz: (Math.random() - 0.5) * 10,
            rotXSpeed: Math.random() * 2,
            rotYSpeed: Math.random() * 2
        });
    }

    // Collision AABB on trunk only – player can walk under canopy
    const box = new THREE.Box3().setFromObject(trunkMesh);
    obstacles.push({ mesh: trunkMesh, box });
}

/* ── Bushes  (Low-poly walk-through decorations) ── */
function createBush(px, pz, scale = 1.0) {
    const bushParts = [
        { r: 9, ox:  0, oy: 5, oz:  0 },
        { r: 7, ox: -5, oy: 4, oz: -4 },
        { r: 7, ox:  5, oy: 3.5, oz:  4 }
    ];

    bushParts.forEach(part => {
        const r  = part.r  * scale;
        const ox = part.ox * scale;
        const oy = part.oy * scale;
        const oz = part.oz * scale;

        const bushGeo  = new THREE.SphereGeometry(r, 6, 5);
        const bushMat  = new THREE.MeshStandardMaterial({ color: PAL.treeLeavesSide, roughness: 0.8, metalness: 0.1 });
        const bushMesh = new THREE.Mesh(bushGeo, bushMat);
        bushMesh.position.set(px + ox, oy, pz + oz);
        bushMesh.castShadow = true;
        bushMesh.receiveShadow = true;
        scene.add(bushMesh);

        // Register for leaf rustle animation
        animLeafMeshes.push({
            mesh: bushMesh,
            line: null,
            baseScale: scale,
            phaseOffset: Math.random() * Math.PI * 2,
            speed: 1.2 + Math.random() * 0.8,
            ox: ox,
            oy: oy,
            oz: oz,
            px: px,
            pz: pz,
            trunkHeight: 0
        });
    });
}
