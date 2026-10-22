import React, { useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { isTopicDueToday, getRelativeDueDateText } from '../../utils/spacedRepetition';
import {
  Sparkles,
  CalendarCheck2,
  ChevronRight,
  BookOpen,
  PlusCircle,
  Clock,
  RotateCcw,
} from 'lucide-react';

function getTodayFormattedString(): string {
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  }).format(new Date());
}

export const TodayReviewView: React.FC = () => {
  const {
    topics,
    subjects,
    setReviewingTopicId,
    setActiveTab,
    resetToInitialData,
  } = useStore();

  const [formattedToday] = useState<string>(() => getTodayFormattedString());

  // Filtrar temas pendientes para hoy (o fechas anteriores)
  const dueTopics = useMemo(() => {
    return topics.filter((topic) => isTopicDueToday(topic));
  }, [topics]);

  // Mapa de asignaturas para acceso rápido por id
  const subjectsMap = useMemo(() => {
    const map = new Map<string, { title: string; color: string }>();
    subjects.forEach((sub) => {
      map.set(sub.id, {
        title: sub.title,
        color: sub.color || '#3b82f6',
      });
    });
    return map;
  }, [subjects]);

  return (
    <div className="flex flex-col gap-5 pb-24 animate-in fade-in duration-300">
      {/* Banner de Bienvenida y Resumen */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute -right-6 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
              <Clock className="w-3.5 h-3.5" />
              Repasos Pendientes
            </span>
            <span className="text-xs text-indigo-100 font-medium">
              {formattedToday}
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight mt-1">
            {dueTopics.length > 0
              ? `Tienes ${dueTopics.length} ${
                  dueTopics.length === 1 ? 'tema para repasar' : 'temas para repasar'
                }`
              : '¡Estás totalmente al día!'}
          </h1>

          <p className="text-xs text-indigo-100/90 leading-relaxed max-w-sm">
            {dueTopics.length > 0
              ? 'Toca un tema para evaluar tu nivel de retención y programar el próximo repaso con repetición espaciada.'
              : 'Has completado todas las tarjetas programadas para el día de hoy.'}
          </p>
        </div>
      </div>

      {/* Lista de Temas Pendientes */}
      {dueTopics.length > 0 ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Para Repasar Hoy ({dueTopics.length})
            </h2>
            <span className="text-xs text-slate-500">
              Toca para calificar
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {dueTopics.map((topic) => {
              const subject = subjectsMap.get(topic.subjectId);
              const dueInfo = getRelativeDueDateText(topic.nextReviewDate);

              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => setReviewingTopicId(topic.id)}
                  className="group w-full text-left bg-white hover:bg-slate-50/80 active:scale-[0.99] border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow transition-all flex items-center justify-between gap-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label={`Repasar tema: ${topic.title}`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Indicador de color de asignatura */}
                    <div
                      className="w-2.5 h-10 rounded-full shrink-0 mt-0.5"
                      style={{ backgroundColor: subject?.color || '#3b82f6' }}
                    />

                    <div className="flex-1 min-w-0">
                      {/* Asignatura y etiqueta de vencimiento */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-500 truncate max-w-[160px]">
                          {subject?.title || 'Sin Asignatura'}
                        </span>
                        {dueInfo.isOverdue && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">
                            {dueInfo.text}
                          </span>
                        )}
                      </div>

                      {/* Título del tema */}
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {topic.title}
                      </h3>

                      {/* Intervalo */}
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Intervalo actual: {topic.interval} {topic.interval === 1 ? 'día' : 'días'}
                      </p>
                    </div>
                  </div>

                  {/* Botón o flecha de acción */}
                  <div className="shrink-0 flex items-center gap-1 text-indigo-600 group-hover:translate-x-0.5 transition-transform bg-indigo-50 group-hover:bg-indigo-100 px-3 py-2 rounded-xl text-xs font-bold">
                    <span>Repasar</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty State cuando no hay repasos */
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 text-center flex flex-col items-center gap-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
            <CalendarCheck2 className="w-8 h-8" />
          </div>

          <div className="max-w-xs">
            <h2 className="text-lg font-bold text-slate-900">
              ¡Genial! Nada pendiente por repasar
            </h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Has revisado todos los conceptos correspondientes a hoy. El algoritmo programará los nuevos repasos automáticamente.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('subjects')}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-colors active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Ver Asignaturas</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('subjects')}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-sm transition-colors active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Añadir Nuevo Tema</span>
            </button>
          </div>

          {topics.length === 0 && (
            <div className="pt-4 border-t border-slate-100 w-full">
              <button
                type="button"
                onClick={resetToInitialData}
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:underline font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Cargar temas y asignaturas de ejemplo
              </button>
            </div>
          )}
        </div>
      )}

      {/* Resumen de Repetición Espaciada info card */}
      <div className="bg-slate-100/80 border border-slate-200/60 rounded-2xl p-4 text-xs text-slate-600 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-800">
            ¿Cómo funciona el repaso espaciado?
          </p>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Al evaluar cada tema, el intervalo aumenta progresivamente según tu facilidad para recordarlo (x1.5 o x2.5). Si te resulta difícil, volverá a 1 día para reforzar tu memoria antes de que se desvanezca.
          </p>
        </div>
      </div>
    </div>
  );
};
