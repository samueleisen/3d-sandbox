/* ───────────────────────────────────────────────
    CAMERA CONTROLS  (resize + UI panel)
    Depends on: scene.js (initCamera, camera, renderer, aspect)
                constants.js (cameraType, camAngle*, camFov, camViewSize)
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
const ctrlHeight = document.getElementById('ctrl-height');
const ctrlFov    = document.getElementById('ctrl-fov');
const ctrlSize   = document.getElementById('ctrl-size');

const valTilt   = document.getElementById('val-tilt');
const valHeight = document.getElementById('val-height');
const valFov    = document.getElementById('val-fov');
const valSize   = document.getElementById('val-size');

const groupFov  = document.getElementById('group-fov');
const groupSize = document.getElementById('group-size');

function syncUI() {
    cameraType  = ctrlType.value;
    camAngleDeg = parseFloat(ctrlTilt.value);
    camHeight   = parseFloat(ctrlHeight.value);
    camFov      = parseFloat(ctrlFov.value);
    camViewSize = parseFloat(ctrlSize.value);

    valTilt.textContent   = `${camAngleDeg}°`;
    valHeight.textContent = camHeight;
    valFov.textContent    = `${camFov}°`;
    valSize.textContent   = camViewSize;

    if (cameraType === 'persp') {
        groupFov.style.display  = '';
        groupSize.style.display = 'none';
    } else {
        groupFov.style.display  = 'none';
        groupSize.style.display = '';
    }
}

ctrlType.addEventListener('change', () => {
    syncUI();
    initCamera();
});

ctrlTilt.addEventListener('input', () => {
    camAngleDeg = parseFloat(ctrlTilt.value);
    valTilt.textContent = `${camAngleDeg}°`;
});

ctrlHeight.addEventListener('input', () => {
    camHeight = parseFloat(ctrlHeight.value);
    valHeight.textContent = camHeight;
});

ctrlFov.addEventListener('input', () => {
    camFov = parseFloat(ctrlFov.value);
    valFov.textContent = `${camFov}°`;
    if (cameraType === 'persp') {
        camera.fov = camFov;
        camera.updateProjectionMatrix();
    }
});

ctrlSize.addEventListener('input', () => {
    camViewSize = parseFloat(ctrlSize.value);
    valSize.textContent = camViewSize;
    if (cameraType === 'ortho') {
        camera.left   = -camViewSize * aspect;
        camera.right  =  camViewSize * aspect;
        camera.top    =  camViewSize;
        camera.bottom = -camViewSize;
        camera.updateProjectionMatrix();
    }
});

/* ── Bootstrap ───────────────────────────────── */
syncUI();
initCamera();
