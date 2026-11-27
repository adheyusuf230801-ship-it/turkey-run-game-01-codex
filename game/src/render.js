import { CONFIG } from './config.js';

const C = CONFIG.COLORS;
let lastStage = null;
let stageBannerStart = 0;

function ellipse(ctx, x, y, rx, ry, color, angle = 0) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, angle, 0, Math.PI * 2); ctx.fill();
}
function poly(ctx, points, color) {
  ctx.fillStyle = color; ctx.beginPath();
  points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.closePath(); ctx.fill();
}
function line(ctx, points, color, width = 3) {
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
}
function rect(ctx, x, y, w, h, color, radius = 0) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(x, y, w, h, radius); ctx.fill();
}
function text(ctx, label, x, y, size, color = C.cream, align = 'left', weight = 700) {
  ctx.font = `${weight} ${size}px 'Trebuchet MS', system-ui, sans-serif`;
  ctx.textAlign = align; ctx.fillStyle = color; ctx.fillText(label, x, y);
}

function turkey(ctx, x, y, phase, duck, scale = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  ellipse(ctx, 0, 0, 39, 7, '#292b2e25');
  const stride = Math.sin(phase) * 11;
  line(ctx, [[-10, -20], [-12 + stride, -5], [-5 + stride, -2]], C.turkeyLight, 5);
  line(ctx, [[10, -20], [12 - stride, -5], [21 - stride, -2]], C.turkeyLight, 5);
  ctx.save(); ctx.translate(0, duck ? -8 : -20); ctx.scale(1, duck ? 0.57 : 1);
  for (let i = 0; i < 7; i++) {
    const angle = -1.15 + i * 0.31;
    const fx = -25 - Math.cos(angle) * 20, fy = -22 + Math.sin(angle) * 25;
    ellipse(ctx, fx, fy, 12, 31, i % 2 ? C.turkeyLight : C.turkeyDark, angle - Math.PI / 2);
    ellipse(ctx, fx - Math.cos(angle) * 13, fy + Math.sin(angle) * 13, 7, 10, C.hay, angle - Math.PI / 2);
  }
  ellipse(ctx, 0, -13, 33, 27, C.turkeyBrown, -0.15);
  ellipse(ctx, 1, -10, 22, 14, C.turkeyLight, -0.4);
  line(ctx, [[-10, -8], [3, -3], [16, -12]], C.turkeyBrown, 2);
  ellipse(ctx, 23, -34, 11, 23, C.turkeyBrown, 0.2);
  ellipse(ctx, 29, -53, 16, 17, C.turkeyLight);
  poly(ctx, [[41, -55], [58, -49], [41, -45]], C.cornYellow);
  ellipse(ctx, 39, -42, 5, 13, C.turkeyRed, -0.2);
  ellipse(ctx, 28, -69, 5, 7, C.turkeyRed, -0.3);
  ellipse(ctx, 35, -57, 5, 6, C.cream); ellipse(ctx, 37, -57, 2.5, 3.5, C.ink);
  ctx.restore(); ctx.restore();
}

