// ─────────────────────────────────────────────────────────────
//  ASSEMBLY_SCRIPT CHARACTER & PONYTAIL PHYSICS ENGINE (characterPhysics.wasm)
//  WASD Camera-Relative Vector Locomotion · AABB Obstacle Collision Response ·
//  Elevation Ground Height Surface Lookup · Jump Gravity & Velocity Smoothers ·
//  Procedural 5-Bone Ponytail Secondary Hair Dynamics
// ─────────────────────────────────────────────────────────────

// Physics Constants
const PLAYER_SPEED: f32 = 300.0;
const PLAYER_RADIUS: f32 = 6.0;
const PLAYER_HEIGHT: f32 = 16.0;
const JUMP_POWER: f32 = 350.0;
const JUMP_GRAVITY: f32 = 1100.0;
const PLAYER_FRICTION: f32 = 14.0;
const MIN_WALK_SPEED: f32 = 8.0;

// Exported Player State Registers
export let px: f32 = 0.0;
export let py: f32 = 0.0;
export let pz: f32 = 0.0;

export let velX: f32 = 0.0;
export let velY: f32 = 0.0;
export let velZ: f32 = 0.0;

export let rotY: f32 = 0.0;
export let isGrounded: boolean = true;
export let isWalking: boolean = false;
export let justLanded: boolean = false;

// Obstacle AABB Memory Storage (Up to 256 AABBs: [minX, minY, minZ, maxX, maxY, maxZ] per obstacle)
const MAX_OBSTACLES: i32 = 256;
const obstaclesBuffer = new Float32Array(MAX_OBSTACLES * 6);
let obstacleCount: i32 = 0;

// Ponytail Secondary Physics State & Buffer (5 bones * 3 floats: pitch, yaw, roll)
const ponytailBuffer = new Float32Array(15);
const smoothedPitch = new Float32Array(5);
const smoothedRoll = new Float32Array(5);
const smoothedYaw = new Float32Array(5);

let prevPx: f32 = 0.0;
let prevPy: f32 = 0.0;
let prevPz: f32 = 0.0;
let prevYaw: f32 = 0.0;
let ponytailInitialized: boolean = false;

export function getObstaclesPointer(): usize {
    return obstaclesBuffer.dataStart;
}

export function setObstacleCount(count: i32): void {
    obstacleCount = count < MAX_OBSTACLES ? count : MAX_OBSTACLES;
}

export function getPonytailBufferPointer(): usize {
    return ponytailBuffer.dataStart;
}

export function setPlayerPosition(x: f32, y: f32, z: f32): void {
    px = x;
    py = y;
    pz = z;
}

@inline
function clampF32(val: f32, minVal: f32, maxVal: f32): f32 {
    if (val < minVal) return minVal;
    if (val > maxVal) return maxVal;
    return val;
}

/**
 * Calculates ground elevation under character feet against obstacle top surfaces.
 */
export function getGroundHeightWasm(x: f32, z: f32, radius: f32): f32 {
    let groundY: f32 = 0.0;
    for (let i = 0; i < obstacleCount; i++) {
        const idx: i32 = i * 6;
        const minX: f32 = obstaclesBuffer[idx];
        const minZ: f32 = obstaclesBuffer[idx + 2];
        const maxX: f32 = obstaclesBuffer[idx + 3];
        const maxY: f32 = obstaclesBuffer[idx + 4];
        const maxZ: f32 = obstaclesBuffer[idx + 5];

        if (x + radius > minX && x - radius < maxX &&
            z + radius > minZ && z - radius < maxZ) {
            if (maxY > groundY) {
                groundY = maxY;
            }
        }
    }
    return groundY;
}

/**
 * Tests player AABB box against obstacle bounding boxes.
 */
