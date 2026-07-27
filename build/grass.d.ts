/** Exported memory */
export declare const memory: WebAssembly.Memory;
/** assembly/grass/lastCamDirX */
export declare const lastCamDirX: {
  /** @type `f32` */
  get value(): number;
  set value(value: number);
};
/** assembly/grass/lastCamDirZ */
export declare const lastCamDirZ: {
  /** @type `f32` */
  get value(): number;
  set value(value: number);
};
/** assembly/grass/lastHalfFovCos */
export declare const lastHalfFovCos: {
  /** @type `f32` */
  get value(): number;
  set value(value: number);
};
/**
 * assembly/grass/hash2D
 * @param cx `f32`
 * @param cz `f32`
 * @param index `f32`
 * @param seed `f32`
 * @returns `f32`
 */
export declare function hash2D(cx: number, cz: number, index: number, seed: number): number;
/**
 * assembly/grass/initGrassBladeGeometry
 */
export declare function initGrassBladeGeometry(): void;
/**
 * assembly/grass/getGrassHeaderShaderWasm
 * @returns `~lib/string/String`
 */
export declare function getGrassHeaderShaderWasm(): string;
/**
 * assembly/grass/getGrassTransformShaderWasm
 * @param isDepth `bool`
 * @returns `~lib/string/String`
 */
export declare function getGrassTransformShaderWasm(isDepth: boolean): string;
/**
 * assembly/grass/initGrassShadersWasm
 */
export declare function initGrassShadersWasm(): void;
/**
 * assembly/grass/getHeaderShaderPointer
 * @returns `usize`
 */
export declare function getHeaderShaderPointer(): number;
/**
 * assembly/grass/getHeaderShaderLength
 * @returns `i32`
 */
export declare function getHeaderShaderLength(): number;
/**
 * assembly/grass/getMainShaderPointer
 * @returns `usize`
 */
export declare function getMainShaderPointer(): number;
/**
 * assembly/grass/getMainShaderLength
 * @returns `i32`
 */
export declare function getMainShaderLength(): number;
/**
 * assembly/grass/getDepthShaderPointer
 * @returns `usize`
 */
export declare function getDepthShaderPointer(): number;
/**
 * assembly/grass/getDepthShaderLength
 * @returns `i32`
 */
export declare function getDepthShaderLength(): number;
/**
 * assembly/grass/getPositionsPointer
 * @returns `usize`
 */
export declare function getPositionsPointer(): number;
/**
 * assembly/grass/getIndicesPointer
 * @returns `usize`
 */
export declare function getIndicesPointer(): number;
/**
 * assembly/grass/getClustersPointer
 * @returns `usize`
 */
export declare function getClustersPointer(): number;
/**
 * assembly/grass/getMatrixBufferPointer
 * @returns `usize`
 */
export declare function getMatrixBufferPointer(): number;
/**
 * assembly/grass/getFovHelperBufferPointer
 * @returns `usize`
 */
export declare function getFovHelperBufferPointer(): number;
/**
 * assembly/grass/computeCamParamsWasm
 * @param yawDeg `f32`
 * @param fovDeg `f32`
 * @param aspectVal `f32`
 * @returns `f32`
 */
export declare function computeCamParamsWasm(yawDeg: number, fovDeg: number, aspectVal: number): number;
/**
 * assembly/grass/computeFovHelperLinesWasm
 * @param camX `f32`
 * @param camZ `f32`
 * @param originY `f32`
 * @param px `f32`
 * @param pz `f32`
 * @param yawDeg `f32`
 * @param fovDeg `f32`
 * @param aspectVal `f32`
 * @param maxDist `f32`
 */
export declare function computeFovHelperLinesWasm(camX: number, camZ: number, originY: number, px: number, pz: number, yawDeg: number, fovDeg: number, aspectVal: number, maxDist: number): void;
/**
 * assembly/grass/updateRollingGridWasm
 * @param camX `f32`
 * @param camZ `f32`
 * @param camDirX `f32`
 * @param camDirZ `f32`
 * @param maxCount `i32`
 * @returns `bool`
 */
export declare function updateRollingGridWasm(camX: number, camZ: number, camDirX: number, camDirZ: number, maxCount: number): boolean;
