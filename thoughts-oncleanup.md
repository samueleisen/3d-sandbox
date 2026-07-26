5. 
cameraFOVHelper.js
Visual Arc Misalignment Bug:
Boundary ray lines (left, right, center) originate correctly from camera ground coordinates (camX, camZ). However, the far FOV boundary arc (Lines 100-106) calculates points relative to player position (px, pz).
Fix: Update arc calculations to use (camX, camZ) so rays and arc share the exact same origin.
8. 
ponytailPhysics.js
Redundant Per-Frame Math:
maxBasePitch = MAX_TOTAL_PITCH / chainSum (Lines 87-91) is calculated inside updatePonytailPhysics(dt) on every single frame.
Optimization: Move maxBasePitch calculation outside the function as a module constant.
9. 
horizonSink.js
Suboptimal Loop Math:
Line 36: range = Math.max(1, HORIZON_SINK_END - HORIZON_SINK_START) is computed inside updateHorizonDisplacement() every frame.
Line 48: Math.sqrt(dx * dx + dz * dz) runs per object.
Optimization: Cache range and invRange to replace division with multiplication.
10. 
scenePlacement.js
Redundant Script Wrapper:
Contains only 11 lines invoking createGrassLandscape(80000). Can be consolidated into grass.js or loop.js to reduce script file count.