export function testCollisionWasm(testX: f32, testY: f32, testZ: f32): boolean {
    const pMinX: f32 = testX - PLAYER_RADIUS;
    const pMaxX: f32 = testX + PLAYER_RADIUS;
    const pMinY: f32 = testY;
    const pMaxY: f32 = testY + PLAYER_HEIGHT;
    const pMinZ: f32 = testZ - PLAYER_RADIUS;
    const pMaxZ: f32 = testZ + PLAYER_RADIUS;

    const EPSILON: f32 = 0.5;

    for (let i = 0; i < obstacleCount; i++) {
        const idx: i32 = i * 6;
        const minX: f32 = obstaclesBuffer[idx];
        const minY: f32 = obstaclesBuffer[idx + 1];
        const minZ: f32 = obstaclesBuffer[idx + 2];
        const maxX: f32 = obstaclesBuffer[idx + 3];
        const maxY: f32 = obstaclesBuffer[idx + 4];
        const maxZ: f32 = obstaclesBuffer[idx + 5];

        if (testY >= maxY - EPSILON) continue;

        if (pMinX <= maxX && pMaxX >= minX &&
            pMinY <= maxY && pMaxY >= minY &&
            pMinZ <= maxZ && pMaxZ >= minZ) {
            return true;
        }
    }
    return false;
}

/**
 * Main Player Physics & Locomotion Update Loop in Wasm.
 */
export function updatePlayerPhysicsWasm(
    dt: f32,
    keyW: boolean, keyA: boolean, keyS: boolean, keyD: boolean, keySpace: boolean,
    camYawDeg: f32
): void {
    if (dt <= 0.0) return;

    /* 1. WASD Input Vector & Camera-Relative Movement */
    const rawDx: f32 = (keyD ? 1.0 : 0.0) - (keyA ? 1.0 : 0.0);
    const rawDz: f32 = (keyS ? 1.0 : 0.0) - (keyW ? 1.0 : 0.0);

    const yawRad: f32 = camYawDeg * f32(Math.PI / 180.0);
    const moveX: f32 =  rawDx * f32(Math.cos(yawRad)) + rawDz * f32(Math.sin(yawRad));
    const moveZ: f32 = -rawDx * f32(Math.sin(yawRad)) + rawDz * f32(Math.cos(yawRad));

    const inputLen: f32 = f32(Math.sqrt(moveX * moveX + moveZ * moveZ));
    let dirX: f32 = 0.0;
    let dirZ: f32 = 0.0;
    if (inputLen > 0.0) {
        dirX = moveX / inputLen;
        dirZ = moveZ / inputLen;
    }

    const targetVelX: f32 = dirX * PLAYER_SPEED;
    const targetVelZ: f32 = dirZ * PLAYER_SPEED;

    /* 2. Acceleration & Friction */
    if (inputLen > 0.0) {
        const accelAlpha: f32 = f32(Math.min(1.0, 16.0 * dt));
        velX += (targetVelX - velX) * accelAlpha;
        velZ += (targetVelZ - velZ) * accelAlpha;
    } else {
        const frictionAlpha: f32 = f32(Math.min(1.0, PLAYER_FRICTION * dt));
        velX += (0.0 - velX) * frictionAlpha;
        velZ += (0.0 - velZ) * frictionAlpha;
        if (f32(Math.abs(velX)) < 0.1) velX = 0.0;
        if (f32(Math.abs(velZ)) < 0.1) velZ = 0.0;
    }

    /* 3. Displacement & 2-Pass AABB Collision Response */
    const prevX: f32 = px;
    const prevZ: f32 = pz;

    const dx: f32 = velX * dt;
    const dz: f32 = velZ * dt;

    const newX: f32 = px + dx;
    if (!testCollisionWasm(newX, py, pz)) {
        px = newX;
    } else {
        velX = 0.0;
    }

    const newZ: f32 = pz + dz;
    if (!testCollisionWasm(px, py, newZ)) {
        pz = newZ;
    } else {
        velZ = 0.0;
    }

    /* 4. Ground Height & Jump Physics */
    const targetGroundY: f32 = getGroundHeightWasm(px, pz, PLAYER_RADIUS);
    justLanded = false;

    if (keySpace && isGrounded) {
        isGrounded = false;
        velY = JUMP_POWER;
    }

    if (!isGrounded) {
        velY -= JUMP_GRAVITY * dt;
        py += velY * dt;

        if (py <= targetGroundY) {
            py = targetGroundY;
            velY = 0.0;
            isGrounded = true;
            justLanded = true;
        }
    } else {
        if (py > targetGroundY + 0.1) {
            isGrounded = false;
            velY = 0.0;
        } else {
            py = targetGroundY;
        }
    }

    /* 5. Facing Rotation Smoothing */
    const actualDx: f32 = px - prevX;
    const actualDz: f32 = pz - prevZ;
    const dtSafe: f32 = dt > 0.0001 ? dt : 0.0001;
    const actualSpeed: f32 = f32(Math.sqrt(actualDx * actualDx + actualDz * actualDz)) / dtSafe;
    isWalking = actualSpeed > MIN_WALK_SPEED;

    if (isWalking || inputLen > 0.0) {
        const facingX: f32 = f32(Math.abs(actualDx)) > 0.01 ? actualDx : dirX;
        const facingZ: f32 = f32(Math.abs(actualDz)) > 0.01 ? actualDz : dirZ;

        if (facingX != 0.0 || facingZ != 0.0) {
            const targetAngle: f32 = f32(Math.atan2(facingX, facingZ));
            let diff: f32 = targetAngle - rotY;
            while (diff > f32(Math.PI)) diff -= f32(Math.PI * 2.0);
            while (diff < -f32(Math.PI)) diff += f32(Math.PI * 2.0);
            rotY += diff * f32(Math.min(1.0, 14.0 * dt));
        }
    }
}

