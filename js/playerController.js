/* ───────────────────────────────────────────────
    PLAYER CONTROLLER & ANIMATION SYSTEM
    Movement physics · collision sliding · 8-dir facing ·
    skeletal animation mixer · dynamic ponytail physics
    Depends on: scene, playerGroup, pShadow, mixer, walkAction,
                ponyBaseBone, ponyMidBone, ponyTipBone, keys,
                PLAYER_SPEED, PLAYER_RADIUS, HALF_WIDTH, HALF_DEPTH,
                GRAVITY, testCollision, clock
─────────────────────────────────────────────── */

// Persistent ponytail sway spring state
let ponySwayX = 0;
let ponySwayZ = 0;

function updatePlayerController(dt) {
    /* ── 1. Movement Physics & Collision ── */
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

    /* ── 2. 8-Directional Facing & Walk Animation ── */
    const rawDx   = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
    const rawDz   = (keys.s ? 1 : 0) - (keys.w ? 1 : 0);
    const isMoving = rawDx !== 0 || rawDz !== 0;

    // Smooth rotation toward movement direction
    let angleDiff = 0;
    if (isMoving) {
        const targetAngle = Math.atan2(rawDx, rawDz);
        angleDiff = targetAngle - playerGroup.rotation.y;
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

    /* ── 3. Dynamic Ponytail Secondary Physics & Gravity ── */
    const time = clock.elapsedTime;

    // Neutral straight-down rest pose (0 pitch at rest, lifts backward when moving)
    const motionLift = isMoving ? 0.35 : 0; // aerodynamic backward lift when running
    const targetSwayX = motionLift; // net pitch (0 at rest = hangs straight down)

    // Turning inertia (damped side sway)
    const targetSwayZ = isMoving ? THREE.MathUtils.clamp(-angleDiff * 0.45, -0.4, 0.4) : 0;

    // Smooth spring lerp towards target pitch & yaw
    ponySwayX += (targetSwayX - ponySwayX) * Math.min(1, 8 * dt);
    ponySwayZ += (targetSwayZ - ponySwayZ) * Math.min(1, 10 * dt);

    // Dynamic step bounce (when moving) and natural idle breathing sway
    const bouncePhase = isMoving ? Math.sin(time * 16) * 0.08 : 0;
    const idleSwayX   = Math.sin(time * 2.5) * 0.03 + bouncePhase;
    const idleSwayZ   = Math.cos(time * 1.8) * 0.03;

    // Direct assignment prevents frame-over-frame angle accumulation
    ponyBaseBone.rotation.x = ponySwayX + idleSwayX;
    ponyBaseBone.rotation.y = 0;
    ponyBaseBone.rotation.z = ponySwayZ + idleSwayZ;

    ponyMidBone.rotation.x  = ponySwayX * 0.7 + idleSwayX * 0.6;
    ponyMidBone.rotation.y  = 0;
    ponyMidBone.rotation.z  = ponySwayZ * 0.7 + idleSwayZ * 0.5;

    ponyTipBone.rotation.x  = ponySwayX * 0.5 + idleSwayX * 0.4;
    ponyTipBone.rotation.y  = 0;
    ponyTipBone.rotation.z  = ponySwayZ * 0.5 + idleSwayZ * 0.3;

    // Lock player height to ground
    playerGroup.position.y = 0;
}
