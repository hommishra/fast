import React, { useState } from 'react';

interface FCLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  animatedGlobe?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function FCLogo({
  size = 'md',
  showText = false,
  animatedGlobe = true,
  className = '',
  onClick
}: FCLogoProps) {
  const [imgError, setImgError] = useState(false);

  // Size mapping for logo frame and font sizes
  const sizeMap = {
    xs: { frame: 'w-7 h-7', text: 'text-sm', sub: 'text-[8px]', globe: 28 },
    sm: { frame: 'w-9 h-9 md:w-10 md:h-10', text: 'text-lg md:text-xl', sub: 'text-[8px] md:text-[9px]', globe: 38 },
    md: { frame: 'w-12 h-12 md:w-14 md:h-14', text: 'text-xl md:text-2xl', sub: 'text-[9px] md:text-[10px]', globe: 50 },
    lg: { frame: 'w-20 h-20 md:w-24 md:h-24', text: 'text-3xl md:text-4xl', sub: 'text-xs md:text-sm', globe: 80 },
    xl: { frame: 'w-32 h-32 md:w-40 md:h-40', text: 'text-5xl md:text-6xl', sub: 'text-base md:text-lg', globe: 140 },
    '2xl': { frame: 'w-48 h-48 md:w-60 md:h-60', text: 'text-6xl md:text-8xl', sub: 'text-lg md:text-xl', globe: 200 },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 md:gap-3.5 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* Logo Outer Container with 3D Orbit Ring & Red Aura Glow */}
      <div className={`relative ${currentSize.frame} flex items-center justify-center shrink-0`}>
        {/* Continuously Rotating Orbit Ring */}
        <div className={`absolute inset-0 rounded-full border-2 border-dashed border-red-600/80 ${animatedGlobe ? 'animate-spin-slow' : ''} pointer-events-none`} />

        {/* Outer Red Pulse Glow */}
        <div className="absolute inset-0 rounded-full bg-red-600/30 blur-md animate-red-pulse pointer-events-none" />

        {/* FC Logo Frame (Vector + Image Fallback to guarantee zero broken image on GoDaddy / Node.js) */}
        <div className="relative w-full h-full rounded-full border-2 border-red-600/90 shadow-[0_0_20px_rgba(225,6,0,0.7)] overflow-hidden bg-black flex items-center justify-center">
          {!imgError ? (
            <img
              src="/fast_coverages_logo.jpg"
              alt="FAST COVERAGES Logo"
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
            />
          ) : (
            /* High Precision Vector SVG Fallback with Metallic 'F' and Glowing Red 'C' over 3D Globe */
            <svg viewBox="0 0 100 100" className="w-full h-full p-1 bg-black">
              <defs>
                <radialGradient id="globeGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1a0000" />
                  <stop offset="70%" stopColor="#0a0000" />
                  <stop offset="100%" stopColor="#000000" />
                </radialGradient>
                <linearGradient id="silverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="50%" stopColor="#E2E8F0" />
                  <stop offset="100%" stopColor="#94A3B8" />
                </linearGradient>
                <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF2E2E" />
                  <stop offset="50%" stopColor="#E10600" />
                  <stop offset="100%" stopColor="#990000" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Sphere Background */}
              <circle cx="50" cy="50" r="44" fill="url(#globeGrad)" stroke="#E10600" strokeWidth="1.5" />

              {/* Grid / Lat Long Lines */}
              <ellipse cx="50" cy="50" rx="44" ry="18" fill="none" stroke="#E10600" strokeWidth="0.8" opacity="0.4" />
              <ellipse cx="50" cy="50" rx="22" ry="44" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
              <line x1="6" y1="50" x2="94" y2="50" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />

              {/* Stylized FC Letters */}
              {/* 'F' Metallic Silver */}
              <path
                d="M 22 28 L 48 28 L 45 36 L 31 36 L 29 46 L 43 46 L 40 54 L 27 54 L 21 72 L 13 72 Z"
                fill="url(#silverGrad)"
                filter="url(#glow)"
              />
              {/* 'C' Glowing Red */}
              <path
                d="M 78 35 C 65 24 45 28 42 45 C 40 60 56 74 76 67 L 72 58 C 58 63 49 55 51 46 C 53 37 68 34 75 41 Z"
                fill="url(#redGrad)"
                filter="url(#glow)"
              />
            </svg>
          )}

          {/* Light sweep effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-light-sweep pointer-events-none" />
        </div>
      </div>

      {/* Optional Brand Typography */}
      {showText && (
        <div className="flex flex-col items-start text-left leading-none">
          <span className={`font-black uppercase tracking-tighter ${currentSize.text} flex items-center gap-1`}>
            <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(225,6,0,0.5)]">
              FAST
            </span>
            <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(225,6,0,0.5)]">
              COVERAGES
            </span>
          </span>
          <span className={`font-mono font-bold uppercase tracking-[0.38em] text-slate-600 dark:text-slate-300 mt-1 ${currentSize.sub}`}>
            GLOBAL NEWS NETWORK
          </span>
        </div>
      )}
    </div>
  );
}