/**
 * Procedural 5-Bone Ponytail Secondary Physics Tick in Wasm.
 */
export function updatePonytailPhysicsWasm(dt: f32, curPx: f32, curPy: f32, curPz: f32, currentYaw: f32): void {
    if (dt <= 0.0) return;

    if (!ponytailInitialized) {
        prevPx = curPx;
        prevPy = curPy;
        prevPz = curPz;
        prevYaw = currentYaw;
        ponytailInitialized = true;
        return;
    }

    const vx: f32 = (curPx - prevPx) / dt;
    const vy: f32 = (curPy - prevPy) / dt;
    const vz: f32 = (curPz - prevPz) / dt;

    let yawDiff: f32 = currentYaw - prevYaw;
    while (yawDiff > f32(Math.PI)) yawDiff -= f32(Math.PI * 2.0);
    while (yawDiff < -f32(Math.PI)) yawDiff += f32(Math.PI * 2.0);
    const yawRate: f32 = yawDiff / dt;

    prevPx = curPx;
    prevPy = curPy;
    prevPz = curPz;
    prevYaw = currentYaw;

    const sinY: f32 = f32(Math.sin(currentYaw));
    const cosY: f32 = f32(Math.cos(currentYaw));

    const vForward: f32 = -(vx * sinY + vz * cosY);
    const vRight: f32   =  vx * cosY - vz * sinY;

    const speedRatio: f32 = clampF32(vForward / PLAYER_SPEED, -0.5, 1.0);
    const vyFactor: f32   = clampF32(vy * 0.0035, -0.15, 0.15);
    const targetBasePitch: f32 = -speedRatio * 0.55 - vyFactor;

    const targetBaseRoll: f32 = clampF32(-vRight / PLAYER_SPEED * 0.30 - yawRate * 0.08, -0.35, 0.35);
    const targetBaseYaw: f32  = clampF32(-yawRate * 0.10, -0.20, 0.20);

    const chainSum: f32 = 2.95;
    const MAX_TOTAL_PITCH: f32 = f32(115.0 * Math.PI / 180.0);
    const maxBasePitch: f32 = MAX_TOTAL_PITCH / chainSum;
    const clampedBasePitch: f32 = clampF32(targetBasePitch, -maxBasePitch, maxBasePitch);

    const chainFactors: f32[] = [0.05, 0.15, 1.10, 0.75, 0.90];
    const lerpSpeed: f32 = 6.0;
    const alpha: f32 = 1.0 - f32(Math.exp(-lerpSpeed * dt));

    for (let i: i32 = 0; i < 5; i++) {
        const factor: f32 = chainFactors[i];
        const targetPitch: f32 = clampedBasePitch * factor;
        const targetRoll: f32  = targetBaseRoll * factor;
        const targetYaw: f32   = targetBaseYaw * factor;

        smoothedPitch[i] += (targetPitch - smoothedPitch[i]) * alpha;
        smoothedRoll[i]  += (targetRoll - smoothedRoll[i])  * alpha;
        smoothedYaw[i]   += (targetYaw - smoothedYaw[i])   * alpha;

        const idx: i32 = i * 3;
        ponytailBuffer[idx]     = smoothedPitch[i];
        ponytailBuffer[idx + 1] = smoothedYaw[i];
        ponytailBuffer[idx + 2] = smoothedRoll[i];
    }
}
