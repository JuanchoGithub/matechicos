
import React from 'react';
import { BackArrowIcon, Icons } from '../components/icons';
import { DEFAULT_AVATAR } from '../constants';
import { IconName } from '../types'; // Import correct IconName


interface AvatarPageProps {
  onNavigateBack: () => void;
}

const AvatarDisplay: React.FC<{ avatar: { iconName: IconName, color: string }, onClick?: () => void, large?: boolean }> = ({ avatar, onClick, large }) => {
  const AvatarIconComponent = Icons[avatar.iconName as keyof typeof Icons]; // Cast to keyof typeof Icons as IconName is AllIconNames
  const sizeClass = large ? "w-32 h-32" : "w-8 h-8";
  return (
    <button onClick={onClick} className={`p-1 rounded-full ${avatar.color}`}>
      <AvatarIconComponent className={sizeClass} />
    </button>
  );
};

export const AvatarPage: React.FC<AvatarPageProps> = ({ onNavigateBack }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="w-full p-3 shadow-md bg-sky-500 sticky top-0 z-50 text-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={onNavigateBack} className="p-2 rounded-full hover:bg-white/20 transition-colors">
            <BackArrowIcon className="w-7 h-7" />
          </button>
          <h1 className="text-2xl font-bold">Personalizar Avatar</h1>
          <div className="w-10"> {/* Spacer */} </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center">
          <AvatarDisplay avatar={DEFAULT_AVATAR} large />
          <h2 className="text-2xl font-semibold text-slate-700 mt-6 mb-2">Editor de Avatar</h2>
          <p className="text-slate-500 mb-6">
            Esta sección estará disponible próximamente para que personalices tu avatar.
          </p>
          <button
            onClick={onNavigateBack}
            className="px-6 py-2 bg-sky-500 text-white font-semibold rounded-lg shadow hover:bg-sky-600 transition-colors"
          >
            Volver
          </button>
        </div>
      </main>
      <footer className="py-4 text-center text-slate-500 text-sm border-t border-slate-200">
         Matechicos - Personalización
      </footer>
    </div>
  );
};
