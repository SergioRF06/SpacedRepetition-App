import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Subject, Topic, ReviewDifficulty } from '../types';
import { calculateNextReview } from '../utils/spacedRepetition';

interface SpacedRepetitionState {
  subjects: Subject[];
  topics: Topic[];
  activeTab: 'today' | 'subjects';
  selectedSubjectId: string | null;
  reviewingTopicId: string | null;

  // Acciones de Asignaturas
  addSubject: (title: string, color?: string) => Subject;
  updateSubject: (id: string, updates: Partial<Omit<Subject, 'id'>>) => void;
  deleteSubject: (id: string) => void;

  // Acciones de Temas
  addTopic: (data: {
    subjectId: string;
    title: string;
    interval?: number;
    nextReviewDate?: string;
  }) => Topic;
  updateTopic: (id: string, updates: Partial<Omit<Topic, 'id'>>) => void;
  deleteTopic: (id: string) => void;

  // Acción de Repaso
  reviewTopic: (id: string, difficulty: ReviewDifficulty) => void;

  // Navegación UI
  setActiveTab: (tab: 'today' | 'subjects') => void;
  setSelectedSubjectId: (id: string | null) => void;
  setReviewingTopicId: (id: string | null) => void;

  // Utilidades
  resetToInitialData: () => void;
  clearAllData: () => void;
}

const DEFAULT_SUBJECTS: Subject[] = [
  { id: 'sub-calculo', title: 'Cálculo II', color: '#3b82f6' }, // blue-500
  { id: 'sub-ed', title: 'Estructuras de Datos', color: '#10b981' }, // emerald-500
  { id: 'sub-so', title: 'Sistemas Operativos', color: '#8b5cf6' }, // violet-500
];

const nowIso = new Date().toISOString();

const DEFAULT_TOPICS: Topic[] = [
  {
    id: 'top-1',
    subjectId: 'sub-calculo',
    title: 'Integrales Impropias y Convergencia',
    interval: 1,
    nextReviewDate: nowIso,
  },
  {
    id: 'top-2',
    subjectId: 'sub-ed',
    title: 'Árboles AVL y Factor de Balance',
    interval: 2,
    nextReviewDate: nowIso,
  },
  {
    id: 'top-3',
    subjectId: 'sub-ed',
    title: 'Tablas Hash y Resolución de Colisiones',
    interval: 1,
    nextReviewDate: nowIso,
  },
  {
    id: 'top-4',
    subjectId: 'sub-so',
    title: 'Algoritmos de Planificación de CPU',
    interval: 3,
    nextReviewDate: nowIso,
  },
];

const getSafeStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  const memoryStorage = new Map<string, string>();
  return {
    getItem: (key: string) => memoryStorage.get(key) ?? null,
    setItem: (key: string, value: string) => memoryStorage.set(key, value),
    removeItem: (key: string) => {
      memoryStorage.delete(key);
    },
    clear: () => memoryStorage.clear(),
    key: (index: number) => Array.from(memoryStorage.keys())[index] ?? null,
    length: memoryStorage.size,
  };
};

export const useStore = create<SpacedRepetitionState>()(
  persist(
    (set, get) => ({
      subjects: DEFAULT_SUBJECTS,
      topics: DEFAULT_TOPICS,
      activeTab: 'today',
      selectedSubjectId: null,
      reviewingTopicId: null,

      addSubject: (title, color = '#3b82f6') => {
        const newSubject: Subject = {
          id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          title: title.trim(),
          color,
        };
        set((state) => ({ subjects: [...state.subjects, newSubject] }));
        return newSubject;
      },

      updateSubject: (id, updates) => {
        set((state) => ({
          subjects: state.subjects.map((sub) =>
            sub.id === id ? { ...sub, ...updates } : sub
          ),
        }));
      },

      deleteSubject: (id) => {
        set((state) => ({
          subjects: state.subjects.filter((sub) => sub.id !== id),
          // Eliminar en cascada los temas asociados
          topics: state.topics.filter((topic) => topic.subjectId !== id),
          selectedSubjectId:
            state.selectedSubjectId === id ? null : state.selectedSubjectId,
        }));
      },

      addTopic: ({ subjectId, title, interval = 1, nextReviewDate }) => {
        const newTopic: Topic = {
          id: `top-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          subjectId,
          title: title.trim(),
          interval,
          nextReviewDate: nextReviewDate || new Date().toISOString(),
        };
        set((state) => ({ topics: [...state.topics, newTopic] }));
        return newTopic;
      },

      updateTopic: (id, updates) => {
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      deleteTopic: (id) => {
        set((state) => ({
          topics: state.topics.filter((t) => t.id !== id),
          reviewingTopicId:
            state.reviewingTopicId === id ? null : state.reviewingTopicId,
        }));
      },

      reviewTopic: (id, difficulty) => {
        const topic = get().topics.find((t) => t.id === id);
        if (!topic) return;

        const { interval: newInterval, nextReviewDate } = calculateNextReview(
          topic.interval,
          difficulty
        );

        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === id
              ? { ...t, interval: newInterval, nextReviewDate }
              : t
          ),
          reviewingTopicId: null, // Cerrar el modal de repaso
        }));
      },

      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedSubjectId: (id) => set({ selectedSubjectId: id }),
      setReviewingTopicId: (id) => set({ reviewingTopicId: id }),

      resetToInitialData: () =>
        set({
          subjects: DEFAULT_SUBJECTS,
          topics: DEFAULT_TOPICS,
          selectedSubjectId: null,
          reviewingTopicId: null,
        }),

      clearAllData: () =>
        set({
          subjects: [],
          topics: [],
          selectedSubjectId: null,
          reviewingTopicId: null,
        }),
    }),
    {
      name: 'spaced-repetition-storage',
      storage: createJSONStorage(() => getSafeStorage()),
      partialize: (state) => ({
        subjects: state.subjects,
        topics: state.topics,
      }),
    }
  )
);
