# State Management & Engine Subsystems
## Universe Civilization: Empire at War

This document details the real-time simulation tick engine, state synchronization workflows, Web Audio API sound synthesis, and persistence strategies in Universe Civilization: Empire at War.

---

## 1. Real-Time Game Loop & Turn Processing

Universe Civilization: Empire at War combines continuous real-time resource accumulation with a tactical action-turn pool:

### Continuous Tick Processing
- An internal `setInterval` fires once per second (1000ms cadence) inside `src/App.tsx`.
- On each tick:
  1. Computes fractional resource yields based on active mine levels and power availability.
  2. Increments the turn accumulator (1 turn gained every 10 seconds = 6 turns per minute).
  3. Evaluates active shipyard construction queues and research projects; triggers completion notifications when timers reach zero.
  4. Recalculates fleet travel vectors for active expeditions and planetary invasions.
  5. Updates server timestamps for real-time synchronization.

### Manual Turn Burning
- Players can spend stored action turns (+1, +10, +50, or +All) via the Topbar quick execution controls.
- Each turn spent immediately grants:
  - 10 seconds worth of gross planetary resource yields.
  - Advance of all building, research, and shipyard construction queues by 10 seconds.
  - Tactical exploration or colony expedition turn requirements.

---

## 2. Web Audio API Sound Synthesizer (`src/sound.ts`)

To avoid bulky audio downloads and ensure instant offline audio feedback across all devices (including iOS mobile Safari), Universe Civilization uses a zero-dependency synthesizer:

```typescript
class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  public play(name: 'click' | 'confirm' | 'warning' | 'alarm' | 'launch' | 'turn' | 'success' | 'laser' | 'warp') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    // Generates frequency ramps using OscillatorNode and GainNode
  }
}
```

- **Features**:
  - Automatically handles user gesture activation required by mobile Safari.
  - Generates crisp retro sci-fi audio: square waves for clicks, dual-tone sine chords for confirmation, decaying saw-tooth sweeps for warp jumps, and harmonic tones for turn ticks.
  - Global mute/unmute state preserved in LocalStorage.

---

## 3. Persistence & State Recovery

The game supports a dual-tier persistence strategy ensuring data continuity across sessions:

### 1. Client LocalStorage Caching
- Key states automatically serialize to `localStorage` under namespaced keys:
  - `universe_civ_resources`: Resource amounts, turn count, and last tick timestamp.
  - `universe_civ_colonies`: Colony structures, building levels, and coordinates.
  - `universe_civ_technologies`: Unlocked tech nodes and active research timers.
  - `universe_civ_ships`: Fleet composition and drydock queues.
  - `ogame_sidebar_collapsed`: Sidebar rail mode preference.
  - `uc_audio_muted`: Sound toggle state.

### 2. Manual JSON State Management (`SaveStateManagerModal.tsx`)
- Allows commanders to export their entire game progression as a formatted JSON document.
- Provides a backup mechanism for transferring empire states across different browsers, mobile devices, and testing environments.
- Validation checks ensure save state integrity before applying changes.

### 3. Firebase Cloud Synchronization (`src/firebase.ts`)
- Configured with Firebase Authentication and Firestore documents.
- Stores multi-device user accounts, guild affiliations, inter-player battle logs, and global rankings.
