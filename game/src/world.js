import { CONFIG as C } from './config.js';
import { mulberry32 } from './random.js';

export function createWorld(seed = C.defaultSeed) {
  return {
    seed: Number(seed) >>> 0, rng: mulberry32(seed), phase: 'title',
    distance: 0, score: 0, lives: C.startingLives, time: 0,
    turkey: { x: C.player.x, y: C.groundY, vy: 0, jumps: 0,
      ducking: false, invincibleUntil: 0, runPhase: 0 },
    farmer: { gap: C.farmer.catchDistanceStart }, obstacles: [], pickups: [],
    particles: [], stageIndex: 0, stageBanner: 0, dustTimer: 0,
    speed: C.baseScrollSpeed, paused: false,
    slowUntil: 0, nextObstacle: C.obstacles.firstSpawnMetres, nextPickup: 7,
    collected: 0, goldenCollected: 0, grabs: 0, nextId: 1,
  };
}

export function startRun(state) {
  const fresh = createWorld(state.seed);
  Object.assign(state, fresh, { phase: 'run' });
  return state;
}

function overlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function burst(s, x, y, color, kind = 'spark') {
  for (let i = 0; i < 10; i++) s.particles.push({ x, y, vx: s.rng.range(-110, 110),
    vy: s.rng.range(-180, -50), life: 0.65, maxLife: 0.65, color, kind });
}

function hurt(s, grabbed = false) {
  if (s.time < s.turkey.invincibleUntil) return;
  s.lives = Math.max(0, s.lives - 1);
  s.turkey.invincibleUntil = s.time + C.invincibilitySeconds;
  s.farmer.gap = grabbed ? C.farmer.grabPushback : s.farmer.gap - C.farmer.stumblePenalty;
  if (grabbed) s.grabs++;
  burst(s, s.turkey.x, s.turkey.y - 30, C.COLORS.turkeyLight, 'feather');
  if (s.lives === 0) s.phase = 'caught';
}

function spawn(s) {
  const r = s.rng;
  // Distances describe when an object enters the right edge of the scene.
  while (s.distance >= s.nextObstacle) {
    const stage = Math.min(2, Math.floor((s.distance + 38) / 400));
    const types = stage === 2 ? ['oven', 'oven', 'knife', 'knife', 'hay', 'fence', 'mud'] : C.obstacles.stageTypes[stage];
    const type = r.pick(types), spec = C.obstacles[type];
    s.obstacles.push({ id: s.nextId++, type, x: C.obstacles.spawnAhead,
      y: C.groundY - (type === 'knife' ? spec.bottomAboveGround + spec.height : spec.height),
      w: spec.width, h: spec.height, hit: false });
    s.nextObstacle += r.range(C.obstacles.gapMinMetres, C.obstacles.gapMaxMetres) * (1 - stage * 0.12);
  }
  while (s.distance >= s.nextPickup) {
    s.pickups.push({ id: s.nextId++, x: C.W + 30,
      y: C.groundY - r.range(C.pickups.minHeightAboveGround, C.pickups.maxHeightAboveGround),
      golden: r.chance(C.pickups.goldenChance) });
    s.nextPickup += r.range(C.pickups.gapMinMetres, C.pickups.gapMaxMetres);
  }
}

