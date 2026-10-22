import React from 'react';
import { useStore } from './store/useStore';
import { Navbar } from './components/Navbar';
import { TodayReviewView } from './components/views/TodayReviewView';
import { SubjectsListView } from './components/views/SubjectsListView';
import { SubjectDetailView } from './components/views/SubjectDetailView';
import { ReviewModal } from './components/ReviewModal';

export const App: React.FC = () => {
  const { activeTab, selectedSubjectId } = useStore();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Contenedor mobile-first centrado */}
      <div className="w-full max-w-lg mx-auto min-h-screen bg-slate-50 flex flex-col shadow-xl sm:border-x sm:border-slate-200">
        <Navbar />

        <main className="flex-1 p-4 pt-5">
          {activeTab === 'today' && <TodayReviewView />}

          {activeTab === 'subjects' && (
            <>
              {selectedSubjectId ? (
                <SubjectDetailView subjectId={selectedSubjectId} />
              ) : (
                <SubjectsListView />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modal global de repaso */}
      <ReviewModal />
    </div>
  );
};

export default App;
