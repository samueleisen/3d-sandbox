/* ───────────────────────────────────────────────
    UNIFIED ENGINE CORE & SCENE ORCHESTRATOR
    Global Constants & Color Palette · WebGL Renderer ·
    Lights & Shadow Camera · WebAudio Wind SFX · Camera Orbit Controls ·
    Atmospheric Sky Dome · Circular Floor · Horizon Sink Manager ·
    Procedural Monuments · Render Loop (animate / startGameLoop)
─────────────────────────────────────────────── */

// ── Global Constants & State Definitions ─────────────────────
const WORLD_WIDTH = 5000;
const WORLD_DEPTH = 5000;
const WORLD_RADIUS = WORLD_WIDTH / 2;
const HALF_WIDTH = WORLD_WIDTH / 2;
const HALF_DEPTH = WORLD_DEPTH / 2;
const PLAYER_SPEED = 190;
const PLAYER_ACCEL = 1200;
const PLAYER_FRICTION = 16;
const PLAYER_RADIUS = 10;
const PLAYER_HEIGHT = 24;
const JUMP_POWER = 120;
const JUMP_GRAVITY = 180;

let maxVisDist = 99999;
let renderScale = 1.0;

let HORIZON_SINK_START = 3500;
let HORIZON_SINK_END = 16000;
let HORIZON_MAX_SINK = 360;
let HORIZON_MIN_SCALE = 0.0;

let camAngleDeg = 75;
let camYawDeg = 180;
let camHeight = 150;
let camFov = 50;

const PAL = {
    bg: 0x1a1a2e,
    floorPosZ: 0xfff04f,
    floorNegZ: 0x665105,
    grass: 0xf0c830,
    shadow: 0x0e0e1a,
};

// ── WebGL Renderer Setup ─────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(PAL.bg);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

// ── Lighting ──────────────────────────────────────────────────
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
dirLight.position.set(0, 2500, -5000);
dirLight.castShadow = true;

dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.left = -2000;
dirLight.shadow.camera.right = 2000;
dirLight.shadow.camera.top = 2000;
dirLight.shadow.camera.bottom = -2000;
dirLight.shadow.camera.near = 100;
dirLight.shadow.camera.far = 9000;
dirLight.shadow.bias = -0.0002;
dirLight.shadow.camera.updateProjectionMatrix();
scene.add(dirLight);
scene.add(dirLight.target);

// Visual Shadow Camera Helper (toggleable via UI)
const shadowHelper = new THREE.CameraHelper(dirLight.shadow.camera);
shadowHelper.visible = false;
scene.add(shadowHelper);

let aspect = window.innerWidth / window.innerHeight;
let camera;

function initCamera() {
    camera = new THREE.PerspectiveCamera(typeof camFov !== 'undefined' ? camFov : 50, aspect, 10, 16000);
}

// ─────────────────────────────────────────────────────────────
//  Ambient Wind Audio Controller
// ─────────────────────────────────────────────────────────────
let windAudio = null;
let isAudioInitialized = false;
let windVolume = 0.05;
let isMuted = false;

function initAudio() {
    if (windAudio) return;

    windAudio = new Audio('WIND-SFX.mp3');
    windAudio.loop = true;
    windAudio.volume = isMuted ? 0 : windVolume;

    windAudio.addEventListener('error', () => {
        if (windAudio.src.includes('WIND-SFX.mp3')) {
            windAudio.src = 'wind-sfx.mp3';
            if (isAudioInitialized && !isMuted) windAudio.play();
        }
    });

    const startAudio = () => {
        if (!windAudio) return;
        windAudio.play().then(() => {
            isAudioInitialized = true;
            updateAudioUI();
        }).catch(err => {
            console.warn("Audio play deferred until user interaction:", err);
        });

        window.removeEventListener('pointerdown', startAudio);
        window.removeEventListener('keydown', startAudio);
        window.removeEventListener('touchstart', startAudio);
    };

    window.addEventListener('pointerdown', startAudio);
    window.addEventListener('keydown', startAudio);
    window.addEventListener('touchstart', startAudio);

    setupAudioControls();
}