function farmer(ctx, x, y, phase, reaching = false, scale = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
  ellipse(ctx, 0, 0, 31, 7, '#292b2e25');
  const stride = Math.sin(phase) * 13;
  line(ctx, [[-10, -34], [-14 + stride, -13], [-16 + stride, -5]], C.farmerOveralls, 12);
  line(ctx, [[10, -34], [13 - stride, -15], [19 - stride, -5]], C.farmerOveralls, 12);
  ellipse(ctx, -11 + stride, -3, 12, 5, C.turkeyDark); ellipse(ctx, 23 - stride, -3, 12, 5, C.turkeyDark);
  rect(ctx, -23, -91, 46, 49, C.farmerShirt, 13);
  rect(ctx, -19, -66, 39, 34, C.farmerOveralls, 8);
  line(ctx, [[-12, -86], [-10, -57], [11, -57], [13, -86]], C.farmerOveralls, 7);
  ellipse(ctx, -10, -62, 2, 2, C.cornYellow); ellipse(ctx, 11, -62, 2, 2, C.cornYellow);
  line(ctx, [[19, -81], [reaching ? 40 : 30, -66], [reaching ? 66 : 42, reaching ? -73 : -87]], C.farmerShirt, 11);
  ellipse(ctx, reaching ? 67 : 43, reaching ? -73 : -88, 7, 6, C.farmerHat);
  line(ctx, [[-20, -81], [-34, -65], [-40, -78]], C.farmerShirt, 10);
  line(ctx, [[-43, -36], [-43, -132]], C.turkeyDark, 4);
  line(ctx, [[-55, -145], [-55, -127], [-32, -127], [-32, -145]], C.knifeSilver, 3);
  line(ctx, [[-43, -145], [-43, -125]], C.knifeSilver, 3);
  ellipse(ctx, 1, -108, 19, 22, C.farmerHat);
  ellipse(ctx, 20, -104, 9, 6, C.farmerHat);
  ellipse(ctx, 12, -111, 2, 3, C.ink);
  line(ctx, [[9, -95], [20, -96]], C.turkeyDark, 3);
  rect(ctx, -19, -140, 37, 24, C.farmerHat, 6);
  rect(ctx, -20, -124, 39, 7, C.turkeyDark);
  ellipse(ctx, 0, -117, 32, 5, C.farmerHat);
  ctx.restore();
}

function invertedCapture(ctx, x, y, phase) {
  ctx.save(); ctx.translate(x, y);
  // The farmer leans into the catch and holds both turkey legs overhead.
  ellipse(ctx, 0, 0, 32, 7, '#292b2e25');
  rect(ctx, -25, -130, 50, 65, C.farmerShirt, 12);
  rect(ctx, -20, -83, 40, 42, C.farmerOveralls, 8);
  ellipse(ctx, 0, -151, 22, 23, C.farmerHat);
  rect(ctx, -30, -173, 60, 10, C.turkeyDark, 4);
  ellipse(ctx, -8, -151, 3, 4, C.ink); ellipse(ctx, 8, -151, 3, 4, C.ink);
  line(ctx, [[-18, -113], [-47, -154], [-39, -190]], C.farmerShirt, 11);
  line(ctx, [[18, -113], [47, -154], [39, -190]], C.farmerShirt, 11);
  ellipse(ctx, -39, -193, 7, 6, C.farmerHat); ellipse(ctx, 39, -193, 7, 6, C.farmerHat);
  line(ctx, [[-13, -42], [-19 + Math.sin(phase) * 5, -8], [-28, 0]], C.farmerOveralls, 13);
  line(ctx, [[13, -42], [19 - Math.sin(phase) * 5, -8], [28, 0]], C.farmerOveralls, 13);
  // Turkey hanging head-down between the farmer's raised hands.
  ctx.save(); ctx.translate(0, -245); ctx.rotate(Math.PI);
  turkey(ctx, 0, 0, phase, false, 0.72);
  ctx.restore();
  line(ctx, [[-12, -192], [-8, -218]], C.turkeyLight, 4);
  line(ctx, [[12, -192], [8, -218]], C.turkeyLight, 4);
  ctx.restore();
}

function corn(ctx, p) {
  ctx.save(); ctx.translate(p.x, p.y);
  if (p.golden) {
    ellipse(ctx, 0, 0, 23, 26, '#ffdf7228');
    for (const [x, y] of [[-20, -18], [22, -4], [10, 23]]) {
      poly(ctx, [[x, y - 6], [x + 2, y - 2], [x + 6, y], [x + 2, y + 2], [x, y + 6], [x - 2, y + 2], [x - 6, y], [x - 2, y - 2]], C.goldenCorn);
    }
  }
  ellipse(ctx, 0, 0, 9, 16, p.golden ? C.goldenCorn : C.cornYellow, 0.2);
  for (let y = -10; y <= 10; y += 6) line(ctx, [[-5, y], [5, y + 1]], C.hay, 1);
  poly(ctx, [[0, 17], [-15, -2], [-9, 13]], C.cornHusk);
  poly(ctx, [[0, 17], [16, 1], [9, 15]], C.grass);
  ctx.restore();
}

