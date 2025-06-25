import React, { useEffect, useState } from 'react';
import { HeartStatus } from '../types'; // Import HeartStatus

export const BackArrowIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

export const UserCircleIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const OwlIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-4.6-7.4c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm9.2 0c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-4.6-2.6c1.33 0 2.52.41 3.52 1.12.33.24.76.06.99-.26.24-.33.06-.76-.26-.99C15.08 9.08 13.59 8.5 12 8.5s-3.08.58-4.59 1.77c-.33.24-.5.67-.26.99.23.32.66.5.99.26.99-.71 2.18-1.12 3.52-1.12zm0 5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.79 2.04-2.77 3.5-5.11 3.5z"/>
  </svg>
);

export const MeasureIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
  </svg>
);

export const GeometryIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
  </svg>
);

export const StatisticsIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3M3.75 14.25v-2.25m0 0h1.5m-1.5 0H3.75m0 0H2.25m1.5 0V12m2.25 2.25H6v-2.25m1.5 2.25H8.25V12M12 14.25H9.75v-2.25H12v2.25zm3-2.25H12.75V12h2.25v2.25zm3-2.25h-2.25V12h2.25V14.25z" />
  </svg>
);

export const ProbabilityIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const NumbersIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const OperationsIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const ProblemsIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);

export const LockIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

export const BookOpenIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
  </svg>
);

export const PlaceholderIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.158 0L12.5 12.5m1.5-1.5H14" />
    </svg>
  );

export const HomeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.955 8.955M3.75 12H20.25m-16.5 0V21.75c0 .621.504 1.125 1.125 1.125h4.5a1.125 1.125 0 001.125-1.125V16.5a.375.375 0 01.375-.375h2.25a.375.375 0 01.375.375v5.25A1.125 1.125 0 0015.75 22.5h4.5a1.125 1.125 0 001.125-1.125V12M3.75 12H2.25m18 0h-1.5" />
  </svg>
);

export const StarIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className = "w-6 h-6", filled = true }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.479.038.674.646.314.949l-3.841 3.491a.563.563 0 00-.182.523l1.103 5.434c.084.417-.354.757-.723.546l-4.796-2.739a.563.563 0 00-.595 0l-4.796 2.739c-.37.211-.807-.13-.723-.546l1.103-5.434a.563.563 0 00-.182.523l-3.841-3.491c-.36-.303-.165-.91.314-.949l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  </svg>
);

export const GiftIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A3.375 3.375 0 006.375 8.25H17.625A3.375 3.375 0 0012 4.875zm0 0V21m0-16.125c2.062 0 3.834.996 4.969 2.475H7.031A5.231 5.231 0 0112 4.875zM12 12.75c-2.485 0-4.5-2.015-4.5-4.5S9.515 3.75 12 3.75s4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5zm0 0V21" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75H4.5m0 0v8.25h15V12.75M4.5 12.75A2.25 2.25 0 016.75 15h10.5a2.25 2.25 0 012.25-2.25M12 4.875c-1.256 0-2.428.328-3.411.896M12 4.875c1.256 0 2.428.328 3.411.896" />
  </svg>
);


export const CharacterQuestionIcon: React.FC<{ className?: string }> = ({ className = "w-24 h-24" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    {/* Simple character placeholder */}
    <div className="w-16 h-20 bg-orange-300 rounded-full flex flex-col items-center justify-end overflow-hidden">
      <div className="w-8 h-8 bg-orange-500 rounded-full mb-1"></div> {/* Head */}
      <div className="w-12 h-10 bg-orange-400"></div> {/* Body */}
    </div>
    {/* Speech bubble with question mark */}
    <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
      <div className="relative bg-green-400 p-2 rounded-lg shadow">
        <span className="text-white font-bold text-2xl">?</span>
        <div className="absolute left-1 bottom-0 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-t-green-400 transform translate-y-full -translate-x-1/2"></div>
      </div>
    </div>
  </div>
);

export const CharacterPlaceholderIcon: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  // A very basic character representation
  <div className={`flex flex-col items-center justify-center ${className} bg-yellow-300 rounded-full p-1`}>
    <div className="w-4/5 h-2/5 bg-yellow-500 rounded-full"></div> {/* Head */}
    <div className="w-full h-3/5 bg-yellow-400 rounded-b-full mt-0.5"></div> {/* Body */}
  </div>
);


export const BackspaceIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0L12 14.25m2.25-2.25L18 9.75M12 14.25L9.75 12M3.75 12h10.5m1.5-3.75L15.75 6 9.75 12l6 6 2.25-2.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12H9M3 12h2.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 4.755v14.49A1.875 1.875 0 0119.125 21H5.625A1.875 1.875 0 013.75 19.245V4.755c0-.198.058-.387.16-.549L5.25 2.59a1.875 1.875 0 011.53-.765h10.44c.663 0 1.258.347 1.53.765l1.34 1.616a.874.874 0 01.16.549z" />
  </svg>
);

