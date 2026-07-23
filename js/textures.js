/* ───────────────────────────────────────────────
    TREE TEXTURES  (canvas-generated, smooth stylized)
    makeWoodTexture · makeLeafDiscTexture · makeLeafVerticalTexture
    + pre-built shared texture instances used by trees.js
─────────────────────────────────────────────── */

/**
 * Generates a tiled smooth wood texture on a canvas.
 * Horizontal planks with subtle color variation, knots, and grain lines.
 */
function makeWoodTexture(tw = 64, th = 128) {
    const canvas = document.createElement('canvas');
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext('2d');

    const plankH = 16; // px per plank row
    const baseColors = [0x56341c, 0x6a3f22, 0x4e2f18, 0x5c3720];

    for (let row = 0; row < th / plankH; row++) {
        const base = baseColors[row % baseColors.length];
        const r = (base >> 16) & 0xff;
        const g = (base >> 8) & 0xff;
        const b = base & 0xff;

        for (let py = row * plankH; py < (row + 1) * plankH; py++) {
            for (let px = 0; px < tw; px++) {
                // smooth grain noise
                const noise = (Math.sin(px * 0.35 + py * 0.65) * 0.5 + 0.5) * 12 - 6;
                const rr = THREE.MathUtils.clamp(r + noise, 0, 255);
                const gg = THREE.MathUtils.clamp(g + noise * 0.6, 0, 255);
                const bb = THREE.MathUtils.clamp(b + noise * 0.3, 0, 255);
                ctx.fillStyle = `rgb(${Math.round(rr)},${Math.round(gg)},${Math.round(bb)})`;
                ctx.fillRect(px, py, 1, 1);
            }
        }
        // Dark plank seam line at bottom of each plank
        ctx.fillStyle = 'rgba(15,8,3,0.45)';
        ctx.fillRect(0, (row + 1) * plankH - 1, tw, 1);
    }

    // Add a few knot dots
    [[12, 24], [48, 72], [28, 104]].forEach(([kx, ky]) => {
        ctx.beginPath();
        ctx.arc(kx, ky, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(20,10,5,0.4)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(kx, ky, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(90,50,20,0.6)';
        ctx.fill();
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

/**
 * Generates a smooth leaf canopy disc texture with organic silhouettes,
 * transparent gaps, twigs/branches, and custom ambient occlusion shading.
 */
function makeLeafDiscTexture(size = 128, layer = 0) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Transparent background
    ctx.clearRect(0, 0, size, size);

    // Leaf palette per layer (top = lighter, bottom = darker)
    const palettes = [
        [0x4cb050, 0x388e3c, 0x66bb6a, 0x2e7d32], // bottom disc (darkest)
        [0x56c15a, 0x43a047, 0x76cc7a, 0x388e3c], // mid disc
        [0x66cc6a, 0x4caf50, 0x88d88a, 0x43a047], // top disc (brightest)
        [0x78d47c, 0x66bb6a, 0x9ae09e, 0x4caf50], // tip disc
    ];
    const pal = palettes[Math.min(layer, 3)];

    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 2;
    const cellSize = 1;

    // 1. Draw organic twigs radiating from center (underneath leaves)
    ctx.strokeStyle = '#3d2818';
    ctx.lineWidth = 3;
    const numBranches = 4 + (layer % 2);
    for (let b = 0; b < numBranches; b++) {
        const bAngle = (b * Math.PI * 2) / numBranches + (layer * 0.45);
        const bLen = radius * (0.4 + Math.random() * 0.28);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(bAngle) * bLen, cy + Math.sin(bAngle) * bLen);
        ctx.stroke();
    }

    // 2. Draw organic noise-deformed leaf cells
    for (let y = 0; y < size; y += cellSize) {
        for (let x = 0; x < size; x += cellSize) {
            const dx = (x + cellSize / 2) - cx;
            const dy = (y + cellSize / 2) - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const theta = Math.atan2(dy, dx);

            // Radial wave formula to deform circle into organic leaf clumps
            const wave = Math.sin(theta * 5 + layer * 1.5) * 0.12 +
                Math.cos(theta * 11) * 0.06 +
                Math.sin(theta * 19) * 0.03;
            const r_limit = radius * (0.85 + wave);

            if (dist > r_limit) continue; // outside organic silhouette

            // Natural transparent leaf gaps (noise-based)
            const gapNoise = Math.sin(x * 0.16) * Math.cos(y * 0.16) + Math.sin(x * 0.36 + y * 0.2);
            if (gapNoise > 1.25 && dist > radius * 0.22) {
                continue; // transparent leaf gap
            }

            // Shading: Ambient Occlusion near center, Highlights on outer bounds
            const normDist = dist / r_limit;
            const shadingNoise = (Math.sin(x * 1.7 + y * 2.3) * 0.5 + 0.5) * 0.2 - 0.1;
            const factor = THREE.MathUtils.clamp(normDist + shadingNoise, 0, 1);

            let colorIdx;
            if (factor < 0.28) {
                colorIdx = 3; // Center / Ambient Occlusion (darkest)
            } else if (factor < 0.58) {
                colorIdx = 1; // Middle shaded
            } else if (factor < 0.88) {
                colorIdx = 0; // Outer main green
            } else {
                colorIdx = 2; // Highlights (brightest edges)
            }

            const hex = pal[colorIdx];
            const r = (hex >> 16) & 0xff;
            const g = (hex >> 8) & 0xff;
            const b = hex & 0xff;
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(x, y, cellSize, cellSize);
        }
    }

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
}

/**
 * Generates a smooth vertical tree canopy texture with organic silhouette,
 * central branch lines, natural gaps, and baked depth/shadow highlights.
 */
function makeLeafVerticalTexture(w = 128, h = 128) {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, w, h);

    // Using the mid layer palette (index 1) for the vertical planes
    const pal = [0x56c15a, 0x43a047, 0x76cc7a, 0x388e3c];

    const cx = w / 2;
    const cellSize = 1;

    // Draw simple center trunk branch pixels first (bottom to 20% of top)
    ctx.fillStyle = '#3d2818';
    ctx.fillRect(cx - 3, h * 0.2, 6, h * 0.8);

    for (let y = 0; y < h; y += cellSize) {
        // Taper shape: narrow at top (y=0), wide in middle, slightly tapering at bottom
        const vFactor = y / h;
        let baseRadius = w * 0.42;

        if (vFactor < 0.22) {
            baseRadius *= (vFactor / 0.22) * 0.7 + 0.3;
        } else if (vFactor > 0.8) {
            baseRadius *= 1.0 - ((vFactor - 0.8) / 0.2) * 0.35;
        }

        // Wave deformation
        const theta = vFactor * Math.PI * 4.5;
        const wave = Math.sin(theta) * 0.12 + Math.cos(vFactor * 14) * 0.06;
        const r_limit = baseRadius * (1.0 + wave);

        for (let x = 0; x < w; x += cellSize) {
            const dx = x - cx;
            const dist = Math.abs(dx);

            if (dist > r_limit) continue;

            // Natural transparent gaps in vertical canopy
            const gapNoise = Math.sin(x * 0.16) * Math.cos(y * 0.16) + Math.sin(x * 0.36 + y * 0.24);
            if (gapNoise > 1.3 && dist > w * 0.12) continue;

            // Shading: Highlights at top/edges, shadow/AO near bottom-center
            const normDist = dist / r_limit;
            const shadingNoise = (Math.sin(x * 1.6 + y * 2.2) * 0.5 + 0.5) * 0.2 - 0.1;
            const factor = THREE.MathUtils.clamp((normDist * 0.5 + (y / h) * 0.5) + shadingNoise, 0, 1);

            let colorIdx;
            if (factor < 0.25) {
                colorIdx = 2; // highlights
            } else if (factor < 0.55) {
                colorIdx = 0; // main green
            } else if (factor < 0.8) {
                colorIdx = 1; // mid-dark
            } else {
                colorIdx = 3; // darkest
            }

            const hex = pal[colorIdx];
            const r = (hex >> 16) & 0xff;
            const g = (hex >> 8) & 0xff;
            const b = hex & 0xff;
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(x, y, cellSize, cellSize);
        }
    }

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
}

/* ── Pre-build shared texture instances (re-used across all trees) ── */
const woodTex = makeWoodTexture(64, 128);
woodTex.repeat.set(1, 2);
const leafTextures = [0, 1, 2, 3].map(i => makeLeafDiscTexture(128, i));
const leafVertTex = makeLeafVerticalTexture(128, 128);
