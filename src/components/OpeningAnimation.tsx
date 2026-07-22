import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, ChevronRight, Zap, Globe2, ShieldCheck } from 'lucide-react';
import FCLogo from './FCLogo';

interface OpeningAnimationProps {
  onComplete: () => void;
}

export default function OpeningAnimation({ onComplete }: OpeningAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Timeline Step States:
  // Step 1: 'F' enters from LEFT (0.0s - 1.2s)
  // Step 2: 'C' enters from RIGHT (1.2s - 2.2s)
  // Step 3: Collision & Shockwave in center to form FC Mark (2.2s - 3.2s)
  // Step 4: 'FAST COVERAGES' appears with lighting effects (3.2s - 4.2s)
  // Step 5: 'GLOBAL NEWS NETWORK' appears beneath (4.2s - 5.2s)
  // Step 6: Full Network Grand Stage & Smooth Transition (5.2s - 6.5s)
  const [animStep, setAnimStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [showCollisionBurst, setShowCollisionBurst] = useState(false);
  const [activeHeadlineIdx, setActiveHeadlineIdx] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const headlines = [
    'BREAKING NEWS',
    'LIVE TRANSMISSION',
    'WORLD NEWS DESK',
    'BUSINESS & FINANCE',
    'GLOBAL MARKETS LIVE',
    'POLITICS & DIPLOMACY',
    'ADVANCED TECHNOLOGY',
    'SPORTS WIRE',
    'INTERNATIONAL COVERAGE',
    'REAL-TIME UPDATES'
  ];

  // Precise Timeline Control: 0s -> 6.5s
  useEffect(() => {
    const t1 = setTimeout(() => setAnimStep(2), 1200);   // Step 2: 'C' from right
    const t2 = setTimeout(() => {
      setAnimStep(3);                                   // Step 3: Collision & Shockwave
      setShowCollisionBurst(true);
      setTimeout(() => setShowCollisionBurst(false), 800);
    }, 2200);
    const t3 = setTimeout(() => setAnimStep(4), 3200);   // Step 4: FAST COVERAGES appears
    const t4 = setTimeout(() => setAnimStep(5), 4200);   // Step 5: GLOBAL NEWS NETWORK appears
    const t5 = setTimeout(() => setAnimStep(6), 5200);   // Step 6: Full Network Stage
    const tFade = setTimeout(() => setIsFadingOut(true), 6000);
    const tEnd = setTimeout(() => handleFinish(), 6500);

    const headlineInterval = setInterval(() => {
      setActiveHeadlineIdx((prev) => (prev + 1) % headlines.length);
    }, 900);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(tFade);
      clearTimeout(tEnd);
      clearInterval(headlineInterval);
    };
  }, []);

  // Web Audio API: International News Broadcast Chimes & Collision Impact Sound
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();

        // Sub-bass riser at start
        const subOsc = audioCtx.createOscillator();
        const subGain = audioCtx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(45, audioCtx.currentTime);
        subOsc.frequency.exponentialRampToValueAtTime(180, audioCtx.currentTime + 1.5);
        subGain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        subGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
        subOsc.connect(subGain);
        subGain.connect(audioCtx.destination);
        subOsc.start();
        subOsc.stop(audioCtx.currentTime + 1.5);

        // Collision Impact sound at 2.2s
        setTimeout(() => {
          if (!audioCtx) return;
          const impactOsc = audioCtx.createOscillator();
          const impactGain = audioCtx.createGain();
          impactOsc.type = 'triangle';
          impactOsc.frequency.setValueAtTime(220, audioCtx.currentTime);
          impactOsc.frequency.exponentialRampToValueAtTime(55, audioCtx.currentTime + 0.5);
          impactGain.gain.setValueAtTime(0.25, audioCtx.currentTime);
          impactGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
          impactOsc.connect(impactGain);
          impactGain.connect(audioCtx.destination);
          impactOsc.start();
          impactOsc.stop(audioCtx.currentTime + 0.5);
        }, 2200);

        // Broadcast Chime Sequence (C5 -> E5 -> G5 -> C6) starting at 3.2s
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          if (!audioCtx) return;
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const startTime = audioCtx.currentTime + 3.2 + idx * 0.2;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.1, startTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.45);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.45);
        });
      }
    } catch (e) {
      console.log('Autoplay handled safely by browser', e);
    }

    return () => {
      if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close();
      }
    };
  }, []);

  // 60 FPS HTML5 Canvas Engine: 3D Rotating Digital Globe, Red Light Particles & World Transmission Arc Lines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    // Red & Silver Light Particles
    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
      size: Math.random() * 2.5 + 0.8,
      alpha: Math.random() * 0.8 + 0.2,
      isRed: Math.random() > 0.4
    }));

    // Major Global News Hub Cities for World Transmission Lines
    const globalHubs = [
      { name: 'New York', lat: 40.7128, lon: -74.0060 },
      { name: 'London', lat: 51.5074, lon: -0.1278 },
      { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
      { name: 'New Delhi', lat: 28.6139, lon: 77.2090 },
      { name: 'Paris', lat: 48.8566, lon: 2.3522 },
      { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
      { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
      { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
      { name: 'Beijing', lat: 39.9042, lon: 116.4074 }
    ];

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let pulseProgress = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const globeRadius = Math.min(cx, cy) * 0.65;

      rotation += 0.022;
      pulseProgress = (pulseProgress + 0.018) % 1;

      // 1. Digital Particles Motion
      particles.forEach((p) => {
        p.x += p.vx * 1.5;
        p.y += p.vy * 1.5;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.isRed 
          ? `rgba(225, 6, 0, ${p.alpha * 0.85})` 
          : `rgba(255, 255, 255, ${p.alpha * 0.9})`;
        ctx.shadowColor = p.isRed ? '#E10600' : '#FFFFFF';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 2. 3D Rotating Globe Radial Atmosphere Glow
      const bgGlow = ctx.createRadialGradient(cx, cy, globeRadius * 0.2, cx, cy, globeRadius * 1.4);
      bgGlow.addColorStop(0, 'rgba(225, 6, 0, 0.30)');
      bgGlow.addColorStop(0.5, 'rgba(225, 6, 0, 0.08)');
      bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bgGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // 3. 3D Globe Sphere Wireframe Base
      ctx.beginPath();
      ctx.arc(cx, cy, globeRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(5, 5, 5, 0.94)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(225, 6, 0, 0.85)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 4. Globe Latitude Lines
      for (let lat = -70; lat <= 70; lat += 20) {
        const r = globeRadius * Math.cos((lat * Math.PI) / 180);
        const y = cy + globeRadius * Math.sin((lat * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(cx, y, r, r * 0.25, 0, 0, Math.PI * 2);
        ctx.strokeStyle = lat === 0 ? 'rgba(255, 255, 255, 0.8)' : 'rgba(225, 6, 0, 0.25)';
        ctx.lineWidth = lat === 0 ? 1.8 : 0.8;
        ctx.stroke();
      }

      // 5. Globe Longitude Rotating Ellipses (3D Orbit)
      for (let lon = 0; lon < 360; lon += 30) {
        const currentRot = rotation + (lon * Math.PI) / 180;
        const widthFactor = Math.sin(currentRot);

        ctx.beginPath();
        ctx.ellipse(cx, cy, globeRadius * Math.abs(widthFactor), globeRadius, 0, 0, Math.PI * 2);
        if (widthFactor > 0) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.lineWidth = 1.1;
        } else {
          ctx.strokeStyle = 'rgba(225, 6, 0, 0.2)';
          ctx.lineWidth = 0.7;
        }
        ctx.stroke();
      }

      // 6. Global News Transmission Lines & Nodes
      const projectedCoords: { x: number; y: number; visible: boolean; name: string }[] = [];

      globalHubs.forEach((hub) => {
        const radLat = (hub.lat * Math.PI) / 180;
        const radLon = (hub.lon * Math.PI) / 180 + rotation;
        const visible = Math.sin(radLon) > 0;

        const x = cx + globeRadius * Math.cos(radLat) * Math.cos(radLon);
        const y = cy - globeRadius * Math.sin(radLat);
        projectedCoords.push({ x, y, visible, name: hub.name });

        if (visible) {
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, 6 + Math.sin(rotation * 6) * 3, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(225, 6, 0, 0.9)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });

      // Inter-city Arc Transmission Lines
      for (let i = 0; i < projectedCoords.length; i++) {
        for (let j = i + 1; j < projectedCoords.length; j++) {
          const h1 = projectedCoords[i];
          const h2 = projectedCoords[j];

          if (h1.visible && h2.visible) {
            ctx.beginPath();
            ctx.moveTo(h1.x, h1.y);
            const midX = (h1.x + h2.x) / 2 + (Math.sin(rotation) * 20);
            const midY = (h1.y + h2.y) / 2 - 30;
            ctx.quadraticCurveTo(midX, midY, h2.x, h2.y);
            ctx.strokeStyle = 'rgba(225, 6, 0, 0.35)';
            ctx.lineWidth = 1;
            ctx.stroke();

            const pulseX = (1 - pulseProgress) * (1 - pulseProgress) * h1.x + 2 * (1 - pulseProgress) * pulseProgress * midX + pulseProgress * pulseProgress * h2.x;
            const pulseY = (1 - pulseProgress) * (1 - pulseProgress) * h1.y + 2 * (1 - pulseProgress) * pulseProgress * midY + pulseProgress * pulseProgress * h2.y;

            ctx.beginPath();
            ctx.arc(pulseX, pulseY, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleFinish = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fc_last_animation_time', Date.now().toString());
    }
    onComplete();
  };

  return (
    <div
      id="cinematic-website-opening-animation"
      className={`fixed inset-0 bg-black text-white z-50 flex flex-col items-center justify-between p-4 md:p-8 overflow-hidden select-none font-sans transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* 1. Background Digital Transmission Canvas & Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full opacity-80" />

        {/* Laser Sweep Beam */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-laser-sweep pointer-events-none shadow-[0_0_25px_#E10600]" />

        {/* Tech Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Scrolling News Categories Stream */}
        <div className="absolute inset-0 flex flex-col justify-around opacity-15 pointer-events-none select-none overflow-hidden font-mono text-[10px] md:text-xs tracking-[0.4em] font-black text-white/50">
          <div className="animate-marquee whitespace-nowrap">
            BREAKING NEWS • LIVE TRANSMISSION • GLOBAL MARKETS • INTERNATIONAL HEADLINES • POLITICS • TECHNOLOGY • WORLD DESK •
          </div>
          <div className="animate-marquee whitespace-nowrap" style={{ animationDirection: 'reverse' }}>
            SPORTS WIRE • BUSINESS INTELLIGENCE • REAL-TIME NEWS • FAST COVERAGES GLOBAL NETWORK •
          </div>
        </div>
      </div>

      {/* 2. Top Broadcast Control Bar */}
      <div className="relative z-30 w-full max-w-6xl flex items-center justify-between">
        <div className="flex items-center gap-2.5 bg-black/80 border border-red-600/60 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(225,6,0,0.3)]">
          <Radio className="w-3.5 h-3.5 text-red-500 animate-ping" />
          <span className="text-[10px] md:text-xs font-mono font-black uppercase tracking-widest text-red-400">
            STEP {animStep}/6 • 4K 60FPS TRANSMISSION
          </span>
        </div>

        <button
          onClick={handleFinish}
          className="bg-white/10 hover:bg-red-600 hover:text-white border border-white/20 text-white font-mono font-black text-xs px-4 py-1.5 rounded-full backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 group"
          title="Skip to Homepage"
        >
          <span>ENTER NETWORK</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 3. MAIN CINEMATIC STAGE: STEPS 1-6 */}
      <div className="relative z-20 flex flex-col items-center justify-center my-auto max-w-5xl w-full text-center min-h-[380px]">

        {/* Collision Shockwave Flash Effect */}
        <AnimatePresence>
          {showCollisionBurst && (
            <motion.div
              initial={{ scale: 0.1, opacity: 1 }}
              animate={{ scale: 3.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute z-40 w-48 h-48 rounded-full bg-gradient-to-r from-red-500 via-white to-red-600 blur-xl pointer-events-none shadow-[0_0_100px_#E10600]"
            />
          )}
        </AnimatePresence>

        {/* STEPS 1, 2, 3: Letter "F" from Left, Letter "C" from Right, Meeting in Center */}
        {animStep < 3 && (
          <div className="relative flex items-center justify-center w-full h-48 sm:h-64 my-4">
            {/* STEP 1: Letter "F" in Metallic Silver from Left */}
            <motion.div
              initial={{ x: '-100vw', opacity: 0, scale: 1.8, filter: 'blur(10px)' }}
              animate={{ x: animStep === 1 ? '-60px' : '-20px', opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="absolute z-20 font-black text-7xl sm:text-9xl md:text-[11rem] uppercase tracking-tighter"
            >
              <span className="bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent filter drop-shadow-[0_0_35px_rgba(255,255,255,0.8)]">
                F
              </span>
            </motion.div>

            {/* STEP 2: Letter "C" in Glowing Red from Right */}
            {animStep >= 2 && (
              <motion.div
                initial={{ x: '100vw', opacity: 0, scale: 1.8, filter: 'blur(10px)' }}
                animate={{ x: '20px', opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
                className="absolute z-20 font-black text-7xl sm:text-9xl md:text-[11rem] uppercase tracking-tighter"
              >
                <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent filter drop-shadow-[0_0_45px_rgba(225,6,0,0.95)]">
                  C
                </span>
              </motion.div>
            )}
          </div>
        )}

        {/* STEPS 3, 4, 5, 6: Collision Completed into Official FC Logo & Full Brand Display */}
        {animStep >= 3 && (
          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center gap-6 my-2"
          >
            {/* The Unified Official FC Logo System */}
            <motion.div
              animate={{
                scale: animStep === 3 ? 1.25 : 1,
              }}
              transition={{ duration: 0.5 }}
              className="relative z-30"
            >
              <FCLogo size="2xl" animatedGlobe={true} />
            </motion.div>

            {/* STEP 4 & 5: FAST COVERAGES & Subtitle */}
            <div className="flex flex-col items-center gap-1.5 mt-2">
              {animStep >= 4 && (
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-none filter drop-shadow-[0_0_30px_rgba(0,0,0,0.9)]"
                >
                  <span className="bg-gradient-to-r from-red-600 via-red-500 to-red-700 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(225,6,0,0.95)]">
                    FAST{' '}
                  </span>
                  <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(225,6,0,0.95)]">
                    COVERAGES
                  </span>
                </motion.h1>
              )}

              {animStep >= 5 && (
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-xs sm:text-sm md:text-base lg:text-lg font-mono font-black uppercase tracking-[0.45em] text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] mt-1 flex items-center gap-2.5"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping inline-block shrink-0 shadow-[0_0_12px_#E10600]" />
                  <span>GLOBAL NEWS NETWORK</span>
                </motion.p>
              )}
            </div>

            {/* Active Live Headlines Ticker Tag */}
            <div className="h-10 my-2 flex items-center justify-center overflow-hidden w-full max-w-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeHeadlineIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="inline-flex items-center gap-2 bg-red-950/80 border border-red-600/80 px-4 py-1.5 rounded-full text-xs md:text-sm font-mono font-black text-red-100 uppercase tracking-wider shadow-[0_0_20px_rgba(225,6,0,0.5)]"
                >
                  <Zap className="w-4 h-4 text-red-500 animate-bounce" />
                  <span>{headlines[activeHeadlineIdx]}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

      </div>

      {/* 4. Bottom Broadcast Progress Bar */}
      <div className="relative z-30 w-full max-w-md flex flex-col items-center gap-2 mb-1">
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-red-600 via-white to-red-600 shadow-[0_0_12px_#E10600]"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 6.2, ease: 'linear' }}
          />
        </div>
        <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> GODADDY / NODE.JS READY
          </span>
          <span className="flex items-center gap-1">
            <Globe2 className="w-3.5 h-3.5 text-red-500 animate-spin" /> 60 FPS BROADCAST
          </span>
        </div>
      </div>
    </div>
  );
}
