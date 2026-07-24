/* ───────────────────────────────────────────────
    CAMERA CONTROLS  (resize + UI panel + mouse & pointer-lock orbiting)
    Depends on: scene.js (initCamera, camera, renderer, aspect)
                constants.js (cameraType, camAngle*, camYawDeg, camFov, camViewSize)
                input.js (keys)
─────────────────────────────────────────────── */

/* ── Resize Handler ───────────────────────────── */
window.addEventListener('resize', () => {
    aspect = window.innerWidth / window.innerHeight;
    if (cameraType === 'persp') {
        camera.aspect = aspect;
    } else {
        camera.left   = -camViewSize * aspect;
        camera.right  =  camViewSize * aspect;
        camera.top    =  camViewSize;
        camera.bottom = -camViewSize;
    }
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ── Camera Controls UI Sync ─────────────────── */
const ctrlType   = document.getElementById('ctrl-type');
const ctrlTilt   = document.getElementById('ctrl-tilt');
const ctrlYaw    = document.getElementById('ctrl-yaw');
const ctrlHeight = document.getElementById('ctrl-height');
const ctrlFov    = document.getElementById('ctrl-fov');
const ctrlSize        = document.getElementById('ctrl-size');
const ctrlCullingMode = document.getElementById('ctrl-culling-mode');
const ctrlCullingDist = document.getElementById('ctrl-culling-dist');
const ctrlRenderScale = document.getElementById('ctrl-render-scale');
const ctrlGrassDensity = document.getElementById('ctrl-grass-density');

const valTilt        = document.getElementById('val-tilt');
const valYaw         = document.getElementById('val-yaw');
const valHeight      = document.getElementById('val-height');
const valFov         = document.getElementById('val-fov');
const valSize        = document.getElementById('val-size');
const valCullingDist = document.getElementById('val-culling-dist');

const groupFov        = document.getElementById('group-fov');
const groupSize       = document.getElementById('group-size');
const groupCullingDist= document.getElementById('group-culling-dist');

function syncUI() {
    cameraType  = ctrlType.value;
    camAngleDeg = parseFloat(ctrlTilt.value);
    camYawDeg   = parseFloat(ctrlYaw.value);
    camHeight   = parseFloat(ctrlHeight.value);
    camFov      = parseFloat(ctrlFov.value);
    camViewSize = parseFloat(ctrlSize.value);

    if (ctrlCullingMode) cullingMode = ctrlCullingMode.value;
    if (ctrlCullingDist) {
        maxVisDist = parseFloat(ctrlCullingDist.value);
        maxVisDistSq = maxVisDist * maxVisDist;
    }
    if (ctrlRenderScale) {
        renderScale = parseFloat(ctrlRenderScale.value);
        if (typeof renderer !== 'undefined') {
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2) * renderScale);
        }
    }

    updateUISliders();

    if (cameraType === 'persp') {
        groupFov.style.display  = '';
        groupSize.style.display = 'none';
    } else {
        groupFov.style.display  = 'none';
        groupSize.style.display = '';
    }
}

function updateUISliders() {
    if (ctrlTilt) ctrlTilt.value = camAngleDeg;
    if (valTilt) valTilt.textContent = `${Math.round(camAngleDeg)}°`;

    if (ctrlYaw) ctrlYaw.value = camYawDeg;
    if (valYaw) valYaw.textContent = `${Math.round(camYawDeg)}°`;

    if (ctrlHeight) ctrlHeight.value = camHeight;
    if (valHeight) valHeight.textContent = Math.round(camHeight);

    if (ctrlFov) ctrlFov.value = camFov;
    if (valFov) valFov.textContent = `${Math.round(camFov)}°`;

    if (ctrlSize) ctrlSize.value = camViewSize;
    if (valSize) valSize.textContent = Math.round(camViewSize);

    if (ctrlCullingDist) ctrlCullingDist.value = maxVisDist;
    if (valCullingDist) valCullingDist.textContent = Math.round(maxVisDist);

    if (ctrlRenderScale) ctrlRenderScale.value = renderScale;
}

ctrlType.addEventListener('change', () => {
    syncUI();
    initCamera();
});

if (ctrlGrassDensity) {
    ctrlGrassDensity.addEventListener('change', () => {
        const density = parseInt(ctrlGrassDensity.value, 10);
        if (typeof createGrassLandscape === 'function') {
            createGrassLandscape(density);
        }
    });
}

const ctrlFovLines = document.getElementById('ctrl-fov-lines');
if (ctrlFovLines) {
    ctrlFovLines.addEventListener('change', () => {
        fovHelperEnabled = ctrlFovLines.checked;
    });
}

const ctrlShadowHelper = document.getElementById('ctrl-shadow-helper');
if (ctrlShadowHelper) {
    ctrlShadowHelper.addEventListener('change', () => {
        if (typeof shadowHelper !== 'undefined') {
            shadowHelper.visible = ctrlShadowHelper.checked;
        }
    });
}

