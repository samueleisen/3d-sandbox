/* ───────────────────────────────────────────────
    PLAYER CONTROLLER
    Movement physics · collision sliding · 8-dir facing ·
    idle ↔ walk cross-fade · animation mixer tick

    Animation contract (HeroMC-Animation.glb):
      idleAction  = "Hero-Idle"  — plays at weight 1 by default
      walkAction  = "Hero-Walk"  — cross-fades in when moving

    Depends on: scene, playerGroup, pShadow,
                mixer, idleAction, walkAction, isWalking, glbReady,
                keys, PLAYER_SPEED, PLAYER_RADIUS,
                HALF_WIDTH, HALF_DEPTH, testCollision
─────────────────────────────────────────────── */

// Blend duration constants — easy to tweak
const WALK_FADE_IN  = 0.20;   // seconds
const WALK_FADE_OUT = 0.30;   // seconds

function updatePlayerController(dt) {

    // Tick the mixer regardless — lets blend-outs finish cleanly
    if (mixer) mixer.update(dt);
    if (!glbReady) return;

    /* ── 1. Movement input → displacement ───────────────────── */
    let dx = 0, dz = 0;
    if (keys.w) dz -= 1;   // forward  → −Z
    if (keys.s) dz += 1;   // back     → +Z
    if (keys.a) dx -= 1;   // left     → −X
    if (keys.d) dx += 1;   // right    → +X

    const len = Math.sqrt(dx * dx + dz * dz);
    if (len > 0) {
        dx = (dx / len) * PLAYER_SPEED * dt;
        dz = (dz / len) * PLAYER_SPEED * dt;
    }

    /* ── 2. Collision-sliding movement ──────────────────────── */
    let px = playerGroup.position.x;
    let pz = playerGroup.position.z;

    const newX = THREE.MathUtils.clamp(px + dx, -HALF_WIDTH + PLAYER_RADIUS, HALF_WIDTH - PLAYER_RADIUS);
    if (!testCollision(newX, pz)) px = newX;

    const newZ = THREE.MathUtils.clamp(pz + dz, -HALF_DEPTH + PLAYER_RADIUS, HALF_DEPTH - PLAYER_RADIUS);
    if (!testCollision(px, newZ)) pz = newZ;

    playerGroup.position.set(px, 0, pz);
    pShadow.position.x = px;
    pShadow.position.z = pz;

    /* ── 3. 8-dir smooth rotation ────────────────────────────── */
    const rawDx    = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
    const rawDz    = (keys.s ? 1 : 0) - (keys.w ? 1 : 0);
    const isMoving = rawDx !== 0 || rawDz !== 0;

    if (isMoving) {
        const targetAngle = Math.atan2(rawDx, rawDz);
        let diff = targetAngle - playerGroup.rotation.y;
        while (diff >  Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        playerGroup.rotation.y += diff * Math.min(1, 12 * dt);
    }

    /* ── 4. Idle ↔ Walk cross-fade ───────────────────────────── */
    if (isMoving && !isWalking) {
        // Transition: Idle → Walk
        if (idleAction) idleAction.fadeOut(WALK_FADE_IN);
        if (walkAction) walkAction.reset().fadeIn(WALK_FADE_IN).play();
        isWalking = true;

    } else if (!isMoving && isWalking) {
        // Transition: Walk → Idle
        if (walkAction) walkAction.fadeOut(WALK_FADE_OUT);
        if (idleAction) idleAction.reset().fadeIn(WALK_FADE_OUT).play();
        isWalking = false;
    }
}
