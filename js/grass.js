/* ───────────────────────────────────────────────
    INTERACTIVE GRASS LANDSCAPE (Strict WebAssembly Core)
    createGrassLandscape · updateGrassPhysics · updateRollingGrid · initGrassWasm
    Depends on: scene, PAL, WORLD_WIDTH, WORLD_DEPTH, getGroundHeight
    Requires: build/grass.wasm binary module
─────────────────────────────────────────────── */

let grassInstancedMesh = null;
let maxGrassCount = 80000;

// Rolling Grid parameters (11x11 chunk grid = 4400x4400 total active span extending around camera)
const CHUNK_SIZE = 400;    // units per chunk square
const GRID_RADIUS = 5;     // 11x11 chunk grid (-5 to +5)
const GRID_DIM = GRID_RADIUS * 2 + 1; // 11
const TOTAL_CHUNKS = GRID_DIM * GRID_DIM; // 121

// WASM Module instance state
let isWasmLoaded = false;
let grassWasmInstance = null;

// Shared uniforms for GPU GLSL shader deformation
const grassUniforms = {
    uPlayerPos: { value: new THREE.Vector3(0, -999, 0) },
    uCamPos: { value: new THREE.Vector3(0, 0, 0) },
    uCamDir: { value: new THREE.Vector3(0, 0, -1) },
    uHalfFovCos: { value: 0.1 },
    uTime: { value: 0 },
    uMaxVisDist: { value: 2800.0 },
    uBendRadius: { value: 24.0 }
};

/**
 * Retrieves a TypedArray view directly into WebAssembly Linear Memory.
 */
function getWasmMemoryView(pointer, length, type = 'Float32Array') {
    if (!grassWasmInstance || !grassWasmInstance.exports.memory) return null;
    const buffer = grassWasmInstance.exports.memory.buffer;
    if (type === 'Float32Array') return new Float32Array(buffer, pointer, length);
    if (type === 'Uint16Array') return new Uint16Array(buffer, pointer, length);
    if (type === 'Uint8Array') return new Uint8Array(buffer, pointer, length);
    return null;
}

/**
 * Decodes a UTF-8 string directly from WebAssembly Linear Memory bytes.
 */
function getWasmString(pointer, length) {
    if (!grassWasmInstance || !grassWasmInstance.exports.memory || !pointer || !length) return "";
    const bytes = new Uint8Array(grassWasmInstance.exports.memory.buffer, pointer, length);
    return new TextDecoder("utf-8").decode(bytes);
}

/**
 * Asserts that the WASM module is loaded and ready.
 */
function assertWasmReady() {
    if (!isWasmLoaded || !grassWasmInstance) {
        throw new Error("[GrassEngine] FATAL: build/grass.wasm module is missing or not initialized!");
    }
}

/**
 * Creates low-poly tapered grass blade geometry from WASM binary memory.
 */
function createGrassBladeGeometry() {
    assertWasmReady();

    const positions = getWasmMemoryView(grassWasmInstance.exports.getPositionsPointer(), 48, 'Float32Array');
    const indices = getWasmMemoryView(grassWasmInstance.exports.getIndicesPointer(), 24, 'Uint16Array');
    const clusters = getWasmMemoryView(grassWasmInstance.exports.getClustersPointer(), 16, 'Float32Array');

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aCluster', new THREE.BufferAttribute(clusters, 1));
    geo.setIndex(Array.from(indices));
    geo.computeVertexNormals();

    return geo;
}

/**
 * Recalculates and re-seeds chunks starting from camera position using WASM binary core.
 */
function updateRollingGrid(camX, camZ, camDirX = 0, camDirZ = -1) {
    if (!grassInstancedMesh) return;
    assertWasmReady();

    const updated = grassWasmInstance.exports.updateRollingGridWasm(camX, camZ, camDirX, camDirZ, maxGrassCount);
    if (updated) {
        grassInstancedMesh.instanceMatrix.needsUpdate = true;
    }
}

/**
 * Applies GLSL shaders by pulling shader bytecode directly from WASM linear memory.
 */
