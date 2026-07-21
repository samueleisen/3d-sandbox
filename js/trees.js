/* ───────────────────────────────────────────────
    TREES & BUSHES
    createTree · createBush
    Depends on: scene, PAL, obstacles, animLeafMeshes,
                leafParticles, particleGeo,
                woodTex, leafTextures, leafVertTex  (textures.js)
─────────────────────────────────────────────── */

/* Shared animation / particle arrays written here,
   read by loop.js each frame.                      */
const animLeafMeshes = [];
const leafParticles  = [];
const particleGeo    = new THREE.BoxGeometry(2.5, 2.5, 2.5);

/* ────────────────────────────────────────────────
    DIORAMA BOX TREE
    Trunk  : narrow 4-sided BoxGeometry with tiled wood texture
    Foliage: stacked flat horizontal leaf disc plates
             + intersecting vertical cross-planes
──────────────────────────────────────────────── */
function createTree(px, pz, scale = 1.0) {
    // ── Trunk ──────────────────────────────────────
    const trunkW = 12 * scale;
    const trunkD = 12 * scale;
    const trunkHeight = 55 * scale;

    const trunkGeo = new THREE.BoxGeometry(trunkW, trunkHeight, trunkD);

    // Per-face materials: sides get wood texture, top/bottom get solid color
    const woodMat = new THREE.MeshBasicMaterial({ map: woodTex });
    const topMat  = new THREE.MeshBasicMaterial({ color: PAL.treeTrunkTop });
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
    scene.add(trunkMesh);

    // Sharp pixel-art edge outline on trunk
    const trunkEdges = new THREE.EdgesGeometry(trunkGeo);
    const trunkLine  = new THREE.LineSegments(
        trunkEdges,
        new THREE.LineBasicMaterial({ color: PAL.trunkEdge })
    );
    trunkLine.position.copy(trunkMesh.position);
    scene.add(trunkLine);

    // ── Leaf Disc Layers ────────────────────────────
    const numDiscs       = 4;
    const discBaseRadius = 36 * scale;
    const discSpacing    = 16 * scale; // vertical gap between discs
    const discBaseY      = trunkHeight * 0.62; // start at 62% of trunk height

    for (let i = 0; i < numDiscs; i++) {
        // Each disc shrinks and rises: bottom widest, top narrowest
        const taper = 1.0 - i * 0.18;
        const discR = discBaseRadius * taper;
        const discY = discBaseY + i * discSpacing;

        const discGeo = new THREE.PlaneGeometry(discR * 2, discR * 2, 1, 1);

        const discMat = new THREE.MeshBasicMaterial({
            map: leafTextures[i],
            transparent: true,
            alphaTest: 0.15,
            side: THREE.DoubleSide,
            depthWrite: false,
        });

        const discMesh = new THREE.Mesh(discGeo, discMat);

        // Horizontal plane (rotate -90° around X), then slight random tilt
        discMesh.rotation.x = -Math.PI / 2;
        discMesh.rotation.z = (i % 2 === 0 ? 1 : -1) * 0.06 * scale;
        discMesh.rotation.y = (i * Math.PI) / 5;

        discMesh.position.set(px, discY, pz);
        scene.add(discMesh);

        // Thin outline ring around each disc for crisp pixel-art look
        const ringGeo  = new THREE.RingGeometry(discR * 0.92, discR * 1.0, 16);
        const ringLine = new THREE.LineSegments(
            new THREE.EdgesGeometry(ringGeo),
            new THREE.LineBasicMaterial({ color: PAL.treeEdge, transparent: true, opacity: 0.7 })
        );
        ringLine.rotation.x = discMesh.rotation.x;
        ringLine.rotation.y = discMesh.rotation.y;
        ringLine.position.copy(discMesh.position);
        scene.add(ringLine);

        // Register discs for gentle swaying rustle animation
        animLeafMeshes.push({
            mesh: discMesh,
            line: ringLine,
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
    const vertMat = new THREE.MeshBasicMaterial({
        map: leafVertTex,
        transparent: true,
        alphaTest: 0.15,
        side: THREE.DoubleSide,
        depthWrite: false,
    });

    // Plane 1 (facing North-South)
    const vertMesh1 = new THREE.Mesh(vertGeo, vertMat);
    vertMesh1.position.set(px, vertY, pz);
    scene.add(vertMesh1);

    // Plane 2 (facing East-West, rotated 90 degrees around Y)
    const vertMesh2 = new THREE.Mesh(vertGeo, vertMat);
    vertMesh2.position.set(px, vertY, pz);
    vertMesh2.rotation.y = Math.PI / 2;
    scene.add(vertMesh2);

    // Pixel-art edges for the vertical cross-planes
    const vertEdges = new THREE.EdgesGeometry(vertGeo);

    const vertLine1 = new THREE.LineSegments(
        vertEdges,
        new THREE.LineBasicMaterial({ color: PAL.treeEdge, transparent: true, opacity: 0.6 })
    );
    vertLine1.position.copy(vertMesh1.position);
    scene.add(vertLine1);

    const vertLine2 = new THREE.LineSegments(
        vertEdges,
        new THREE.LineBasicMaterial({ color: PAL.treeEdge, transparent: true, opacity: 0.6 })
    );
    vertLine2.position.copy(vertMesh2.position);
    vertLine2.rotation.y = Math.PI / 2;
    scene.add(vertLine2);

    // Register vertical planes for sway animation
    const vertSpeed = 1.1 + Math.random() * 0.5;
    const vertPhase = Math.random() * Math.PI * 2;

    animLeafMeshes.push({
        mesh: vertMesh1,
        line: vertLine1,
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
        line: vertLine2,
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
        baseRotY: vertMesh2.rotation.y, // already Math.PI / 2 on geometry init
    });

    // Spawn falling leaf particles for this tree
    const numParticles = 6;
    for (let i = 0; i < numParticles; i++) {
        const py    = discBaseY + Math.random() * numDiscs * discSpacing;
        const pxOff = (Math.random() - 0.5) * discBaseRadius * 1.4;
        const pzOff = (Math.random() - 0.5) * discBaseRadius * 1.4;

        const color = Math.random() > 0.5 ? PAL.treeLeavesTop : PAL.treeLeavesSide;
        const mat   = new THREE.MeshBasicMaterial({ color });
        const pMesh = new THREE.Mesh(particleGeo, mat);
        pMesh.position.set(px + pxOff, py, pz + pzOff);
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

    // Shadow ellipse on ground (covers full canopy width)
    const shadowGeo = new THREE.CircleGeometry(discBaseRadius * 0.85, 14);
    const shadowMat = new THREE.MeshBasicMaterial({ color: PAL.shadow, transparent: true, opacity: 0.48 });
    const shadow    = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(px, 0.5, pz);
    scene.add(shadow);

    // Collision AABB on trunk only – player can walk under canopy
    const box = new THREE.Box3().setFromObject(trunkMesh);
    obstacles.push({ mesh: trunkMesh, box, shadow });
}

/* ───────────────────────────────────────────────
    BUSHES  (Low-poly walk-through decorations)
─────────────────────────────────────────────── */
function createBush(px, pz, scale = 1.0) {
    const bushParts = [
        { r: 14, ox:  0, oy: 8, oz:  0 },
        { r: 10, ox: -8, oy: 6, oz: -6 },
        { r: 11, ox:  8, oy: 5, oz:  6 }
    ];

    bushParts.forEach(part => {
        const r  = part.r  * scale;
        const ox = part.ox * scale;
        const oy = part.oy * scale;
        const oz = part.oz * scale;

        const bushGeo  = new THREE.SphereGeometry(r, 8, 6);
        // Slightly darker green/leaves side to separate bushes from trees visually
        const bushMat  = new THREE.MeshBasicMaterial({ color: PAL.treeLeavesSide });
        const bushMesh = new THREE.Mesh(bushGeo, bushMat);
        bushMesh.position.set(px + ox, oy, pz + oz);
        scene.add(bushMesh);

        // Outline
        const bushEdges = new THREE.EdgesGeometry(bushGeo);
        const bushLine  = new THREE.LineSegments(bushEdges, new THREE.LineBasicMaterial({ color: PAL.treeEdge }));
        bushLine.position.copy(bushMesh.position);
        scene.add(bushLine);

        // Register for leaf rustle animation (same system as trees!)
        animLeafMeshes.push({
            mesh: bushMesh,
            line: bushLine,
            baseScale: scale,
            phaseOffset: Math.random() * Math.PI * 2,
            speed: 1.2 + Math.random() * 0.8,
            ox: ox,
            oy: oy,
            oz: oz,
            px: px,
            pz: pz,
            trunkHeight: 0 // Bushes are directly on the ground
        });
    });

    // Shadow
    const shadowGeo = new THREE.CircleGeometry(20 * scale, 10);
    const shadowMat = new THREE.MeshBasicMaterial({ color: PAL.shadow, transparent: true, opacity: 0.35 });
    const shadow    = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(px, 0.5, pz);
    scene.add(shadow);
}
