import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { isTopicDueToday } from '../../utils/spacedRepetition';
import {
  Plus,
  BookOpen,
  Trash2,
  ChevronRight,
  Layers,
  X,
  Palette,
} from 'lucide-react';

const PRESET_COLORS = [
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Esmeralda', value: '#10b981' },
  { name: 'Violeta', value: '#8b5cf6' },
  { name: 'Ámbar', value: '#f59e0b' },
  { name: 'Rosa', value: '#f43f5e' },
  { name: 'Cian', value: '#06b6d4' },
  { name: 'Índigo', value: '#6366f1' },
  { name: 'Naranja', value: '#f97316' },
];

export const SubjectsListView: React.FC = () => {
  const { subjects, topics, addSubject, deleteSubject, setSelectedSubjectId } =
    useStore();

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0].value);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addSubject(newTitle.trim(), selectedColor);
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col gap-5 pb-24 animate-in fade-in duration-300">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Asignaturas
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organiza tus materias y gestiona los temas de estudio
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-1.5 px-4 h-11 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all focus:outline-none focus:ring-4 focus:ring-indigo-100"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva</span>
        </button>
      </div>

      {/* Formulario / Modal para Añadir Asignatura */}
      {isAdding && (
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-5 shadow-lg flex flex-col gap-4 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Nueva Asignatura
            </span>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              aria-label="Cerrar formulario"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleCreateSubject} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="subject-title-input"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Nombre de la Asignatura *
              </label>
              <input
                id="subject-title-input"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ej. Álgebra Lineal, Fisiología, etc."
                required
                autoFocus
                className="w-full h-12 px-4 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 text-base text-slate-900 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-slate-500" />
                Color identificativo
              </label>
              <div className="flex flex-wrap gap-2.5">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setSelectedColor(c.value)}
                    className={`w-9 h-9 rounded-xl transition-all flex items-center justify-center ${
                      selectedColor === c.value
                        ? 'ring-4 ring-offset-2 ring-indigo-500 scale-110 shadow-sm'
                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                    aria-label={`Seleccionar color ${c.name}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-semibold text-sm transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white font-semibold text-sm shadow-md shadow-indigo-200 transition-all"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Asignaturas */}
      {subjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {subjects.map((subject) => {
            const subjectTopics = topics.filter((t) => t.subjectId === subject.id);
            const dueCount = subjectTopics.filter((t) => isTopicDueToday(t)).length;

            return (
              <div
                key={subject.id}
                className="group bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  {/* Tocar para entrar a SubjectDetailView */}
                  <button
                    type="button"
                    onClick={() => setSelectedSubjectId(subject.id)}
                    className="flex-1 flex items-center gap-3 text-left focus:outline-none"
                  >
                    <div
                      className="w-4 h-12 rounded-xl shrink-0"
                      style={{ backgroundColor: subject.color || '#3b82f6' }}
                    />
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {subject.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span>
                          {subjectTopics.length}{' '}
                          {subjectTopics.length === 1 ? 'tema' : 'temas'}
                        </span>
                        {dueCount > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            {dueCount} para hoy
                          </span>
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Acciones */}
                  <div className="flex items-center gap-1 shrink-0 pl-2">
                    {deleteConfirmId === subject.id ? (
                      <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={() => deleteSubject(subject.id)}
                          className="px-2.5 py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg shadow-sm active:scale-95"
                          aria-label="Confirmar eliminar asignatura"
                        >
                          Borrar
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1.5 text-slate-500 text-xs font-medium hover:text-slate-800"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(subject.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                        aria-label={`Eliminar asignatura ${subject.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedSubjectId(subject.id)}
                      className="p-2 text-slate-400 group-hover:text-indigo-600 rounded-xl group-hover:bg-indigo-50 transition-colors"
                      aria-label={`Ver temas de ${subject.title}`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 text-center flex flex-col items-center gap-3 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BookOpen className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            No tienes asignaturas creadas
          </h2>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
            Crea tu primera asignatura para empezar a estructurar tus temas de estudio universitario.
          </p>
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="mt-2 inline-flex items-center gap-2 px-5 h-12 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-200 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Primera Asignatura</span>
          </button>
        </div>
      )}
    </div>
  );
};