function applyGrassShader(shader, isDepth = false) {
    assertWasmReady();

    shader.uniforms.uPlayerPos = grassUniforms.uPlayerPos;
    shader.uniforms.uCamPos = grassUniforms.uCamPos;
    shader.uniforms.uCamDir = grassUniforms.uCamDir;
    shader.uniforms.uHalfFovCos = grassUniforms.uHalfFovCos;
    shader.uniforms.uTime = grassUniforms.uTime;
    shader.uniforms.uMaxVisDist = grassUniforms.uMaxVisDist;
    shader.uniforms.uBendRadius = grassUniforms.uBendRadius;

    const headerStr = getWasmString(
        grassWasmInstance.exports.getHeaderShaderPointer(),
        grassWasmInstance.exports.getHeaderShaderLength()
    );

    const ptr = isDepth
        ? grassWasmInstance.exports.getDepthShaderPointer()
        : grassWasmInstance.exports.getMainShaderPointer();
    const len = isDepth
        ? grassWasmInstance.exports.getDepthShaderLength()
        : grassWasmInstance.exports.getMainShaderLength();

    const bodyStr = getWasmString(ptr, len);

    shader.vertexShader = headerStr + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', bodyStr);
}

/**
 * Initializes the InstancedMesh grass landscape across the world floor.
 */
function createGrassLandscape(count = 5000) {
    if (grassInstancedMesh) {
        scene.remove(grassInstancedMesh);
        if (grassInstancedMesh.geometry) grassInstancedMesh.geometry.dispose();
        if (grassInstancedMesh.material) grassInstancedMesh.material.dispose();
        grassInstancedMesh = null;
    }

    if (count <= 0) return;
    assertWasmReady();

    maxGrassCount = count;

    const geo = createGrassBladeGeometry();

    const mat = new THREE.MeshStandardMaterial({
        color: (typeof PAL !== 'undefined' && PAL.grass) ? PAL.grass : 0xf0c830,
        roughness: 0.7,
        metalness: 0.1,
        side: THREE.DoubleSide,
        shadowSide: THREE.DoubleSide
    });

    mat.onBeforeCompile = function (shader) {
        applyGrassShader(shader, false);
    };

    const wasmMatArray = getWasmMemoryView(grassWasmInstance.exports.getMatrixBufferPointer(), count * 16, 'Float32Array');
    grassInstancedMesh = new THREE.InstancedMesh(geo, mat, count);
    grassInstancedMesh.instanceMatrix = new THREE.BufferAttribute(wasmMatArray, 16);
    grassInstancedMesh.castShadow = true;
    grassInstancedMesh.receiveShadow = true;

    const customDepthMat = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
    customDepthMat.onBeforeCompile = function (shader) {
        applyGrassShader(shader, true);
    };
    grassInstancedMesh.customDepthMaterial = customDepthMat;

    updateRollingGrid(0, 0, 0, -1);

    if (typeof scene !== 'undefined') {
        scene.add(grassInstancedMesh);
    }
    console.log(`[grass] Created ${count} GPU grass blades using Strict WASM core.`);
}

/**
 * Updates GPU GLSL Shader Uniforms & Rolling Grid each frame.
 */
function updateGrassPhysics(px, py, pz, dt, time) {
    if (!grassInstancedMesh) return;
    assertWasmReady();

    const yawDeg = typeof camYawDeg !== 'undefined' ? camYawDeg : 0;
    const fovDeg = typeof camFov !== 'undefined' ? camFov : 45;
    const aspectVal = typeof aspect !== 'undefined' ? aspect : (window.innerWidth / window.innerHeight);

    const halfFovCos = grassWasmInstance.exports.computeCamParamsWasm(yawDeg, fovDeg, aspectVal);
    const camDirX = grassWasmInstance.exports.lastCamDirX ? grassWasmInstance.exports.lastCamDirX.value : 0;
    const camDirZ = grassWasmInstance.exports.lastCamDirZ ? grassWasmInstance.exports.lastCamDirZ.value : -1;

    const camX = typeof camera !== 'undefined' ? camera.position.x : px;
    const camZ = typeof camera !== 'undefined' ? camera.position.z : pz;

    grassUniforms.uCamPos.value.set(camX, 0, camZ);
    grassUniforms.uCamDir.value.set(camDirX, 0, camDirZ);
    grassUniforms.uHalfFovCos.value = halfFovCos;

    updateRollingGrid(camX, camZ, camDirX, camDirZ);

    grassUniforms.uPlayerPos.value.set(px, py, pz);
    grassUniforms.uTime.value = time;

    if (typeof maxVisDist !== 'undefined' && maxVisDist < 10000) {
        grassUniforms.uMaxVisDist.value = maxVisDist;
    } else {
        grassUniforms.uMaxVisDist.value = 2800.0;
    }
}

