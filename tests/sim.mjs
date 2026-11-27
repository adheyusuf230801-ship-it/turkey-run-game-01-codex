import assert from 'node:assert/strict';
import { createWorld, startRun, stepWorld, stateHash } from '../game/src/world.js';
import { mulberry32 } from '../game/src/random.js';

function game(seed) {
  const state = createWorld(seed), script = mulberry32(901);
  startRun(state);
  const hashes = [];
  for (let i = 0; i < 120 * 30; i++) {
    stepWorld(state, { jump: script.chance(0.018), duck: script.chance(0.18) }, 1 / 120);
    assert.ok(['title', 'run', 'caught', 'escaped'].includes(state.phase));
    hashes.push(stateHash(state));
  }
  assert.ok(state.distance > 50, 'turkey gains distance');
  assert.ok(state.score > 0, 'turkey gains score');
  return hashes;
}
assert.deepEqual(game(12345), game(12345));
console.log('PASS: 3,600 identical scripted steps produce identical state hashes');
console.log('PASS: distance and score increase; phases remain valid');

// Controlled encounters exercise hitboxes and the chase independently of spawning.
const encounter = (type, duck = false) => {
  const s = startRun(createWorld(7));
  s.nextObstacle = s.nextPickup = Infinity;
  s.obstacles = [{ type, x: 214, y: type === 'knife' ? 383 : 428,
    w: type === 'knife' ? 58 : 110, h: type === 'knife' ? 14 : 12, hit: false }];
  stepWorld(s, { duck }, 1 / 120);
  return s;
};
assert.equal(encounter('knife', true).lives, 3);
assert.equal(encounter('knife').lives, 2);
const mud = encounter('mud');
const gap = mud.farmer.gap;
stepWorld(mud, {}, 1 / 120);
assert.ok(mud.speed < 280 && mud.farmer.gap < gap);
const corn = startRun(createWorld(8));
corn.pickups.push({ x: 230, y: 408, golden: true });
stepWorld(corn, {}, 1 / 120);
assert.equal(corn.goldenCollected, 1);
assert.ok(corn.score >= 500);
corn.distance = 1199.99;
stepWorld(corn, {}, 1 / 120);
assert.equal(corn.phase, 'escaped');
const caught = startRun(createWorld(9));
caught.lives = 1; caught.farmer.gap = -1;
stepWorld(caught, {}, 1 / 120);
assert.equal(caught.phase, 'caught');
console.log('PASS: ducking, knife damage, mud chase, golden corn, escape and capture');
