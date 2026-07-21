/* ───────────────────────────────────────────────
    ANIMATION LOOP
    animate() — movement · facing · skeletal anim ·
    leaf rustle · falling leaves · flower sway ·
    camera tracking · HUD
    Depends on: all other modules
─────────────────────────────────────────────── */
const clock    = new THREE.Clock();
const coordsEl = document.getElementById('coords');

// Smooth camera tracking
let camTargetX = 0, camTargetZ = 0;
const CAM_LERP = 8; // higher = snappier

function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05); // cap to avoid tunnelling

    /* ── Movement ── */
    let dx = 0, dz = 0;
    if (keys.w) dz -= 1;  // screen UP    → world -Z
    if (keys.s) dz += 1;  // screen DOWN  → world +Z
    if (keys.a) dx -= 1;  // screen LEFT  → world -X
    if (keys.d) dx += 1;  // screen RIGHT → world +X

    // Normalize diagonal movement
    const len = Math.sqrt(dx * dx + dz * dz);
    if (len > 0) {
        dx = (dx / len) * PLAYER_SPEED * dt;
        dz = (dz / len) * PLAYER_SPEED * dt;
    }

    let px = playerGroup.position.x;
    let pz = playerGroup.position.z;

    // Try X axis independently for wall-sliding
    let newX = px + dx;
    newX = THREE.MathUtils.clamp(newX, -HALF_WIDTH + PLAYER_RADIUS, HALF_WIDTH - PLAYER_RADIUS);
    if (!testCollision(newX, pz)) {
        px = newX;
    }

    // Try Z axis independently for wall-sliding
    let newZ = pz + dz;
    newZ = THREE.MathUtils.clamp(newZ, -HALF_DEPTH + PLAYER_RADIUS, HALF_DEPTH - PLAYER_RADIUS);
    if (!testCollision(px, newZ)) {
        pz = newZ;
    }

    playerGroup.position.x = px;
    playerGroup.position.z = pz;

    // Player shadow follows
    pShadow.position.x = px;
    pShadow.position.z = pz;

    /* ── 8-Directional Facing & Walk Animation ── */
    const rawDx   = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
    const rawDz   = (keys.s ? 1 : 0) - (keys.w ? 1 : 0);
    const isMoving = rawDx !== 0 || rawDz !== 0;

    // Smooth rotation toward movement direction
    if (isMoving) {
        const targetAngle = Math.atan2(rawDx, rawDz);
        let angleDiff = targetAngle - playerGroup.rotation.y;
        // Shortest-arc wrap to [-PI, PI]
        while (angleDiff >  Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        playerGroup.rotation.y += angleDiff * Math.min(1, 12 * dt);
    }

    // Walk animation fade-in / fade-out
    if (isMoving && !isWalking) {
        walkAction.reset().fadeIn(0.15).play();
        isWalking = true;
    } else if (!isMoving && isWalking) {
        walkAction.fadeOut(0.25);
        isWalking = false;
    }

    // Tick the skeletal animation mixer
    mixer.update(dt);

    // Lock player height to ground (no idle bob)
    playerGroup.position.y = 0;

    /* ── Leaf Rustling Animation ── */
    const time = clock.elapsedTime;
    animLeafMeshes.forEach(item => {
        const wobble = Math.sin(time * item.speed + item.phaseOffset);

        if (item.isDisc) {
            // For diorama leaf discs: gentle tilt sway (rotation-based, not scale)
            item.mesh.rotation.z = item.baseRotZ + wobble * 0.035;
            item.mesh.rotation.y = item.baseRotY + Math.cos(time * item.speed * 0.5 + item.phaseOffset) * 0.04;
            // Subtle vertical bob
            item.mesh.position.y = item.oy + Math.sin(time * item.speed * 0.3 + item.phaseOffset) * 0.8 * item.baseScale;
            item.line.rotation.copy(item.mesh.rotation);
            item.line.position.copy(item.mesh.position);
        } else if (item.isVertPlane) {
            // For vertical cross-planes: translate/rotate sway to match the wind
            const swayX = Math.cos(time * item.speed * 0.4 + item.phaseOffset) * 1.8 * item.baseScale;
            const swayZ = Math.sin(time * item.speed * 0.4 + item.phaseOffset) * 1.8 * item.baseScale;
            // Subtle tilt sway on rotation
            item.mesh.rotation.z = item.baseRotZ + wobble * 0.025;
            item.mesh.rotation.y = item.baseRotY + Math.cos(time * item.speed * 0.35 + item.phaseOffset) * 0.03;

            item.mesh.position.set(item.px + swayX, item.oy, item.pz + swayZ);
            item.line.rotation.copy(item.mesh.rotation);
            item.line.position.copy(item.mesh.position);
        } else {
            // Legacy sphere/bush sway (scale-based)
            const currentScale = item.baseScale * (1.0 + wobble * 0.04);
            item.mesh.scale.set(currentScale, currentScale, currentScale);
            item.line.scale.set(currentScale, currentScale, currentScale);

            const swayX = Math.cos(time * item.speed * 0.4 + item.phaseOffset) * 1.5 * item.baseScale;
            const swayZ = Math.sin(time * item.speed * 0.4 + item.phaseOffset) * 1.5 * item.baseScale;
            item.mesh.position.set(item.px + item.ox + swayX, item.trunkHeight + item.oy, item.pz + item.oz + swayZ);
            item.line.position.copy(item.mesh.position);
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
        f.line.position.copy(f.mesh.position);
    });

    /* ── Camera tracking (always centered on player) ── */
    camTargetX = px;
    camTargetZ = pz;

    const camAngleRad = THREE.MathUtils.degToRad(camAngleDeg);
    const camOffsetY  = camHeight * Math.cos(camAngleRad);
    const camOffsetZ  = camHeight * Math.sin(camAngleRad);

    camera.position.x = camTargetX;
    camera.position.y = camOffsetY;
    camera.position.z = camTargetZ + camOffsetZ;
    camera.lookAt(camTargetX, 0, camTargetZ);

    /* ── HUD ── */
    coordsEl.textContent = `x: ${Math.round(px)}  z: ${Math.round(pz)}`;

    renderer.render(scene, camera);
}

animate();