function setupAudioControls() {
    const sliderVol = document.getElementById('ctrl-wind-vol');
    const valVol = document.getElementById('val-wind-vol');
    const chkMute = document.getElementById('ctrl-wind-mute');

    if (sliderVol && valVol) {
        sliderVol.addEventListener('input', (e) => {
            windVolume = parseFloat(e.target.value);
            valVol.textContent = Math.round(windVolume * 100) + '%';
            if (windAudio && !isMuted) {
                windAudio.volume = windVolume;
            }
        });
    }

    if (chkMute) {
        chkMute.addEventListener('change', (e) => {
            isMuted = e.target.checked;
            if (windAudio) {
                windAudio.volume = isMuted ? 0 : windVolume;
            }
        });
    }
}

function updateAudioUI() {
    const statusEl = document.getElementById('wind-audio-status');
    if (statusEl) {
        statusEl.textContent = isAudioInitialized ? 'Active (Looping)' : 'Click to enable audio';
        statusEl.style.color = isAudioInitialized ? '#5cf0a0' : '#ffb050';
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAudio);
} else {
    initAudio();
}

// ─────────────────────────────────────────────────────────────
//  Camera Controls & Window Resize Listener
// ─────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
    aspect = window.innerWidth / window.innerHeight;
    if (camera) {
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const ctrlTilt         = document.getElementById('ctrl-tilt');
const ctrlYaw          = document.getElementById('ctrl-yaw');
const ctrlHeight       = document.getElementById('ctrl-height');
const ctrlFov          = document.getElementById('ctrl-fov');
const ctrlGrassDensity = document.getElementById('ctrl-grass-density');

const valTilt   = document.getElementById('val-tilt');
const valYaw    = document.getElementById('val-yaw');
const valHeight = document.getElementById('val-height');
const valFov    = document.getElementById('val-fov');

function syncUI() {
    if (ctrlTilt) camAngleDeg = parseFloat(ctrlTilt.value);
    if (ctrlYaw) camYawDeg = parseFloat(ctrlYaw.value);
    if (ctrlHeight) camHeight = parseFloat(ctrlHeight.value);
    if (ctrlFov) camFov = parseFloat(ctrlFov.value);

    updateUISliders();
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
}

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

if (ctrlTilt) {
    ctrlTilt.addEventListener('input', () => {
        camAngleDeg = parseFloat(ctrlTilt.value);
        if (valTilt) valTilt.textContent = `${Math.round(camAngleDeg)}°`;
    });
}

if (ctrlYaw) {
    ctrlYaw.addEventListener('input', () => {
        camYawDeg = parseFloat(ctrlYaw.value);
        if (valYaw) valYaw.textContent = `${Math.round(camYawDeg)}°`;
    });
}

if (ctrlHeight) {
    ctrlHeight.addEventListener('input', () => {
        camHeight = parseFloat(ctrlHeight.value);
        if (valHeight) valHeight.textContent = Math.round(camHeight);
    });
}

if (ctrlFov) {
    ctrlFov.addEventListener('input', () => {
        camFov = parseFloat(ctrlFov.value);
        if (valFov) valFov.textContent = `${Math.round(camFov)}°`;
        if (camera) {
            camera.fov = camFov;
            camera.updateProjectionMatrix();
        }
    });
}

let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;

renderer.domElement.addEventListener('click', (e) => {
    if (e.target.closest('#camera-panel') || e.target.closest('#ui-overlay')) return;
    if (document.pointerLockElement !== renderer.domElement) {
        renderer.domElement.requestPointerLock();
    }
});

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
        deltaX = e.movementX;
        deltaY = e.movementY;
    } else if (isDragging) {
        deltaX = e.clientX - previousMouseX;
        deltaY = e.clientY - previousMouseY;
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
    } else {
        return;
    }

    camYawDeg = (camYawDeg - deltaX * 0.35) % 360;
    if (camYawDeg < 0) camYawDeg += 360;

    camAngleDeg = THREE.MathUtils.clamp(camAngleDeg - deltaY * 0.25, 5, 135);
    updateUISliders();
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

syncUI();
initCamera();

// ─────────────────────────────────────────────────────────────
//  Stylized Atmospheric Gradient Sky Dome
// ─────────────────────────────────────────────────────────────
let skyMesh = null;
let skyMaterial = null;

