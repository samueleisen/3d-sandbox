// ─────────────────────────────────────────────────────────────
//  ASSEMBLY_SCRIPT FOLIAGE & LANDSCAPE ENGINE (grass.wasm)
//  Deterministic Hash2D · Geometry Vertex Generator ·
//  Linear Memory 4x4 Matrix Instanced Chunk Transformer ·
//  Camera Vision & FOV Cone Line Computations ·
//  Embedded GLSL Shader Bytecode Generators
// ─────────────────────────────────────────────────────────────

// Global constants matching 3D landscape parameters
const CHUNK_SIZE: f32 = 400.0;
const GRID_RADIUS: i32 = 5;
const GRID_DIM: i32 = GRID_RADIUS * 2 + 1; // 11
const TOTAL_CHUNKS: i32 = GRID_DIM * GRID_DIM; // 121

let activeGridX: i32 = -999999;
let activeGridZ: i32 = -999999;

// Linear Memory Array allocation for 80,000 instances (80,000 * 16 floats = 1,280,000 floats = 5.12 MB)
const MAX_GRASS_COUNT: i32 = 80000;
const matrixBuffer = new Float32Array(MAX_GRASS_COUNT * 16);

// Grass blade vertex geometry data buffers
const positionsBuffer = new Float32Array(48); // 16 vertices * 3 (x,y,z)
const indicesBuffer = new Uint16Array(24);   // 24 indices for 8 triangles
const clustersBuffer = new Float32Array(16);  // 16 cluster floats (0.0 vs 1.0)

// FOV helper 3D cone line buffer: (6 + 32 * 2) * 3 = 210 float coordinates
const FOV_HELPER_VERTS: i32 = 70;
const fovHelperBuffer = new Float32Array(FOV_HELPER_VERTS * 3);

// Calculated camera parameters stored in Wasm memory
export let lastCamDirX: f32 = 0.0;
export let lastCamDirZ: f32 = -1.0;
export let lastHalfFovCos: f32 = 0.1;

// Shader UTF8 Byte Buffers
let headerShaderBuffer: Uint8Array | null = null;
let mainShaderBuffer: Uint8Array | null = null;
let depthShaderBuffer: Uint8Array | null = null;

/**
 * Deterministic 2D hash generator for chunk seeding.
 */
@inline
export function hash2D(cx: f32, cz: f32, index: f32, seed: f32): f32 {
    const angle: f32 = cx * 12.9898 + cz * 78.233 + index * 43758.5453 + seed * 19.19;
    const n: f32 = f32(Math.sin(angle)) * 43758.5453;
    return n - f32(Math.floor(n));
}

/**
 * Builds low-poly tapered grass blade geometry attributes in Wasm memory.
 */
export function initGrassBladeGeometry(): void {
    const w: f32 = 2.2;
    const h: f32 = 10.0;
    const taper: f32 = 0.25;

    const halfW: f32 = w / 2.0;
    const topHalfW: f32 = halfW * taper;

    const ox: f32 = 1.8;
    const oz: f32 = 1.8;

    // --- Cluster 1 (0, 0, 0) ---
    // Quad 1A (0°)
    positionsBuffer[0]  = -halfW;    positionsBuffer[1]  = 0.0; positionsBuffer[2]  = 0.0;
    positionsBuffer[3]  =  halfW;    positionsBuffer[4]  = 0.0; positionsBuffer[5]  = 0.0;
    positionsBuffer[6]  = -topHalfW; positionsBuffer[7]  = h;   positionsBuffer[8]  = 0.0;
    positionsBuffer[9]  =  topHalfW; positionsBuffer[10] = h;   positionsBuffer[11] = 0.0;

    // Quad 1B (90°)
    positionsBuffer[12] = 0.0; positionsBuffer[13] = 0.0; positionsBuffer[14] = -halfW;
    positionsBuffer[15] = 0.0; positionsBuffer[16] = 0.0; positionsBuffer[17] =  halfW;
    positionsBuffer[18] = 0.0; positionsBuffer[19] = h;   positionsBuffer[20] = -topHalfW;
    positionsBuffer[21] = 0.0; positionsBuffer[22] = h;   positionsBuffer[23] =  topHalfW;

    // --- Cluster 2 (ox, 0, oz) ---
    // Quad 2A (0°)
    positionsBuffer[24] = ox - halfW;    positionsBuffer[25] = 0.0; positionsBuffer[26] = oz;
    positionsBuffer[27] = ox + halfW;    positionsBuffer[28] = 0.0; positionsBuffer[29] = oz;
    positionsBuffer[30] = ox - topHalfW; positionsBuffer[31] = h;   positionsBuffer[32] = oz;
    positionsBuffer[33] = ox + topHalfW; positionsBuffer[34] = h;   positionsBuffer[35] = oz;

    // Quad 2B (90°)
    positionsBuffer[36] = ox; positionsBuffer[37] = 0.0; positionsBuffer[38] = oz - halfW;
    positionsBuffer[39] = ox; positionsBuffer[40] = 0.0; positionsBuffer[41] = oz + halfW;
    positionsBuffer[42] = ox; positionsBuffer[43] = h;   positionsBuffer[44] = oz - topHalfW;
    positionsBuffer[45] = ox; positionsBuffer[46] = h;   positionsBuffer[47] = oz + topHalfW;

    // Indices
    const idxData: u16[] = [
        0, 1, 2, 2, 1, 3,
        4, 5, 6, 6, 5, 7,
        8, 9, 10, 10, 9, 11,
        12, 13, 14, 14, 13, 15
    ];
    for (let i = 0; i < 24; i++) {
        indicesBuffer[i] = idxData[i];
    }

    // Clusters attribute (0.0 for cluster 1, 1.0 for cluster 2)
    for (let i = 0; i < 8; i++) clustersBuffer[i] = 0.0;
    for (let i = 8; i < 16; i++) clustersBuffer[i] = 1.0;
}

