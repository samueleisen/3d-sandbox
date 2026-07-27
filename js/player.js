/* ───────────────────────────────────────────────
    UNIFIED PLAYER & CHARACTER PHYSICS ENGINE (Strict WebAssembly Core)
    GLTF Model Loader · Input Listeners (WASD + Space) ·
    WASM AABB Obstacle Collision Response · WASM Ground Elevation Detection ·
    WASM Velocity-Based Physics & Jump Gravity · WASM Facing Rotation ·
    Locomotion Animations · WASM Procedural Ponytail Hair Dynamics
    Requires: build/characterPhysics.wasm binary module
─────────────────────────────────────────────── */

// ── Keyboard Input State & Event Listeners ────────────────────
const keys = { w: false, a: false, s: false, d: false, space: false };

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.key === ' ') {
        keys.space = true;
        e.preventDefault();
    }
    const k = e.key.toLowerCase();
    if (k in keys) keys[k] = true;
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'Space' || e.key === ' ') {
        keys.space = false;
        e.preventDefault();
    }
    const k = e.key.toLowerCase();
    if (k in keys) keys[k] = false;
});

window.addEventListener('blur', () => {
    keys.w = keys.a = keys.s = keys.d = keys.space = false;
});

// ── Player Container & Ground Shadow ─────────────────────────
const playerGroup = new THREE.Group();
if (typeof scene !== 'undefined') {
    scene.add(playerGroup);
}

const pShadow = new THREE.Mesh(
    new THREE.CircleGeometry(((typeof PLAYER_RADIUS !== 'undefined' ? PLAYER_RADIUS : 6) + 4) * 0.5, 16),
    new THREE.MeshBasicMaterial({ color: (typeof PAL !== 'undefined' && PAL.shadow) ? PAL.shadow : 0x000000, transparent: true, opacity: 0.5 })
);
pShadow.rotation.x = -Math.PI / 2;
pShadow.position.y = 0.6;
if (typeof scene !== 'undefined') {
    scene.add(pShadow);
}

// ── WASM State & Module Loader ───────────────────────────────
let isPlayerWasmLoaded = false;
let playerWasmInstance = null;

function getWasmMemoryViewPlayer(pointer, length) {
    if (!playerWasmInstance || !playerWasmInstance.exports.memory) return null;
    return new Float32Array(playerWasmInstance.exports.memory.buffer, pointer, length);
}

function assertPlayerWasmReady() {
    if (!isPlayerWasmLoaded || !playerWasmInstance) {
        throw new Error("[player] FATAL: build/characterPhysics.wasm module is missing or not initialized!");
    }
}

function syncObstaclesToWasm() {
    if (!isPlayerWasmLoaded || !playerWasmInstance) return;
    if (typeof obstacles === 'undefined' || !obstacles || obstacles.length === 0) {
        playerWasmInstance.exports.setObstacleCount(0);
        return;
    }

    const count = Math.min(obstacles.length, 256);
    const ptr = playerWasmInstance.exports.getObstaclesPointer();
    const view = getWasmMemoryViewPlayer(ptr, count * 6);
    if (!view) return;

    for (let i = 0; i < count; i++) {
        const box = obstacles[i].box;
        const idx = i * 6;
        view[idx] = box.min.x;
        view[idx + 1] = box.min.y;
        view[idx + 2] = box.min.z;
        view[idx + 3] = box.max.x;
        view[idx + 4] = box.max.y;
        view[idx + 5] = box.max.z;
    }
    playerWasmInstance.exports.setObstacleCount(count);
}

async function initPlayerWasm() {
    try {
        const response = await fetch('build/characterPhysics.wasm');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const bytes = await response.arrayBuffer();
        const wasmModule = await WebAssembly.instantiate(bytes, {
            env: {
                abort: (msg, file, line, col) => console.error(`[Player WASM Abort] ${file}:${line}:${col} - ${msg}`)
            }
        });

        playerWasmInstance = wasmModule.instance;
        isPlayerWasmLoaded = true;

        syncObstaclesToWasm();
        console.log('[player] WebAssembly build/characterPhysics.wasm initialized successfully.');
    } catch (err) {
        console.error('[player] FATAL: Failed to load build/characterPhysics.wasm:', err);
    }
}

initPlayerWasm();

// ── Animation & Controller State ─────────────────────────────
let mixer = null;
let idleAction = null;
let walkAction = null;
let jumpAction = null;
let isWalking = false;
let isGrounded = true;
const animations = {};
let glbReady = false;
const PLAYER_GLB = 'HeroMC-Animation-color.glb';

const WALK_FADE_IN = 0.18;
const WALK_FADE_OUT = 0.25;
const JUMP_LAUNCH_BLEND = 0.14;
const MIN_WALK_SPEED = 8.0;
const WALK_ANIM_SPEED_MULT = 1.35;

