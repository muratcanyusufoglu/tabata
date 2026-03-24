import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TimerTemplate } from '../types';
import { PRESET_TEMPLATES } from '../constants/presets';

interface TemplateState {
  templates: TimerTemplate[];
  isSeeded: boolean;

  seedPresets: () => void;
  addTemplate: (template: TimerTemplate) => void;
  updateTemplate: (id: string, updates: Partial<TimerTemplate>) => void;
  deleteTemplate: (id: string) => void;
  duplicateTemplate: (id: string) => TimerTemplate | null;
  toggleFavorite: (id: string) => void;
  incrementUsage: (id: string) => void;
  reorderTemplates: (templates: TimerTemplate[]) => void;
  getCustomTemplates: () => TimerTemplate[];
  getPresetTemplates: () => TimerTemplate[];
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      templates: [],
      isSeeded: false,

      seedPresets: () => {
        const state = get();
        if (state.isSeeded) return;
        set({
          templates: [...PRESET_TEMPLATES, ...state.templates.filter(t => t.type === 'custom')],
          isSeeded: true,
        });
      },

      addTemplate: (template: TimerTemplate) => {
        set(state => ({ templates: [...state.templates, template] }));
      },

      updateTemplate: (id: string, updates: Partial<TimerTemplate>) => {
        set(state => ({
          templates: state.templates.map(t =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        }));
      },

      deleteTemplate: (id: string) => {
        set(state => ({
          templates: state.templates.filter(t => t.id !== id || t.type === 'preset'),
        }));
      },

      duplicateTemplate: (id: string) => {
        const state = get();
        const original = state.templates.find(t => t.id === id);
        if (!original) return null;

        const { generateUUID } = require('../utils/uuid');
        const now = new Date().toISOString();
        const duplicate: TimerTemplate = {
          ...original,
          id: generateUUID(),
          name: `Copy of ${original.name}`,
          type: 'custom',
          createdAt: now,
          updatedAt: now,
          isFavorite: false,
          usageCount: 0,
          lastUsedAt: null,
        };

        set(state => ({ templates: [...state.templates, duplicate] }));
        return duplicate;
      },

      toggleFavorite: (id: string) => {
        set(state => ({
          templates: state.templates.map(t =>
            t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
          ),
        }));
      },

      incrementUsage: (id: string) => {
        set(state => ({
          templates: state.templates.map(t =>
            t.id === id
              ? { ...t, usageCount: t.usageCount + 1, lastUsedAt: new Date().toISOString() }
              : t
          ),
        }));
      },

      reorderTemplates: (templates: TimerTemplate[]) => {
        set({ templates });
      },

      getCustomTemplates: () => {
        return get().templates.filter(t => t.type === 'custom');
      },

      getPresetTemplates: () => {
        return get().templates.filter(t => t.type === 'preset');
      },
    }),
    {
      name: 'fittimer-templates',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