// ─────────────────────────────────────────────────────────────
//  GLSL Shader String Generators
// ─────────────────────────────────────────────────────────────
export function getGrassHeaderShaderWasm(): string {
    return "attribute float aCluster;\nuniform vec3 uPlayerPos;\nuniform vec3 uCamPos;\nuniform vec3 uCamDir;\nuniform float uHalfFovCos;\nuniform float uTime;\nuniform float uMaxVisDist;\nuniform float uBendRadius;\n";
}

export function getGrassTransformShaderWasm(isDepth: boolean): string {
    const shadowCutoff: string = isDepth
        ? "if (distToCam > 1400.0) { fadeAlpha = 0.0; }\ntransformed *= fadeAlpha;\n"
        : "transformed *= fadeAlpha;\n";

    return "#include <begin_vertex>\n"
        + "#ifdef USE_INSTANCING\nvec4 instWorldPos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);\n#else\nvec4 instWorldPos = modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);\n#endif\n"
        + "vec2 dirFromCam = instWorldPos.xz - uCamPos.xz;\nfloat distToCam = length(dirFromCam);\nfloat distToPlayer = length(instWorldPos.xz - uPlayerPos.xz);\n"
        + "if (aCluster > 0.5) {\nfloat c2Scale = smoothstep(300.0, 50.0, distToCam);\nvec3 c2Center = vec3(1.8, 0.0, 1.8);\ntransformed = c2Center + (transformed - c2Center) * c2Scale;\n}\n"
        + "float innerDist = uMaxVisDist * 0.57;\nfloat fadeAlpha = 1.0;\nif (distToCam > innerDist) {\nfloat t = clamp((distToCam - innerDist) / (uMaxVisDist - innerDist), 0.0, 1.0);\nfadeAlpha = 1.0 - (t * t * (3.0 - 2.0 * t));\n}\n"
        + "if (distToCam > 10.0) {\nvec2 normDir = dirFromCam / distToCam;\nfloat dotCam = dot(normDir, uCamDir.xz);\nif (dotCam < uHalfFovCos) {\nfloat fovFade = clamp((dotCam - (uHalfFovCos - 0.25)) / 0.25, 0.0, 1.0);\nfadeAlpha *= fovFade;\n}\n}\n"
        + shadowCutoff
        + "float heightFactor = clamp(position.y / 10.0, 0.0, 1.0);\n"
        + "if (distToCam < 600.0) {\nfloat windSway = sin(uTime * 2.8 + instWorldPos.x * 0.08 + instWorldPos.z * 0.08) * 0.45 * heightFactor;\ntransformed.x += windSway;\n}\n"
        + "if (distToPlayer < uBendRadius && abs(instWorldPos.y - uPlayerPos.y) < 25.0) {\nvec2 pushDir = normalize(instWorldPos.xz - uPlayerPos.xz + vec2(0.0001));\nfloat bendFactor = (1.0 - distToPlayer / uBendRadius) * 4.5 * heightFactor;\ntransformed.x += pushDir.x * bendFactor;\ntransformed.z += pushDir.y * bendFactor;\ntransformed.y -= bendFactor * 0.3;\n}\n";
}

