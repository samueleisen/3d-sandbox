async function instantiate(module, imports = {}) {
  const adaptedImports = {
    env: Object.setPrototypeOf({
      abort(message, fileName, lineNumber, columnNumber) {
        // ~lib/builtins/abort(~lib/string/String | null?, ~lib/string/String | null?, u32?, u32?) => void
        message = __liftString(message >>> 0);
        fileName = __liftString(fileName >>> 0);
        lineNumber = lineNumber >>> 0;
        columnNumber = columnNumber >>> 0;
        (() => {
          // @external.js
          throw Error(`${message} in ${fileName}:${lineNumber}:${columnNumber}`);
        })();
      },
    }, Object.assign(Object.create(globalThis), imports.env || {})),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    isGrounded: {
      // assembly/characterPhysics/isGrounded: bool
      valueOf() { return this.value; },
      get value() {
        return exports.isGrounded.value != 0;
      },
      set value(value) {
        exports.isGrounded.value = value ? 1 : 0;
      }
    },
    isWalking: {
      // assembly/characterPhysics/isWalking: bool
      valueOf() { return this.value; },
      get value() {
        return exports.isWalking.value != 0;
      },
      set value(value) {
        exports.isWalking.value = value ? 1 : 0;
      }
    },
    justLanded: {
      // assembly/characterPhysics/justLanded: bool
      valueOf() { return this.value; },
      get value() {
        return exports.justLanded.value != 0;
      },
      set value(value) {
        exports.justLanded.value = value ? 1 : 0;
      }
    },
    getObstaclesPointer() {
      // assembly/characterPhysics/getObstaclesPointer() => usize
      return exports.getObstaclesPointer() >>> 0;
    },
    getPonytailBufferPointer() {
      // assembly/characterPhysics/getPonytailBufferPointer() => usize
      return exports.getPonytailBufferPointer() >>> 0;
    },
    testCollisionWasm(testX, testY, testZ) {
      // assembly/characterPhysics/testCollisionWasm(f32, f32, f32) => bool
      return exports.testCollisionWasm(testX, testY, testZ) != 0;
    },
    updatePlayerPhysicsWasm(dt, keyW, keyA, keyS, keyD, keySpace, camYawDeg) {
      // assembly/characterPhysics/updatePlayerPhysicsWasm(f32, bool, bool, bool, bool, bool, f32) => void
      keyW = keyW ? 1 : 0;
      keyA = keyA ? 1 : 0;
      keyS = keyS ? 1 : 0;
      keyD = keyD ? 1 : 0;
      keySpace = keySpace ? 1 : 0;
      exports.updatePlayerPhysicsWasm(dt, keyW, keyA, keyS, keyD, keySpace, camYawDeg);
    },
  }, exports);
  function __liftString(pointer) {
    if (!pointer) return null;
    const
      end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1,
      memoryU16 = new Uint16Array(memory.buffer);
    let
      start = pointer >>> 1,
      string = "";
    while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
    return string + String.fromCharCode(...memoryU16.subarray(start, end));
  }
  return adaptedExports;
}
export const {
  memory,
  px,
  py,
  pz,
  velX,
  velY,
  velZ,
  rotY,
  isGrounded,
  isWalking,
  justLanded,
  getObstaclesPointer,
  setObstacleCount,
  getPonytailBufferPointer,
  setPlayerPosition,
  getGroundHeightWasm,
  testCollisionWasm,
  updatePlayerPhysicsWasm,
  updatePonytailPhysicsWasm,
} = await (async url => instantiate(
  await (async () => {
    const isNodeOrBun = typeof process != "undefined" && process.versions != null && (process.versions.node != null || process.versions.bun != null);
    if (isNodeOrBun) { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
    else { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
  })(), {
  }
))(new URL("characterPhysics.wasm", import.meta.url));
