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

    /* ── Leaf Rustling Animation ── */
    animLeafMeshes.forEach(item => {
        const wobble = Math.sin(time * item.speed + item.phaseOffset);

        if (item.isDisc) {
            // For diorama leaf discs: gentle tilt sway (rotation-based, not scale)
            item.mesh.rotation.z = item.baseRotZ + wobble * 0.035;
            item.mesh.rotation.y = item.baseRotY + Math.cos(time * item.speed * 0.5 + item.phaseOffset) * 0.04;
            // Subtle vertical bob
            item.mesh.position.y = item.oy + Math.sin(time * item.speed * 0.3 + item.phaseOffset) * 0.8 * item.baseScale;
            if (item.line) {
                item.line.rotation.copy(item.mesh.rotation);
                item.line.position.copy(item.mesh.position);
            }
        } else if (item.isVertPlane) {
            // For vertical cross-planes: translate/rotate sway to match the wind
            const swayX = Math.cos(time * item.speed * 0.4 + item.phaseOffset) * 1.8 * item.baseScale;
            const swayZ = Math.sin(time * item.speed * 0.4 + item.phaseOffset) * 1.8 * item.baseScale;
            // Subtle tilt sway on rotation
            item.mesh.rotation.z = item.baseRotZ + wobble * 0.025;
            item.mesh.rotation.y = item.baseRotY + Math.cos(time * item.speed * 0.35 + item.phaseOffset) * 0.03;

            item.mesh.position.set(item.px + swayX, item.oy, item.pz + swayZ);
            if (item.line) {
                item.line.rotation.copy(item.mesh.rotation);
                item.line.position.copy(item.mesh.position);
            }
        } else {
            // Legacy sphere/bush sway (scale-based)
            const currentScale = item.baseScale * (1.0 + wobble * 0.04);
            item.mesh.scale.set(currentScale, currentScale, currentScale);
            if (item.line) item.line.scale.set(currentScale, currentScale, currentScale);

            const swayX = Math.cos(time * item.speed * 0.4 + item.phaseOffset) * 1.5 * item.baseScale;
            const swayZ = Math.sin(time * item.speed * 0.4 + item.phaseOffset) * 1.5 * item.baseScale;
            item.mesh.position.set(item.px + item.ox + swayX, item.trunkHeight + item.oy, item.pz + item.oz + swayZ);
            if (item.line) item.line.position.copy(item.mesh.position);
        }
    });

    /* ── Falling Leaves Animation ── */
    leafParticles.forEach(p => {
        p.mesh.position.x += p.vx * dt;
        p.mesh.position.y += p.vy * dt;
        p.mesh.position.z += p.vz * dt;

        // Tumbling rotation
        p.mesh.rotation.x += p.rotXSpeed * dt;
        p.mesh.rotation.y += p.rotYSpeed * dt;

        // Wind sway drift (flutter)
        p.mesh.position.x += Math.sin(time * 3 + p.mesh.position.y * 0.1) * 0.15;

        // Reset particle if it touches the floor (y <= 1.0)
        if (p.mesh.position.y <= 1.0) {
            p.mesh.position.y = p.trunkHeight + (20 + Math.random() * 20) * p.scale;
            p.mesh.position.x = p.baseX + (Math.random() - 0.5) * 45 * p.scale;
            p.mesh.position.z = p.baseZ + (Math.random() - 0.5) * 45 * p.scale;
        }
    });

    /* ── Flower Swaying Animation ── */
    animFlowers.forEach(f => {
        const sway = Math.sin(time * f.speed + f.phaseOffset) * 0.8 * f.scale;
        f.mesh.position.x = f.baseX + sway;
        if (f.line) f.line.position.copy(f.mesh.position);
    });

    /* ── Camera 3D Orbit Tracking ── */
    const px = playerGroup.position.x;
    const py = playerGroup.position.y;
    const pz = playerGroup.position.z;

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
    coordsEl.textContent = `x: ${Math.round(px)}  z: ${Math.round(pz)}`;

    renderer.render(scene, camera);

    if (typeof perfMonitor !== 'undefined') {
        perfMonitor.record(performance.now() - frameStart);
    }
}

animate();
