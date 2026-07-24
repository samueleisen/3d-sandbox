/* ───────────────────────────────────────────────
    HORIZON SINK & DISTANCE SCALE MANAGER
    registerHorizonObject · updateHorizonDisplacement
    Depends on: constants.js (HORIZON_SINK_START, HORIZON_SINK_END, HORIZON_MAX_SINK, HORIZON_MIN_SCALE)
─────────────────────────────────────────────── */

const horizonTrackedObjects = [];

/**
 * Registers a Three.js Object3D (mesh, group, model) to automatically scale down and sink
 * below the horizon line as distance from the camera increases.
 */
function registerHorizonObject(obj, customBaseScale = null, customBaseY = null) {
    if (!obj) return;

    const baseScale = customBaseScale !== null 
        ? (typeof customBaseScale === 'number' ? new THREE.Vector3(customBaseScale, customBaseScale, customBaseScale) : customBaseScale.clone())
        : obj.scale.clone();

    const baseY = customBaseY !== null ? customBaseY : obj.position.y;

    horizonTrackedObjects.push({
        obj,
        baseScale,
        baseY
    });
}

/**
 * Updates scale and vertical Y displacement for all registered objects relative to (camX, camZ).
 * Called every frame in loop.js.
 */
function updateHorizonDisplacement(camX, camZ) {
    if (horizonTrackedObjects.length === 0) return;

    const range = Math.max(1, HORIZON_SINK_END - HORIZON_SINK_START);

    for (let i = 0; i < horizonTrackedObjects.length; i++) {
        const item = horizonTrackedObjects[i];
        const obj = item.obj;

        // Obtain ground position of the object
        const ox = obj.position.x;
        const oz = obj.position.z;

        const dx = ox - camX;
        const dz = oz - camZ;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist <= HORIZON_SINK_START) {
            // Within full visibility range — 100% scale, original Y elevation
            obj.scale.copy(item.baseScale);
            obj.position.y = item.baseY;
            obj.visible = true;
        } else {
            // Linear scale interpolation t from 0.0 to 1.0
            const t = Math.min(1.0, (dist - HORIZON_SINK_START) / range);

            const currentScaleFactor = THREE.MathUtils.lerp(1.0, HORIZON_MIN_SCALE, t);
            
            // Slightly slower downward sink progression (Math.pow(t, 1.3) keeps object higher longer)
            const sinkY = Math.pow(t, 1.3) * HORIZON_MAX_SINK;

            if (currentScaleFactor <= 0.001) {
                obj.visible = false;
            } else {
                obj.visible = true;
                obj.scale.set(
                    item.baseScale.x * currentScaleFactor,
                    item.baseScale.y * currentScaleFactor,
                    item.baseScale.z * currentScaleFactor
                );
                obj.position.y = item.baseY - sinkY;
            }
        }
    }
}
