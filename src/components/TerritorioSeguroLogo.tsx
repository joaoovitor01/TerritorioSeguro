import React, { useState } from 'react';

interface TerritorioSeguroLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const TerritorioSeguroLogo: React.FC<TerritorioSeguroLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = false,
}) => {
  const [imageError, setImageError] = useState(false);

  // Height mappings based on size
  const heightClasses = {
    sm: 'h-8',
    md: 'h-10 sm:h-11',
    lg: 'h-14',
  }[size];

  if (!imageError) {
    return (
      <div className={`flex items-center gap-2 select-none ${className}`}>
        <img
          src="/territorio-seguro-logo.jpg"
          alt="Território Seguro"
          className={`${heightClasses} w-auto object-contain rounded-lg border border-slate-800/60 shadow-sm`}
          onError={() => setImageError(true)}
        />
        {showSubtitle && (
          <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Monitoramento Oficial
          </span>
        )}
      </div>
    );
  }

  // Fallback high-fidelity SVG representation matching the user's design
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Brazil map with rising fire outline */}
      <div className="relative flex items-center justify-center p-1.5 rounded-xl bg-slate-900 border border-slate-800">
        <svg
          viewBox="0 0 100 90"
          className="w-8 h-8 text-white fill-none stroke-current"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Brazil contour simplified */}
          <path
            d="M 28,12 C 34,10 44,11 48,16 C 53,19 62,17 68,22 C 73,26 84,28 88,38 C 91,46 88,58 79,64 C 71,70 65,75 58,82 C 54,86 48,82 46,75 C 43,68 35,62 30,55 C 22,46 16,38 18,29 C 19,20 22,14 28,12 Z"
            fill="rgba(255,255,255,0.06)"
          />
          {/* Internal state divisions */}
          <path d="M 38,15 L 42,32 L 62,35" strokeWidth="1.2" strokeOpacity="0.7" />
          <path d="M 42,32 L 32,48 L 46,55" strokeWidth="1.2" strokeOpacity="0.7" />
          <path d="M 62,35 L 75,46 L 65,60" strokeWidth="1.2" strokeOpacity="0.7" />
          <path d="M 46,55 L 56,66 L 52,78" strokeWidth="1.2" strokeOpacity="0.7" />

          {/* Central rising flame */}
          <path
            d="M 60,70 C 58,62 52,55 58,45 C 62,38 68,34 66,22 C 72,28 78,35 75,44 C 80,42 82,37 80,30 C 86,40 85,55 77,63 C 71,70 65,72 60,70 Z"
            fill="white"
            stroke="white"
            strokeWidth="1.2"
          />
          {/* Left flame tongue */}
          <path
            d="M 35,52 C 32,45 34,38 38,32 C 40,38 45,42 42,48 C 39,53 35,55 35,52 Z"
            fill="white"
            stroke="white"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Vertical divider line */}
      <div className="h-8 w-[2px] bg-white/80 rounded-full" />

      {/* Brand Name Typography */}
      <div className="flex flex-col justify-center leading-none">
        <span className="text-base font-black tracking-tight text-white uppercase font-sans">
          TERRITÓRIO
        </span>
        <span className="text-sm font-extrabold tracking-wider text-white/95 uppercase font-sans">
          SEGURO
        </span>
      </div>
    </div>
  );
};