// ── Ponytail Hair Secondary Physics State ─────────────────────
let ponytailBones = [];
const _additiveQuat = new THREE.Quaternion();
const _euler = new THREE.Euler(0, 0, 0, 'YXZ');

function initPonytailBones(model) {
    if (!model) return;
    const ponytailNames = ['ponytail1', 'ponytail2', 'ponytail3', 'ponytail4', 'ponytail5'];
    ponytailBones = new Array(5).fill(null);
    model.traverse(function (node) {
        if (node.name) {
            const idx = ponytailNames.indexOf(node.name.toLowerCase());
            if (idx !== -1) {
                node._restQuaternion = node.quaternion.clone();
                ponytailBones[idx] = node;
            }
        }
    });
    const foundCount = ponytailBones.filter(Boolean).length;
    console.log(`[player] Found ${foundCount}/5 ponytail bones for WASM secondary physics.`);
}

function updatePonytailPhysics(dt) {
    if (!ponytailBones || ponytailBones.length === 0 || !playerGroup) return;
    if (dt <= 0) return;
    assertPlayerWasmReady();

    const px = playerWasmInstance.exports.px.value;
    const py = playerWasmInstance.exports.py.value;
    const pz = playerWasmInstance.exports.pz.value;
    const rotY = playerWasmInstance.exports.rotY.value;

    playerWasmInstance.exports.updatePonytailPhysicsWasm(dt, px, py, pz, rotY);

    const ptr = playerWasmInstance.exports.getPonytailBufferPointer();
    const ponytailView = getWasmMemoryViewPlayer(ptr, 15);
    if (!ponytailView) return;

    for (let i = 0; i < 5; i++) {
        const bone = ponytailBones[i];
        if (!bone) continue;

        const idx = i * 3;
        const pitch = ponytailView[idx];
        const yaw = ponytailView[idx + 1];
        const roll = ponytailView[idx + 2];

        if (bone._restQuaternion) {
            bone.quaternion.copy(bone._restQuaternion);
        }

        _euler.set(pitch, yaw, roll, 'YXZ');
        _additiveQuat.setFromEuler(_euler);
        bone.quaternion.multiply(_additiveQuat);
    }
}

// ─────────────────────────────────────────────────────────────
//  GLTF Model Loader
// ─────────────────────────────────────────────────────────────
const _loader = new THREE.GLTFLoader();
_loader.load(
    PLAYER_GLB,

    function (gltf) {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const pHeight = typeof PLAYER_HEIGHT !== 'undefined' ? PLAYER_HEIGHT : 16.0;
        if (size.y > 0) model.scale.setScalar(pHeight / size.y);

        model.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        const box2 = new THREE.Box3().setFromObject(model);
        model.position.y = -box2.min.y + 5.0;

        playerGroup.add(model);

        initPonytailBones(model);

        mixer = new THREE.AnimationMixer(model);

        if (gltf.animations && gltf.animations.length > 0) {
            gltf.animations.forEach(function (clip) {
                const action = mixer.clipAction(clip);
                action.setLoop(THREE.LoopRepeat);
                animations[clip.name.toLowerCase()] = action;
            });

            idleAction = animations['hero-idle'] || Object.values(animations)[0];
            walkAction = animations['hero-walk'] || null;
            jumpAction = animations['hero-jump'] || null;

            if (jumpAction) {
                jumpAction.setLoop(THREE.LoopOnce);
                jumpAction.clampWhenFinished = true;
            }

            if (idleAction) idleAction.play();
        }

        glbReady = true;
        console.log('[player] ' + PLAYER_GLB + ' ready.');
    },

    function (xhr) {
        if (xhr.total) {
            console.log('[player] ' + Math.round(xhr.loaded / xhr.total * 100) + '% loaded');
        }
    },

    function (err) {
        console.error('[player] Failed to load ' + PLAYER_GLB + ':', err);
    }
);

// ─────────────────────────────────────────────────────────────
//  Ground Elevation Detection Helper API
// ─────────────────────────────────────────────────────────────
function getGroundHeight(x, z, radius = 6.0) {
    if (isPlayerWasmLoaded && playerWasmInstance && playerWasmInstance.exports.getGroundHeightWasm) {
        return playerWasmInstance.exports.getGroundHeightWasm(x, z, radius);
    }
    return 0;
}

