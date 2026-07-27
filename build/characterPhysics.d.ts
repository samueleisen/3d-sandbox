/** Exported memory */
export declare const memory: WebAssembly.Memory;
/** assembly/characterPhysics/px */
export declare const px: {
  /** @type `f32` */
  get value(): number;
  set value(value: number);
};
/** assembly/characterPhysics/py */
export declare const py: {
  /** @type `f32` */
  get value(): number;
  set value(value: number);
};
/** assembly/characterPhysics/pz */
export declare const pz: {
  /** @type `f32` */
  get value(): number;
  set value(value: number);
};
/** assembly/characterPhysics/velX */
export declare const velX: {
  /** @type `f32` */
  get value(): number;
  set value(value: number);
};
/** assembly/characterPhysics/velY */
export declare const velY: {
  /** @type `f32` */
  get value(): number;
  set value(value: number);
};
/** assembly/characterPhysics/velZ */
export declare const velZ: {
  /** @type `f32` */
  get value(): number;
  set value(value: number);
};
/** assembly/characterPhysics/rotY */
export declare const rotY: {
  /** @type `f32` */
  get value(): number;
  set value(value: number);
};
/** assembly/characterPhysics/isGrounded */
export declare const isGrounded: {
  /** @type `bool` */
  get value(): boolean;
  set value(value: boolean);
};
/** assembly/characterPhysics/isWalking */
export declare const isWalking: {
  /** @type `bool` */
  get value(): boolean;
  set value(value: boolean);
};
/** assembly/characterPhysics/justLanded */
export declare const justLanded: {
  /** @type `bool` */
  get value(): boolean;
  set value(value: boolean);
};
/**
 * assembly/characterPhysics/getObstaclesPointer
 * @returns `usize`
 */
export declare function getObstaclesPointer(): number;
/**
 * assembly/characterPhysics/setObstacleCount
 * @param count `i32`
 */
export declare function setObstacleCount(count: number): void;
/**
 * assembly/characterPhysics/getPonytailBufferPointer
 * @returns `usize`
 */
export declare function getPonytailBufferPointer(): number;
/**
 * assembly/characterPhysics/setPlayerPosition
 * @param x `f32`
 * @param y `f32`
 * @param z `f32`
 */
export declare function setPlayerPosition(x: number, y: number, z: number): void;
/**
 * assembly/characterPhysics/getGroundHeightWasm
 * @param x `f32`
 * @param z `f32`
 * @param radius `f32`
 * @returns `f32`
 */
export declare function getGroundHeightWasm(x: number, z: number, radius: number): number;
/**
 * assembly/characterPhysics/testCollisionWasm
 * @param testX `f32`
 * @param testY `f32`
 * @param testZ `f32`
 * @returns `bool`
 */
export declare function testCollisionWasm(testX: number, testY: number, testZ: number): boolean;
/**
 * assembly/characterPhysics/updatePlayerPhysicsWasm
 * @param dt `f32`
 * @param keyW `bool`
 * @param keyA `bool`
 * @param keyS `bool`
 * @param keyD `bool`
 * @param keySpace `bool`
 * @param camYawDeg `f32`
 */
export declare function updatePlayerPhysicsWasm(dt: number, keyW: boolean, keyA: boolean, keyS: boolean, keyD: boolean, keySpace: boolean, camYawDeg: number): void;
/**
 * assembly/characterPhysics/updatePonytailPhysicsWasm
 * @param dt `f32`
 * @param curPx `f32`
 * @param curPy `f32`
 * @param curPz `f32`
 * @param currentYaw `f32`
 */
export declare function updatePonytailPhysicsWasm(dt: number, curPx: number, curPy: number, curPz: number, currentYaw: number): void;
