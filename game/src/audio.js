export function createAudio() {
  let context = null;
  let master = null;
  let muted = false;
  let unlocked = false;
  const gestureEvents = ['pointerdown', 'keydown'];

  function unlock(event) {
    if (event && event.isTrusted === false) return;
    unlocked = true;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      if (!context) {
        context = new AudioContextClass();
        master = context.createGain();
        master.gain.value = muted ? 0 : 0.15;
        master.connect(context.destination);
      }
      if (context.state === 'suspended') context.resume().catch(() => {});
    } catch {
      // Gameplay continues when browser audio is unavailable.
    }
  }

  // Capture runs before input handlers, so the first gesture can make a sound.
  for (const type of gestureEvents) window.addEventListener(type, unlock, { capture: true });

  function tone(frequency, duration, delay = 0, type = 'sine', endFrequency = frequency) {
    if (!unlocked || muted) return;
    if (!context) unlock();
    if (!context || !master || context.state !== 'running') return;
    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
    envelope.gain.setValueAtTime(0, start);
    envelope.gain.linearRampToValueAtTime(0.55, start + 0.008);
    envelope.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(envelope);
    envelope.connect(master);
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
    };
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  function melody(notes, spacing, duration, type = 'sine') {
    notes.forEach((note, index) => tone(note, duration, index * spacing, type));
  }

  return {
    get muted() { return muted; },
    toggleMute() {
      muted = !muted;
      if (master) master.gain.setTargetAtTime(muted ? 0 : 0.15, context.currentTime, 0.01);
      return muted;
    },
    jump() { tone(280, 0.13, 0, 'triangle', 620); },
    pickup(golden = false) {
      melody(golden ? [660, 880, 1320] : [740, 1040], 0.065, 0.11);
    },
    hit() { tone(180, 0.2, 0, 'sawtooth', 55); },
    grab() { melody([220, 150, 75], 0.09, 0.16, 'square'); },
    win() { melody([523.25, 659.25, 783.99, 1046.5], 0.12, 0.24, 'triangle'); },
    lose() { melody([392, 311.13, 233.08, 130.81], 0.16, 0.25, 'triangle'); },
    click() { tone(520, 0.055, 0, 'sine', 420); },
  };
}
