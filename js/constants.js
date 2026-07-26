/* ───────────────────────────────────────────────
    CONSTANTS
─────────────────────────────────────────────── */
const WORLD_WIDTH = 5000;
const WORLD_DEPTH = 5000;
const WORLD_RADIUS = WORLD_WIDTH / 2; // 3000 units ground radius
const HALF_WIDTH = WORLD_WIDTH / 2;
const HALF_DEPTH = WORLD_DEPTH / 2;
const PLAYER_SPEED = 400;          // units/sec max speed
const PLAYER_ACCEL = 1200;          // units/sec² acceleration
const PLAYER_FRICTION = 16;         // deceleration damping factor
const PLAYER_RADIUS = 10;           // collision half-width
const PLAYER_HEIGHT = 24;
const JUMP_POWER = 100;           // initial vertical jump velocity (units/sec)
const JUMP_GRAVITY = 180;         // gravity acceleration (units/sec²) — 40 frames / 1.6667s airtime

// Mutable Render State (controlled via UI)
let maxVisDist = 99999;               // max view distance units
let renderScale = 1.0;                // render resolution multiplier (1.0, 0.75, 0.5)

// Horizon Curvature & Distance Sink Parameters (Easy to adjust)
let HORIZON_SINK_START = 3500;        // Distance units where objects start shrinking & sinking
let HORIZON_SINK_END = 16000;       // Extended distance range for much slower/gradual transition
let HORIZON_MAX_SINK = 280;         // Downward displacement below ground
let HORIZON_MIN_SCALE = 0.0;         // Minimum scale at max distance

// Mutable Camera State
let cameraType = 'persp';
let camAngleDeg = 75;
let camYawDeg = 180;                 // horizontal camera rotation angle (degrees)
let camHeight = 150;
let camFov = 50;
let camViewSize = 420;

/* ───────────────────────────────────────────────
    PALETTE
─────────────────────────────────────────────── */
const PAL = {
    bg: 0x1a1a2e,
    floorPosZ: 0xfff04f, // Positive Z Ground Color (Bright Golden Yellow)
    floorNegZ: 0x665105, // Negative Z Ground Color (Dark Yellow-Brown)
    grass: 0xf0c830,     // Golden Yellow Grass
    shadow: 0x0e0e1a,
};

