import React from 'react';
import { useStore } from '../store/useStore';
import { isTopicDueToday } from '../utils/spacedRepetition';
import { Calendar, BookOpen, GraduationCap, RotateCcw } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedSubjectId, topics, subjects, resetToInitialData } =
    useStore();

  const dueCount = topics.filter((t) => isTopicDueToday(t)).length;

  const handleTabChange = (tab: 'today' | 'subjects') => {
    setActiveTab(tab);
    if (tab === 'subjects') {
      setSelectedSubjectId(null);
    }
  };

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black text-slate-900 tracking-tight block">
                Repaso Espaciado
              </span>
              <span className="text-[10px] text-slate-500 font-medium block">
                Estudio Universitario Local
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetToInitialData}
              title="Restablecer datos de ejemplo"
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors text-xs flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Ejemplo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Mobile Tab Bar */}
      <nav
        aria-label="Navegación principal"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-4 py-2 safe-area-pb"
      >
        <div className="max-w-lg mx-auto flex items-center justify-around">
          {/* Tab 1: Repasos de Hoy */}
          <button
            type="button"
            onClick={() => handleTabChange('today')}
            className={`flex flex-col items-center gap-1 py-1 px-5 rounded-2xl transition-all relative ${
              activeTab === 'today'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <div className="relative">
              <Calendar className="w-6 h-6" />
              {dueCount > 0 && (
                <span className="absolute -top-1 -right-2.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                  {dueCount}
                </span>
              )}
            </div>
            <span className="text-[11px]">Repasos Hoy</span>
          </button>

          {/* Tab 2: Asignaturas */}
          <button
            type="button"
            onClick={() => handleTabChange('subjects')}
            className={`flex flex-col items-center gap-1 py-1 px-5 rounded-2xl transition-all ${
              activeTab === 'subjects'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <div className="relative">
              <BookOpen className="w-6 h-6" />
              <span className="absolute -top-1 -right-2.5 min-w-[18px] h-[18px] px-1 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-full flex items-center justify-center">
                {subjects.length}
              </span>
            </div>
            <span className="text-[11px]">Asignaturas</span>
          </button>
        </div>
      </nav>
    </>
  );
};
