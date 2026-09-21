// Royal Birthday Music Box synthesized audio manager (Web Audio API)
// Provides gentle, royalty-free, 100% reliable chimes that work offline and on all devices.

export type SynthMelodyType = 'birthday' | 'lullaby';

class SoundManager {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private timerId: number | null = null;
  private melodyIndex: number = 0;
  private volume: number = 0.5;
  private currentMelodyType: SynthMelodyType = 'birthday';
  private sessionToken: number = 0;

  // Gentle music box chime notes for "Happy Birthday to You"
  private birthdayMelodyNotes: { freq: number; duration: number; delay: number }[] = [
    { freq: 261.63, duration: 0.35, delay: 0.4 }, // C4 - Hap-
    { freq: 261.63, duration: 0.2, delay: 0.25 }, // C4 - py
    { freq: 293.66, duration: 0.5, delay: 0.55 }, // D4 - birth-
    { freq: 261.63, duration: 0.5, delay: 0.55 }, // C4 - day
    { freq: 349.23, duration: 0.5, delay: 0.55 }, // F4 - to
    { freq: 329.63, duration: 0.9, delay: 0.95 }, // E4 - you

    { freq: 261.63, duration: 0.35, delay: 0.4 }, // C4 - Hap-
    { freq: 261.63, duration: 0.2, delay: 0.25 }, // C4 - py
    { freq: 293.66, duration: 0.5, delay: 0.55 }, // D4 - birth-
    { freq: 261.63, duration: 0.5, delay: 0.55 }, // C4 - day
    { freq: 392.00, duration: 0.5, delay: 0.55 }, // G4 - to
    { freq: 349.23, duration: 0.9, delay: 0.95 }, // F4 - you

    { freq: 261.63, duration: 0.35, delay: 0.4 }, // C4 - Hap-
    { freq: 261.63, duration: 0.2, delay: 0.25 }, // C4 - py
    { freq: 523.25, duration: 0.6, delay: 0.65 }, // C5 - birth-
    { freq: 440.00, duration: 0.5, delay: 0.55 }, // A4 - day
    { freq: 349.23, duration: 0.5, delay: 0.55 }, // F4 - dear
    { freq: 329.63, duration: 0.5, delay: 0.55 }, // E4 - Mi-
    { freq: 293.66, duration: 0.8, delay: 0.85 }, // D4 - thran

    { freq: 466.16, duration: 0.35, delay: 0.4 }, // Bb4 - Hap-
    { freq: 466.16, duration: 0.2, delay: 0.25 }, // Bb4 - py
    { freq: 440.00, duration: 0.5, delay: 0.55 }, // A4 - birth-
    { freq: 349.23, duration: 0.5, delay: 0.55 }, // F4 - day
    { freq: 392.00, duration: 0.5, delay: 0.6 },  // G4 - to
    { freq: 349.23, duration: 1.2, delay: 1.4 },  // F4 - you
  ];

  // Sweet Lullaby chimes
  private lullabyNotes: { freq: number; duration: number; delay: number }[] = [
    { freq: 261.63, duration: 0.4, delay: 0.5 }, // Twin-
    { freq: 261.63, duration: 0.4, delay: 0.5 }, // kle
    { freq: 392.00, duration: 0.4, delay: 0.5 }, // Twin-
    { freq: 392.00, duration: 0.4, delay: 0.5 }, // kle
    { freq: 440.00, duration: 0.4, delay: 0.5 }, // Lit-
    { freq: 440.00, duration: 0.4, delay: 0.5 }, // tle
    { freq: 392.00, duration: 0.8, delay: 1.0 }, // Star
    { freq: 349.23, duration: 0.4, delay: 0.5 }, // How
    { freq: 349.23, duration: 0.4, delay: 0.5 }, // I
    { freq: 329.63, duration: 0.4, delay: 0.5 }, // Won-
    { freq: 329.63, duration: 0.4, delay: 0.5 }, // der
    { freq: 293.66, duration: 0.4, delay: 0.5 }, // What
    { freq: 293.66, duration: 0.4, delay: 0.5 }, // You
    { freq: 261.63, duration: 0.8, delay: 1.0 }, // Are
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

  private playMusicBoxNote(freq: number, duration: number) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);

      const targetGain = 0.08 * (this.volume / 0.5);
      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.exponentialRampToValueAtTime(targetGain, now + 0.03);
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
      // ignore
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0.05, Math.min(1.0, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public startMelody() {
    this.sessionToken++;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.isPlaying = true;
    this.melodyIndex = 0;
    this.stepMelody(this.sessionToken);
  }

  private stepMelody = (sessionId: number) => {
    if (!this.isPlaying || this.sessionToken !== sessionId) return;

    const notes = this.currentMelodyType === 'lullaby' ? this.lullabyNotes : this.birthdayMelodyNotes;
    const note = notes[this.melodyIndex];
    this.playMusicBoxNote(note.freq, note.duration);

    this.melodyIndex = (this.melodyIndex + 1) % notes.length;
    this.timerId = window.setTimeout(() => this.stepMelody(sessionId), note.delay * 1000);
  };

  public stopMelody() {
    this.isPlaying = false;
    this.sessionToken++;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.melodyIndex = 0;
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

  // Soft button pop sound effect
  public playPop() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

      gain.gain.setValueAtTime(0.12 * (this.volume / 0.5), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // ignore
    }
  }

  // Celebration fanfare sound effect
  public playFanfare() {
    try {
      const ctx = this.getAudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const now = ctx.currentTime + idx * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.12 * (this.volume / 0.5), now + 0.02);
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

  // Playful train whistle sound effect ("Choo Choo!")
  public playTrainWhistle() {
    try {
      const ctx = this.getAudioContext();
      const playToot = (startTime: number, duration: number) => {
        const freqs = [440, 554.37, 659.25]; // A4, C#5, E5 harmonious chord
        freqs.forEach((f) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, startTime);

          gain.gain.setValueAtTime(0.001, startTime);
          gain.gain.linearRampToValueAtTime(0.06 * (this.volume / 0.5), startTime + 0.05);
          gain.gain.setValueAtTime(0.06 * (this.volume / 0.5), startTime + duration - 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + duration);
        });
      };

      const now = ctx.currentTime;
      playToot(now, 0.25);
      playToot(now + 0.3, 0.45);
    } catch {
      // ignore
    }
  }
}

export const soundManager = new SoundManager();
