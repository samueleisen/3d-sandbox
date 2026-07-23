/* ───────────────────────────────────────────────
    SCENE SETUP  (renderer, scene, fog, camera)
─────────────────────────────────────────────── */
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(PAL.bg);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(PAL.bg, 0.0008);

// ── Lighting ────────────────────────────────────────────────
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
dirLight.position.set(200, 450, 200);
dirLight.castShadow = true;

// Large orthographic shadow camera bounds to fit the play area (WORLD_WIDTH=1200, WORLD_DEPTH=600)
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
const dShadow = 650;
dirLight.shadow.camera.left = -dShadow;
dirLight.shadow.camera.right = dShadow;
dirLight.shadow.camera.top = dShadow;
dirLight.shadow.camera.bottom = -dShadow;
dirLight.shadow.camera.near = 10;
dirLight.shadow.camera.far = 1500;
dirLight.shadow.bias = -0.0005;
scene.add(dirLight);

let aspect = window.innerWidth / window.innerHeight;
let camera;

function initCamera() {
    if (cameraType === 'persp') {
        camera = new THREE.PerspectiveCamera(camFov, aspect, 10, 3000);
    } else {
        camera = new THREE.OrthographicCamera(
            -camViewSize * aspect, camViewSize * aspect,
            camViewSize, -camViewSize,
            10, 3000
        );
    }
}
