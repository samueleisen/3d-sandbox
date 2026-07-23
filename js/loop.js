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

    /* ── Leaf Rustling Animation with Smooth Dissolve & LOD Culling ── */
    animLeafMeshes.forEach(item => {
        totalTrackedObjects++;
        let fadeAlpha = 1.0;

        if (cullingMode !== 'off') {
            const dx = item.px - px;
            const dz = item.pz - pz;
            const distSq = dx * dx + dz * dz;

            // 1. Distance Culling
            if (distSq > maxVisDistSq) {
                item.mesh.visible = false;
                if (item.line) item.line.visible = false;
                return;
            }

            // 2. Forgiving View Frustum Culling
            cullingSphere.center.set(item.px, item.oy, item.pz);
            cullingSphere.radius = (item.baseRadius || 30) * item.baseScale + cullingMargin;

            if (!cameraFrustum.intersectsSphere(cullingSphere)) {
                item.mesh.visible = false;
                if (item.line) item.line.visible = false;
                return;
            }

            // 3. Slow Gentle Smoothstep Dissolve Fade
            fadeAlpha = calcSmoothFade(distSq);
        }

        if (fadeAlpha <= 0.001) {
            item.mesh.visible = false;
            if (item.line) item.line.visible = false;
            return;
        }

        item.mesh.visible = true;
        if (item.line) item.line.visible = true;
        activeObjectsCount++;

        // Smooth Scale Dissolve factor
        const scaleFade = item.baseScale * fadeAlpha;

        // LOD Animation Math Bypass for distant objects
        const isFarLOD = fadeAlpha < 0.4;
        const wobble = isFarLOD ? 0 : Math.sin(time * item.speed + item.phaseOffset);

        if (item.isDisc) {
            item.mesh.scale.set(scaleFade, scaleFade, scaleFade);
            if (!isFarLOD) {
                item.mesh.rotation.z = item.baseRotZ + wobble * 0.035;
                item.mesh.rotation.y = item.baseRotY + Math.cos(time * item.speed * 0.5 + item.phaseOffset) * 0.04;
                item.mesh.position.y = item.oy + Math.sin(time * item.speed * 0.3 + item.phaseOffset) * 0.8 * item.baseScale;
            }
        } else if (item.isVertPlane) {
            item.mesh.scale.set(scaleFade, scaleFade, scaleFade);
            if (!isFarLOD) {
                const swayX = Math.cos(time * item.speed * 0.4 + item.phaseOffset) * 1.8 * item.baseScale;
                const swayZ = Math.sin(time * item.speed * 0.4 + item.phaseOffset) * 1.8 * item.baseScale;
                item.mesh.rotation.z = item.baseRotZ + wobble * 0.025;
                item.mesh.rotation.y = item.baseRotY + Math.cos(time * item.speed * 0.35 + item.phaseOffset) * 0.03;
                item.mesh.position.set(item.px + swayX, item.oy, item.pz + swayZ);
            }
        } else {
            // Bushes
            const currentScale = scaleFade * (1.0 + wobble * 0.04);
            item.mesh.scale.set(currentScale, currentScale, currentScale);
            if (!isFarLOD) {
                const swayX = Math.cos(time * item.speed * 0.4 + item.phaseOffset) * 1.5 * item.baseScale;
                const swayZ = Math.sin(time * item.speed * 0.4 + item.phaseOffset) * 1.5 * item.baseScale;
                item.mesh.position.set(item.px + item.ox + swayX, item.trunkHeight + item.oy, item.pz + item.oz + swayZ);
            }
        }
    });

    /* ── Falling Leaves Animation with Smooth Dissolve & LOD Culling ── */
    leafParticles.forEach(p => {
        totalTrackedObjects++;
        let pFade = 1.0;

        if (cullingMode !== 'off') {
            const dx = p.baseX - px;
            const dz = p.baseZ - pz;
            const distSq = dx * dx + dz * dz;

            if (distSq > maxVisDistSq) {
                p.mesh.visible = false;
                return;
            }

            cullingSphere.center.copy(p.mesh.position);
            cullingSphere.radius = 15 + cullingMargin;

            if (!cameraFrustum.intersectsSphere(cullingSphere)) {
                p.mesh.visible = false;
                return;
            }

            pFade = calcSmoothFade(distSq);
        }

        if (pFade <= 0.001) {
            p.mesh.visible = false;
            return;
        }

        p.mesh.visible = true;
        p.mesh.scale.setScalar(pFade);
        activeObjectsCount++;

        // Only update physics for near particles (LOD optimization)
        if (pFade >= 0.35) {
            p.mesh.position.x += p.vx * dt;
            p.mesh.position.y += p.vy * dt;
            p.mesh.position.z += p.vz * dt;
            p.mesh.rotation.x += p.rotXSpeed * dt;
            p.mesh.rotation.y += p.rotYSpeed * dt;
            p.mesh.position.x += Math.sin(time * 3 + p.mesh.position.y * 0.1) * 0.15;

            if (p.mesh.position.y <= 1.0) {
                p.mesh.position.y = p.trunkHeight + (20 + Math.random() * 20) * p.scale;
                p.mesh.position.x = p.baseX + (Math.random() - 0.5) * 45 * p.scale;
                p.mesh.position.z = p.baseZ + (Math.random() - 0.5) * 45 * p.scale;
            }
        }
    });

    /* ── Flower Swaying Animation with Smooth Dissolve & LOD Culling ── */
    animFlowers.forEach(f => {
        totalTrackedObjects++;
        let fFade = 1.0;

        if (cullingMode !== 'off') {
            const dx = f.baseX - px;
            const dz = f.baseZ - pz;
            const distSq = dx * dx + dz * dz;

            if (distSq > maxVisDistSq) {
                f.mesh.visible = false;
                if (f.line) f.line.visible = false;
                return;
            }

            cullingSphere.center.set(f.baseX, f.y, f.baseZ);
            cullingSphere.radius = 15 + cullingMargin;

            if (!cameraFrustum.intersectsSphere(cullingSphere)) {
                f.mesh.visible = false;
                if (f.line) f.line.visible = false;
                return;
            }

            fFade = calcSmoothFade(distSq);
        }

        if (fFade <= 0.001) {
            f.mesh.visible = false;
            if (f.line) f.line.visible = false;
            return;
        }

        f.mesh.visible = true;
        if (f.line) f.line.visible = true;
        f.mesh.scale.set(fFade, fFade, fFade);
        activeObjectsCount++;

        if (fFade >= 0.35) {
            const sway = Math.sin(time * f.speed + f.phaseOffset) * 0.8 * f.scale;
            f.mesh.position.x = f.baseX + sway;
            if (f.line) f.line.position.copy(f.mesh.position);
        }
    });

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
