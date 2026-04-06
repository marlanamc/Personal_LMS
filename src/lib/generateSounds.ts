/**
 * Sound generation utilities for the LMS gamification system.
 * These generate satisfying audio feedback using the Web Audio API.
 *
 * To generate the actual MP3 files, run this in a browser console
 * or use a tool like Tone.js. For now, sounds are synthesized on-the-fly.
 */

export interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
  ramp?: "up" | "down" | "none";
}

export const SOUND_CONFIGS: Record<string, SoundConfig[]> = {
  // Quick ascending chime for earning points
  points: [
    { frequency: 523, duration: 0.1, type: "sine", volume: 0.3, ramp: "down" },
    { frequency: 659, duration: 0.1, type: "sine", volume: 0.3, ramp: "down" },
    { frequency: 784, duration: 0.15, type: "sine", volume: 0.4, ramp: "down" },
  ],

  // Triumphant fanfare for achievements
  achievement: [
    { frequency: 392, duration: 0.15, type: "sine", volume: 0.3, ramp: "none" },
    { frequency: 523, duration: 0.15, type: "sine", volume: 0.3, ramp: "none" },
    { frequency: 659, duration: 0.15, type: "sine", volume: 0.35, ramp: "none" },
    { frequency: 784, duration: 0.3, type: "sine", volume: 0.4, ramp: "down" },
  ],

  // Fire whoosh for streak milestones
  streak: [
    { frequency: 200, duration: 0.1, type: "sawtooth", volume: 0.2, ramp: "up" },
    { frequency: 400, duration: 0.15, type: "sawtooth", volume: 0.3, ramp: "up" },
    { frequency: 600, duration: 0.2, type: "sine", volume: 0.35, ramp: "down" },
  ],

  // Victory sound for daily challenge
  challenge: [
    { frequency: 523, duration: 0.1, type: "sine", volume: 0.3, ramp: "none" },
    { frequency: 659, duration: 0.1, type: "sine", volume: 0.3, ramp: "none" },
    { frequency: 784, duration: 0.1, type: "sine", volume: 0.35, ramp: "none" },
    { frequency: 1047, duration: 0.25, type: "sine", volume: 0.4, ramp: "down" },
  ],

  // Quick positive blip for correct answers
  correct: [
    { frequency: 880, duration: 0.08, type: "sine", volume: 0.25, ramp: "down" },
    { frequency: 1047, duration: 0.12, type: "sine", volume: 0.3, ramp: "down" },
  ],

  // Soft bump for wrong answers (not harsh)
  wrong: [
    { frequency: 220, duration: 0.15, type: "sine", volume: 0.2, ramp: "down" },
    { frequency: 180, duration: 0.1, type: "sine", volume: 0.15, ramp: "down" },
  ],

  // Level up sound
  levelUp: [
    { frequency: 392, duration: 0.1, type: "sine", volume: 0.25, ramp: "none" },
    { frequency: 494, duration: 0.1, type: "sine", volume: 0.25, ramp: "none" },
    { frequency: 587, duration: 0.1, type: "sine", volume: 0.3, ramp: "none" },
    { frequency: 784, duration: 0.15, type: "sine", volume: 0.35, ramp: "none" },
    { frequency: 988, duration: 0.25, type: "sine", volume: 0.4, ramp: "down" },
  ],

  /** On Again / Off Again: new scheduled block started */
  timeBlock: [
    { frequency: 523, duration: 0.09, type: "sine", volume: 0.22, ramp: "down" },
    { frequency: 698, duration: 0.12, type: "sine", volume: 0.28, ramp: "down" },
  ],
};

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export function playSynthSound(soundName: keyof typeof SOUND_CONFIGS): void {
  const configs = SOUND_CONFIGS[soundName];
  if (!configs) return;

  const ctx = getAudioContext();
  let startTime = ctx.currentTime;

  configs.forEach((config) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency, startTime);

    gainNode.gain.setValueAtTime(0, startTime);

    // Attack
    if (config.ramp === "up") {
      gainNode.gain.linearRampToValueAtTime(config.volume, startTime + config.duration * 0.8);
      gainNode.gain.linearRampToValueAtTime(0, startTime + config.duration);
    } else if (config.ramp === "down") {
      gainNode.gain.linearRampToValueAtTime(config.volume, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + config.duration);
    } else {
      gainNode.gain.linearRampToValueAtTime(config.volume, startTime + 0.01);
      gainNode.gain.setValueAtTime(config.volume, startTime + config.duration - 0.02);
      gainNode.gain.linearRampToValueAtTime(0, startTime + config.duration);
    }

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + config.duration + 0.05);

    startTime += config.duration * 0.9; // Slight overlap for smoother sound
  });
}
