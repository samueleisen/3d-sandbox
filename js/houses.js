/* ───────────────────────────────────────────────
    HOUSES  (Modular 3D house: box walls, pyramid roof,
             door, windows, chimney - modern 3D lighted version)
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
        new THREE.MeshStandardMaterial({ color: PAL.houseWallSide, roughness: 0.7, metalness: 0.1 }), // +X
        new THREE.MeshStandardMaterial({ color: PAL.houseWallSide, roughness: 0.7, metalness: 0.1 }), // -X
        new THREE.MeshStandardMaterial({ color: PAL.houseWallTop,  roughness: 0.6, metalness: 0.1 }), // +Y (top)
        new THREE.MeshStandardMaterial({ color: PAL.houseWallSide, roughness: 0.7, metalness: 0.1 }), // -Y
        new THREE.MeshStandardMaterial({ color: PAL.houseWallSide, roughness: 0.7, metalness: 0.1 }), // +Z
        new THREE.MeshStandardMaterial({ color: PAL.houseWallSide, roughness: 0.7, metalness: 0.1 }), // -Z
    ];
    const wallsMesh = new THREE.Mesh(wallsGeo, wallsMats);
    wallsMesh.position.y = wHeight / 2;
    wallsMesh.castShadow = true;
    wallsMesh.receiveShadow = true;
    houseGroup.add(wallsMesh);

    // 2. Roof (Cone with 4 segments = Pyramid)
    const rRadius = 60 * scale; // corner radius to slightly overhang 80x80 walls
    const rHeight = 35 * scale;
    const roofGeo = new THREE.ConeGeometry(rRadius, rHeight, 4);
    roofGeo.rotateY(Math.PI / 4); // Align sides with the square walls

    const roofMats = [
        new THREE.MeshStandardMaterial({ color: PAL.houseRoofSide, roughness: 0.65, metalness: 0.1 }), // sides
        new THREE.MeshStandardMaterial({ color: PAL.houseRoofTop,  roughness: 0.65, metalness: 0.1 }), // bottom cap
    ];
    const roofMesh = new THREE.Mesh(roofGeo, roofMats);
    roofMesh.position.y = wHeight + rHeight / 2;
    roofMesh.castShadow = true;
    roofMesh.receiveShadow = true;
    houseGroup.add(roofMesh);

    // 3. Door (Box on front wall: +Z side)
    const dWidth  = 20 * scale;
    const dHeight = 32 * scale;
    const dDepth  = 3  * scale;
    const doorGeo = new THREE.BoxGeometry(dWidth, dHeight, dDepth);
    const doorMat = new THREE.MeshStandardMaterial({ color: PAL.houseDoor, roughness: 0.8, metalness: 0.05 });
    const doorMesh = new THREE.Mesh(doorGeo, doorMat);
    doorMesh.position.set(0, dHeight / 2, wDepth / 2 + dDepth / 2 - 1.5 * scale); // slightly embedded
    doorMesh.castShadow = true;
    doorMesh.receiveShadow = true;
    houseGroup.add(doorMesh);

    // 4. Windows (Left and Right sides)
    const winSize  = 18 * scale;
    const winDepth = 3  * scale;
    const winGeo   = new THREE.BoxGeometry(winDepth, winSize, winSize);
    const winMat   = new THREE.MeshStandardMaterial({ color: PAL.houseWindow, roughness: 0.2, metalness: 0.9 });

    // Left window (-X side)
    const winLeft = new THREE.Mesh(winGeo, winMat);
    winLeft.position.set(-wWidth / 2 - winDepth / 2 + 1.5 * scale, wHeight * 0.6, 0);
    winLeft.castShadow = true;
    winLeft.receiveShadow = true;
    houseGroup.add(winLeft);

    // Right window (+X side)
    const winRight = new THREE.Mesh(winGeo, winMat);
    winRight.position.set(wWidth / 2 + winDepth / 2 - 1.5 * scale, wHeight * 0.6, 0);
    winRight.castShadow = true;
    winRight.receiveShadow = true;
    houseGroup.add(winRight);

    // 5. Chimney (Box)
    const cSize      = 12 * scale;
    const cHeight    = 28 * scale;
    const chimneyGeo = new THREE.BoxGeometry(cSize, cHeight, cSize);
    const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x78909c, roughness: 0.7, metalness: 0.1 });
    const chimneyMesh = new THREE.Mesh(chimneyGeo, chimneyMat);
    chimneyMesh.position.set(-wWidth * 0.28, wHeight + cHeight / 2 - 5 * scale, -wDepth * 0.28);
    chimneyMesh.castShadow = true;
    chimneyMesh.receiveShadow = true;
    houseGroup.add(chimneyMesh);

    // Position the group
    houseGroup.position.set(px, 0, pz);
    scene.add(houseGroup);

    // 6. Collision (AABB Box) set from the house walls
    houseGroup.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(wallsMesh);
    obstacles.push({ mesh: wallsMesh, box });
}
