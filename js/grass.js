/* ───────────────────────────────────────────────
    INTERACTIVE GRASS LANDSCAPE (Deep Narrow Camera Vision Span + Rolling Chunk Grid + GPU GLSL Shader)
    createGrassLandscape · updateGrassPhysics · updateRollingGrid
    Depends on: scene, PAL, WORLD_WIDTH, WORLD_DEPTH, getGroundHeight
─────────────────────────────────────────────── */

let grassInstancedMesh = null;
let grassData = [];
let maxGrassCount = 200000;

// Rolling Grid parameters (11x11 chunk grid = 4400x4400 total active span extending around camera)
const CHUNK_SIZE = 400;    // units per chunk square
const GRID_RADIUS = 5;     // 11x11 chunk grid (-5 to +5)
const GRID_DIM = GRID_RADIUS * 2 + 1; // 11
const TOTAL_CHUNKS = GRID_DIM * GRID_DIM; // 121
let activeGridX = null;
let activeGridZ = null;

// Reusable Three.js math objects to avoid per-frame allocations
const _dummyGrass = new THREE.Object3D();

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
 * Deterministic 2D hash generator for consistent chunk pseudo-random seeding.
 */
function hash2D(cx, cz, index, seed = 0) {
    const n = Math.sin(cx * 12.9898 + cz * 78.233 + index * 43758.5453 + seed * 19.19) * 43758.5453;
    return n - Math.floor(n);
}

/**
 * Creates low-poly tapered grass blade geometry.
 * Pivot is anchored at the bottom (y=0) so bending rotates from the root.
 */
function createGrassBladeGeometry() {
    const w = 2.2;
    const h = 10.0;

    // Plane geometry with 3 height segments for natural curvature
    const geo = new THREE.PlaneGeometry(w, h, 1, 3);

    // Anchor pivot at bottom (y = 0)
    geo.translate(0, h / 2, 0);

    // Taper width toward top vertex tip
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const yRatio = pos.getY(i) / h;
        const taper = 1.0 - yRatio * 0.75; // 75% narrower at top tip
        pos.setX(i, pos.getX(i) * taper);
    }
    geo.computeVertexNormals();

    return geo;
}

/**
 * Seeds a single chunk cell (cx, cz) into grassData starting at instance offset baseIdx.
 */
function seedChunk(cx, cz, baseIdx, bladesPerChunk) {
    const originX = cx * CHUNK_SIZE - CHUNK_SIZE / 2;
    const originZ = cz * CHUNK_SIZE - CHUNK_SIZE / 2;

    for (let i = 0; i < bladesPerChunk; i++) {
        const idx = baseIdx + i;
        if (idx >= maxGrassCount) break;

        const offX = hash2D(cx, cz, i, 1) * CHUNK_SIZE;
        const offZ = hash2D(cx, cz, i, 2) * CHUNK_SIZE;
        const gx = originX + offX;
        const gz = originZ + offZ;

        const rawGy = typeof getGroundHeight === 'function' ? getGroundHeight(gx, gz) : 0;
        const gy = rawGy > 5 ? 0 : rawGy;

        const rotY = hash2D(cx, cz, i, 3) * Math.PI * 2;
        const baseScale = 0.85 + hash2D(cx, cz, i, 4) * 1.55;

        grassData[idx] = { x: gx, y: gy, z: gz, rotY, baseScale };

        _dummyGrass.position.set(gx, gy, gz);
        _dummyGrass.rotation.set(0, rotY, 0);
        _dummyGrass.scale.set(baseScale, baseScale, baseScale);
        _dummyGrass.updateMatrix();

        grassInstancedMesh.setMatrixAt(idx, _dummyGrass.matrix);
    }
}

/**
 * Recalculates and re-seeds chunks starting from camera ground position (camX, camZ).
 */