const skyUniforms = {
    uSunDir: { value: new THREE.Vector3(0, 0.44721, -0.89443) },
    uColorHotCore: { value: new THREE.Color(1.0, 1.0, 1.0) },
    uColorHotGlow: { value: new THREE.Color(0.78, 0.93, 1.0) },
    uColorSun: { value: new THREE.Color(0.58, 0.82, 0.98) },
    uColorHorizon: { value: new THREE.Color(0.35, 0.68, 0.92) },
    uColorZenith: { value: new THREE.Color(0.06, 0.16, 0.42) }
};

function initSky() {
    if (skyMesh) return;

    const skyGeo = new THREE.SphereGeometry(14000, 32, 16);

    skyMaterial = new THREE.ShaderMaterial({
        uniforms: skyUniforms,
        vertexShader: `
            varying vec3 vWorldPos;
            void main() {
                vWorldPos = position;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vWorldPos;
            uniform vec3 uSunDir;
            uniform vec3 uColorHotCore;
            uniform vec3 uColorHotGlow;
            uniform vec3 uColorSun;
            uniform vec3 uColorHorizon;
            uniform vec3 uColorZenith;

            void main() {
                vec3 dir = normalize(vWorldPos);
                float height = clamp(dir.y, 0.0, 1.0);
                float sunAlignment = max(0.0, dot(dir, uSunDir));

                vec3 skyColor = mix(uColorHorizon, uColorZenith, pow(height, 0.7));
                float sunAmbientGlow = pow(sunAlignment, 2.0);
                skyColor = mix(skyColor, uColorSun, sunAmbientGlow * 0.75);

                float hotGlowFactor = pow(sunAlignment, 64.0);
                skyColor = mix(skyColor, uColorHotGlow, hotGlowFactor * 0.95);

                float hotCoreFactor = pow(sunAlignment, 1024.0);
                skyColor = mix(skyColor, uColorHotCore, hotCoreFactor * 1.0);

                gl_FragColor = vec4(skyColor, 1.0);
            }
        `,
        side: THREE.BackSide,
        depthWrite: false
    });

    skyMesh = new THREE.Mesh(skyGeo, skyMaterial);
    skyMesh.renderOrder = -1000;
    scene.add(skyMesh);
}

function updateSky() {
    if (!skyMesh) {
        initSky();
    }
    if (camera && skyMesh) {
        skyMesh.position.copy(camera.position);
        const sunDir = new THREE.Vector3(0, 2500, -5000).normalize();
        skyUniforms.uSunDir.value.copy(sunDir);
    }
}

initSky();

// ─────────────────────────────────────────────────────────────
//  Horizon Sink & Distance Scale Manager
// ─────────────────────────────────────────────────────────────
const horizonTrackedObjects = [];

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

