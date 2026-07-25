/* ───────────────────────────────────────────────
    CAMERA FOV VISION BOUNDARY HELPER
    Draws 3D glowing boundary lines simulating the camera's
    exact horizontal vision cone (left, right, center rays & arc).
─────────────────────────────────────────────── */

let fovHelperLines = null;
let fovHelperEnabled = false;

/**
 * Creates visual 3D FOV boundary lines in the scene.
 */
function createCameraFOVHelper() {
    if (fovHelperLines) {
        scene.remove(fovHelperLines);
        fovHelperLines.geometry.dispose();
        fovHelperLines.material.dispose();
        fovHelperLines = null;
    }

    const segments = 32;
    // Total line vertices: 2 (left ray) + 2 (right ray) + 2 (center ray) + (segments * 2 for arc)
    const totalVerts = 6 + segments * 2;
    const positions = new Float32Array(totalVerts * 3);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.LineBasicMaterial({
        color: 0x00ffcc, // Glowing neon cyan/green
        linewidth: 2,
        transparent: true,
        opacity: 0.85,
        depthTest: false
    });

    fovHelperLines = new THREE.LineSegments(geo, mat);
    fovHelperLines.renderOrder = 999;
    scene.add(fovHelperLines);
}

/**
 * Updates 3D FOV vision boundary line positions matching current camera yaw, FOV, and aspect ratio.
 */
function updateCameraFOVHelper(px, py, pz) {
    if (!fovHelperLines) {
        createCameraFOVHelper();
    }

    fovHelperLines.visible = fovHelperEnabled;
    if (!fovHelperEnabled) return;

    const yawRad = THREE.MathUtils.degToRad(typeof camYawDeg !== 'undefined' ? camYawDeg : 0);

    // Calculate horizontal half-FOV angle from camera FOV & aspect ratio
    const vertFovRad = THREE.MathUtils.degToRad(typeof camFov !== 'undefined' ? camFov : 45);
    const aspectVal = typeof aspect !== 'undefined' ? aspect : (window.innerWidth / window.innerHeight);
    const halfHovRad = Math.atan(Math.tan(vertFovRad / 2) * aspectVal) + 0.05; // Narrow safety margin

    const maxDist = typeof maxVisDist !== 'undefined' ? Math.min(maxVisDist * 0.55, 1400) : 1400;
    const camX = typeof camera !== 'undefined' ? camera.position.x : px;
    const camZ = typeof camera !== 'undefined' ? camera.position.z : pz;
    const originY = py + 2.0;

    // Camera look angle (centered)
    const centerAngle = yawRad + Math.PI; // Looking towards player and through into world
    const leftAngle   = centerAngle - halfHovRad;
    const rightAngle  = centerAngle + halfHovRad;

    const posAttr = fovHelperLines.geometry.attributes.position;
    const array = posAttr.array;
    let idx = 0;

    // 1. Center ray (yellow/cyan forward centerline originating at camera X,Z)
    array[idx++] = camX; array[idx++] = originY; array[idx++] = camZ;
    array[idx++] = camX + Math.sin(centerAngle) * maxDist;
    array[idx++] = originY;
    array[idx++] = camZ + Math.cos(centerAngle) * maxDist;

    // 2. Left FOV boundary ray
    array[idx++] = camX; array[idx++] = originY; array[idx++] = camZ;
    array[idx++] = camX + Math.sin(leftAngle) * maxDist;
    array[idx++] = originY;
    array[idx++] = camZ + Math.cos(leftAngle) * maxDist;

    // 3. Right FOV boundary ray
    array[idx++] = camX; array[idx++] = originY; array[idx++] = camZ;
    array[idx++] = camX + Math.sin(rightAngle) * maxDist;
    array[idx++] = originY;
    array[idx++] = camZ + Math.cos(rightAngle) * maxDist;

    // 4. Far FOV boundary arc
    const segments = 32;
    for (let i = 0; i < segments; i++) {
        const t1 = i / segments;
        const t2 = (i + 1) / segments;
        const a1 = leftAngle + (rightAngle - leftAngle) * t1;
        const a2 = leftAngle + (rightAngle - leftAngle) * t2;

        array[idx++] = px + Math.sin(a1) * maxDist;
        array[idx++] = originY;
        array[idx++] = pz + Math.cos(a1) * maxDist;

        array[idx++] = px + Math.sin(a2) * maxDist;
        array[idx++] = originY;
        array[idx++] = pz + Math.cos(a2) * maxDist;
    }

    posAttr.needsUpdate = true;
}
