/* ───────────────────────────────────────────────
    ANIMATION LOOP
    animate() — movement · facing · skeletal anim ·
    leaf rustle · falling leaves · flower sway ·
    camera tracking · HUD
    Depends on: all other modules
─────────────────────────────────────────────── */
const clock = new THREE.Clock();
const coordsEl = document.getElementById('coords');

// Smooth camera tracking
let camTargetX = 0, camTargetZ = 0;
const CAM_LERP = 8; // higher = snappier

// Reusable frustum calculation objects (prevents GC allocation per frame)
const cameraFrustum = new THREE.Frustum();
const projScreenMatrix = new THREE.Matrix4();
const cullingSphere = new THREE.Sphere();
let totalCulledObjects = 0;

function animate() {
    requestAnimationFrame(animate);
    const frameStart = performance.now();
    const dt = Math.min(clock.getDelta(), 0.05); // cap to avoid tunnelling
    const time = clock.elapsedTime;

    /* ── Player Physics, Animation & Ponytail Secondary Motion ── */
    updatePlayerController(dt);

    const px = playerGroup.position.x;
    const py = playerGroup.position.y;
    const pz = playerGroup.position.z;

    /* ── Interactive Grass Collision Bending & Wind Sway ── */
    if (typeof updateGrassPhysics === 'function') {
        updateGrassPhysics(px, py, pz, dt, time);
    }

    /* ── Camera FOV Vision Boundary Helper Lines ── */
    if (typeof updateCameraFOVHelper === 'function') {
        updateCameraFOVHelper(px, py, pz);
    }

    /* ── Camera 3D Orbit Tracking ── */

    const pitchRad = THREE.MathUtils.degToRad(camAngleDeg);
    const yawRad = THREE.MathUtils.degToRad(camYawDeg || 0);

    const groundDist = camHeight * Math.sin(pitchRad);
    const camOffsetY = camHeight * Math.cos(pitchRad);
    const camOffsetX = groundDist * Math.sin(yawRad);
    const camOffsetZ = groundDist * Math.cos(yawRad);

    camera.position.x = px + camOffsetX;
    camera.position.y = py + camOffsetY;
    camera.position.z = pz + camOffsetZ;
    camera.lookAt(px, py + 12, pz);

    /* ── Compute Camera View Frustum for Object Culling ── */
    camera.updateMatrixWorld();
    projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    cameraFrustum.setFromProjectionMatrix(projScreenMatrix);

    let activeObjectsCount = 0;
    let totalTrackedObjects = 0;

    // Wide inner distance threshold (35% of maxVisDist) for a very slow, gentle shrink transition
    const innerDist = maxVisDist * 0.35;
    const innerDistSq = innerDist * innerDist;

    // Helper for smoothstep easing fade (keeps scale high for longer, easing down gradually)
    function calcSmoothFade(distSq) {
        if (distSq <= innerDistSq) return 1.0;
        if (distSq >= maxVisDistSq) return 0.0;
        const dist = Math.sqrt(distSq);
        const t = (dist - innerDist) / (maxVisDist - innerDist);
        return 1.0 - (t * t * (3 - 2 * t));
    }



    /* ── View-Frustum Aligned & Texel-Snapped Shadow Tracking ── */
    // Camera forward unit vector on horizontal ground plane
    const fwdX = -Math.sin(yawRad);
    const fwdZ = -Math.cos(yawRad);

    // Shift shadow box center forward (in front of player/camera)
    const SHADOW_FORWARD_OFFSET = 200; // Increase to shift box further forward/North ! important manual changes
    const shadowTargetX = px + fwdX * SHADOW_FORWARD_OFFSET;
    const shadowTargetY = 0; // Anchored to ground level so jumps do not lift/bounce the shadow camera
    const shadowTargetZ = pz + fwdZ * SHADOW_FORWARD_OFFSET;

    // Calculate light source offset
    let shadowCamX = shadowTargetX + 200;
    let shadowCamY = shadowTargetY + 450; // Fixed light height relative to ground
    let shadowCamZ = shadowTargetZ + 200;

    // Snap position to shadow map texel grid to stop shadow edge flickering/swimming during movement
    const shadowWidth = dirLight.shadow.camera.right - dirLight.shadow.camera.left;
    const texelSize = shadowWidth / dirLight.shadow.mapSize.width;
    shadowCamX = Math.floor(shadowCamX / texelSize) * texelSize;
    shadowCamZ = Math.floor(shadowCamZ / texelSize) * texelSize;

    dirLight.position.set(shadowCamX, shadowCamY, shadowCamZ);
    dirLight.target.position.set(shadowTargetX, shadowTargetY, shadowTargetZ);
    dirLight.target.updateMatrixWorld();
    if (typeof shadowHelper !== 'undefined') shadowHelper.update();

    /* ── HUD ── */
    coordsEl.textContent = `x: ${Math.round(px)}  z: ${Math.round(pz)} | Active: ${activeObjectsCount}/${totalTrackedObjects}`;

    renderer.render(scene, camera);

    if (typeof perfMonitor !== 'undefined') {
        perfMonitor.record(performance.now() - frameStart);
    }
}

animate();
