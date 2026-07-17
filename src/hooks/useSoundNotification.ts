// hooks/useSoundNotification.ts
import { useCallback, useEffect, useRef, useState } from 'react';

// Sound configuration types
interface SoundConfig {
  url: string;
  volume?: number;
  autoPlay?: boolean;
}

// Default sound URLs
const DEFAULT_SOUNDS = {
  notification: 'https://www.tapicker.com/sounds/notification.mp3',
  success: 'https://www.tapicker.com/sounds/notification.mp3',
  error: 'https://www.tapicker.com/sounds/notification.mp3',
  ticket: 'https://www.tapicker.com/sounds/notification.mp3',
} as const;

type SoundType = keyof typeof DEFAULT_SOUNDS;

interface UseSoundNotificationOptions {
  enabled?: boolean;
  volume?: number;
  fallbackToBeep?: boolean;
  customSounds?: Partial<Record<SoundType, string>>;
}

export const useSoundNotification = (options: UseSoundNotificationOptions = {}) => {
  const {
    enabled = true,
    volume = 0.5,
    fallbackToBeep = true,
    customSounds = {},
  } = options;

  const [isEnabled, setIsEnabled] = useState(enabled);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Get sound URL with custom override
  const getSoundUrl = useCallback(
    (type: SoundType): string => {
      return customSounds[type] || DEFAULT_SOUNDS[type];
    },
    [customSounds]
  );

  // Play beep as fallback
  const playBeep = useCallback(
    (frequency: number = 800, duration: number = 0.3, beepVolume: number = 0.3) => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        }

        const context = audioContextRef.current;
        if (context.state === 'suspended') {
          context.resume();
        }

        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;

        const now = context.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(beepVolume, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

        oscillator.start(now);
        oscillator.stop(now + duration);
      } catch (error) {
        console.error('Failed to play beep:', error);
      }
    },
    []
  );

  // Main play sound function
  const playSound = useCallback(
    async (type: SoundType = 'notification', customVolume?: number): Promise<void> => {
      if (!isEnabled) return;

      const soundVolume = customVolume !== undefined ? customVolume : volume;
      const url = getSoundUrl(type);

      try {
        setIsPlaying(true);

        // Create new audio instance
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }

        const audio = new Audio(url);
        audio.volume = Math.max(0, Math.min(1, soundVolume));
        audioRef.current = audio;

        // Preload and play
        await audio.load();
        await audio.play();
      } catch (error) {
        console.error(`Failed to play ${type} sound:`, error);
        if (fallbackToBeep) {
          playBeep();
        }
      } finally {
        setIsPlaying(false);
      }
    },
    [isEnabled, volume, getSoundUrl, fallbackToBeep, playBeep]
  );

  // Play specific sound types
  const playNotification = useCallback(
    (customVolume?: number) => playSound('notification', customVolume),
    [playSound]
  );

  const playSuccess = useCallback(
    (customVolume?: number) => playSound('success', customVolume),
    [playSound]
  );

  const playError = useCallback(
    (customVolume?: number) => playSound('error', customVolume),
    [playSound]
  );

  const playTicketCreated = useCallback(
    (customVolume?: number) => playSound('ticket', customVolume),
    [playSound]
  );

  // Play custom sound with URL
  const playCustomSound = useCallback(
    async (url: string, customVolume?: number): Promise<void> => {
      if (!isEnabled) return;

      const soundVolume = customVolume !== undefined ? customVolume : volume;

      try {
        setIsPlaying(true);

        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }

        const audio = new Audio(url);
        audio.volume = Math.max(0, Math.min(1, soundVolume));
        audioRef.current = audio;

        await audio.load();
        await audio.play();
      } catch (error) {
        console.error('Failed to play custom sound:', error);
        if (fallbackToBeep) {
          playBeep();
        }
      } finally {
        setIsPlaying(false);
      }
    },
    [isEnabled, volume, fallbackToBeep, playBeep]
  );

  // Stop current sound
  const stopSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsPlaying(false);
    }
  }, []);

  // Toggle sound on/off
  const toggleSound = useCallback(() => {
    setIsEnabled((prev) => {
      const newState = !prev;
      if (!newState) {
        stopSound();
      }
      return newState;
    });
  }, [stopSound]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  return {
    // Play functions
    playSound,
    playNotification,
    playSuccess,
    playError,
    playTicketCreated,
    playCustomSound,
    playBeep,
    stopSound,

    // Controls
    toggleSound,
    setEnabled: setIsEnabled,

    // State
    isEnabled,
    isPlaying,

    // Utility
    getSoundUrl,
  };
};

export default useSoundNotification;