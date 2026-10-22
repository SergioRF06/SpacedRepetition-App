import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import {
  isTopicDueToday,
  formatReviewDate,
  getRelativeDueDateText,
} from '../../utils/spacedRepetition';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  Flame,
} from 'lucide-react';

interface SubjectDetailViewProps {
  subjectId: string;
}

export const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({ subjectId }) => {
  const {
    subjects,
    topics,
    addTopic,
    deleteTopic,
    setSelectedSubjectId,
    setReviewingTopicId,
  } = useStore();

  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const subject = subjects.find((s) => s.id === subjectId);
  const subjectTopics = topics.filter((t) => t.subjectId === subjectId);

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim()) return;

    addTopic({
      subjectId,
      title: newTopicTitle.trim(),
      interval: 1,
      nextReviewDate: new Date().toISOString(),
    });

    setNewTopicTitle('');
  };

  if (!subject) {
    return (
      <div className="p-8 text-center flex flex-col items-center gap-3">
        <p className="text-sm text-slate-500">Asignatura no encontrada</p>
        <button
          onClick={() => setSelectedSubjectId(null)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
        >
          Volver a la lista
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-24 animate-in fade-in duration-300">
      {/* Botón Volver y Cabecera de la Asignatura */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setSelectedSubjectId(null)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 active:scale-95 transition-all w-fit py-1 pr-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Asignaturas</span>
        </button>

        <div className="flex items-center gap-3">
          <div
            className="w-4 h-12 rounded-xl shrink-0 shadow-sm"
            style={{ backgroundColor: subject.color || '#3b82f6' }}
          />
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
              {subject.title}
            </h1>
            <p className="text-xs text-slate-500">
              {subjectTopics.length}{' '}
              {subjectTopics.length === 1 ? 'tema registrado' : 'temas registrados'}
            </p>
          </div>
        </div>
      </div>

      {/* Formulario sencillo para añadir nuevo tema */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
        <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-indigo-600" />
          Añadir Nuevo Tema
        </h2>

        <form onSubmit={handleCreateTopic} className="flex flex-col sm:flex-row gap-2.5">
          <div className="flex-1">
            <input
              type="text"
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              placeholder="Ej. Teorema de Stokes, Herencia en C++..."
              required
              className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 text-base text-slate-900 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            disabled={!newTopicTitle.trim()}
            className="h-12 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Tema</span>
          </button>
        </form>
      </div>

      {/* Lista de Temas de la Asignatura */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          Temas de esta Asignatura ({subjectTopics.length})
        </h2>

        {subjectTopics.length > 0 ? (
          <div className="grid grid-cols-1 gap-2.5">
            {subjectTopics.map((topic) => {
              const isDue = isTopicDueToday(topic);
              const dueInfo = getRelativeDueDateText(topic.nextReviewDate);

              return (
                <div
                  key={topic.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow transition-all flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {isDue ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            <Flame className="w-3 h-3 text-amber-600" />
                            Repaso pendiente ({dueInfo.text})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            Próximo: {dueInfo.text} ({formatReviewDate(topic.nextReviewDate)})
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {topic.title}
                      </h3>

                      <p className="text-xs text-slate-500 mt-1">
                        Intervalo actual: <span className="font-semibold text-slate-700">{topic.interval} {topic.interval === 1 ? 'día' : 'días'}</span>
                      </p>
                    </div>

                    {/* Acciones del tema */}
                    <div className="flex items-center gap-1 shrink-0">
                      {deleteConfirmId === topic.id ? (
                        <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={() => deleteTopic(topic.id)}
                            className="px-2.5 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg shadow-sm active:scale-95"
                          >
                            Borrar
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1.5 text-slate-500 text-xs font-medium"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(topic.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                          aria-label={`Eliminar tema ${topic.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Botón de repaso directo */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Fecha: {formatReviewDate(topic.nextReviewDate)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setReviewingTopicId(topic.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                        isDue
                          ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isDue ? 'Repasar Ahora' : 'Adelantar Repaso'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 text-center flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              Esta asignatura aún no tiene temas
            </p>
            <p className="text-xs text-slate-500 max-w-xs">
              Usa el formulario de arriba para añadir temas y empezar el ciclo de repetición espaciada.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
