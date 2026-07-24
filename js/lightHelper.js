/* ───────────────────────────────────────────────
    LIGHT DIRECTION & RADIAL VISION HELPER
    Draws a single central sun ray line and the pinkish radial shadow vision circle (R=2700).
─────────────────────────────────────────────── */

let lightHelperGroup = null;
let centerSunRayLine = null;
let shadowRadialCircle = null;
let lightHelperEnabled = true;

/**
 * Creates visual 3D Center Light Ray & Pinkish Radial Vision Circle.
 */
function createLightHelper() {
    if (lightHelperGroup) {
        scene.remove(lightHelperGroup);
        lightHelperGroup = null;
    }

    lightHelperGroup = new THREE.Group();

    // 1. Central Sun Ray Line (Golden Beam connecting light source to player target)
    const rayPositions = new Float32Array(6); // 2 vertices (start -> end)
    const rayGeo = new THREE.BufferGeometry();
    rayGeo.setAttribute('position', new THREE.BufferAttribute(rayPositions, 3));

    const rayMat = new THREE.LineBasicMaterial({
        color: 0xffd700, // Vibrant Gold
        linewidth: 2,
        transparent: true,
        opacity: 0.85,
        depthTest: false
    });

    centerSunRayLine = new THREE.Line(rayGeo, rayMat);
    centerSunRayLine.renderOrder = 999;
    lightHelperGroup.add(centerSunRayLine);

    // 2. Radial Vision Shadow Circle (R=2700 Units, Neon Magenta / Pinkish)
    const circleSegments = 64;
    const circlePositions = new Float32Array(circleSegments * 2 * 3);
    const circleGeo = new THREE.BufferGeometry();
    circleGeo.setAttribute('position', new THREE.BufferAttribute(circlePositions, 3));

    const circleMat = new THREE.LineBasicMaterial({
        color: 0xff00ff, // Neon Magenta / Pinkish
        linewidth: 2,
        transparent: true,
        opacity: 0.85,
        depthTest: false
    });

    shadowRadialCircle = new THREE.LineSegments(circleGeo, circleMat);
    shadowRadialCircle.renderOrder = 999;
    lightHelperGroup.add(shadowRadialCircle);

    scene.add(lightHelperGroup);
}

/**
 * Dynamically updates 3D Center Light Ray & Pinkish Radial Vision Circle.
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
    const groundY = 1.5;

    // 1. Update Central Sun Ray Line (Light Source -> Player Target Center)
    const rArr = centerSunRayLine.geometry.attributes.position.array;
    rArr[0] = lightPos.x;  rArr[1] = lightPos.y;  rArr[2] = lightPos.z;
    rArr[3] = targetPos.x; rArr[4] = groundY;     rArr[5] = targetPos.z;
    centerSunRayLine.geometry.attributes.position.needsUpdate = true;

    // 2. Update Pinkish Radial Vision Circle (R=2700)
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
}