function obstacle(ctx, o, time = 0) {
  ctx.save(); ctx.translate(o.x, o.y);
  if (o.hit && o.type !== 'mud') ctx.globalAlpha = 0.6;
  if (o.type === 'oven') {
    rect(ctx, 0, 0, o.w, o.h, C.ovenGrey, 5);
    rect(ctx, 5, 5, o.w - 10, 11, C.knifeSilver, 2);
    for (let x = 12; x < 52; x += 15) ellipse(ctx, x, 10, 3, 3, C.ink);
    rect(ctx, 6, 22, o.w - 12, 39, C.ink, 4);
    rect(ctx, 11, 32, o.w - 22, 24, C.ovenRed, 3);
    poly(ctx, [[15, 55], [22, 36], [29, 49], [37, 35], [44, 55]], C.cornYellow);
    line(ctx, [[13, 26], [45, 26]], C.knifeSilver, 4);
    line(ctx, [[7, -5], [52, -5]], C.turkeyDark, 4);
  } else if (o.type === 'knife') {
    rect(ctx, 0, 2, 23, 11, C.turkeyDark, 3);
    ellipse(ctx, 7, 7, 2, 2, C.hay); ellipse(ctx, 17, 7, 2, 2, C.hay);
    poly(ctx, [[24, 0], [62, 0], [53, 12], [24, 14]], C.knifeSilver);
    line(ctx, [[29, 3], [53, 3]], C.cream, 2);
    const glint = 0.45 + 0.55 * Math.abs(Math.sin(time * 8 + o.x * 0.02));
    ctx.globalAlpha = glint;
    line(ctx, [[68, 5], [80, 5]], C.turkeyRed, 2); line(ctx, [[74, -1], [74, 11]], C.turkeyRed, 2);
    ctx.globalAlpha = 1;
  } else if (o.type === 'hay') {
    rect(ctx, 0, 0, o.w, o.h, C.hay, 9);
    for (let i = 5; i < o.w; i += 7) line(ctx, [[i, 5], [i - 3, o.h - 5]], C.cornYellow, 2);
    rect(ctx, 12, 0, 5, o.h, C.turkeyLight); rect(ctx, 42, 0, 5, o.h, C.turkeyLight);
  } else if (o.type === 'fence') {
    for (let x = 0; x < o.w; x += 20) poly(ctx, [[x, o.h], [x, 8], [x + 6, 0], [x + 12, 8], [x + 12, o.h]], C.fence);
    rect(ctx, -5, 22, o.w + 10, 9, C.turkeyLight); rect(ctx, -5, 49, o.w + 10, 9, C.turkeyLight);
  } else {
    ellipse(ctx, o.w / 2, 7, o.w / 2, 10, C.mud);
    ellipse(ctx, 28, 5, 17, 3, C.dirt); ellipse(ctx, 78, 9, 18, 2, C.dirt);
  }
  ctx.restore();
}