export const SpeechBubbleIcon: React.FC<{ className?: string, children?: React.ReactNode, direction?: 'left' | 'right' }> = ({ className = "bg-green-400 text-white", children, direction = 'left' }) => (
    <div className={`relative p-3 rounded-lg shadow-md ${className}`}>
      {children}
      {direction === 'left' && (
        <div className="absolute left-0 bottom-0 w-0 h-0 border-r-[15px] border-r-transparent border-t-[15px] border-t-[currentColor] transform translate-y-full -translate-x-1/2" style={{borderTopColor: 'inherit'}}></div>
      )}
      {direction === 'right' && (
         <div className="absolute right-0 bottom-0 w-0 h-0 border-l-[15px] border-l-transparent border-t-[15px] border-t-[currentColor] transform translate-y-full translate-x-1/2" style={{borderTopColor: 'inherit'}}></div>
      )}
    </div>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const FilledHeart: React.FC<{ className?: string, animate?: boolean }> = ({ className, animate }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={1.5} className={`${className} ${animate ? 'heart-pulse' : ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const EmptyHeart: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

export const BrokenHeartIcon: React.FC<{ className?: string, animate?: boolean }> = ({ className, animate }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5" className={`${className} ${animate ? 'broken-heart-shatter' : ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.501 5.501 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    {/* Crack lines - can be adjusted for better visual */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5.67l-2 2.5m4 0l2-2.5m-4 7.5v3m0-5l-1.5 2m3 0l1.5-2" stroke="white" strokeWidth="0.8"/>
     <path d="M10.5 10.5l-1.5 2.5h5l-1.5-2.5" stroke="white" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


export const HeartIcon: React.FC<{ className?: string; status?: HeartStatus }> = ({ className = "w-6 h-6", status = 'filled' }) => {
  const [animationStage, setAnimationStage] = useState<'idle' | 'pulsing' | 'breaking'>('idle');

  useEffect(() => {
    if (status === 'losing') {
      setAnimationStage('pulsing');
      const pulseTimer = setTimeout(() => {
        setAnimationStage('breaking');
      }, 450); // Pulse animation is 0.5s, switch just before it ends or as it ends.
      return () => clearTimeout(pulseTimer);
    } else {
      setAnimationStage('idle'); // Reset if status changes from 'losing'
    }
  }, [status]);


  if (status === 'losing') {
    if (animationStage === 'pulsing') {
      return <FilledHeart className={`${className} text-pink-500 heart-pulse`} />;
    } else if (animationStage === 'breaking') {
      // The BrokenHeartIcon needs to be visible for its animation to play
      return <BrokenHeartIcon className={`${className} text-pink-600 broken-heart-shatter`} />;
    }
    // After 'breaking' animation, it will naturally become 'empty' due to parent state change
    // or render nothing briefly if parent hasn't updated yet.
    // To avoid flicker, we can render an empty heart or nothing until parent re-renders.
    return <EmptyHeart className={`${className} text-sky-300 opacity-70`} />; // Fallback during transition
  }

  if (status === 'filled') {
    return <FilledHeart className={`${className} text-pink-500`} />;
  }

  // status === 'empty'
  return <EmptyHeart className={`${className} text-sky-300 opacity-70`} />;
};

export const PencilIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

export const EraserIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9.75a2.25 2.25 0 012.25 2.25v9.75a2.25 2.25 0 01-2.25 2.25H7.5a2.25 2.25 0 01-2.25-2.25V7.5zM10.5 10.5L13.5 13.5M13.5 10.5L10.5 13.5" /> {/* Simplified eraser with an X */}
</svg>
);

export const ClearIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0L12 14.25m2.25-2.25L18 9.75M12 14.25L9.75 12M3 3l3.857 3.857m0 0A4.502 4.502 0 008.25 9h7.5a4.5 4.5 0 004.5-4.5m-13.5 0V1.5" /> {/* Broom / Brush like */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.03 8.87a5.625 5.625 0 010 6.26m-10.06 0a5.625 5.625 0 010-6.26M12 3v2.25m0 16.5V21" />
  </svg>
);


export const Icons = {
  BackArrowIcon,
  UserCircleIcon,
  OwlIcon,
  MeasureIcon,
  GeometryIcon,
  StatisticsIcon,
  ProbabilityIcon,
  NumbersIcon,
  OperationsIcon,
  ProblemsIcon,
  LockIcon,
  BookOpenIcon,
  PlaceholderIcon,
  HomeIcon,
  StarIcon,
  GiftIcon,
  CharacterQuestionIcon, 
  BackspaceIcon,
  SpeechBubbleIcon,
  CharacterPlaceholderIcon,
  CheckIcon,
  HeartIcon, 
  BrokenHeartIcon,
  PencilIcon, // Added
  EraserIcon, // Added
  ClearIcon, // Added
};

// This type is what was originally `IconName`
export type OriginalIconName = keyof Omit<typeof Icons, 'HomeIcon' | 'StarIcon' | 'GiftIcon' | 'CharacterQuestionIcon' | 'BackspaceIcon' | 'SpeechBubbleIcon' | 'CharacterPlaceholderIcon' | 'CheckIcon' | 'HeartIcon' | 'BrokenHeartIcon' | 'PencilIcon' | 'EraserIcon' | 'ClearIcon'>;
// The new IconName type is defined in types.ts and includes all icons.
// This local IconName is for convenience if used only within this file.
// type IconName = keyof typeof Icons;
// It's better to rely on the one from types.ts for external use.
export type AllIconNames = keyof typeof Icons;

// Helper to get icon component
export const getIcon = (name?: AllIconNames): React.FC<{className?: string, filled?: boolean, status?: HeartStatus}> | null => {
  if (!name || !(name in Icons)) return PlaceholderIcon; 
  return Icons[name as AllIconNames] as React.FC<{className?: string, filled?: boolean, status?: HeartStatus}>;
};