function updateRollingGrid(camX, camZ, camDirX = 0, camDirZ = -1) {
    if (!grassInstancedMesh) return;

    // Center grid deep along camera vision frustum (+1.5 * CHUNK_SIZE forward)
    const forwardPx = camX + camDirX * (CHUNK_SIZE * 1.5);
    const forwardPz = camZ + camDirZ * (CHUNK_SIZE * 1.5);

    const currentChunkX = Math.floor((forwardPx + CHUNK_SIZE / 2) / CHUNK_SIZE);
    const currentChunkZ = Math.floor((forwardPz + CHUNK_SIZE / 2) / CHUNK_SIZE);

    if (currentChunkX === activeGridX && currentChunkZ === activeGridZ) {
        return; // Still in the same chunk cell
    }

    activeGridX = currentChunkX;
    activeGridZ = currentChunkZ;

    const bladesPerChunk = Math.floor(maxGrassCount / TOTAL_CHUNKS);
    let chunkIdx = 0;

    for (let cx = currentChunkX - GRID_RADIUS; cx <= currentChunkX + GRID_RADIUS; cx++) {
        for (let cz = currentChunkZ - GRID_RADIUS; cz <= currentChunkZ + GRID_RADIUS; cz++) {
            seedChunk(cx, cz, chunkIdx * bladesPerChunk, bladesPerChunk);
            chunkIdx++;
        }
    }

    grassInstancedMesh.instanceMatrix.needsUpdate = true;
}

/**
 * Initializes the InstancedMesh grass landscape across the world floor.
 */