function scenery(ctx, s) {
  const scroll = s.distance * CONFIG.pixelsPerMetre;
  const sky = ctx.createLinearGradient(0, 0, 0, 440);
  sky.addColorStop(0, s.stageIndex === 2 ? '#e5b98e' : C.sky); sky.addColorStop(1, C.cream);
  rect(ctx, 0, 0, 960, 540, sky);
  ellipse(ctx, 778, 102, 55, 55, '#fff3d440'); ellipse(ctx, 778, 102, 40, 40, C.cream);
  for (let i = 0; i < 5; i++) {
    const x = ((i * 251 - scroll * 0.035) % 1255 + 1255) % 1255 - 110;
    ellipse(ctx, x, 102 + i % 2 * 47, 59, 15, '#fff3d475');
    ellipse(ctx, x + 18, 90 + i % 2 * 47, 28, 22, '#fff3d475');
  }
  for (let i = -1; i < 5; i++) {
    const x = i * 340 - scroll * 0.10 % 340;
    ellipse(ctx, x, 374, 275, 120, '#a8b48a');
    ellipse(ctx, x + 180, 412, 220, 99, '#899b70');
  }
  for (let i = -1; i < 4; i++) {
    const x = i * 410 - scroll * 0.22 % 410;
    const color = s.stageIndex === 2 ? '#8b8270' : '#687e58';
    if (s.stageIndex === 2) {
      rect(ctx, x, 305, 135, 120, color); rect(ctx, x + 18, 270, 24, 45, color);
      for (let j = 0; j < 3; j++) rect(ctx, x + 15 + j * 39, 328, 21, 28, '#b3aa8c');
      poly(ctx, [[x - 10, 305], [x + 65, 280], [x + 145, 305]], color);
    } else {
      rect(ctx, x, 334, 130, 91, color);
      poly(ctx, [[x - 10, 334], [x + 65, 284], [x + 140, 334]], color);
      rect(ctx, x + 46, 364, 40, 61, '#536b4d');
      line(ctx, [[x + 48, 366], [x + 84, 422], [x + 84, 366], [x + 48, 422]], '#899b70', 3);
    }
  }
  for (let i = -1; i < 17; i++) {
    const x = i * 70 - scroll * 0.4 % 70;
    rect(ctx, x, 391, 7, 49, '#61764f'); rect(ctx, x, 403, 72, 5, '#61764f'); rect(ctx, x, 424, 72, 5, '#61764f');
  }
  rect(ctx, 0, 435, 960, 105, C.dirt);
  rect(ctx, 0, 435, 960, 13, C.grass);
  rect(ctx, 0, 451, 960, 3, '#79503940');
  for (let i = -1; i < 40; i++) {
    const x = i * 29 - scroll % 29;
    line(ctx, [[x, 440], [x - 4, 432], [x + 1, 437], [x + 5, 430]], C.grass, 2);
    ellipse(ctx, x + 12, 478 + (i * i % 5) * 10, 3, 1.5, '#79503960');
  }
  const gateX = CONFIG.player.x + (CONFIG.goalDistance - s.distance) * CONFIG.pixelsPerMetre;
  if (gateX < 1150) {
    rect(ctx, gateX - 80, 235, 14, 205, C.woods, 4); rect(ctx, gateX + 80, 235, 14, 205, C.woods, 4);
    ctx.strokeStyle = C.woods; ctx.lineWidth = 15; ctx.beginPath(); ctx.arc(gateX + 7, 239, 80, Math.PI, 0); ctx.stroke();
    rect(ctx, gateX - 94, 245, 202, 40, C.cream, 8);
    text(ctx, 'FREEDOM', gateX + 7, 273, 25, C.woods, 'center');
    for (const x of [gateX - 70, gateX + 90]) poly(ctx, [[x, 195], [x + 36, 208], [x, 221]], C.cornYellow);
  }
}

function heart(ctx, x, y, full) {
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = full ? C.turkeyRed : '#fff3d430';
  ctx.beginPath(); ctx.moveTo(0, 17); ctx.bezierCurveTo(-28, 0, -14, -17, 0, -6);
  ctx.bezierCurveTo(14, -17, 28, 0, 0, 17); ctx.fill(); ctx.restore();
}

function hud(ctx, s, assets) {
  rect(ctx, 20, 18, 920, 71, '#292b2ee8', 14);
  text(ctx, 'CORN SCORE', 42, 41, 11, C.hay);
  text(ctx, String(Math.floor(s.score)).padStart(5, '0'), 42, 70, 27);
  text(ctx, `${Math.floor(s.distance)} / 1200 m`, 215, 61, 22);
  for (let i = 0; i < 3; i++) heart(ctx, 440 + i * 35, 52, i < s.lives);
  text(ctx, 'FARMER', 578, 42, 11, C.hay);
  rect(ctx, 578, 51, 151, 12, '#fff3d425', 6);
  rect(ctx, 578, 51, Math.max(0, Math.min(1, s.farmer.gap / 300)) * 151, 12,
    s.farmer.gap < 90 ? C.turkeyRed : C.grass, 6);
  text(ctx, CONFIG.stages[s.stageIndex].name.toUpperCase(), 916, 48, 15, C.cream, 'right');
  text(ctx, assets?.muted ? 'M: SOUND OFF' : 'P: PAUSE  ·  M: SOUND', 916, 70, 10, C.hay, 'right');
  rect(ctx, 20, 96, 920, 4, '#292b2e25', 2);
  rect(ctx, 20, 96, 920 * Math.min(1, s.distance / 1200), 4, C.cornYellow, 2);
}

