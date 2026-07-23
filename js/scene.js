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

// Asymmetric rectangular shadow camera bounds (expanded top and right)
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.left = -350;
dirLight.shadow.camera.right = 700; // Expanded right side ! human notice
dirLight.shadow.camera.top = 700;   // Expanded top side
dirLight.shadow.camera.bottom = -230;
dirLight.shadow.camera.near = 300;
dirLight.shadow.camera.far = 1000;
dirLight.shadow.bias = -0.0003;
dirLight.shadow.camera.updateProjectionMatrix();
scene.add(dirLight);
scene.add(dirLight.target);

// ── Visual Shadow Camera Helper (shows the exact 3D shadow region) ──
const shadowHelper = new THREE.CameraHelper(dirLight.shadow.camera);
scene.add(shadowHelper);

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
