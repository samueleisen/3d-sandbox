3D Web Application Asset Budgeting & Architecture Guide
A strategic blueprint for building high-performance 3D web applications combining JS procedural geometry with lightweight imported GLB assets.

1. Web Asset Size Budget Guidelines
When delivering 3D experiences over the web, fast initial page load times and low memory footprints are essential for mobile and desktop visitors.

Asset Category	Target Size Limit	Purpose & Strategy
Hero Character / Main Rig	500 KB – 1.5 MB	Main player model containing skeletal rigs, bone weights, and animation clips (e.g., HeroMC-Animation.glb).
Environment Prop GLB	50 KB – 200 KB	Static world props (trees, rocks, barrels, lanterns, market stalls).
Total Initial Load Budget	< 3.0 MB – 4.0 MB	Total combined initial download budget for sub-1.5 second first paint over 4G/5G mobile connections.
TIP

200 KB Limit Target: Individual environment prop models should stay under 200 KB – 300 KB. Models exceeding 1 MB usually contain uncompressed 4K PNG texture maps or unnecessarily dense polygon counts.

2. Hybrid Architecture: JS Procedural + 200 KB GLB Assets
Combining procedural JavaScript generation with small GLB prop packs delivers maximum map density at minimal bandwidth cost.


┌─────────────────────────────────────────────────────────┐
│                   Hybrid 3D World                       │
├────────────────────────────┬────────────────────────────┤
│   JS Procedural (0 KB)     │    GLB Assets (~200 KB)    │
├────────────────────────────┼────────────────────────────┤
│ • Circular Terrain Disk     │ • Organic Foliage (Trees)  │
│ • Gradient Sky Dome        │ • Rocks & Boulder Packs    │
│ • Low-Poly Store Structures│ • Village Props & Lanterns │
│ • Grass Blade Instancing   │ • Decorative Props & NPCs  │
└────────────────────────────┴────────────────────────────┘
The "Load Once, Instance Many" Pattern
Download a single 150 KB Tree GLB asset.
Store the loaded geometry in memory.
Use Three.js InstancedMesh or clone groups to place 500+ trees across the world map.
Network Overhead: Only 150 KB download total.
Map Density: Hundreds of visible world objects.
3. What to Build in JS vs. What to Import as GLBs
Build in Pure JS (0 KB Download)
Architectural Primitives: Stores, monoliths, geometric platforms, walls, rectangular fences.
Procedural Environments: Floor geometry, gradient sky dome, particle effects, grass instancing.
Import as 200 KB GLBs
Organic & Curved Geometry: Stylized pine trees, leafy bushes, curved boulders, barrels, wagon wheels.
Detailed Props: Market stalls, treasure chests, signposts, small decorative objects.
4. Optimization Checklist for Web GLB Assets
Use Vertex Colors (No PNG Textures)

Models built with vertex colors or flat palette materials take up 20 KB – 80 KB.
Embedded high-resolution PNG texture files increase size to 2 MB – 5 MB.
Apply Draco Compression

Running .glb files through Draco Compression (via gltf-pipeline or Blender GLTF Exporter) reduces geometry payload size by 60% – 80% without quality loss.
Bundle Props into Single Asset Packs

Combine multiple small props into a single environment_props.glb pack to eliminate HTTP connection overhead from separate network requests.