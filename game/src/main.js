import { CONFIG } from './config.js';
import { createInput } from './input.js';
import { createAudio } from './audio.js';
import { createWorld, startRun, stepWorld } from './world.js';
import { drawGame } from './render.js';
import { getShotConfig, composeShot } from './shots.js';

const canvas = document.querySelector('#game');
canvas.width = CONFIG.W; canvas.height = CONFIG.H;
const ctx = canvas.getContext('2d');
const shot = getShotConfig();
const state = createWorld(shot.seed);
const input = createInput(canvas), audio = createAudio();
if (shot.shot) composeShot(state, shot.shot);
const fixedDt = 1 / 120;
let previous = null, accumulator = 0, jumpPending = false;

function frame(now) {
  if (!shot.shot) {
    const jump = input.consumeJump(), start = input.consumeStart();
    const restart = input.consumeRestart(), pause = input.consumePause();
    if (input.consumeMute()) audio.toggleMute();
    if ((state.phase === 'title' && (start || jump)) ||
        ((state.phase === 'caught' || state.phase === 'escaped') && restart)) {
      startRun(state); accumulator = 0; jumpPending = false; audio.click();
    } else if (state.phase === 'run') {
      if (pause) { state.paused = !state.paused; accumulator = 0; jumpPending = false; }
      if (!state.paused) jumpPending ||= jump;
    }
    const elapsed = previous === null ? 0 : Math.min(CONFIG.maxFrameDelta, (now - previous) / 1000);
    if (state.phase === 'run' && !state.paused) {
      accumulator += elapsed;
      while (accumulator >= fixedDt && state.phase === 'run') {
        const before = { lives: state.lives, collected: state.collected, golden: state.goldenCollected,
          phase: state.phase, grabs: state.grabs, jumps: state.turkey.jumps };
        const jumping = jumpPending && state.turkey.jumps < CONFIG.maxJumps;
        stepWorld(state, { jump: jumpPending, duck: input.duckHeld() }, fixedDt);
        jumpPending = false;
        if (jumping) audio.jump();
        if (state.lives < before.lives) state.grabs > before.grabs ? audio.grab() : audio.hit();
        if (state.collected > before.collected) audio.pickup(state.goldenCollected > before.golden);
        if (state.phase !== before.phase) state.phase === 'escaped' ? audio.win() : audio.lose();
        accumulator -= fixedDt;
      }
    } else accumulator = 0;
  }
  previous = now;
  drawGame(ctx, state, { muted: audio.muted });
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
