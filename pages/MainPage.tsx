
import React from 'react';
import { GRADES_CONFIG, APP_TITLE, DEFAULT_AVATAR } from '../constants';
import { GradeData } from '../types'; // GradeData still used for GradeButton prop type
import { Icons } from '../components/icons';
import { IconName } from '../types'; 

interface MainPageProps {
  onNavigateToGrade: (gradeId: number) => void;
  onNavigateToAvatar: () => void;
}

const AvatarDisplay: React.FC<{ avatar: { iconName: IconName, color: string }, onClick: () => void }> = ({ avatar, onClick }) => {
  const AvatarIconComponent = Icons[avatar.iconName as keyof typeof Icons]; 
  return (
    <button onClick={onClick} className={`p-2 rounded-full hover:bg-slate-200 transition-colors ${avatar.color}`}>
      <AvatarIconComponent className="w-10 h-10" />
    </button>
  );
};

// GradeButton expects a structure that includes themeColor, id, and name.
// GRADES_CONFIG provides Omit<GradeData, 'subjects'> which fits this.
const GradeButton: React.FC<{ grade: Omit<GradeData, 'subjects'>; onClick: () => void }> = ({ grade, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full md:w-5/12 lg:w-1/4 p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out text-white font-bold text-2xl flex flex-col items-center justify-center ${grade.themeColor}`}
  >
    <span className="text-4xl mb-2">{grade.id}</span>
    <span>{grade.name}</span>
  </button>
);

export const MainPage: React.FC<MainPageProps> = ({ onNavigateToGrade, onNavigateToAvatar }) => {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-slate-50">
      <header className="w-full flex justify-between items-center p-4 mb-8">
        <div className="w-10 h-10"> {/* Placeholder for logo or empty space */} </div>
        <h1 className="text-5xl font-extrabold text-sky-600 tracking-tight">{APP_TITLE}</h1>
        <AvatarDisplay avatar={DEFAULT_AVATAR} onClick={onNavigateToAvatar} />
      </header>

      <main className="flex flex-wrap justify-center items-center gap-6 md:gap-8 flex-grow">
        {GRADES_CONFIG.map((grade) => (
          <GradeButton key={grade.id} grade={grade} onClick={() => onNavigateToGrade(grade.id)} />
        ))}
      </main>
      <footer className="py-4 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} Matechicos. Todos los derechos reservados.
      </footer>
    </div>
  );
};
