// Web Audio API ambient music synthesizer & sound effects
// Completely standalone, zero external audio asset dependencies, guaranteed reliable playback.

class SoundManager {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private timerId: number | null = null;
  private melodyIndex: number = 0;

  // Sweet music box notes (frequencies in Hz for a gentle celebratory melody)
  private melodyNotes: { freq: number; duration: number; delay: number }[] = [
    // Gentle "Happy Birthday / Royal Celebration" melody motif in C major / F major
    { freq: 261.63, duration: 0.35, delay: 0.4 }, // C4
    { freq: 261.63, duration: 0.2, delay: 0.25 }, // C4
    { freq: 293.66, duration: 0.5, delay: 0.55 }, // D4
    { freq: 261.63, duration: 0.5, delay: 0.55 }, // C4
    { freq: 349.23, duration: 0.5, delay: 0.55 }, // F4
    { freq: 329.63, duration: 0.9, delay: 0.95 }, // E4

    { freq: 261.63, duration: 0.35, delay: 0.4 }, // C4
    { freq: 261.63, duration: 0.2, delay: 0.25 }, // C4
    { freq: 293.66, duration: 0.5, delay: 0.55 }, // D4
    { freq: 261.63, duration: 0.5, delay: 0.55 }, // C4
    { freq: 392.00, duration: 0.5, delay: 0.55 }, // G4
    { freq: 349.23, duration: 0.9, delay: 0.95 }, // F4

    { freq: 261.63, duration: 0.35, delay: 0.4 }, // C4
    { freq: 261.63, duration: 0.2, delay: 0.25 }, // C4
    { freq: 523.25, duration: 0.6, delay: 0.65 }, // C5
    { freq: 440.00, duration: 0.5, delay: 0.55 }, // A4
    { freq: 349.23, duration: 0.5, delay: 0.55 }, // F4
    { freq: 329.63, duration: 0.5, delay: 0.55 }, // E4
    { freq: 293.66, duration: 0.8, delay: 0.85 }, // D4

    { freq: 466.16, duration: 0.35, delay: 0.4 }, // Bb4
    { freq: 466.16, duration: 0.2, delay: 0.25 }, // Bb4
    { freq: 440.00, duration: 0.5, delay: 0.55 }, // A4
    { freq: 349.23, duration: 0.5, delay: 0.55 }, // F4
    { freq: 392.00, duration: 0.5, delay: 0.6 },  // G4
    { freq: 349.23, duration: 1.2, delay: 1.4 },  // F4
  ];

  private getAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play a soft chime note (music box / celesta tone)
  private playMusicBoxNote(freq: number, duration: number) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Primary tone
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // Shimmer octave overtone
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);

      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.07, now + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public startMelody() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.melodyIndex = 0;
    this.stepMelody();
  }

  private stepMelody = () => {
    if (!this.isPlaying) return;
    const note = this.melodyNotes[this.melodyIndex];
    this.playMusicBoxNote(note.freq, note.duration);

    this.melodyIndex = (this.melodyIndex + 1) % this.melodyNotes.length;
    this.timerId = window.setTimeout(this.stepMelody, note.delay * 1000);
  };

  public stopMelody() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public toggleMusic(): boolean {
    if (this.isPlaying) {
      this.stopMelody();
      return false;
    } else {
      this.startMelody();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Playful pop sound effect
  public playPop() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // ignore
    }
  }

  // Celebratory harp / glockenspiel fanfare
  public playFanfare() {
    try {
      const ctx = this.getAudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const now = ctx.currentTime + idx * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.65);
      });
    } catch {
      // ignore
    }
  }
}

export const soundManager = new SoundManager();