export function initGrassShadersWasm(): void {
    headerShaderBuffer = Uint8Array.wrap(String.UTF8.encode(getGrassHeaderShaderWasm()));
    mainShaderBuffer   = Uint8Array.wrap(String.UTF8.encode(getGrassTransformShaderWasm(false)));
    depthShaderBuffer  = Uint8Array.wrap(String.UTF8.encode(getGrassTransformShaderWasm(true)));
}

export function getHeaderShaderPointer(): usize {
    return headerShaderBuffer ? headerShaderBuffer!.dataStart : 0;
}
export function getHeaderShaderLength(): i32 {
    return headerShaderBuffer ? headerShaderBuffer!.length : 0;
}

export function getMainShaderPointer(): usize {
    return mainShaderBuffer ? mainShaderBuffer!.dataStart : 0;
}
export function getMainShaderLength(): i32 {
    return mainShaderBuffer ? mainShaderBuffer!.length : 0;
}

export function getDepthShaderPointer(): usize {
    return depthShaderBuffer ? depthShaderBuffer!.dataStart : 0;
}
export function getDepthShaderLength(): i32 {
    return depthShaderBuffer ? depthShaderBuffer!.length : 0;
}

// Export raw buffer byte offset pointers into Wasm linear memory
export function getPositionsPointer(): usize {
    return positionsBuffer.dataStart;
}

export function getIndicesPointer(): usize {
    return indicesBuffer.dataStart;
}

export function getClustersPointer(): usize {
    return clustersBuffer.dataStart;
}

export function getMatrixBufferPointer(): usize {
    return matrixBuffer.dataStart;
}

export function getFovHelperBufferPointer(): usize {
    return fovHelperBuffer.dataStart;
}

/**
 * Computes camera direction vectors and FOV cosine parameters in Wasm.
 */
export function computeCamParamsWasm(yawDeg: f32, fovDeg: f32, aspectVal: f32): f32 {
    const yawRad: f32 = yawDeg * f32(Math.PI / 180.0);
    lastCamDirX = -f32(Math.sin(yawRad));
    lastCamDirZ = -f32(Math.cos(yawRad));

    const vertFovRad: f32 = fovDeg * f32(Math.PI / 180.0);
    const halfHovRad: f32 = f32(Math.atan(Math.tan(vertFovRad / 2.0) * aspectVal));
    lastHalfFovCos = f32(Math.cos(halfHovRad + 0.05));

    return lastHalfFovCos;
}

/**
 * Computes camera FOV vision boundary line segments in Wasm linear memory.
 */
export function computeFovHelperLinesWasm(
    camX: f32, camZ: f32, originY: f32,
    px: f32, pz: f32,
    yawDeg: f32, fovDeg: f32, aspectVal: f32, maxDist: f32
): void {
    const yawRad: f32 = yawDeg * f32(Math.PI / 180.0);
    const vertFovRad: f32 = fovDeg * f32(Math.PI / 180.0);
    const halfHovRad: f32 = f32(Math.atan(Math.tan(vertFovRad / 2.0) * aspectVal)) + 0.05;

    const centerAngle: f32 = yawRad + f32(Math.PI);
    const leftAngle: f32   = centerAngle - halfHovRad;
    const rightAngle: f32  = centerAngle + halfHovRad;

    let idx: i32 = 0;

    // Center ray
    fovHelperBuffer[idx++] = camX; fovHelperBuffer[idx++] = originY; fovHelperBuffer[idx++] = camZ;
    fovHelperBuffer[idx++] = camX + f32(Math.sin(centerAngle)) * maxDist;
    fovHelperBuffer[idx++] = originY;
    fovHelperBuffer[idx++] = camZ + f32(Math.cos(centerAngle)) * maxDist;

    // Left ray
    fovHelperBuffer[idx++] = camX; fovHelperBuffer[idx++] = originY; fovHelperBuffer[idx++] = camZ;
    fovHelperBuffer[idx++] = camX + f32(Math.sin(leftAngle)) * maxDist;
    fovHelperBuffer[idx++] = originY;
    fovHelperBuffer[idx++] = camZ + f32(Math.cos(leftAngle)) * maxDist;

    // Right ray
    fovHelperBuffer[idx++] = camX; fovHelperBuffer[idx++] = originY; fovHelperBuffer[idx++] = camZ;
    fovHelperBuffer[idx++] = camX + f32(Math.sin(rightAngle)) * maxDist;
    fovHelperBuffer[idx++] = originY;
    fovHelperBuffer[idx++] = camZ + f32(Math.cos(rightAngle)) * maxDist;

    // Outer Arc (32 segments)
    const segments: i32 = 32;
    for (let i = 0; i < segments; i++) {
        const t1: f32 = f32(i) / f32(segments);
        const t2: f32 = f32(i + 1) / f32(segments);
        const a1: f32 = leftAngle + (rightAngle - leftAngle) * t1;
        const a2: f32 = leftAngle + (rightAngle - leftAngle) * t2;

        fovHelperBuffer[idx++] = px + f32(Math.sin(a1)) * maxDist;
        fovHelperBuffer[idx++] = originY;
        fovHelperBuffer[idx++] = pz + f32(Math.cos(a1)) * maxDist;

        fovHelperBuffer[idx++] = px + f32(Math.sin(a2)) * maxDist;
        fovHelperBuffer[idx++] = originY;
        fovHelperBuffer[idx++] = pz + f32(Math.cos(a2)) * maxDist;
    }
}

