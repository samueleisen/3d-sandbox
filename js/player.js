/* ───────────────────────────────────────────────
    PLAYER  (Skinned Low-Poly Humanoid)
    Bone hierarchy · visual meshes · AnimationClip · Mixer
    Depends on: scene, PAL, PLAYER_RADIUS
─────────────────────────────────────────────── */
const playerGroup = new THREE.Group();

// ── Bone Hierarchy ──────────────────────────────
const hipsBone     = new THREE.Bone(); hipsBone.name     = 'Hips';
const spineBone    = new THREE.Bone(); spineBone.name    = 'Spine';
const headBone     = new THREE.Bone(); headBone.name     = 'Head';
const leftArmBone  = new THREE.Bone(); leftArmBone.name  = 'LeftArm';
const rightArmBone = new THREE.Bone(); rightArmBone.name = 'RightArm';
const leftLegBone  = new THREE.Bone(); leftLegBone.name  = 'LeftLeg';
const rightLegBone = new THREE.Bone(); rightLegBone.name = 'RightLeg';

hipsBone.add(spineBone);
spineBone.add(headBone);
spineBone.add(leftArmBone);
spineBone.add(rightArmBone);
hipsBone.add(leftLegBone);
hipsBone.add(rightLegBone);

// Rest-pose positions (local, relative to parent bone)
// Rest-pose positions (local, relative to parent bone) - scaled down by 50%
hipsBone.position.set(0, 10, 0);
spineBone.position.set(0, 0, 0);
headBone.position.set(0, 8, 0);
leftArmBone.position.set(-4, 7, 0);
rightArmBone.position.set(4, 7, 0);
leftLegBone.position.set(-2, 0, 0);
rightLegBone.position.set(2, 0, 0);

playerGroup.add(hipsBone);

// ── Skeleton (formal binding) ──────────────────
const skeleton = new THREE.Skeleton([
    hipsBone, spineBone, headBone,
    leftArmBone, rightArmBone, leftLegBone, rightLegBone
]);

// ── Visual Meshes & Edge Outlines ──────────────
const _edgeMat = new THREE.LineBasicMaterial({
    color: PAL.playerEdge, transparent: true, opacity: 0.6
});

function attachPart(bone, geometry, color, localPos) {
    const mesh = new THREE.Mesh(geometry,
        new THREE.MeshBasicMaterial({ color }));
    mesh.position.copy(localPos);
    bone.add(mesh);
    const line = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry), _edgeMat);
    line.position.copy(localPos);
    bone.add(line);
}

const _v = (x, y, z) => new THREE.Vector3(x, y, z);

// Head — ball (UNTOUCHED size: radius 6)
attachPart(headBone,
    new THREE.SphereGeometry(6, 8, 6),
    PAL.playerTop, _v(0, 5, 0));

// Torso — rounded tube / capsule body (50% smaller)
attachPart(spineBone,
    new THREE.CylinderGeometry(3.5, 3, 7, 8),
    PAL.playerSide, _v(0, 3.5, 0));
attachPart(spineBone,                                              // top dome cap
    new THREE.SphereGeometry(3.5, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2),
    PAL.playerSide, _v(0, 7, 0));
attachPart(spineBone,                                              // bottom dome cap
    new THREE.SphereGeometry(3, 8, 4, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
    PAL.playerSide, _v(0, 0, 0));

// Arms — round limbs with ball hands (50% smaller)
const armGeo  = new THREE.CylinderGeometry(1.25, 1, 5, 6);
const handGeo = new THREE.SphereGeometry(1.25, 6, 4);
attachPart(leftArmBone,  armGeo,  PAL.playerSide, _v(0, -2.5, 0));
attachPart(leftArmBone,  handGeo, PAL.playerTop,  _v(0, -5.5, 0));
attachPart(rightArmBone, armGeo,  PAL.playerSide, _v(0, -2.5, 0));
attachPart(rightArmBone, handGeo, PAL.playerTop,  _v(0, -5.5, 0));

// Legs — round limbs with ball feet (50% smaller)
const legGeo  = new THREE.CylinderGeometry(1.5, 1.25, 7.5, 6);
const footGeo = new THREE.SphereGeometry(1.5, 6, 4);
attachPart(leftLegBone,  legGeo,  PAL.playerSide, _v(0, -3.75, 0));
attachPart(leftLegBone,  footGeo, PAL.playerTop,  _v(0, -8,    0));
attachPart(rightLegBone, legGeo,  PAL.playerSide, _v(0, -3.75, 0));
attachPart(rightLegBone, footGeo, PAL.playerTop,  _v(0, -8,    0));

// Player shadow (50% smaller)
const pShadowGeo = new THREE.CircleGeometry((PLAYER_RADIUS + 4) * 0.5, 16);
const pShadowMat = new THREE.MeshBasicMaterial({ color: PAL.shadow, transparent: true, opacity: 0.5 });
const pShadow    = new THREE.Mesh(pShadowGeo, pShadowMat);
pShadow.rotation.x = -Math.PI / 2;
pShadow.position.set(0, 0.6, 0);
scene.add(pShadow); // separate from group so it stays on ground

playerGroup.position.set(0, 0, 0);
scene.add(playerGroup);

// ── Walk Animation Clip (4-step baked keyframes) ─
const WALK_DURATION = 0.8;
const walkTimes = [0, 0.2, 0.4, 0.6, 0.8];

const _legSwing = 0.4;                                       // ~23° leg swing
const _armSwing = 0.3;                                       // ~17° arm swing
const _xAxis    = new THREE.Vector3(1, 0, 0);

const qLF = new THREE.Quaternion().setFromAxisAngle(_xAxis,  _legSwing);
const qLB = new THREE.Quaternion().setFromAxisAngle(_xAxis, -_legSwing);
const qAF = new THREE.Quaternion().setFromAxisAngle(_xAxis,  _armSwing);
const qAB = new THREE.Quaternion().setFromAxisAngle(_xAxis, -_armSwing);
const qN  = new THREE.Quaternion();                          // identity (rest)

const fq = (...qs) => {
    const a = [];
    for (const q of qs) a.push(q.x, q.y, q.z, q.w);
    return a;
};

const walkClip = new THREE.AnimationClip('Walk', WALK_DURATION, [
    // Hip bob — Y oscillates ±0.5 from new rest y=10
    new THREE.VectorKeyframeTrack('Hips.position', walkTimes,
        [0,9.5,0,  0,10.5,0,  0,9.5,0,  0,10.5,0,  0,9.5,0]),
    // Left Leg:  fwd → rest → back → rest → fwd
    new THREE.QuaternionKeyframeTrack('LeftLeg.quaternion', walkTimes,
        fq(qLF, qN, qLB, qN, qLF)),
    // Right Leg: back → rest → fwd → rest → back
    new THREE.QuaternionKeyframeTrack('RightLeg.quaternion', walkTimes,
        fq(qLB, qN, qLF, qN, qLB)),
    // Left Arm:  contralateral to left leg (same phase as right leg)
    new THREE.QuaternionKeyframeTrack('LeftArm.quaternion', walkTimes,
        fq(qAB, qN, qAF, qN, qAB)),
    // Right Arm: contralateral to right leg (same phase as left leg)
    new THREE.QuaternionKeyframeTrack('RightArm.quaternion', walkTimes,
        fq(qAF, qN, qAB, qN, qAF)),
]);

// ── Animation Mixer ────────────────────────────
const mixer     = new THREE.AnimationMixer(playerGroup);
const walkAction = mixer.clipAction(walkClip);
walkAction.setLoop(THREE.LoopRepeat);
let isWalking = false;
