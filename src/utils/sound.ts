// utils/sound.ts

// Sound configuration
interface SoundConfig {
  url: string;
  volume?: number;
  fallbackToBeep?: boolean;
}

// Default sound URLs
const SOUND_URLS = {
  notification: 'https://www.tapicker.com/sounds/notification.mp3',
  success: 'https://www.tapicker.com/sounds/success.mp3',
  error: 'https://www.tapicker.com/sounds/error.mp3',
  alert: 'https://www.tapicker.com/sounds/alert.mp3',
} as const;

/**
 * Play a notification sound using an audio URL
 * @param {string} url - The URL of the audio file
 * @param {number} volume - Volume level (0.0 to 1.0)
 */
export const playSound = async (url: string, volume: number = 0.5): Promise<void> => {
  try {
    const audio = new Audio(url);
    audio.volume = Math.max(0, Math.min(1, volume)); // Clamp volume between 0 and 1
    
    // Preload the audio to reduce delay
    await audio.load();
    
    // Play the audio
    await audio.play();
  } catch (error) {
    console.error('Failed to play sound:', error);
    // Fallback to beep if sound fails
    playBeep();
  }
};

/**
 * Play a notification sound with default settings
 */
export const playNotificationSound = (): void => {
  playSound(SOUND_URLS.notification, 0.5);
};

/**
 * Play a success sound
 */
export const playSuccessSound = (): void => {
  playSound(SOUND_URLS.success, 0.6);
};

/**
 * Play an error sound
 */
export const playErrorSound = (): void => {
  playSound(SOUND_URLS.error, 0.4);
};

/**
 * Play a simple beep using Web Audio API (fallback)
 * @param {number} frequency - Frequency in Hz (default: 800)
 * @param {number} duration - Duration in seconds (default: 0.3)
 * @param {number} volume - Volume (default: 0.3)
 */
export const playBeep = (
  frequency: number = 800,
  duration: number = 0.3,
  volume: number = 0.3
): void => {
  try {
    // Create audio context
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContext();
    
    // Resume context if suspended (needed for autoplay policies)
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    // Create oscillator and gain node
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure oscillator
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    // Configure gain (volume envelope)
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    // Start and stop
    oscillator.start(now);
    oscillator.stop(now + duration);
  } catch (error) {
    console.error('Failed to play beep:', error);
  }
};

/**
 * Play a double beep (two quick beeps)
 */
export const playDoubleBeep = (): void => {
  playBeep(800, 0.15, 0.3);
  setTimeout(() => playBeep(1000, 0.15, 0.3), 200);
};

/**
 * Sound manager class for better control
 */
export class SoundManager {
  private isEnabled: boolean = true;
  private currentAudio: HTMLAudioElement | null = null;

  /**
   * Enable or disable all sounds
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled && this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
  }

  /**
   * Check if sounds are enabled
   */
  isSoundEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Play a sound with the current settings
   */
  async play(url: string, volume: number = 0.5): Promise<void> {
    if (!this.isEnabled) return;

    try {
      // Stop any currently playing sound
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      const audio = new Audio(url);
      audio.volume = Math.max(0, Math.min(1, volume));
      this.currentAudio = audio;
      
      await audio.play();
    } catch (error) {
      console.error('Failed to play sound:', error);
      // Fallback to beep
      playBeep();
    }
  }

  /**
   * Stop any currently playing sound
   */
  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
  }
}

// Create a singleton instance
export const soundManager = new SoundManager();

// Default export
export default {
  playSound,
  playNotificationSound,
  playSuccessSound,
  playErrorSound,
  playBeep,
  playDoubleBeep,
  soundManager,
};