const ctrlLightHelper = document.getElementById('ctrl-light-helper');
if (ctrlLightHelper) {
    ctrlLightHelper.addEventListener('change', () => {
        if (typeof lightHelperEnabled !== 'undefined') {
            lightHelperEnabled = ctrlLightHelper.checked;
        }
    });
}

if (ctrlRenderScale) {
    ctrlRenderScale.addEventListener('change', () => {
        renderScale = parseFloat(ctrlRenderScale.value);
        if (typeof renderer !== 'undefined') {
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2) * renderScale);
        }
    });
}

if (ctrlCullingMode) {
    ctrlCullingMode.addEventListener('change', () => {
        cullingMode = ctrlCullingMode.value;
        if (cullingMode === 'generous') {
            maxVisDist = 1200;
            cullingMargin = 100;
        } else if (cullingMode === 'balanced') {
            maxVisDist = 800;
            cullingMargin = 60;
        } else if (cullingMode === 'aggressive') {
            maxVisDist = 500;
            cullingMargin = 30;
        } else if (cullingMode === 'off') {
            maxVisDist = 99999;
            cullingMargin = 200;
        }
        maxVisDistSq = maxVisDist * maxVisDist;
        if (groupCullingDist) groupCullingDist.style.display = cullingMode === 'off' ? 'none' : '';
        updateUISliders();
    });
}

if (ctrlCullingDist) {
    ctrlCullingDist.addEventListener('input', () => {
        maxVisDist = parseFloat(ctrlCullingDist.value);
        maxVisDistSq = maxVisDist * maxVisDist;
        if (valCullingDist) valCullingDist.textContent = Math.round(maxVisDist);
    });
}

ctrlTilt.addEventListener('input', () => {
    camAngleDeg = parseFloat(ctrlTilt.value);
    if (valTilt) valTilt.textContent = `${Math.round(camAngleDeg)}°`;
});

ctrlYaw.addEventListener('input', () => {
    camYawDeg = parseFloat(ctrlYaw.value);
    if (valYaw) valYaw.textContent = `${Math.round(camYawDeg)}°`;
});

ctrlHeight.addEventListener('input', () => {
    camHeight = parseFloat(ctrlHeight.value);
    if (valHeight) valHeight.textContent = Math.round(camHeight);
});

ctrlFov.addEventListener('input', () => {
    camFov = parseFloat(ctrlFov.value);
    if (valFov) valFov.textContent = `${Math.round(camFov)}°`;
    if (cameraType === 'persp') {
        camera.fov = camFov;
        camera.updateProjectionMatrix();
    }
});

ctrlSize.addEventListener('input', () => {
    camViewSize = parseFloat(ctrlSize.value);
    if (valSize) valSize.textContent = Math.round(camViewSize);
    if (cameraType === 'ortho') {
        camera.left   = -camViewSize * aspect;
        camera.right  =  camViewSize * aspect;
        camera.top    =  camViewSize;
        camera.bottom = -camViewSize;
        camera.updateProjectionMatrix();
    }
});

/* ── Mouse Movement & Drag Orbit Controls ────── */
let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;

// Enable Pointer Lock on Canvas Click (optional 3D mouse look mode)
renderer.domElement.addEventListener('click', (e) => {
    // Only lock pointer if not clicking UI panels
    if (e.target.closest('#camera-panel') || e.target.closest('#ui-overlay')) return;
    if (document.pointerLockElement !== renderer.domElement) {
        renderer.domElement.requestPointerLock();
    }
});

// Drag Orbit handling (works both with pointer lock and drag-click)
window.addEventListener('mousedown', (e) => {
    if (e.target.closest('#camera-panel') || e.target.closest('#ui-overlay')) return;
    isDragging = true;
    previousMouseX = e.clientX;
    previousMouseY = e.clientY;
});

window.addEventListener('mousemove', (e) => {
    let deltaX = 0;
    let deltaY = 0;

    if (document.pointerLockElement === renderer.domElement) {
        // Pointer Lock Active: direct mouse movement
        deltaX = e.movementX;
        deltaY = e.movementY;
    } else if (isDragging) {
        // Drag Orbit Active: cursor movement delta
        deltaX = e.clientX - previousMouseX;
        deltaY = e.clientY - previousMouseY;
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
    } else {
        return;
    }

    // Horizontal Yaw (0° to 360°) — reversed axis
    camYawDeg = (camYawDeg - deltaX * 0.35) % 360;
    if (camYawDeg < 0) camYawDeg += 360;

    // Vertical Tilt Pitch (clamped between 10° and 85°) — reversed axis
    camAngleDeg = THREE.MathUtils.clamp(camAngleDeg - deltaY * 0.25, 10, 85);

    updateUISliders();
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

/* ── Bootstrap ───────────────────────────────── */
syncUI();
initCamera();