function updateHorizonDisplacement(camX, camZ, playerY = 0) {
    if (horizonTrackedObjects.length === 0) return;

    const range = Math.max(1, HORIZON_SINK_END - HORIZON_SINK_START);
    const groundY = typeof getGroundHeight === 'function' ? getGroundHeight(camX, camZ) : 0;
    const airHeight = Math.max(0, playerY - groundY);

    for (let i = 0; i < horizonTrackedObjects.length; i++) {
        const item = horizonTrackedObjects[i];
        const obj = item.obj;

        const ox = obj.position.x;
        const oz = obj.position.z;

        const dx = ox - camX;
        const dz = oz - camZ;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist <= HORIZON_SINK_START) {
            obj.scale.copy(item.baseScale);
            obj.position.y = item.baseY;
            obj.visible = true;
        } else {
            const t = Math.min(1.0, (dist - HORIZON_SINK_START) / range);
            const currentScaleFactor = THREE.MathUtils.lerp(1.0, HORIZON_MIN_SCALE, t);
            const sinkY = Math.pow(t, 0.90) * HORIZON_MAX_SINK;
            const jumpCounterY = airHeight * Math.pow(t, 1.2) * 5;

            if (currentScaleFactor <= 0.001) {
                obj.visible = false;
            } else {
                obj.visible = true;
                obj.scale.set(
                    item.baseScale.x * currentScaleFactor,
                    item.baseScale.y * currentScaleFactor,
                    item.baseScale.z * currentScaleFactor
                );
                obj.position.y = item.baseY - sinkY - jumpCounterY;
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────
//  World Geometry: Floor plane & Procedural Monuments
// ─────────────────────────────────────────────────────────────
const floorGeo = new THREE.CircleGeometry(WORLD_RADIUS, 128);
const colorPos = new THREE.Color(PAL.floorPosZ);
const colorNeg = new THREE.Color(PAL.floorNegZ);
const posAttr = floorGeo.attributes.position;
const floorColors = new Float32Array(posAttr.count * 3);
const _tempColor = new THREE.Color();

for (let i = 0; i < posAttr.count; i++) {
    const ly = posAttr.getY(i);
    const t = Math.max(0, Math.min(1, 0.5 - ly / (WORLD_RADIUS * 2)));
    _tempColor.copy(colorNeg).lerp(colorPos, t);
    floorColors[i * 3]     = _tempColor.r;
    floorColors[i * 3 + 1] = _tempColor.g;
    floorColors[i * 3 + 2] = _tempColor.b;
}
floorGeo.setAttribute('color', new THREE.BufferAttribute(floorColors, 3));

const floorMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.8,
    metalness: 0.1,
    side: THREE.DoubleSide
});
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

const obstacles = [];
const animatedMonuments = [];

function createTallMonolith(x, z) {
    const group = new THREE.Group();

    const rockMat = new THREE.MeshStandardMaterial({ 
        color: 0x2b2d3d, 
        roughness: 0.9, 
        metalness: 0.1, 
        flatShading: true 
    });

    const base1Geo = new THREE.CylinderGeometry(140, 180, 40, 8);
    const base1 = new THREE.Mesh(base1Geo, rockMat);
    base1.position.y = 20;
    base1.castShadow = true;
    base1.receiveShadow = true;
    group.add(base1);

    const rockCount = 8;
    for (let i = 0; i < rockCount; i++) {
        const angle = (i / rockCount) * Math.PI * 2 + (i % 2 === 0 ? 0.2 : -0.1);
        const radius = 130 + (i % 3) * 25;
        const rx = Math.cos(angle) * radius;
        const rz = Math.sin(angle) * radius;

        const rockGeo = new THREE.DodecahedronGeometry(35 + (i % 4) * 12, 0);
        const rockMesh = new THREE.Mesh(rockGeo, rockMat);
        rockMesh.position.set(rx, 18 + (i % 2) * 8, rz);
        rockMesh.rotation.set(
            (i * 0.7) % 1.5,
            (i * 1.3) % 3.14,
            (i * 0.9) % 1.2
        );
        rockMesh.scale.set(
            1.0 + (i % 3) * 0.4,
            1.2 + (i % 2) * 0.6,
            0.9 + (i % 4) * 0.3
        );
        rockMesh.castShadow = true;
        rockMesh.receiveShadow = true;
        group.add(rockMesh);
    }

    const base2Geo = new THREE.CylinderGeometry(95, 125, 35, 8);
    const base2 = new THREE.Mesh(base2Geo, rockMat);
    base2.position.y = 50;
    base2.castShadow = true;
    base2.receiveShadow = true;
    group.add(base2);

    const shaftGeo = new THREE.CylinderGeometry(40, 75, 460, 8);
    const shaftMat = new THREE.MeshStandardMaterial({ 
        color: 0x4d3e58, 
        emissive: 0x1a2e47, 
        emissiveIntensity: 0.5,
        roughness: 0.6, 
        flatShading: true 
    });
    const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
    shaftMesh.position.y = 65 + 230;
    shaftMesh.castShadow = true;
    shaftMesh.receiveShadow = true;
    group.add(shaftMesh);

    const coreGeo = new THREE.CylinderGeometry(18, 18, 480, 8);
    const coreMat = new THREE.MeshStandardMaterial({
        color: 0x00e1ff,
        emissive: 0x00b4ff,
        emissiveIntensity: 1.6,
        roughness: 0.15
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = 65 + 240;
    group.add(coreMesh);

    const crystalGeo = new THREE.OctahedronGeometry(45, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
        color: 0x70f0ff,
        emissive: 0x00c8ff,
        emissiveIntensity: 1.2,
        roughness: 0.15,
        metalness: 0.3,
        flatShading: true
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.position.y = 65 + 460 + 65;
    crystal.scale.set(1.0, 1.8, 1.0);
    crystal.castShadow = true;
    group.add(crystal);

    const rings = [];

    function createBlueRing(radius, tube, yPos, colorHex, emissiveHex, speed, oscAmp) {
        const rGeo = new THREE.TorusGeometry(radius, tube, 8, 20);
        const rMat = new THREE.MeshStandardMaterial({
            color: colorHex,
            emissive: emissiveHex,
            emissiveIntensity: 2.0,
            roughness: 0.1
        });
        const rMesh = new THREE.Mesh(rGeo, rMat);
        rMesh.rotation.x = Math.PI / 2;
        rMesh.position.y = yPos;
        group.add(rMesh);

        rings.push({
            mesh: rMesh,
            baseY: yPos,
            speed: speed,
            oscAmp: oscAmp
        });
    }

    createBlueRing(78, 6, 65 + 160, 0x00aaff, 0x0088ff, -0.6, 10);
    createBlueRing(62, 7, 65 + 310, 0x00f0ff, 0x00d0ff, 0.9, 14);
    createBlueRing(46, 5, 65 + 430, 0x80f5ff, 0x00e1ff, -1.2, 8);

    group.scale.set(3.0, 3.0, 3.0);
    group.position.set(x, 0, z);
    scene.add(group);

    animatedMonuments.push({
        group,
        crystal,
        rings
    });

    group.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(base1);
    obstacles.push({ mesh: base1, box });

    registerHorizonObject(group);
}

function spawnMonumentGrid() {
    const locations = [
        { x: 0, z: -3000 },
        { x: 6000, z: 6000 },
        { x: -6000, z: 6000 },
        { x: 12000, z: -12000 },
        { x: -12000, z: -12000 },
        { x: 0, z: 12000 },
        { x: -14000, z: 0 },
        { x: 14000, z: 0 }
    ];

    locations.forEach(loc => createTallMonolith(loc.x, loc.z));
}

spawnMonumentGrid();

// ─────────────────────────────────────────────────────────────
//  Animation Render Loop
// ─────────────────────────────────────────────────────────────
const clock = new THREE.Clock();
const coordsEl = document.getElementById('coords');

function animate() {
    requestAnimationFrame(animate);
    const frameStart = performance.now();
    const dt = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;

    /* 1. Player Movement & Physics Tick */
    if (typeof updatePlayerController === 'function') {
        updatePlayerController(dt);
    }

    const px = typeof playerGroup !== 'undefined' ? playerGroup.position.x : 0;
    const py = typeof playerGroup !== 'undefined' ? playerGroup.position.y : 0;
    const pz = typeof playerGroup !== 'undefined' ? playerGroup.position.z : 0;

    /* 2. Floor Mesh Position Sync */
    if (typeof floor !== 'undefined') {
        floor.position.x = px;
        floor.position.z = pz;
    }

    /* 3. Horizon Sink & Monument Floating Animations */
    updateHorizonDisplacement(px, pz, py);

    if (animatedMonuments.length > 0) {
        const ANIM_CULL_DIST_SQ = 10000 * 10000;
        for (let i = 0; i < animatedMonuments.length; i++) {
            const m = animatedMonuments[i];
            if (!m.group || !m.group.visible) continue;

            const dx = m.group.position.x - px;
            const dz = m.group.position.z - pz;
            if (dx * dx + dz * dz > ANIM_CULL_DIST_SQ) continue;

            if (m.crystal) {
                m.crystal.rotation.y += 0.8 * dt;
            }
            if (m.rings) {
                for (let r = 0; r < m.rings.length; r++) {
                    const rData = m.rings[r];
                    rData.mesh.rotation.z += rData.speed * dt;
                    rData.mesh.position.y = rData.baseY + Math.sin(time * 2.2 + r * 1.5 + i) * rData.oscAmp;
                }
            }
        }
    }

    /* 4. Grass Physics & GPU Shaders */
    if (typeof updateGrassPhysics === 'function') {
        updateGrassPhysics(px, py, pz, dt, time);
    }

    /* 5. FOV Vision Helper */
    if (typeof updateCameraFOVHelper === 'function') {
        updateCameraFOVHelper(px, py, pz);
    }

    /* 6. Orbit Camera Tracking */
    if (camera) {
        const MAX_POSITION_TILT = 80;
        const angleDeg = typeof camAngleDeg !== 'undefined' ? camAngleDeg : 75;
        const heightVal = typeof camHeight !== 'undefined' ? camHeight : 150;
        const yawVal = typeof camYawDeg !== 'undefined' ? camYawDeg : 180;

        const orbitAngleDeg = Math.min(angleDeg, MAX_POSITION_TILT);
        const pitchRad = THREE.MathUtils.degToRad(orbitAngleDeg);
        const yawRad = THREE.MathUtils.degToRad(yawVal);

        const groundDist = heightVal * Math.sin(pitchRad);
        const camOffsetY = heightVal * Math.cos(pitchRad);
        const camOffsetX = groundDist * Math.sin(yawRad);
        const camOffsetZ = groundDist * Math.cos(yawRad);

        camera.position.x = px + camOffsetX;
        camera.position.y = py + camOffsetY;
        camera.position.z = pz + camOffsetZ;

        let targetY = py + 12;
        if (angleDeg > MAX_POSITION_TILT) {
            const extraTiltRad = THREE.MathUtils.degToRad(angleDeg - MAX_POSITION_TILT);
            targetY += heightVal * Math.tan(extraTiltRad);
        }
        camera.lookAt(px, targetY, pz);
    }

    /* 7. Sky Dome & Directional Shadow Texel Snapping */
    updateSky();

    const shadowWidth = dirLight.shadow.camera.right - dirLight.shadow.camera.left;
    const texelSize = shadowWidth / dirLight.shadow.mapSize.width;
    const shadowTargetX = Math.floor(px / texelSize) * texelSize;
    const shadowTargetZ = Math.floor(pz / texelSize) * texelSize;

    dirLight.position.set(shadowTargetX, 2500, shadowTargetZ - 5000);
    dirLight.target.position.set(shadowTargetX, 0, shadowTargetZ);
    dirLight.target.updateMatrixWorld();

    if (typeof obstacles !== 'undefined' && obstacles.length > 0) {
        const shadowRadiusSq = 2700 * 2700;
        for (let i = 0; i < obstacles.length; i++) {
            const obs = obstacles[i];
            if (obs && obs.mesh) {
                const monumentPos = obs.mesh.parent ? obs.mesh.parent.position : obs.mesh.position;
                const dx = monumentPos.x - px;
                const dz = monumentPos.z - pz;
                obs.mesh.castShadow = (dx * dx + dz * dz <= shadowRadiusSq);
            }
        }
    }

    if (typeof shadowHelper !== 'undefined' && shadowHelper.visible) {
        shadowHelper.update();
    }

    /* 8. HUD & WebGL Render */
    if (coordsEl) {
        coordsEl.textContent = `x: ${Math.round(px)} | z: ${Math.round(pz)}`;
    }

    if (camera) {
        renderer.render(scene, camera);
    }

    recordPerf(performance.now() - frameStart);
}

// Minimal HUD Performance Counter (FPS & Avg ms)
let perfFrames = 0;
let perfTimeAccum = 0;
let fpsEl = null;
let avgMsEl = null;

function recordPerf(dtMs) {
    if (!fpsEl) fpsEl = document.querySelector('.perf-fps');
    if (!avgMsEl) avgMsEl = document.querySelector('.perf-avg');

    perfFrames++;
    perfTimeAccum += dtMs;

    if (perfTimeAccum >= 400) {
        const avgMs = perfTimeAccum / perfFrames;
        const fps = Math.round(1000 / Math.max(avgMs, 0.1));
        if (fpsEl) fpsEl.textContent = fps;
        if (avgMsEl) avgMsEl.textContent = avgMs.toFixed(1) + 'ms';
        perfFrames = 0;
        perfTimeAccum = 0;
    }
}

let gameLoopStarted = false;
function startGameLoop() {
    if (gameLoopStarted) return;
    gameLoopStarted = true;
    animate();
}

