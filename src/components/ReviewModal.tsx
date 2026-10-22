import React from 'react';
import { useStore } from '../store/useStore';
import { calculateNextReview, formatReviewDate } from '../utils/spacedRepetition';
import type { ReviewDifficulty } from '../types';
import { X, Sparkles, Flame, CheckCircle2, Zap } from 'lucide-react';

export const ReviewModal: React.FC = () => {
  const { reviewingTopicId, setReviewingTopicId, topics, subjects, reviewTopic } =
    useStore();

  if (!reviewingTopicId) return null;

  const topic = topics.find((t) => t.id === reviewingTopicId);
  if (!topic) return null;

  const subject = subjects.find((s) => s.id === topic.subjectId);

  // Pre-calcular los resultados para mostrárselos al usuario
  const hardResult = calculateNextReview(topic.interval, 'hard');
  const goodResult = calculateNextReview(topic.interval, 'good');
  const easyResult = calculateNextReview(topic.interval, 'easy');

  const handleSelectDifficulty = (difficulty: ReviewDifficulty) => {
    reviewTopic(topic.id, difficulty);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={() => setReviewingTopicId(null)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      <div
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col gap-5 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con botón de cerrar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full inline-block ring-2 ring-white shadow-sm"
              style={{ backgroundColor: subject?.color || '#3b82f6' }}
            />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {subject?.title || 'Asignatura'}
            </span>
          </div>
          <button
            onClick={() => setReviewingTopicId(null)}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Cerrar ventana de repaso"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Título del tema y estado actual */}
        <div>
          <div className="flex items-center gap-1.5 text-indigo-600 font-medium text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sesión de Repaso Espaciado</span>
          </div>
          <h2
            id="review-modal-title"
            className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug"
          >
            {topic.title}
          </h2>
          <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
            <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium text-slate-600">
              Intervalo actual: {topic.interval} {topic.interval === 1 ? 'día' : 'días'}
            </span>
          </div>
        </div>

        {/* Indicación */}
        <p className="text-sm text-slate-600 bg-indigo-50/70 border border-indigo-100/80 rounded-xl p-3.5 leading-relaxed">
          ¿Qué tan bien recuerdas este tema? Selecciona una dificultad para recalcular cuándo volver a repasarlo.
        </p>

        {/* Los 3 botones de acción rápida grandes para pantallas táctiles */}
        <div className="grid grid-cols-1 gap-3 pt-1">
          {/* Botón Difícil */}
          <button
            type="button"
            onClick={() => handleSelectDifficulty('hard')}
            className="group relative flex items-center justify-between w-full p-4 rounded-2xl bg-rose-50 hover:bg-rose-100/80 active:scale-[0.98] border-2 border-rose-200 transition-all text-left focus:outline-none focus:ring-4 focus:ring-rose-200"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-md shadow-rose-200 group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-base font-bold text-rose-900">
                  Difícil
                </span>
                <span className="text-xs text-rose-700">
                  No lo recordaba bien o costó mucho
                </span>
              </div>
            </div>
            <div className="text-right pl-2">
              <span className="block text-sm font-bold text-rose-800">
                {hardResult.interval} {hardResult.interval === 1 ? 'día' : 'días'}
              </span>
              <span className="text-[11px] text-rose-600">
                {formatReviewDate(hardResult.nextReviewDate)}
              </span>
            </div>
          </button>

          {/* Botón Bien */}
          <button
            type="button"
            onClick={() => handleSelectDifficulty('good')}
            className="group relative flex items-center justify-between w-full p-4 rounded-2xl bg-sky-50 hover:bg-sky-100/80 active:scale-[0.98] border-2 border-sky-200 transition-all text-left focus:outline-none focus:ring-4 focus:ring-sky-200"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold shadow-md shadow-sky-200 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-base font-bold text-sky-900">
                  Bien
                </span>
                <span className="text-xs text-sky-700">
                  Recordado con esfuerzo normal (x1.5)
                </span>
              </div>
            </div>
            <div className="text-right pl-2">
              <span className="block text-sm font-bold text-sky-800">
                {goodResult.interval} {goodResult.interval === 1 ? 'día' : 'días'}
              </span>
              <span className="text-[11px] text-sky-600">
                {formatReviewDate(goodResult.nextReviewDate)}
              </span>
            </div>
          </button>

          {/* Botón Fácil */}
          <button
            type="button"
            onClick={() => handleSelectDifficulty('easy')}
            className="group relative flex items-center justify-between w-full p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 active:scale-[0.98] border-2 border-emerald-200 transition-all text-left focus:outline-none focus:ring-4 focus:ring-emerald-200"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-base font-bold text-emerald-900">
                  Fácil
                </span>
                <span className="text-xs text-emerald-700">
                  Dominado perfectamente (x2.5)
                </span>
              </div>
            </div>
            <div className="text-right pl-2">
              <span className="block text-sm font-bold text-emerald-800">
                {easyResult.interval} {easyResult.interval === 1 ? 'día' : 'días'}
              </span>
              <span className="text-[11px] text-emerald-600">
                {formatReviewDate(easyResult.nextReviewDate)}
              </span>
            </div>
          </button>
        </div>

        {/* Botón secundario para cancelar */}
        <button
          type="button"
          onClick={() => setReviewingTopicId(null)}
          className="w-full py-3 text-center text-sm font-medium text-slate-500 hover:text-slate-700 active:bg-slate-100 rounded-xl transition-colors"
        >
          Repasar más tarde
        </button>
      </div>
    </div>
  );
};