function createGrassLandscape(count = 5000) {
    // Remove existing grass mesh if present
    if (grassInstancedMesh) {
        scene.remove(grassInstancedMesh);
        if (grassInstancedMesh.geometry) grassInstancedMesh.geometry.dispose();
        if (grassInstancedMesh.material) grassInstancedMesh.material.dispose();
        grassInstancedMesh = null;
    }

    if (count <= 0) {
        grassData = [];
        return;
    }

    maxGrassCount = count;
    activeGridX = null;
    activeGridZ = null;

    const geo = createGrassBladeGeometry();

    const mat = new THREE.MeshStandardMaterial({
        color: PAL.treeLeavesTop || 0x4cb050,
        roughness: 0.7,
        metalness: 0.1,
        side: THREE.DoubleSide,
        shadowSide: THREE.DoubleSide
    });

    // GLSL Shader Injection: 100% GPU-accelerated bending, wind sway, narrow FOV vision angle culling
    mat.onBeforeCompile = function (shader) {
        shader.uniforms.uPlayerPos = grassUniforms.uPlayerPos;
        shader.uniforms.uCamPos = grassUniforms.uCamPos;
        shader.uniforms.uCamDir = grassUniforms.uCamDir;
        shader.uniforms.uHalfFovCos = grassUniforms.uHalfFovCos;
        shader.uniforms.uTime = grassUniforms.uTime;
        shader.uniforms.uMaxVisDist = grassUniforms.uMaxVisDist;
        shader.uniforms.uBendRadius = grassUniforms.uBendRadius;

        shader.vertexShader = `
            uniform vec3 uPlayerPos;
            uniform vec3 uCamPos;
            uniform vec3 uCamDir;
            uniform float uHalfFovCos;
            uniform float uTime;
            uniform float uMaxVisDist;
            uniform float uBendRadius;
        ` + shader.vertexShader;

        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
            #include <begin_vertex>

            #ifdef USE_INSTANCING
                vec4 instWorldPos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
            #else
                vec4 instWorldPos = modelMatrix * vec4(0.0, 0.0, 0.0, 1.0);
            #endif

            // Vector and distance from CAMERA ground position to instance root
            vec2 dirFromCam = instWorldPos.xz - uCamPos.xz;
            float distToCam = length(dirFromCam);
            float distToPlayer = length(instWorldPos.xz - uPlayerPos.xz);

            // 1. Smooth Distance Scale Dissolve from Camera Position (Horizon Fade)
            float innerDist = uMaxVisDist * 0.30;
            float fadeAlpha = 1.0;
            if (distToCam > innerDist) {
                float t = clamp((distToCam - innerDist) / (uMaxVisDist - innerDist), 0.0, 1.0);
                fadeAlpha = 1.0 - (t * t * (3.0 - 2.0 * t)); // Smoothstep curve
            }

            // 2. Narrow Camera Vision Span Angle Alignment (originating at camera X,Z)
            if (distToCam > 10.0) {
                vec2 normDir = dirFromCam / distToCam;
                float dotCam = dot(normDir, uCamDir.xz);
                if (dotCam < uHalfFovCos) {
                    float fovFade = clamp((dotCam - (uHalfFovCos - 0.25)) / 0.25, 0.0, 1.0);
                    fadeAlpha *= fovFade;
                }
            }

            // Scale vertex smoothly down to 0 at view boundary
            transformed *= fadeAlpha;

            // Height-based influence factor (0 at root y=0, 1 at top tip y=10)
            float heightFactor = clamp(position.y / 10.0, 0.0, 1.0);

            // 3. GPU Ambient Wind Sway
            float windSway = sin(uTime * 2.8 + instWorldPos.x * 0.08 + instWorldPos.z * 0.08) * 0.45 * heightFactor;
            transformed.x += windSway;

            // 4. GPU Player Collision Bending Force (from player feet)
            if (distToPlayer < uBendRadius && abs(instWorldPos.y - uPlayerPos.y) < 25.0) {
                vec2 pushDir = normalize(instWorldPos.xz - uPlayerPos.xz + vec2(0.0001));
                float bendFactor = (1.0 - distToPlayer / uBendRadius) * 4.5 * heightFactor;
                transformed.x += pushDir.x * bendFactor;
                transformed.z += pushDir.y * bendFactor;
                transformed.y -= bendFactor * 0.3; // Slight downward displacement when bent over
            }
            `
        );
    };

    grassInstancedMesh = new THREE.InstancedMesh(geo, mat, count);
    grassInstancedMesh.castShadow = true;
    grassInstancedMesh.receiveShadow = true;

    // Custom depth material so shadows reflect GPU vertex bending & wind
    const customDepthMat = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking });
    customDepthMat.onBeforeCompile = mat.onBeforeCompile;
    grassInstancedMesh.customDepthMaterial = customDepthMat;

    grassData = new Array(count);

    // Initial grid seed centered at (0, 0)
    updateRollingGrid(0, 0, 0, -1);

    scene.add(grassInstancedMesh);
    console.log(`[grass] Created ${count} Deep Narrow Camera Vision Span GPU grass blades.`);
}

/**
 * Updates GPU GLSL Shader Uniforms & Rolling Grid each frame.
 */
function updateGrassPhysics(px, py, pz, dt, time) {
    if (!grassInstancedMesh) return;

    // Calculate camera look vector (pointing from camera through player into the forward view)
    const yawRad = THREE.MathUtils.degToRad(typeof camYawDeg !== 'undefined' ? camYawDeg : 0);
    const camDirX = -Math.sin(yawRad);
    const camDirZ = -Math.cos(yawRad);

    // Get camera ground coordinates
    const camX = typeof camera !== 'undefined' ? camera.position.x : px;
    const camZ = typeof camera !== 'undefined' ? camera.position.z : pz;

    // Calculate narrow horizontal half-FOV angle cosine
    const vertFovRad = THREE.MathUtils.degToRad(typeof camFov !== 'undefined' ? camFov : 45);
    const aspectVal = typeof aspect !== 'undefined' ? aspect : (window.innerWidth / window.innerHeight);
    const halfHovRad = Math.atan(Math.tan(vertFovRad / 2) * aspectVal);
    const halfFovCos = Math.cos(halfHovRad + 0.05); // Narrow 0.05 rad safety buffer

    // Pass camera position, direction & FOV cosine to GLSL shader & update rolling grid
    grassUniforms.uCamPos.value.set(camX, 0, camZ);
    grassUniforms.uCamDir.value.set(camDirX, 0, camDirZ);
    grassUniforms.uHalfFovCos.value = halfFovCos;

    updateRollingGrid(camX, camZ, camDirX, camDirZ);

    // Update GLSL Uniforms on the material
    grassUniforms.uPlayerPos.value.set(px, py, pz);
    grassUniforms.uTime.value = time;

    if (typeof maxVisDist !== 'undefined' && maxVisDist < 10000) {
        grassUniforms.uMaxVisDist.value = maxVisDist;
    } else {
        grassUniforms.uMaxVisDist.value = 2800.0;
    }
}