/**
 * Initializes and loads build/grass.wasm binary module.
 */
async function initGrassWasm() {
    try {
        const response = await fetch('build/grass.wasm');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const bytes = await response.arrayBuffer();
        const wasmModule = await WebAssembly.instantiate(bytes, {
            env: {
                abort: (msg, file, line, col) => console.error(`[WASM Abort] ${file}:${line}:${col} - ${msg}`)
            }
        });

        grassWasmInstance = wasmModule.instance;
        isWasmLoaded = true;

        if (grassWasmInstance.exports.initGrassBladeGeometry) {
            grassWasmInstance.exports.initGrassBladeGeometry();
        }
        if (grassWasmInstance.exports.initGrassShadersWasm) {
            grassWasmInstance.exports.initGrassShadersWasm();
        }

        console.log('[grass] WebAssembly build/grass.wasm core loaded successfully.');
        createGrassLandscape(maxGrassCount);
    } catch (err) {
        console.error('[grass] FATAL: Failed to load build/grass.wasm:', err);
    }
}

// Initiate WASM async fetch on script load
initGrassWasm();

/* ───────────────────────────────────────────────
    CAMERA FOV VISION BOUNDARY HELPER
─────────────────────────────────────────────── */

let fovHelperLines = null;
let fovHelperEnabled = false;

function createCameraFOVHelper() {
    if (fovHelperLines) {
        scene.remove(fovHelperLines);
        fovHelperLines.geometry.dispose();
        fovHelperLines.material.dispose();
        fovHelperLines = null;
    }

    const segments = 32;
    const totalVerts = 6 + segments * 2;
    const positions = new Float32Array(totalVerts * 3);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.LineBasicMaterial({
        color: 0x00ffcc,
        linewidth: 2,
        transparent: true,
        opacity: 0.85,
        depthTest: false
    });

    fovHelperLines = new THREE.LineSegments(geo, mat);
    fovHelperLines.renderOrder = 999;
    if (typeof scene !== 'undefined') {
        scene.add(fovHelperLines);
    }
}

function updateCameraFOVHelper(px, py, pz) {
    if (!fovHelperLines) {
        createCameraFOVHelper();
    }

    fovHelperLines.visible = fovHelperEnabled;
    if (!fovHelperEnabled) return;
    assertWasmReady();

    const yawDeg = typeof camYawDeg !== 'undefined' ? camYawDeg : 0;
    const fovDeg = typeof camFov !== 'undefined' ? camFov : 45;
    const aspectVal = typeof aspect !== 'undefined' ? aspect : (window.innerWidth / window.innerHeight);
    const maxDist = typeof maxVisDist !== 'undefined' ? Math.min(maxVisDist * 0.55, 1400) : 1400;
    const camX = typeof camera !== 'undefined' ? camera.position.x : px;
    const camZ = typeof camera !== 'undefined' ? camera.position.z : pz;
    const originY = py + 2.0;

    const posAttr = fovHelperLines.geometry.attributes.position;

    grassWasmInstance.exports.computeFovHelperLinesWasm(
        camX, camZ, originY,
        px, pz,
        yawDeg, fovDeg, aspectVal, maxDist
    );
    const wasmView = getWasmMemoryView(grassWasmInstance.exports.getFovHelperBufferPointer(), 210, 'Float32Array');
    if (wasmView) {
        posAttr.array.set(wasmView);
    }

    posAttr.needsUpdate = true;
}
