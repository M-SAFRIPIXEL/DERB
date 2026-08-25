import React from 'react';

export const DrippingSmiley: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${className}`}
    >
      {/* Outer Head with imperfect graffiti stroke */}
      <circle cx="50" cy="46" r="38" fill="#CCFF00" />
      {/* Dripping effects below the circle */}
      <path
        d="M20 65 C 20 80, 22 92, 23 96 C 24 98, 27 98, 27 95 C 28 88, 30 72, 32 68
           M42 75 C 43 85, 44 94, 45 99 C 46 101, 49 101, 50 97 C 52 89, 54 80, 56 74
           M68 68 C 69 78, 71 88, 72 94 C 73 97, 76 96, 77 92 C 78 85, 80 74, 82 66"
        fill="#CCFF00"
      />
      {/* Eyes: bold distressed black dots or crosses */}
      <circle cx="36" cy="38" r="5" fill="#0A0A0A" />
      <circle cx="64" cy="38" r="5" fill="#0A0A0A" />
      {/* Big graffiti smile */}
      <path
        d="M30 52 C 38 70, 62 70, 70 52"
        stroke="#0A0A0A"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
};

export const GraffitiCrown: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
    >
      <path
        d="M4 30 L6 10 L18 20 L24 4 L30 20 L42 10 L44 30 Z"
        fill="none"
        stroke="#CCFF00"
        strokeWidth="3.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="6" cy="7" r="2.5" fill="#CCFF00" />
      <circle cx="24" cy="2" r="2.5" fill="#CCFF00" />
      <circle cx="42" cy="7" r="2.5" fill="#CCFF00" />
    </svg>
  );
};

export const DoodleArrow: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      width="44"
      height="28"
      viewBox="0 0 60 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
    >
      <path
        d="M4 22 C 16 12, 34 8, 52 16"
        stroke="#CCFF00"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M42 8 L54 16 L44 26"
        stroke="#CCFF00"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
