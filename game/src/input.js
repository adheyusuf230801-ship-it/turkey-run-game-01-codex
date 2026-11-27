export function createInput(canvas) {
  const actions = new Map([
    ['Space', 'jump'], ['ArrowUp', 'jump'], ['KeyW', 'jump'],
    ['ArrowDown', 'duck'], ['KeyS', 'duck'],
    ['Enter', 'start'], ['KeyR', 'restart'],
    ['KeyP', 'pause'], ['KeyM', 'mute'],
  ]);
  const held = new Set();
  const edges = new Set();
  let attached = false;

  function keydown(event) {
    const action = actions.get(event.code);
    if (!action) return;
    event.preventDefault();
    if (!event.repeat && !held.has(event.code) && action !== 'duck') {
      edges.add(action);
    }
    held.add(event.code);
  }

  function keyup(event) {
    if (!actions.has(event.code)) return;
    event.preventDefault();
    held.delete(event.code);
  }

  function pointerdown(event) {
    if (event.isPrimary === false || (event.button !== undefined && event.button !== 0)) return;
    event.preventDefault();
    canvas.focus({ preventScroll: true });
    edges.add('jump');
  }

  function clear() {
    held.clear();
    edges.clear();
  }

  function visibilitychange() {
    if (document.hidden) clear();
  }

  function consume(action) {
    return edges.delete(action);
  }

  function attach() {
    if (attached) return;
    attached = true;
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    window.addEventListener('blur', clear);
    document.addEventListener('visibilitychange', visibilitychange);
    canvas.addEventListener('pointerdown', pointerdown, { passive: false });
  }

  function detach() {
    if (!attached) return;
    attached = false;
    window.removeEventListener('keydown', keydown);
    window.removeEventListener('keyup', keyup);
    window.removeEventListener('blur', clear);
    document.removeEventListener('visibilitychange', visibilitychange);
    canvas.removeEventListener('pointerdown', pointerdown);
    clear();
  }

  attach();
  return {
    consumeJump: () => consume('jump'),
    duckHeld: () => held.has('ArrowDown') || held.has('KeyS'),
    consumeStart: () => consume('start'),
    consumeRestart: () => consume('restart'),
    consumePause: () => consume('pause'),
    consumeMute: () => consume('mute'),
    attach,
    detach,
  };
}