export function stepWorld(s, actions = {}, dt = 1 / 120) {
  if (s.phase !== 'run' || s.paused || !Number.isFinite(dt) || dt <= 0) return s;
  s.time += dt;
  s.stageBanner = Math.max(0, s.stageBanner - dt);
  const t = s.turkey;
  t.ducking = !!actions.duck;
  if (actions.jump && t.jumps < C.maxJumps) {
    t.vy = t.jumps === 0 ? C.jumpVelocity : C.doubleJumpVelocity;
    t.jumps++;
  }
  t.vy += C.gravity * dt;
  t.y += t.vy * dt;
  if (t.y >= C.groundY) { t.y = C.groundY; t.vy = 0; t.jumps = 0; }
  const slowed = s.time < s.slowUntil;
  s.speed = Math.min(C.maxScrollSpeed, C.baseScrollSpeed + s.distance * 0.10) * (slowed ? C.obstacles.mud.speedMultiplier : 1);
  s.distance += s.speed * dt / C.pixelsPerMetre;
  s.score += s.speed * dt / C.pixelsPerMetre;
  const stageIndex = Math.min(2, Math.floor(s.distance / 400));
  if (stageIndex !== s.stageIndex) s.stageBanner = 1.2;
  s.stageIndex = stageIndex;
  t.runPhase += dt * s.speed / 23;
  s.farmer.gap = Math.min(C.farmer.catchDistanceMax, s.farmer.gap +
    (slowed ? -C.obstacles.mud.catchLossPerSecond : C.farmer.cleanRunGainPerSecond) * dt);
  spawn(s);
  if (t.y === C.groundY) {
    s.dustTimer += dt;
    while (s.dustTimer >= 0.08) {
      s.dustTimer -= 0.08;
      s.particles.push({ x: t.x - 14, y: C.groundY - 3,
        vx: -s.speed * 0.45 + s.rng.range(-25, 15), vy: s.rng.range(-32, -12),
        life: 0.32, maxLife: 0.32, color: C.COLORS.cream, kind: 'dust' });
    }
  } else s.dustTimer = 0;
  const box = { x: t.x - C.player.width / 2, y: t.y - (t.ducking ? C.player.duckHeight : C.player.height),
    w: C.player.width, h: t.ducking ? C.player.duckHeight : C.player.height };
  for (const o of s.obstacles) {
    o.x -= (s.speed + (o.type === 'knife' ? C.obstacles.knife.speed : 0)) * dt;
    if (!o.hit && overlap(box, o)) {
      o.hit = true;
      if (o.type === 'mud') { s.slowUntil = s.time + C.obstacles.mud.slowSeconds; }
      else hurt(s);
    }
  }
  s.obstacles = s.obstacles.filter(o => o.x + o.w > -80);
  s.pickups = s.pickups.filter(p => {
    p.x -= s.speed * dt;
    const radius = C.pickups.radius;
    if (overlap(box, { x: p.x - radius, y: p.y - radius, w: radius * 2, h: radius * 2 })) {
      s.score += p.golden ? C.pickups.goldenCornScore : C.pickups.cornScore;
      s.farmer.gap = Math.min(C.farmer.catchDistanceMax, s.farmer.gap + (p.golden ? C.pickups.goldenCornCatchGain : C.pickups.cornCatchGain));
      s.collected++; if (p.golden) s.goldenCollected++;
      burst(s, p.x, p.y, p.golden ? C.COLORS.goldenCorn : C.COLORS.cornYellow);
      return false;
    }
    return p.x > -40;
  });
  for (const p of s.particles) {
    p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt;
    p.vy += (p.kind === 'dust' ? 25 : 480) * dt;
  }
  s.particles = s.particles.filter(p => p.life > 0);
  if (s.farmer.gap <= C.farmer.grabAt) hurt(s, true);
  if (s.phase === 'run' && s.distance >= C.goalDistance) { s.distance = C.goalDistance; s.phase = 'escaped'; }
  return s;
}

export function stateHash(s) {
  const fields = [s.phase, s.seed, s.distance, s.score, s.lives, s.time, s.speed,
    s.stageIndex, s.stageBanner, s.dustTimer, s.slowUntil, s.nextObstacle, s.nextPickup, s.nextId, s.collected,
    s.goldenCollected, s.grabs, s.paused, ...Object.values(s.turkey), s.farmer.gap,
    ...s.obstacles.flatMap(o => Object.values(o)), ...s.pickups.flatMap(p => Object.values(p)),
    ...s.particles.flatMap(p => Object.values(p))];
  let hash = 2166136261;
  for (const ch of fields.map(v => typeof v === 'number' ? v.toFixed(8) : String(v)).join('|')) {
    hash = Math.imul(hash ^ ch.charCodeAt(0), 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}