function speedStreaks(ctx, s) {
  if (s.phase !== 'run' || s.speed < 345 || s.turkey.y >= CONFIG.groundY - 4) return;
  ctx.save(); ctx.globalAlpha = Math.min(0.42, (s.speed - 345) / 220);
  for (let i = 0; i < 9; i++) {
    const y = 120 + ((i * 47 + s.time * 170) % 245);
    const length = 22 + (i % 4) * 12;
    const x = ((i * 137 - s.time * (70 + i * 13)) % 1020 + 1020) % 1020 - 30;
    line(ctx, [[x, y], [x + length, y]], C.cream, 2 + i % 2);
  }
  ctx.restore();
}

function renderParticles(ctx, particles) {
  for (const p of particles || []) {
    const alpha = Math.max(0, p.life / (p.maxLife || 0.65));
    ctx.save(); ctx.globalAlpha = alpha;
    if (p.kind === 'dust') {
      ellipse(ctx, p.x, p.y, 7 + (1 - alpha) * 7, 3 + (1 - alpha) * 3, '#fff3d488');
    } else if (p.kind === 'feather') {
      ellipse(ctx, p.x, p.y, 3 + alpha * 2, 8 + alpha * 3, p.color, p.vx * 0.01 + p.life * 5);
    } else {
      ellipse(ctx, p.x, p.y, 3, 5, p.color, p.life * 5);
    }
    ctx.restore();
  }
}

function stageBanner(ctx, state) {
  if (lastStage === null) { lastStage = state.stageIndex; stageBannerStart = state.time - 1.2; }
  if (state.stageIndex !== lastStage) { lastStage = state.stageIndex; stageBannerStart = state.time; }
  const localRemaining = Math.max(0, 1.2 - (state.time - stageBannerStart));
  let remaining = Number.isFinite(state.stageBanner) && state.stageBanner > 0 ? state.stageBanner : localRemaining;
  if (remaining <= 0 || state.phase === 'title') return;
  const alpha = Math.min(1, remaining / 0.24, (1.2 - remaining) / 0.18 + 0.2);
  ctx.save(); ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  text(ctx, CONFIG.stages[state.stageIndex].name.toUpperCase(), 480, 151, 38, C.cream, 'center', 900);
  text(ctx, 'STAGE', 480, 117, 13, C.cornYellow, 'center', 800);
  ctx.restore();
}

function escapeGate(ctx) {
  ctx.save(); ctx.globalAlpha = 0.8;
  for (let i = 0; i < 11; i++) {
    const a = -Math.PI * 0.92 + i * Math.PI * 0.18;
    line(ctx, [[700, 180], [700 + Math.cos(a) * 115, 180 + Math.sin(a) * 115]], C.cornYellow, 5);
  }
  ctx.restore();
  rect(ctx, 737, 210, 13, 220, C.woods, 4); rect(ctx, 897, 210, 13, 220, C.woods, 4);
  ctx.strokeStyle = C.woods; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(825, 216, 80, Math.PI, 0); ctx.stroke();
  poly(ctx, [[752, 224], [823, 239], [823, 407], [752, 391]], C.cream);
  poly(ctx, [[898, 224], [827, 239], [827, 407], [898, 391]], C.cream);
  text(ctx, 'FREEDOM', 825, 205, 16, C.woods, 'center', 900);
  turkey(ctx, 915, 414, 1.5, false, 0.72);
}

