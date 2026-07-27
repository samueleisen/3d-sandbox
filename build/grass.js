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
    getGrassHeaderShaderWasm() {
      // assembly/grass/getGrassHeaderShaderWasm() => ~lib/string/String
      return __liftString(exports.getGrassHeaderShaderWasm() >>> 0);
    },
    getGrassTransformShaderWasm(isDepth) {
      // assembly/grass/getGrassTransformShaderWasm(bool) => ~lib/string/String
      isDepth = isDepth ? 1 : 0;
      return __liftString(exports.getGrassTransformShaderWasm(isDepth) >>> 0);
    },
    getHeaderShaderPointer() {
      // assembly/grass/getHeaderShaderPointer() => usize
      return exports.getHeaderShaderPointer() >>> 0;
    },
    getMainShaderPointer() {
      // assembly/grass/getMainShaderPointer() => usize
      return exports.getMainShaderPointer() >>> 0;
    },
    getDepthShaderPointer() {
      // assembly/grass/getDepthShaderPointer() => usize
      return exports.getDepthShaderPointer() >>> 0;
    },
    getPositionsPointer() {
      // assembly/grass/getPositionsPointer() => usize
      return exports.getPositionsPointer() >>> 0;
    },
    getIndicesPointer() {
      // assembly/grass/getIndicesPointer() => usize
      return exports.getIndicesPointer() >>> 0;
    },
    getClustersPointer() {
      // assembly/grass/getClustersPointer() => usize
      return exports.getClustersPointer() >>> 0;
    },
    getMatrixBufferPointer() {
      // assembly/grass/getMatrixBufferPointer() => usize
      return exports.getMatrixBufferPointer() >>> 0;
    },
    getFovHelperBufferPointer() {
      // assembly/grass/getFovHelperBufferPointer() => usize
      return exports.getFovHelperBufferPointer() >>> 0;
    },
    updateRollingGridWasm(camX, camZ, camDirX, camDirZ, maxCount) {
      // assembly/grass/updateRollingGridWasm(f32, f32, f32, f32, i32) => bool
      return exports.updateRollingGridWasm(camX, camZ, camDirX, camDirZ, maxCount) != 0;
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
  lastCamDirX,
  lastCamDirZ,
  lastHalfFovCos,
  hash2D,
  initGrassBladeGeometry,
  getGrassHeaderShaderWasm,
  getGrassTransformShaderWasm,
  initGrassShadersWasm,
  getHeaderShaderPointer,
  getHeaderShaderLength,
  getMainShaderPointer,
  getMainShaderLength,
  getDepthShaderPointer,
  getDepthShaderLength,
  getPositionsPointer,
  getIndicesPointer,
  getClustersPointer,
  getMatrixBufferPointer,
  getFovHelperBufferPointer,
  computeCamParamsWasm,
  computeFovHelperLinesWasm,
  updateRollingGridWasm,
} = await (async url => instantiate(
  await (async () => {
    const isNodeOrBun = typeof process != "undefined" && process.versions != null && (process.versions.node != null || process.versions.bun != null);
    if (isNodeOrBun) { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
    else { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
  })(), {
  }
))(new URL("grass.wasm", import.meta.url));
