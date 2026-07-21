/* ───────────────────────────────────────────────
    HOUSES  (Modular 3D house: box walls, pyramid roof,
             door, windows, chimney)
    Depends on: scene, PAL, obstacles
─────────────────────────────────────────────── */
function createHouse(px, pz, scale = 1.0) {
    const houseGroup = new THREE.Group();

    // 1. Walls (Box)
    const wWidth  = 80 * scale;
    const wHeight = 60 * scale;
    const wDepth  = 80 * scale;

    const wallsGeo  = new THREE.BoxGeometry(wWidth, wHeight, wDepth);
    const wallsMats = [
        new THREE.MeshBasicMaterial({ color: PAL.houseWallSide }), // +X
        new THREE.MeshBasicMaterial({ color: PAL.houseWallSide }), // -X
        new THREE.MeshBasicMaterial({ color: PAL.houseWallTop }),  // +Y (top)
        new THREE.MeshBasicMaterial({ color: PAL.houseWallSide }), // -Y
        new THREE.MeshBasicMaterial({ color: PAL.houseWallSide }), // +Z
        new THREE.MeshBasicMaterial({ color: PAL.houseWallSide }), // -Z
    ];
    const wallsMesh = new THREE.Mesh(wallsGeo, wallsMats);
    wallsMesh.position.y = wHeight / 2;
    houseGroup.add(wallsMesh);

    // Walls outlines
    const wallsEdges = new THREE.EdgesGeometry(wallsGeo);
    const wallsLine  = new THREE.LineSegments(wallsEdges, new THREE.LineBasicMaterial({ color: 0x222233 }));
    wallsLine.position.copy(wallsMesh.position);
    houseGroup.add(wallsLine);

    // 2. Roof (Cone with 4 segments = Pyramid)
    const rRadius = 60 * scale; // corner radius to slightly overhang 80x80 walls
    const rHeight = 35 * scale;
    const roofGeo = new THREE.ConeGeometry(rRadius, rHeight, 4);
    roofGeo.rotateY(Math.PI / 4); // Align sides with the square walls

    const roofMats = [
        new THREE.MeshBasicMaterial({ color: PAL.houseRoofSide }), // sides
        new THREE.MeshBasicMaterial({ color: PAL.houseRoofTop }),  // bottom cap
    ];
    const roofMesh = new THREE.Mesh(roofGeo, roofMats);
    roofMesh.position.y = wHeight + rHeight / 2;
    houseGroup.add(roofMesh);

    // Roof outlines
    const roofEdges = new THREE.EdgesGeometry(roofGeo);
    const roofLine  = new THREE.LineSegments(roofEdges, new THREE.LineBasicMaterial({ color: 0x221100 }));
    roofLine.position.copy(roofMesh.position);
    houseGroup.add(roofLine);

    // 3. Door (Box on front wall: +Z side)
    const dWidth  = 20 * scale;
    const dHeight = 32 * scale;
    const dDepth  = 3  * scale;
    const doorGeo = new THREE.BoxGeometry(dWidth, dHeight, dDepth);
    const doorMat = new THREE.MeshBasicMaterial({ color: PAL.houseDoor });
    const doorMesh = new THREE.Mesh(doorGeo, doorMat);
    doorMesh.position.set(0, dHeight / 2, wDepth / 2 + dDepth / 2 - 1.5 * scale); // slightly embedded
    houseGroup.add(doorMesh);

    // Door outline
    const doorEdges = new THREE.EdgesGeometry(doorGeo);
    const doorLine  = new THREE.LineSegments(doorEdges, new THREE.LineBasicMaterial({ color: 0x110800 }));
    doorLine.position.copy(doorMesh.position);
    houseGroup.add(doorLine);

    // 4. Windows (Left and Right sides)
    const winSize  = 18 * scale;
    const winDepth = 3  * scale;
    const winGeo   = new THREE.BoxGeometry(winDepth, winSize, winSize);
    const winMat   = new THREE.MeshBasicMaterial({ color: PAL.houseWindow });

    // Left window (-X side)
    const winLeft = new THREE.Mesh(winGeo, winMat);
    winLeft.position.set(-wWidth / 2 - winDepth / 2 + 1.5 * scale, wHeight * 0.6, 0);
    houseGroup.add(winLeft);

    const winLeftEdges = new THREE.EdgesGeometry(winGeo);
    const winLeftLine  = new THREE.LineSegments(winLeftEdges, new THREE.LineBasicMaterial({ color: 0x111122 }));
    winLeftLine.position.copy(winLeft.position);
    houseGroup.add(winLeftLine);

    // Right window (+X side)
    const winRight = winLeft.clone();
    winRight.position.x = wWidth / 2 + winDepth / 2 - 1.5 * scale;
    houseGroup.add(winRight);

    const winRightLine = winLeftLine.clone();
    winRightLine.position.copy(winRight.position);
    houseGroup.add(winRightLine);

    // 5. Chimney (Box)
    const cSize      = 12 * scale;
    const cHeight    = 28 * scale;
    const chimneyGeo = new THREE.BoxGeometry(cSize, cHeight, cSize);
    const chimneyMat = new THREE.MeshBasicMaterial({ color: 0x78909c });
    const chimneyMesh = new THREE.Mesh(chimneyGeo, chimneyMat);
    chimneyMesh.position.set(-wWidth * 0.28, wHeight + cHeight / 2 - 5 * scale, -wDepth * 0.28);
    houseGroup.add(chimneyMesh);

    const chimneyEdges = new THREE.EdgesGeometry(chimneyGeo);
    const chimneyLine  = new THREE.LineSegments(chimneyEdges, new THREE.LineBasicMaterial({ color: 0x222233 }));
    chimneyLine.position.copy(chimneyMesh.position);
    houseGroup.add(chimneyLine);

    // Position the group
    houseGroup.position.set(px, 0, pz);
    scene.add(houseGroup);

    // 6. Ground Shadow (matching house width/depth)
    const shadowGeo = new THREE.PlaneGeometry(wWidth + 16, wDepth + 16);
    const shadowMat = new THREE.MeshBasicMaterial({ color: PAL.shadow, transparent: true, opacity: 0.45 });
    const shadow    = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(px, 0.5, pz);
    scene.add(shadow);

    // 7. Collision (AABB Box) set from the house walls
    houseGroup.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(wallsMesh);
    obstacles.push({ mesh: wallsMesh, box, shadow });
}
