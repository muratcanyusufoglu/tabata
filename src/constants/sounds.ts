import { SoundPack } from '../types';

// Sound assets - placeholder requires for now
// Real .wav files need to be placed in assets/sounds/
export const soundPacks: SoundPack[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    isPremium: false,
    sounds: {
      workStart: null,
      restStart: null,
      countdown3: null,
      countdown2: null,
      countdown1: null,
      setComplete: null,
      workoutComplete: null,
    },
  },
  {
    id: 'energetic',
    name: 'Energetic',
    isPremium: false,
    sounds: {
      workStart: null,
      restStart: null,
      countdown3: null,
      countdown2: null,
      countdown1: null,
      setComplete: null,
      workoutComplete: null,
    },
  },
  {
    id: 'bell',
    name: 'Boxing Bell',
    isPremium: true,
    sounds: {
      workStart: null,
      restStart: null,
      countdown3: null,
      countdown2: null,
      countdown1: null,
      setComplete: null,
      workoutComplete: null,
    },
  },
  {
    id: 'whistle',
    name: 'Whistle',
    isPremium: true,
    sounds: {
      workStart: null,
      restStart: null,
      countdown3: null,
      countdown2: null,
      countdown1: null,
      setComplete: null,
      workoutComplete: null,
    },
  },
  {
    id: 'digital',
    name: 'Digital',
    isPremium: true,
    sounds: {
      workStart: null,
      restStart: null,
      countdown3: null,
      countdown2: null,
      countdown1: null,
      setComplete: null,
      workoutComplete: null,
    },
  },
  {
    id: 'zen',
    name: 'Zen',
    isPremium: true,
    sounds: {
      workStart: null,
      restStart: null,
      countdown3: null,
      countdown2: null,
      countdown1: null,
      setComplete: null,
      workoutComplete: null,
    },
  },
];

export const getSoundPackById = (id: string): SoundPack => {
  return soundPacks.find(p => p.id === id) ?? soundPacks[0];
};
