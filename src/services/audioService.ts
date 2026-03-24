import { Audio } from 'expo-av';
import { SoundPack } from '../types';
import { handleError } from '../utils/errorHandler';

const soundCache = new Map<string, Audio.Sound>();
let isConfigured = false;

export async function configureAudioSession(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: 1, // MIX_WITH_OTHERS — CRITICAL: don't interrupt music
      interruptionModeAndroid: 2, // DUCK_OTHERS
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    isConfigured = true;
  } catch (e) {
    handleError('audio_session_fail', e);
  }
}

export async function preloadSoundPack(pack: SoundPack): Promise<void> {
  // Unload previous
  for (const sound of soundCache.values()) {
    try { await sound.unloadAsync(); } catch {}
  }
  soundCache.clear();

  // Load new pack sounds that have valid asset refs
  const entries = Object.entries(pack.sounds) as [string, any][];
  await Promise.all(
    entries.map(async ([key, asset]) => {
      if (!asset) return; // placeholder — no file yet
      try {
        const { sound } = await Audio.Sound.createAsync(asset);
        soundCache.set(key, sound);
      } catch (e) {
        handleError('audio_preload_fail', e);
      }
    })
  );
}

export async function play(key: string, volume = 0.8): Promise<void> {
  const sound = soundCache.get(key);
  if (!sound) return;
  try {
    await sound.setVolumeAsync(volume);
    await sound.setPositionAsync(0);
    await sound.playAsync();
  } catch (e) {
    handleError('audio_play_fail', e);
  }
}

export async function playCountdown(count: number, volume = 0.8): Promise<void> {
  const key = `countdown${count}`;
  await play(key, volume);
}

export async function playPhaseTransition(phase: string, volume = 0.8): Promise<void> {
  switch (phase) {
    case 'work':
      await play('workStart', volume);
      break;
    case 'rest':
    case 'cooldown':
      await play('restStart', volume);
      break;
    case 'restBetweenSets':
      await play('setComplete', volume);
      break;
    case 'completed':
      await play('workoutComplete', volume);
      break;
  }
}

export async function unloadAll(): Promise<void> {
  for (const sound of soundCache.values()) {
    try { await sound.unloadAsync(); } catch {}
  }
  soundCache.clear();
}