// ─────────────────────────────────────────────────────────────
//  Ground Elevation Detection & Player Controller
// ─────────────────────────────────────────────────────────────
function updatePlayerController(dt) {
    if (mixer) mixer.update(dt);
    if (!glbReady) return;
    assertPlayerWasmReady();

    syncObstaclesToWasm();

    const yawDeg = typeof camYawDeg !== 'undefined' ? camYawDeg : 0;

    // Execute WASM Character Physics Tick
    playerWasmInstance.exports.updatePlayerPhysicsWasm(
        dt,
        keys.w, keys.a, keys.s, keys.d, keys.space,
        yawDeg
    );

    // Read updated physics state directly from WASM exported registers
    const px = playerWasmInstance.exports.px.value;
    const py = playerWasmInstance.exports.py.value;
    const pz = playerWasmInstance.exports.pz.value;
    const velY = playerWasmInstance.exports.velY.value;
    const rotY = playerWasmInstance.exports.rotY.value;
    const wasmGrounded = playerWasmInstance.exports.isGrounded.value;
    const wasmWalking = playerWasmInstance.exports.isWalking.value;
    const wasmLanded = playerWasmInstance.exports.justLanded.value;

    /* 1. Update Player Object Transforms */
    playerGroup.position.set(px, py, pz);
    playerGroup.rotation.y = rotY;

    /* 2. Jump Animation Launch */
    if (keys.space && isGrounded && !wasmGrounded) {
        if (idleAction) idleAction.fadeOut(JUMP_LAUNCH_BLEND);
        if (walkAction) walkAction.fadeOut(JUMP_LAUNCH_BLEND);

        if (jumpAction) {
            jumpAction.reset();
            jumpAction.time = 0;
            jumpAction.setEffectiveTimeScale(1.0);
            jumpAction.enabled = true;
            jumpAction.fadeIn(JUMP_LAUNCH_BLEND);
            jumpAction.play();
        }
    }

    isGrounded = wasmGrounded;

    if (!isGrounded) {
        if (jumpAction) {
            jumpAction.setEffectiveTimeScale(velY < 0 ? 1.75 : 1.0);
        }

        if (velY < 0 && jumpAction && !jumpAction.isRunning()) {
            jumpAction.reset();
            jumpAction.time = 0.833;
            jumpAction.enabled = true;
            jumpAction.setEffectiveTimeScale(1.75);
            jumpAction.play();

            if (idleAction) idleAction.fadeOut(0.10);
            if (walkAction) walkAction.fadeOut(0.10);
        }

        if (jumpAction && jumpAction.isRunning()) {
            if (jumpAction.time >= 1.55) {
                jumpAction.time = 1.55;
            }
        }
    }

    if (wasmLanded && jumpAction) {
        jumpAction.setEffectiveTimeScale(1.0);
        jumpAction.time = 1.6667;
        jumpAction.fadeOut(0.30);
    }

    /* 3. Update Ground Shadow */
    const targetGroundY = getGroundHeight(px, pz);
    pShadow.position.set(px, targetGroundY + 0.6, pz);
    const elevation = Math.max(0, py - targetGroundY);
    const shadowFactor = THREE.MathUtils.clamp(1.0 - (elevation / 70.0) * 0.45, 0.55, 1.0);
    pShadow.scale.set(shadowFactor, shadowFactor, 1.0);
    pShadow.material.opacity = THREE.MathUtils.clamp(0.5 - (elevation / 70.0) * 0.25, 0.25, 0.5);

    /* 4. Locomotion Cross-Fade */
    if (isGrounded) {
        if (wasmLanded) {
            if (wasmWalking) {
                if (idleAction) idleAction.fadeOut(WALK_FADE_IN);
                if (walkAction) walkAction.reset().fadeIn(WALK_FADE_IN).play();
                isWalking = true;
            } else {
                if (walkAction) walkAction.fadeOut(WALK_FADE_OUT);
                if (idleAction) idleAction.reset().fadeIn(WALK_FADE_OUT).play();
                isWalking = false;
            }
        } else if (wasmWalking && !isWalking) {
            if (idleAction) idleAction.fadeOut(WALK_FADE_IN);
            if (walkAction) walkAction.reset().fadeIn(WALK_FADE_IN).play();
            isWalking = true;
        } else if (!wasmWalking && isWalking) {
            if (walkAction) walkAction.fadeOut(WALK_FADE_OUT);
            if (idleAction) idleAction.reset().fadeIn(WALK_FADE_OUT).play();
            isWalking = false;
        }
    }

    if (walkAction && isWalking && isGrounded) {
        const pSpeed = typeof PLAYER_SPEED !== 'undefined' ? PLAYER_SPEED : 300.0;
        const velXVal = playerWasmInstance.exports.velX.value;
        const velZVal = playerWasmInstance.exports.velZ.value;
        const speed = Math.sqrt(velXVal * velXVal + velZVal * velZVal);
        const timeScale = THREE.MathUtils.clamp((speed / pSpeed) * WALK_ANIM_SPEED_MULT, 0.5, 1.7);
        walkAction.setEffectiveTimeScale(timeScale);
    }

    /* 5. WASM Secondary Ponytail Physics Tick */
    updatePonytailPhysics(dt);
}
