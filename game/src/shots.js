import { startRun } from './world.js';

export function getShotConfig() {
  const params = new URLSearchParams(globalThis.location?.search || '');
  const seed = params.get('seed');
  return { shot: params.get('shot'), seed: seed !== null && Number.isFinite(Number(seed)) ? Number(seed) >>> 0 : 20261127 };
}

export function composeShot(state, shotName) {
  startRun(state);
  state.time = 32;
  state.turkey.runPhase = 1.2;
  if (shotName === 'play') {
    Object.assign(state, { distance: 520, score: 1820, stageIndex: 1, speed: 332 });
    state.farmer.gap = 145;
    state.obstacles = [
      { id: 1, type: 'oven', x: 135, y: 372, w: 58, h: 68, hit: false },
      { id: 2, type: 'knife', x: 650, y: 383, w: 58, h: 14, hit: false },
      { id: 3, type: 'hay', x: 900, y: 390, w: 58, h: 50, hit: false },
    ];
    state.pickups = [{ id: 4, x: 505, y: 350, golden: true }, { id: 5, x: 555, y: 350, golden: false }];
  } else if (shotName === 'caught') {
    Object.assign(state, { phase: 'caught', distance: 876, score: 3276, lives: 0, stageIndex: 2 });
    state.farmer.gap = 42;
  } else if (shotName === 'escaped') {
    Object.assign(state, { phase: 'escaped', distance: 1200, score: 6400, stageIndex: 2 });
    state.farmer.gap = 260;
  } else { state.phase = 'title'; state.time = 0; }
  return state;
}
