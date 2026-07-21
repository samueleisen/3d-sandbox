/* ───────────────────────────────────────────────
    SCENE SETUP  (renderer, scene, fog, camera)
─────────────────────────────────────────────── */
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(PAL.bg);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(PAL.bg, 0.0008);

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