export function drawGame(ctx, state, assets = {}) {
  ctx.save();
  ctx.clearRect(0, 0, CONFIG.W, CONFIG.H);
  scenery(ctx, state);
  speedStreaks(ctx, state);
  for (const o of state.obstacles) obstacle(ctx, o, state.time);
  for (const p of state.pickups) corn(ctx, p);
  if (state.phase !== 'title') {
    renderParticles(ctx, state.particles?.filter(p => p.kind === 'dust'));
    farmer(ctx, state.turkey.x - state.farmer.gap, CONFIG.groundY, state.turkey.runPhase, state.farmer.gap < 100);
    ctx.save();
    if (state.time < state.turkey.invincibleUntil && Math.floor(state.time * 12) % 2) ctx.globalAlpha = 0.4;
    turkey(ctx, state.turkey.x, state.turkey.y, state.turkey.runPhase, state.turkey.ducking);
    ctx.restore();
    renderParticles(ctx, state.particles?.filter(p => p.kind !== 'dust'));
    hud(ctx, state, assets);
    stageBanner(ctx, state);
  }
  if (state.phase === 'title') {
    rect(ctx, 0, 0, 960, 540, '#292b2e18');
    rect(ctx, 218, 35, 524, 30, C.woods, 15);
    text(ctx, 'A LITTLE TURKEY. A BIG ESCAPE.', 480, 56, 13, C.cream, 'center');
    text(ctx, 'FEATHER', 483, 143, 76, C.turkeyDark, 'center', 900);
    text(ctx, 'FUGITIVE', 480, 216, 89, C.turkeyDark, 'center', 900);
    text(ctx, 'Run like your dinner depends on it.', 480, 251, 21, C.woods, 'center', 500);
    farmer(ctx, 296, 439, 1.1, true, 1.02);
    turkey(ctx, 580, 439, 1.3, false, 1.85);
    corn(ctx, { x: 729, y: 362, golden: true });
    line(ctx, [[379, 377], [443, 377]], '#fff3d4b0', 3);
    line(ctx, [[400, 389], [450, 389]], '#fff3d4b0', 3);
    rect(ctx, 262, 465, 436, 43, C.woods, 22);
    text(ctx, 'Press Enter or click to run', 480, 493, 21, C.cream, 'center');
    text(ctx, 'SPACE / ↑ / W / TAP: DOUBLE JUMP     ↓ / S: DUCK     P: PAUSE     M: MUTE', 480, 528, 11, C.cream, 'center');
  } else if (state.phase === 'caught' || state.phase === 'escaped') {
    const won = state.phase === 'escaped';
    rect(ctx, 0, 0, 960, 540, '#292b2e99');
    rect(ctx, 180, 139, 600, 301, C.cream, 22);
    if (won) escapeGate(ctx); else invertedCapture(ctx, 95, 430, state.time * 7);
    rect(ctx, 205, 157, 550, 6, won ? C.grass : C.turkeyRed, 3);
    text(ctx, won ? 'ESCAPED!' : 'CAUGHT!', 480, 233, 62, won ? C.woods : C.turkeyRed, 'center', 900);
    text(ctx, won ? 'Free as a bird.' : 'Thanksgiving is back on the menu.', 480, 276, 23, C.turkeyDark, 'center', 500);
    text(ctx, `SCORE  ${Math.floor(state.score).toLocaleString('en-US')}    ·    ${Math.floor(state.distance)} m`, 480, 328, 25, C.turkeyDark, 'center');
    rect(ctx, 320, 361, 320, 47, C.woods, 24);
    text(ctx, 'Press R to run again', 480, 392, 22, C.cream, 'center');
  }
  if (state.paused && state.phase === 'run') {
    rect(ctx, 0, 0, 960, 540, '#292b2eb0');
    text(ctx, 'PAUSED', 480, 265, 64, C.cream, 'center', 900);
    text(ctx, 'Take a breather. Press P to keep running.', 480, 309, 21, C.cream, 'center', 500);
  }
  ctx.restore();
}
