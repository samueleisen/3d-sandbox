/* ───────────────────────────────────────────────
    STYLIZED ATMOSPHERIC GRADIENT SKY DOME
    Creates a large inverted sky dome featuring a smooth
    directional gradient from a brilliant white/ice-blue sun hot spot
    down to vibrant sky blue at the horizon and deep cobalt blue at the zenith.
─────────────────────────────────────────────── */

let skyMesh = null;
let skyMaterial = null;

const skyUniforms = {
    uSunDir: { value: new THREE.Vector3(0, 0.44721, -0.89443) },
    uColorHotCore: { value: new THREE.Color(1.0, 1.0, 1.0) },     // Pure white sun core
    uColorHotGlow: { value: new THREE.Color(0.78, 0.93, 1.0) },   // Lighter ice blue hot spot (#c7edff)
    uColorSun: { value: new THREE.Color(0.58, 0.82, 0.98) },      // Light sky blue directional glow (#94d1fa)
    uColorHorizon: { value: new THREE.Color(0.35, 0.68, 0.92) },  // Vibrant horizon sky blue (#59adeb)
    uColorZenith: { value: new THREE.Color(0.06, 0.16, 0.42) }    // Deep cobalt / sapphire blue zenith (#0f296b)
};

/**
 * Initializes the sky dome sphere and custom shader material.
 */
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

                // Vertical height factor: 0.0 at horizon, 1.0 at zenith
                float height = clamp(dir.y, 0.0, 1.0);

                // Alignment with sun/light source direction (negative Z offset)
                float sunAlignment = max(0.0, dot(dir, uSunDir));

                // Vertical sky gradient transition (horizon sky blue -> zenith cobalt blue)
                vec3 skyColor = mix(uColorHorizon, uColorZenith, pow(height, 0.7));

                // Directional light ambient glow (light sky blue)
                float sunAmbientGlow = pow(sunAlignment, 2.0);
                skyColor = mix(skyColor, uColorSun, sunAmbientGlow * 0.75);

                // Compressed Hot Spot: Lighter Ice Blue Halo
                float hotGlowFactor = pow(sunAlignment, 64.0);
                skyColor = mix(skyColor, uColorHotGlow, hotGlowFactor * 0.95);

                // Compressed Tight Pure White Sun Core Hot Spot
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

/**
 * Updates sky dome position to follow camera, preventing clipping.
 */
function updateSky() {
    if (!skyMesh) {
        initSky();
    }
    if (camera && skyMesh) {
        skyMesh.position.copy(camera.position);

        // Keep sun direction synced with directional light orientation
        if (typeof dirLight !== 'undefined') {
            const sunDir = new THREE.Vector3(0, 2500, -5000).normalize();
            skyUniforms.uSunDir.value.copy(sunDir);
        }
    }
}
