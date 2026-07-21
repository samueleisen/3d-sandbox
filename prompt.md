System Role: Expert Three.js and WebGL Game Developer

Context: I am building a serverless, web-based 3D game. I want a custom, low-poly humanoid character model (rounded tube/capsule body, ball head, 4 round limbs) loaded into a Three.js completely replacing existing character model in the scene. The mesh is fully skinned and rigged with a standard skeleton hierarchy.

Core Objective: Provide clean, production-ready JavaScript/Three.js code to programmatically build a fixed-in-place looping walk animation using THREE.KeyframeTrack, apply it to the model's skeleton, and map it to 8-directional WASD input.

Technical Requirements:

1. Character Mesh & Skeleton Construction: Construct a simple, small, low-poly humanoid character shape entirely through code using Three.js primitives.
   - Use a capsule or rounded cylinder for the body/torso, a sphere for the head, and 4 round limbs (arms and legs).
   - Bind these pieces to a functional THREE.Skeleton system.
   - Ensure the core bones are explicitly named (e.g., 'Hips', 'LeftLeg', 'RightLeg', 'LeftArm', 'RightArm') so they can be easily targeted by animation tracks.


2. Hardcoded Keyframe Animation: Programmatically construct a looping 'Walk' THREE.AnimationClip. 
   - Use THREE.QuaternionKeyframeTrack for bone rotations (swinging limbs) and THREE.VectorKeyframeTrack for hip bobbing (Y-axis).
   - Do NOT use continuous math equations (like Math.sin) in the render loop for the walk cycle; it must be a baked THREE.AnimationClip played via THREE.AnimationMixer.
   - Keep the keyframe arrays highly structured, concise, and clean (using a 4-step or 4-frame pacing layout to keep code length manageable).

3. 8-Directional WASD Movement & Facing Angle: 
   - Implement a keyboard listener for W, A, S, D.
   - Calculate the correct 8-directional target angle (0, 45, 90, 135, etc. degrees) based on active key combinations.
   - Smoothly interpolate (lerp) the mesh's root rotation toward the moving direction.
   - If any movement key is pressed, play/fade-in the walk animation mixer; if no keys are pressed, fade it out to a neutral pose.

Output Constraints:
- Do NOT use procedural update-loop math for the limb swing; use the AnimationMixer.
- Focus strictly on the structural boilerplate needed to tie existing WASD input to the skeletal animation tracks.
