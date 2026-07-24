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

    // Track floor mesh beneath player for infinite ground coverage
    if (typeof floor !== 'undefined') {
        floor.position.x = px;
        floor.position.z = pz;
    }

    /* ── Faraway Object Horizon Sink & Scale Displacement ── */
    if (typeof updateHorizonDisplacement === 'function') {
        updateHorizonDisplacement(px, pz);
    }

    /* ── Animated Monuments (Floating Top Crystal & Multi Blue Energy Rings) ── */
    if (typeof animatedMonuments !== 'undefined' && animatedMonuments.length > 0) {
        for (let i = 0; i < animatedMonuments.length; i++) {
            const m = animatedMonuments[i];
            if (m.crystal) {
                m.crystal.rotation.y += 0.8 * dt;
            }
            if (m.rings) {
                for (let r = 0; r < m.rings.length; r++) {
                    const rData = m.rings[r];
                    rData.mesh.rotation.z += rData.speed * dt;
                    rData.mesh.position.y = rData.baseY + Math.sin(time * 2.2 + r * 1.5 + i) * rData.oscAmp;
                }
            }
        }
    }

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

    /* ── View-Frustum Aligned & Texel-Snapped Shadow Tracking ── */
    // Camera forward unit vector on horizontal ground plane
    const fwdX = -Math.sin(yawRad);
    const fwdZ = -Math.cos(yawRad);

    // Shift shadow box center forward (in front of player/camera)
    const SHADOW_FORWARD_OFFSET = 500; // Shift shadow box forward for extended far grass shadows
    const shadowTargetX = px + fwdX * SHADOW_FORWARD_OFFSET;
    const shadowTargetY = 0; // Anchored to ground level
    const shadowTargetZ = pz + fwdZ * SHADOW_FORWARD_OFFSET;

    // Calculate light source offset
    let shadowCamX = shadowTargetX + 200;
    let shadowCamY = shadowTargetY + 450;
    let shadowCamZ = shadowTargetZ + 200;

    // Snap position to shadow map texel grid to stop shadow edge flickering during movement
    const shadowWidth = dirLight.shadow.camera.right - dirLight.shadow.camera.left;
    const texelSize = shadowWidth / dirLight.shadow.mapSize.width;
    shadowCamX = Math.floor(shadowCamX / texelSize) * texelSize;
    shadowCamZ = Math.floor(shadowCamZ / texelSize) * texelSize;

    dirLight.position.set(shadowCamX, shadowCamY, shadowCamZ);
    dirLight.target.position.set(shadowTargetX, shadowTargetY, shadowTargetZ);
    dirLight.target.updateMatrixWorld();

    /* ── HUD ── */
    coordsEl.textContent = `x: ${Math.round(px)}  z: ${Math.round(pz)}`;

    renderer.render(scene, camera);

    if (typeof perfMonitor !== 'undefined') {
        perfMonitor.record(performance.now() - frameStart);
    }
}

animate();
