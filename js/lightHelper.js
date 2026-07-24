/* ───────────────────────────────────────────────
    FULL SHADOW CAMERA FRUSTUM, RADIAL VISION & GROUND BOUNDARY VISUALIZER
    Visualizes the entire 3D shadow frustum, sun ray vector,
    outer ground boundary rectangle (4000x4000), internal grid,
    radial shadow vision boundary circle (R=1800), and discrete texel step cell.
─────────────────────────────────────────────── */

let lightHelperGroup = null;
let shadowRayLines = null;
let shadowGroundBoundary = null;
let shadowRadialCircle = null;
let shadowTexelCell = null;
let lightHelperEnabled = true;

/**
 * Creates visual 3D Light Ray Lines, Frustum Pyramid, Radial Vision Circle & Ground Boundary Grid.
 */
function createLightHelper() {
    if (lightHelperGroup) {
        scene.remove(lightHelperGroup);
        lightHelperGroup = null;
    }

    lightHelperGroup = new THREE.Group();

    // ── 1. Sun Ray & 4 Frustum Corner Beams (Gold Lines) ──
    // 5 lines = 10 vertices (Central Ray + 4 Corner Beams)
    const rayPositions = new Float32Array(10 * 3);
    const rayGeo = new THREE.BufferGeometry();
    rayGeo.setAttribute('position', new THREE.BufferAttribute(rayPositions, 3));

    const rayMat = new THREE.LineBasicMaterial({
        color: 0xffd700, // Vibrant Gold
        linewidth: 2,
        transparent: true,
        opacity: 0.85,
        depthTest: false
    });

    shadowRayLines = new THREE.LineSegments(rayGeo, rayMat);
    shadowRayLines.renderOrder = 999;
    lightHelperGroup.add(shadowRayLines);

    // ── 2. Ground Boundary Box Outer Rectangle & Sub-Grid (Cyan / Turquoise) ──
    // Outer border (4 lines) + 6 interior grid lines = 10 lines = 20 vertices
    const gridPositions = new Float32Array(20 * 3);
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute('position', new THREE.BufferAttribute(gridPositions, 3));

    const gridMat = new THREE.LineBasicMaterial({
        color: 0x00ffcc, // Glowing Cyan
        linewidth: 2,
        transparent: true,
        opacity: 0.85,
        depthTest: false
    });

    shadowGroundBoundary = new THREE.LineSegments(gridGeo, gridMat);
    shadowGroundBoundary.renderOrder = 999;
    lightHelperGroup.add(shadowGroundBoundary);

    // ── 3. Radial Vision Shadow Boundary Circle (R=1800 Units, Neon Magenta / Purple) ──
    const circleSegments = 64;
    const circlePositions = new Float32Array(circleSegments * 2 * 3);
    const circleGeo = new THREE.BufferGeometry();
    circleGeo.setAttribute('position', new THREE.BufferAttribute(circlePositions, 3));

    const circleMat = new THREE.LineBasicMaterial({
        color: 0xff00ff, // Neon Magenta
        linewidth: 2,
        transparent: true,
        opacity: 0.9,
        depthTest: false
    });

    shadowRadialCircle = new THREE.LineSegments(circleGeo, circleMat);
    shadowRadialCircle.renderOrder = 1000;
    lightHelperGroup.add(shadowRadialCircle);

    // ── 4. Single Texel Step Footprint Cell (Bright Orange Center Crosshair) ──
    // Square border (4 lines) + center crosshair (2 lines) = 6 lines = 12 vertices
    const cellPositions = new Float32Array(12 * 3);
    const cellGeo = new THREE.BufferGeometry();
    cellGeo.setAttribute('position', new THREE.BufferAttribute(cellPositions, 3));

    const cellMat = new THREE.LineBasicMaterial({
        color: 0xff4500, // Bright Orange-Red
        linewidth: 3,
        transparent: true,
        opacity: 1.0,
        depthTest: false
    });

    shadowTexelCell = new THREE.LineSegments(cellGeo, cellMat);
    shadowTexelCell.renderOrder = 1001;
    lightHelperGroup.add(shadowTexelCell);

    scene.add(lightHelperGroup);
}

