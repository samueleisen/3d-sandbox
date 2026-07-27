/* ───────────────────────────────────────────────
    UNIFIED PLAYER & CHARACTER PHYSICS ENGINE
    GLTF Model Loader · Input Listeners (WASD + Space) ·
    AABB Obstacle Collision Response · Ground Elevation Detection ·
    Velocity-Based Physics & Jump Gravity · Facing Rotation ·
    Locomotion Animations · Procedural Ponytail Hair Physics
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
scene.add(playerGroup);

const pShadow = new THREE.Mesh(
    new THREE.CircleGeometry((PLAYER_RADIUS + 4) * 0.5, 16),
    new THREE.MeshBasicMaterial({ color: PAL.shadow, transparent: true, opacity: 0.5 })
);
pShadow.rotation.x = -Math.PI / 2;
pShadow.position.y = 0.6;
scene.add(pShadow);

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

const WALK_FADE_IN          = 0.18;
const WALK_FADE_OUT         = 0.25;
const JUMP_LAUNCH_BLEND     = 0.14;
const MIN_WALK_SPEED        = 8.0;
const WALK_ANIM_SPEED_MULT  = 1.35;

let velX = 0;
let velY = 0;
let velZ = 0;

// ── Ponytail Hair Secondary Physics State ─────────────────────
let ponytailBones = [];
let prevPx = 0;
let prevPy = 0;
let prevPz = 0;
let prevYaw = 0;
let ponytailInitialized = false;

const smoothedPitch = [0, 0, 0, 0, 0];
const smoothedRoll = [0, 0, 0, 0, 0];
const smoothedYaw = [0, 0, 0, 0, 0];

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
    console.log(`[player] Found ${foundCount}/5 ponytail bones for procedural physics.`);
}

function updatePonytailPhysics(dt) {
    if (!ponytailBones || ponytailBones.length === 0 || !playerGroup) return;
    if (dt <= 0) return;

    const px = playerGroup.position.x;
    const py = playerGroup.position.y;
    const pz = playerGroup.position.z;
    const currentYaw = playerGroup.rotation.y;

    if (!ponytailInitialized) {
        prevPx = px;
        prevPy = py;
        prevPz = pz;
        prevYaw = currentYaw;
        ponytailInitialized = true;
        return;
    }

    const vx = (px - prevPx) / dt;
    const vy = (py - prevPy) / dt;
    const vz = (pz - prevPz) / dt;

    let yawDiff = currentYaw - prevYaw;
    while (yawDiff > Math.PI) yawDiff -= Math.PI * 2;
    while (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
    const yawRate = yawDiff / dt;

    prevPx = px;
    prevPy = py;
    prevPz = pz;
    prevYaw = currentYaw;

    const sinY = Math.sin(currentYaw);
    const cosY = Math.cos(currentYaw);

    const vForward = -(vx * sinY + vz * cosY);
    const vRight = vx * cosY - vz * sinY;

    const speedRatio = THREE.MathUtils.clamp(vForward / PLAYER_SPEED, -0.5, 1.0);
    const vyFactor = THREE.MathUtils.clamp(vy * 0.0035, -0.15, 0.15);
    const targetBasePitch = -speedRatio * 0.55 - vyFactor;

    const targetBaseRoll = THREE.MathUtils.clamp(-vRight / PLAYER_SPEED * 0.30 - yawRate * 0.08, -0.35, 0.35);
    const targetBaseYaw = THREE.MathUtils.clamp(-yawRate * 0.10, -0.20, 0.20);

    const chainFactors = [0.05, 0.15, 1.10, 0.75, 0.90];
    const chainSum = 2.95;
    const MAX_TOTAL_PITCH = THREE.MathUtils.degToRad(115);

    const maxBasePitch = MAX_TOTAL_PITCH / chainSum;
    const clampedBasePitch = THREE.MathUtils.clamp(targetBasePitch, -maxBasePitch, maxBasePitch);

    const lerpSpeed = 6.0;

    for (let i = 0; i < 5; i++) {
        const bone = ponytailBones[i];
        if (!bone) continue;

        const factor = chainFactors[i];
        const targetPitch = clampedBasePitch * factor;
        const targetRoll = targetBaseRoll * factor;
        const targetYaw = targetBaseYaw * factor;

        const alpha = 1.0 - Math.exp(-lerpSpeed * dt);
        smoothedPitch[i] += (targetPitch - smoothedPitch[i]) * alpha;
        smoothedRoll[i] += (targetRoll - smoothedRoll[i]) * alpha;
        smoothedYaw[i] += (targetYaw - smoothedYaw[i]) * alpha;

        if (bone._restQuaternion) {
            bone.quaternion.copy(bone._restQuaternion);
        }

        _euler.set(smoothedPitch[i], smoothedYaw[i], smoothedRoll[i], 'YXZ');
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
        if (size.y > 0) model.scale.setScalar(PLAYER_HEIGHT / size.y);

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
//  3D AABB Obstacle Collision Response
// ─────────────────────────────────────────────────────────────
const _playerBox = new THREE.Box3();

function getPlayerAABB(px, py = 0, pz = 0) {
    _playerBox.min.set(px - PLAYER_RADIUS, py,                 pz - PLAYER_RADIUS);
    _playerBox.max.set(px + PLAYER_RADIUS, py + PLAYER_HEIGHT,  pz + PLAYER_RADIUS);
    return _playerBox;
}

function testCollision(px, py = 0, pz = 0) {
    if (typeof obstacles === 'undefined' || !obstacles || obstacles.length === 0) return false;
    const pBox = getPlayerAABB(px, py, pz);
    const EPSILON = 0.5;

    for (let i = 0; i < obstacles.length; i++) {
        const obsBox = obstacles[i].box;
        if (py >= obsBox.max.y - EPSILON) {
            continue;
        }
        if (pBox.intersectsBox(obsBox)) return true;
    }
    return false;
}

// ─────────────────────────────────────────────────────────────
//  Ground Elevation Detection & Player Controller
// ─────────────────────────────────────────────────────────────
function getGroundHeight(x, z, radius = PLAYER_RADIUS) {
    let groundY = 0;
    if (typeof obstacles !== 'undefined' && obstacles) {
        for (let i = 0; i < obstacles.length; i++) {
            const box = obstacles[i].box;
            if (x + radius > box.min.x && x - radius < box.max.x &&
                z + radius > box.min.z && z - radius < box.max.z) {
                if (box.max.y > groundY) {
                    groundY = box.max.y;
                }
            }
        }
    }
    return groundY;
}

function updatePlayerController(dt) {
    if (mixer) mixer.update(dt);
    if (!glbReady) return;

    /* 1. Input vector & Camera-Relative Movement */
    let rawDx = (keys.d ? 1 : 0) - (keys.a ? 1 : 0);
    let rawDz = (keys.s ? 1 : 0) - (keys.w ? 1 : 0);

    const yawRad = THREE.MathUtils.degToRad(typeof camYawDeg !== 'undefined' ? camYawDeg : 0);
    const moveX =  rawDx * Math.cos(yawRad) + rawDz * Math.sin(yawRad);
    const moveZ = -rawDx * Math.sin(yawRad) + rawDz * Math.cos(yawRad);

    const inputLen = Math.sqrt(moveX * moveX + moveZ * moveZ);
    let dirX = 0;
    let dirZ = 0;
    if (inputLen > 0) {
        dirX = moveX / inputLen;
        dirZ = moveZ / inputLen;
    }

    const targetVelX = dirX * PLAYER_SPEED;
    const targetVelZ = dirZ * PLAYER_SPEED;

    /* 2. Acceleration & Friction */
    if (inputLen > 0) {
        velX += (targetVelX - velX) * Math.min(1, 16 * dt);
        velZ += (targetVelZ - velZ) * Math.min(1, 16 * dt);
    } else {
        velX += (0 - velX) * Math.min(1, PLAYER_FRICTION * dt);
        velZ += (0 - velZ) * Math.min(1, PLAYER_FRICTION * dt);
        if (Math.abs(velX) < 0.1) velX = 0;
        if (Math.abs(velZ) < 0.1) velZ = 0;
    }

    /* 3. Displacement & Collision Response */
    let px = playerGroup.position.x;
    let py = playerGroup.position.y;
    let pz = playerGroup.position.z;

    const prevX = px;
    const prevZ = pz;

    const dx = velX * dt;
    const dz = velZ * dt;

    const newX = px + dx;
    if (!testCollision(newX, py, pz)) {
        px = newX;
    } else {
        velX = 0;
    }

    const newZ = pz + dz;
    if (!testCollision(px, py, newZ)) {
        pz = newZ;
    } else {
        velZ = 0;
    }

    /* 4. Ground Height & Jump Physics */
    const targetGroundY = getGroundHeight(px, pz);
    let justLanded = false;

    if (keys.space && isGrounded) {
        isGrounded = false;
        velY = JUMP_POWER;

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

    if (!isGrounded) {
        velY -= JUMP_GRAVITY * dt;
        py += velY * dt;

        if (jumpAction) {
            if (velY < 0) {
                jumpAction.setEffectiveTimeScale(1.75);
            } else {
                jumpAction.setEffectiveTimeScale(1.0);
            }
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

        if (py <= targetGroundY) {
            py = targetGroundY;
            velY = 0;
            isGrounded = true;
            justLanded = true;

            if (jumpAction) {
                jumpAction.setEffectiveTimeScale(1.0);
                jumpAction.time = 1.6667;
                jumpAction.fadeOut(0.30);
            }
        }
    } else {
        if (py > targetGroundY + 0.1) {
            isGrounded = false;
            velY = 0;
        } else {
            py = targetGroundY;
        }
    }

    playerGroup.position.set(px, py, pz);

    // Update ground shadow
    pShadow.position.set(px, targetGroundY + 0.6, pz);
    const elevation = Math.max(0, py - targetGroundY);
    const shadowFactor = THREE.MathUtils.clamp(1.0 - (elevation / 70.0) * 0.45, 0.55, 1.0);
    pShadow.scale.set(shadowFactor, shadowFactor, 1.0);
    pShadow.material.opacity = THREE.MathUtils.clamp(0.5 - (elevation / 70.0) * 0.25, 0.25, 0.5);

    /* 5. Facing Rotation */
    const actualDx = px - prevX;
    const actualDz = pz - prevZ;
    const actualSpeed = Math.sqrt(actualDx * actualDx + actualDz * actualDz) / Math.max(dt, 0.0001);
    const isMoving = actualSpeed > MIN_WALK_SPEED;

    if (isMoving || inputLen > 0) {
        const facingX = Math.abs(actualDx) > 0.01 ? actualDx : dirX;
        const facingZ = Math.abs(actualDz) > 0.01 ? actualDz : dirZ;

        if (facingX !== 0 || facingZ !== 0) {
            const targetAngle = Math.atan2(facingX, facingZ);
            let diff = targetAngle - playerGroup.rotation.y;
            while (diff >  Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            playerGroup.rotation.y += diff * Math.min(1, 14 * dt);
        }
    }

    /* 6. Locomotion Cross-Fade */
    if (isGrounded) {
        if (justLanded) {
            if (isMoving) {
                if (idleAction) idleAction.fadeOut(WALK_FADE_IN);
                if (walkAction) walkAction.reset().fadeIn(WALK_FADE_IN).play();
                isWalking = true;
            } else {
                if (walkAction) walkAction.fadeOut(WALK_FADE_OUT);
                if (idleAction) idleAction.reset().fadeIn(WALK_FADE_OUT).play();
                isWalking = false;
            }
        } else if (isMoving && !isWalking) {
            if (idleAction) idleAction.fadeOut(WALK_FADE_IN);
            if (walkAction) walkAction.reset().fadeIn(WALK_FADE_IN).play();
            isWalking = true;
        } else if (!isMoving && isWalking) {
            if (walkAction) walkAction.fadeOut(WALK_FADE_OUT);
            if (idleAction) idleAction.reset().fadeIn(WALK_FADE_OUT).play();
            isWalking = false;
        }
    }

    if (walkAction && isWalking && isGrounded) {
        const timeScale = THREE.MathUtils.clamp((actualSpeed / PLAYER_SPEED) * WALK_ANIM_SPEED_MULT, 0.5, 1.7);
        walkAction.setEffectiveTimeScale(timeScale);
    }

    /* 7. Secondary Ponytail Physics Tick */
    updatePonytailPhysics(dt);
}
