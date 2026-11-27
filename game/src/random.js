// The same numeric seed and call sequence always produce the same results.
export function mulberry32(seed) {
  let state = Number(seed) >>> 0;

  function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  }

  function range(a, b) {
    return a + (b - a) * next();
  }

  // Both integer endpoints are included.
  function int(a, b) {
    return Math.floor(range(Math.ceil(a), Math.floor(b) + 1));
  }

  function pick(arr) {
    return arr.length ? arr[int(0, arr.length - 1)] : undefined;
  }

  function chance(p) {
    return next() < p;
  }

  return { next, range, int, pick, chance };
}