/**
 * Dynamically updates 3D Light Rays, Frustum Pyramid, Ground Boundary, Radial Circle & Texel Step.
 */
function updateLightHelper() {
    if (!lightHelperGroup) {
        createLightHelper();
    }

    lightHelperGroup.visible = lightHelperEnabled;
    if (!lightHelperEnabled) return;

    if (typeof dirLight === 'undefined' || !dirLight) return;

    const lightPos = dirLight.position;
    const targetPos = dirLight.target.position;
    const cam = dirLight.shadow.camera;

    const left = cam.left;     // -2000
    const right = cam.right;   //  2000
    const top = cam.top;       //  2000
    const bottom = cam.bottom; // -2000

    const groundY = 1.5; // Slightly elevated above terrain to prevent z-fighting

    // 4 Ground Boundary Corners relative to target position
    const c1x = targetPos.x + left,  c1z = targetPos.z + bottom;
    const c2x = targetPos.x + right, c2z = targetPos.z + bottom;
    const c3x = targetPos.x + right, c3z = targetPos.z + top;
    const c4x = targetPos.x + left,  c4z = targetPos.z + top;

    // ── 1. Update Sun Ray & 4 Corner Beams ──
    const rayArr = shadowRayLines.geometry.attributes.position.array;
    let rIdx = 0;

    // Central Sun Ray (Light Source -> Target Center)
    rayArr[rIdx++] = lightPos.x; rayArr[rIdx++] = lightPos.y; rayArr[rIdx++] = lightPos.z;
    rayArr[rIdx++] = targetPos.x; rayArr[rIdx++] = groundY;    rayArr[rIdx++] = targetPos.z;

    // 4 Corner Beams (Light Source -> 4 Ground Corners)
    const corners = [ [c1x, c1z], [c2x, c2z], [c3x, c3z], [c4x, c4z] ];
    for (let i = 0; i < 4; i++) {
        rayArr[rIdx++] = lightPos.x; rayArr[rIdx++] = lightPos.y; rayArr[rIdx++] = lightPos.z;
        rayArr[rIdx++] = corners[i][0]; rayArr[rIdx++] = groundY; rayArr[rIdx++] = corners[i][1];
    }
    shadowRayLines.geometry.attributes.position.needsUpdate = true;

    // ── 2. Update Ground Outer Boundary Box & Internal Grid ──
    const gArr = shadowGroundBoundary.geometry.attributes.position.array;
    let gIdx = 0;

    // Outer Rectangle Outline (4000x4000)
    gArr[gIdx++] = c1x; gArr[gIdx++] = groundY; gArr[gIdx++] = c1z;
    gArr[gIdx++] = c2x; gArr[gIdx++] = groundY; gArr[gIdx++] = c2z;

    gArr[gIdx++] = c2x; gArr[gIdx++] = groundY; gArr[gIdx++] = c2z;
    gArr[gIdx++] = c3x; gArr[gIdx++] = groundY; gArr[gIdx++] = c3z;

    gArr[gIdx++] = c3x; gArr[gIdx++] = groundY; gArr[gIdx++] = c3z;
    gArr[gIdx++] = c4x; gArr[gIdx++] = groundY; gArr[gIdx++] = c4z;

    gArr[gIdx++] = c4x; gArr[gIdx++] = groundY; gArr[gIdx++] = c4z;
    gArr[gIdx++] = c1x; gArr[gIdx++] = groundY; gArr[gIdx++] = c1z;

    // Interior Grid Subdivisions (3 horizontal + 3 vertical)
    for (let k = 1; k <= 3; k++) {
        const t = k / 4;
        const zPos = c1z + (c4z - c1z) * t;
        gArr[gIdx++] = c1x; gArr[gIdx++] = groundY; gArr[gIdx++] = zPos;
        gArr[gIdx++] = c2x; gArr[gIdx++] = groundY; gArr[gIdx++] = zPos;

        const xPos = c1x + (c2x - c1x) * t;
        gArr[gIdx++] = xPos; gArr[gIdx++] = groundY; gArr[gIdx++] = c1z;
        gArr[gIdx++] = xPos; gArr[gIdx++] = groundY; gArr[gIdx++] = c4z;
    }
    shadowGroundBoundary.geometry.attributes.position.needsUpdate = true;

    // ── 3. Update Radial Vision Shadow Boundary Circle (R=2700) ──
    const circleRadius = 2700;
    const circleSegments = 64;
    const cirArr = shadowRadialCircle.geometry.attributes.position.array;
    let cIdx = 0;

    for (let i = 0; i < circleSegments; i++) {
        const a1 = (i / circleSegments) * Math.PI * 2;
        const a2 = ((i + 1) / circleSegments) * Math.PI * 2;

        cirArr[cIdx++] = targetPos.x + Math.sin(a1) * circleRadius;
        cirArr[cIdx++] = groundY + 0.3;
        cirArr[cIdx++] = targetPos.z + Math.cos(a1) * circleRadius;

        cirArr[cIdx++] = targetPos.x + Math.sin(a2) * circleRadius;
        cirArr[cIdx++] = groundY + 0.3;
        cirArr[cIdx++] = targetPos.z + Math.cos(a2) * circleRadius;
    }
    shadowRadialCircle.geometry.attributes.position.needsUpdate = true;

    // ── 4. Update Single Texel Step Footprint Cell ──
    const shadowWidth = right - left;
    const texelSize = shadowWidth / dirLight.shadow.mapSize.width;
    const halfCell = Math.max(texelSize * 10, 10.0);

    const cx = targetPos.x;
    const cz = targetPos.z;
    const tArr = shadowTexelCell.geometry.attributes.position.array;
    let tIdx = 0;

    // Texel Cell Outline
    tArr[tIdx++] = cx - halfCell; tArr[tIdx++] = groundY + 0.5; tArr[tIdx++] = cz - halfCell;
    tArr[tIdx++] = cx + halfCell; tArr[tIdx++] = groundY + 0.5; tArr[tIdx++] = cz - halfCell;

    tArr[tIdx++] = cx + halfCell; tArr[tIdx++] = groundY + 0.5; tArr[tIdx++] = cz - halfCell;
    tArr[tIdx++] = cx + halfCell; tArr[tIdx++] = groundY + 0.5; tArr[tIdx++] = cz + halfCell;

    tArr[tIdx++] = cx + halfCell; tArr[tIdx++] = groundY + 0.5; tArr[tIdx++] = cz + halfCell;
    tArr[tIdx++] = cx - halfCell; tArr[tIdx++] = groundY + 0.5; tArr[tIdx++] = cz + halfCell;

    tArr[tIdx++] = cx - halfCell; tArr[tIdx++] = groundY + 0.5; tArr[tIdx++] = cz + halfCell;
    tArr[tIdx++] = cx - halfCell; tArr[tIdx++] = groundY + 0.5; tArr[tIdx++] = cz - halfCell;

    // Texel Cell Center Crosshair
    tArr[tIdx++] = cx - halfCell; tArr[tIdx++] = groundY + 0.5; tArr[tIdx++] = cz;
    tArr[tIdx++] = cx + halfCell; tArr[tIdx++] = groundY + 0.5; tArr[tIdx++] = cz;

    tArr[tIdx++] = cx;            tArr[tIdx++] = groundY + 0.5; tArr[tIdx++] = cz - halfCell;
    tArr[tIdx++] = cx;            tArr[tIdx++] = groundY + 0.5; tArr[tIdx++] = cz + halfCell;

    shadowTexelCell.geometry.attributes.position.needsUpdate = true;
}
