/* ───────────────────────────────────────────────
    COLLISION HELPERS
    getPlayerAABB · testCollision
    Depends on: obstacles[] (world.js), PLAYER_RADIUS, PLAYER_HEIGHT
─────────────────────────────────────────────── */

/**
 * Screen-relative movement is mapped to world-space vectors.
 * Because the camera looks "down-and-forward", screen-UP maps
 * to world -Z (north), screen-RIGHT maps to world +X (east).
 * This keeps "Up is Up" regardless of camera tilt.
 */

function getPlayerAABB(px, pz) {
    return new THREE.Box3(
        new THREE.Vector3(px - PLAYER_RADIUS, 0,               pz - PLAYER_RADIUS),
        new THREE.Vector3(px + PLAYER_RADIUS, PLAYER_HEIGHT + PLAYER_RADIUS * 2, pz + PLAYER_RADIUS)
    );
}

function testCollision(px, pz) {
    const pBox = getPlayerAABB(px, pz);
    for (const obs of obstacles) {
        if (pBox.intersectsBox(obs.box)) return true;
    }
    return false;
}
