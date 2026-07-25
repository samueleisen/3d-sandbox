/* ───────────────────────────────────────────────
    CONSTANTS
─────────────────────────────────────────────── */
const WORLD_WIDTH = 10000;
const WORLD_DEPTH = 10000;
const HALF_WIDTH = WORLD_WIDTH / 2;
const HALF_DEPTH = WORLD_DEPTH / 2;
const PLAYER_SPEED = 150;          // units/sec max speed
const PLAYER_ACCEL = 1200;          // units/sec² acceleration
const PLAYER_FRICTION = 16;         // deceleration damping factor
const PLAYER_RADIUS = 12;           // collision half-width
const PLAYER_HEIGHT = 28;
const EDGE_WALL_H = 20;
const JUMP_POWER = 100;           // initial vertical jump velocity (units/sec)
const JUMP_GRAVITY = 180;         // gravity acceleration (units/sec²) — 40 frames / 1.6667s airtime
const GRAVITY = 15;               // world gravity acceleration (m/s²) 9.81

// Mutable Culling & Render State (controlled via UI)
let cullingMode = 'off';              // 'generous', 'balanced', 'aggressive', 'off'
let maxVisDist = 99999;               // max view distance units
let maxVisDistSq = maxVisDist * maxVisDist;
let cullingMargin = 200;              // safety padding margin to prevent edge popping
let renderScale = 1.0;                // render resolution multiplier (1.0, 0.75, 0.5)

// Horizon Curvature & Distance Sink Parameters (Easy to adjust)
let HORIZON_SINK_START = 3500;        // Distance units where objects start shrinking & sinking
let HORIZON_SINK_END = 16000;       // Extended distance range for much slower/gradual transition
let HORIZON_MAX_SINK = 200;         // Gentle downward displacement below ground
let HORIZON_MIN_SCALE = 0.0;         // Minimum scale at max distance

// Mutable Camera State
let cameraType = 'persp';
let camAngleDeg = 75;
let camYawDeg = 180;                 // horizontal camera rotation angle (degrees)
let camHeight = 200;
let camFov = 50;
let camViewSize = 420;

/* ───────────────────────────────────────────────
    PALETTE  (pixel-art inspired muted tones)
─────────────────────────────────────────────── */
const PAL = {
    bg: 0x1a1a2e,
    floorPosZ: 0xfff04f, // Positive Z Ground Color (Bright Golden Yellow)
    floorNegZ: 0x665105, // Negative Z Ground Color (Dark Yellow-Brown)
    floorA: 0xfffd3f,    // Positive Z Ground Color
    floorB: 0x826c1a,    // Negative Z Ground Color
    grass: 0xf0c830,  // Golden Yellow Grass
    gridLine: 0x3a3a5c,
    wallBorder: 0x8c6b23,
    playerTop: 0x5cf0a0,
    playerSide: 0x38c878,
    playerEdge: 0x2aff90,
    playerHair: 0x3d2846,
    playerHairHighlight: 0x5a3d66,
    playerHairTie: 0xff4757,
    obs1Top: 0xe06050, obs1Side: 0xb84040,
    obs2Top: 0x50a0e0, obs2Side: 0x3878b0,
    obs3Top: 0xf0c840, obs3Side: 0xc8a030,
    treeTrunkTop: 0x7d4e2b,
    treeTrunkSide: 0x56341c,
    treeLeavesTop: 0x4cb050,
    treeLeavesSide: 0x2e7d32,
    treeEdge: 0x143516,
    trunkEdge: 0x23140a,
    flowerSoil: 0x3d2818,
    flowerRed: 0xe91e63,
    flowerYellow: 0xffeb3b,
    flowerPink: 0xff69b4,
    houseWallTop: 0xf5f0e6,
    houseWallSide: 0xdfd5c6,
    houseRoofTop: 0xd35400,
    houseRoofSide: 0xa04000,
    houseDoor: 0x5c3a21,
    houseWindow: 0xa0e0ff,
    shadow: 0x0e0e1a,
};
