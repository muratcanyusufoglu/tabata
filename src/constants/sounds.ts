import { SoundPack } from '../types';

export const soundPacks: SoundPack[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    isPremium: false,
    sounds: {
      workStart: require('../../assets/sounds/work_start.mp3'),
      restStart: require('../../assets/sounds/rest_start.wav'),
      countdown3: require('../../assets/sounds/countdown3.wav'),
      countdown2: require('../../assets/sounds/countdown2.wav'),
      countdown1: require('../../assets/sounds/countdown1.wav'),
      setComplete: require('../../assets/sounds/set_complete.mp3'),
      workoutComplete: require('../../assets/sounds/complete.mp3'),
    },
  },
  {
    id: 'energetic',
    name: 'Energetic',
    isPremium: false,
    sounds: {
      workStart: require('../../assets/sounds/work_start.mp3'),
      restStart: require('../../assets/sounds/rest_start.wav'),
      countdown3: require('../../assets/sounds/countdown3.wav'),
      countdown2: require('../../assets/sounds/countdown2.wav'),
      countdown1: require('../../assets/sounds/countdown1.wav'),
      setComplete: require('../../assets/sounds/set_complete.mp3'),
      workoutComplete: require('../../assets/sounds/complete.mp3'),
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