/**
 * Seeds a single chunk cell (cx, cz) starting at instance offset baseIdx in Wasm memory.
 */
function seedChunkWasm(cx: i32, cz: i32, baseIdx: i32, bladesPerChunk: i32, maxCount: i32): void {
    const originX: f32 = f32(cx) * CHUNK_SIZE - CHUNK_SIZE / 2.0;
    const originZ: f32 = f32(cz) * CHUNK_SIZE - CHUNK_SIZE / 2.0;

    for (let i = 0; i < bladesPerChunk; i++) {
        const idx: i32 = baseIdx + i;
        if (idx >= maxCount) break;

        const offX: f32 = hash2D(f32(cx), f32(cz), f32(i), 1.0) * CHUNK_SIZE;
        const offZ: f32 = hash2D(f32(cx), f32(cz), f32(i), 2.0) * CHUNK_SIZE;
        const gx: f32 = originX + offX;
        const gz: f32 = originZ + offZ;
        const gy: f32 = 0.0;

        const rotY: f32 = hash2D(f32(cx), f32(cz), f32(i), 3.0) * f32(Math.PI * 2.0);
        const baseScale: f32 = 0.85 + hash2D(f32(cx), f32(cz), f32(i), 4.0) * 1.55;

        const c: f32 = f32(Math.cos(rotY)) * baseScale;
        const s: f32 = f32(Math.sin(rotY)) * baseScale;
        const m: i32 = idx * 16;

        matrixBuffer[m]      = c;
        matrixBuffer[m + 1]  = 0.0;
        matrixBuffer[m + 2]  = -s;
        matrixBuffer[m + 3]  = 0.0;

        matrixBuffer[m + 4]  = 0.0;
        matrixBuffer[m + 5]  = baseScale;
        matrixBuffer[m + 6]  = 0.0;
        matrixBuffer[m + 7]  = 0.0;

        matrixBuffer[m + 8]  = s;
        matrixBuffer[m + 9]  = 0.0;
        matrixBuffer[m + 10] = c;
        matrixBuffer[m + 11] = 0.0;

        matrixBuffer[m + 12] = gx;
        matrixBuffer[m + 13] = gy;
        matrixBuffer[m + 14] = gz;
        matrixBuffer[m + 15] = 1.0;
    }
}

/**
 * Computes grid chunk matrices in Wasm linear memory centered around camera (camX, camZ).
 * Returns true if grid was updated, false if camera stayed in same cell.
 */
export function updateRollingGridWasm(camX: f32, camZ: f32, camDirX: f32, camDirZ: f32, maxCount: i32): boolean {
    const forwardPx: f32 = camX + camDirX * (CHUNK_SIZE * 1.5);
    const forwardPz: f32 = camZ + camDirZ * (CHUNK_SIZE * 1.5);

    const currentChunkX: i32 = i32(Math.floor((forwardPx + CHUNK_SIZE / 2.0) / CHUNK_SIZE));
    const currentChunkZ: i32 = i32(Math.floor((forwardPz + CHUNK_SIZE / 2.0) / CHUNK_SIZE));

    if (currentChunkX == activeGridX && currentChunkZ == activeGridZ) {
        return false;
    }

    activeGridX = currentChunkX;
    activeGridZ = currentChunkZ;

    const targetCount: i32 = maxCount < MAX_GRASS_COUNT ? maxCount : MAX_GRASS_COUNT;
    const bladesPerChunk: i32 = targetCount / TOTAL_CHUNKS;
    let chunkIdx: i32 = 0;

    for (let cx = currentChunkX - GRID_RADIUS; cx <= currentChunkX + GRID_RADIUS; cx++) {
        for (let cz = currentChunkZ - GRID_RADIUS; cz <= currentChunkZ + GRID_RADIUS; cz++) {
            seedChunkWasm(cx, cz, chunkIdx * bladesPerChunk, bladesPerChunk, targetCount);
            chunkIdx++;
        }
    }

    return true;
}
