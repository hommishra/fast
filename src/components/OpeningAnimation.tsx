import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, ShieldCheck, ChevronRight, Zap, Globe2 } from 'lucide-react';

interface OpeningAnimationProps {
  onComplete: () => void;
}

export default function OpeningAnimation({ onComplete }: OpeningAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [activeHeadlineIdx, setActiveHeadlineIdx] = useState(0);

  const headlines = [
    'LIVE BROADCAST',
    'BREAKING NEWS WIRE',
    'WORLD NEWS DESK',
    'GLOBAL MARKETS LIVE',
    'POLITICS & DIPLOMACY',
    'ADVANCED TECHNOLOGY',
    'INTERNATIONAL SPORTS',
    'ENTERTAINMENT WIRE',
    'REAL-TIME INTELLIGENCE'
  ];

  // Scene sequence timeline timing over 9.5 seconds total
  useEffect(() => {
    const t1 = setTimeout(() => setScene(2), 2000);  // Scene 2 at 2s
    const t2 = setTimeout(() => setScene(3), 4800);  // Scene 3 at 4.8s
    const t3 = setTimeout(() => setScene(4), 7000);  // Scene 4 at 7s
    const t4 = setTimeout(() => setScene(5), 9200);  // Final Scene at 9.2s
    const tEnd = setTimeout(() => handleComplete(), 10500); // Redirect home at 10.5s

    const headlineInterval = setInterval(() => {
      setActiveHeadlineIdx((prev) => (prev + 1) % headlines.length);
    }, 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(tEnd);
      clearInterval(headlineInterval);
    };
  }, []);

  // Web Audio API broadcast sound chime
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      }
    } catch (e) {
      console.log('Audio autoplay handled', e);
    }

    return () => {
      if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close();
      }
    };
  }, []);

  // Canvas 3D Global Earth & High Speed Red Digital Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let rotation = 0;

    // Red high speed particles
    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 800,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      size: Math.random() * 2.5 + 1,
      color: Math.random() > 0.3 ? 'rgba(225, 6, 0, ' : 'rgba(255, 255, 255, '
    }));

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || 360;
      canvas.height = canvas.parentElement?.clientHeight || 360;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawCanvasFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(cx, cy) * 0.70;

      rotation += 0.03;

      // 1. Render Dynamic High Speed Red Digital Particles
      particles.forEach((p) => {
        p.x += p.vx * 1.5;
        p.y += p.vy * 1.5;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (0.4 + Math.sin(rotation * 3) * 0.3) + ')';
        ctx.fill();
      });

      // 2. Global Atmosphere Outer Glow
      const bgGlow = ctx.createRadialGradient(cx, cy, radius * 0.4, cx, cy, radius * 1.4);
      bgGlow.addColorStop(0, 'rgba(225, 6, 0, 0.35)');
      bgGlow.addColorStop(0.6, 'rgba(225, 6, 0, 0.12)');
      bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bgGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.4, 0, Math.PI * 2);
      ctx.fill();

      // 3. Base 3D Sphere Body
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#050505';
      ctx.fill();
      ctx.strokeStyle = 'rgba(225, 6, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 4. Latitude Rings
      for (let lat = -70; lat <= 70; lat += 20) {
        const r = radius * Math.cos((lat * Math.PI) / 180);
        const y = cy + radius * Math.sin((lat * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(cx, y, r, r * 0.22, 0, 0, Math.PI * 2);
        ctx.strokeStyle = lat === 0 ? 'rgba(255, 255, 255, 0.6)' : 'rgba(225, 6, 0, 0.25)';
        ctx.lineWidth = lat === 0 ? 1.8 : 1;
        ctx.stroke();
      }

      // 5. Longitude 3D Rotating Rings
      for (let lon = 0; lon < 360; lon += 30) {
        const currentRot = rotation + (lon * Math.PI) / 180;
        const widthFactor = Math.sin(currentRot);

        ctx.beginPath();
        ctx.ellipse(cx, cy, radius * Math.abs(widthFactor), radius, 0, 0, Math.PI * 2);
        if (widthFactor > 0) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.lineWidth = 1.2;
        } else {
          ctx.strokeStyle = 'rgba(225, 6, 0, 0.2)';
          ctx.lineWidth = 0.8;
        }
        ctx.stroke();
      }

      // 6. Global Bureau Nodes
      const nodes = [
        { lat: 40, lon: -74 },
        { lat: 51, lon: -0.1 },
        { lat: 35, lon: 139 },
        { lat: 28, lon: 77 },
        { lat: -33, lon: 151 },
        { lat: 25, lon: 55 }
      ];

      nodes.forEach((n) => {
        const radLat = (n.lat * Math.PI) / 180;
        const radLon = (n.lon * Math.PI) / 180 + rotation;

        if (Math.sin(radLon) > 0) {
          const x = cx + radius * Math.cos(radLat) * Math.cos(radLon);
          const y = cy - radius * Math.sin(radLat);

          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x, y);
          ctx.strokeStyle = 'rgba(225, 6, 0, 0.2)';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, 6 + Math.sin(rotation * 5) * 2.5, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(225, 6, 0, 0.85)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });

      // 7. Radar Beam Scan
      const scanAngle = rotation * 2;
      const scanX = cx + Math.cos(scanAngle) * radius;
      const scanY = cy + Math.sin(scanAngle) * radius;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(scanX, scanY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      animationId = requestAnimationFrame(drawCanvasFrame);
    };

    drawCanvasFrame();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fc_last_animation_time', Date.now().toString());
    }
    onComplete();
  };

  return (
    <div
      id="website-opening-animation"
      className="fixed inset-0 bg-black text-white z-50 flex flex-col items-center justify-between p-4 md:p-8 overflow-hidden select-none font-sans"
    >
      {/* Background Digital Newsroom Atmosphere & Metallic Light Trails */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
        <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-600/25 via-transparent to-transparent animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-light-sweep" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent animate-light-sweep" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:28px_28px]" />
      </div>

      {/* Top Header Controls */}
      <div className="relative z-30 w-full max-w-6xl flex items-center justify-between">
        <div className="flex items-center gap-2 bg-red-600/20 border border-red-500/40 px-3.5 py-1 rounded-full backdrop-blur-md">
          <Radio className="w-3.5 h-3.5 text-red-500 animate-ping" />
          <span className="text-[10px] md:text-xs font-mono font-black uppercase tracking-widest text-red-400">
            SCENE {scene}/5 • 4K ULTRA HD BROADCAST
          </span>
        </div>

        <button
          onClick={handleComplete}
          className="bg-white/10 hover:bg-red-600 hover:text-white border border-white/20 text-white font-mono font-black text-xs px-4 py-1.5 rounded-full backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95"
          title="Skip Opening Intro"
        >
          <span>ENTER NETWORK</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Center Stage */}
      <div className="relative z-20 flex flex-col items-center justify-center my-auto max-w-4xl w-full text-center">

        {/* Dynamic Transition: Center Globe Zoom -> Side-by-Side Logo & Title (Scene 3, 4, 5) */}
        <motion.div 
          layout
          className={`flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 my-4 transition-all duration-700 ${
            scene >= 3 ? 'md:items-center' : ''
          }`}
        >
          {/* 3D Global Earth & FC Logo Metallic Emblem */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center shrink-0">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full rounded-full opacity-85 filter drop-shadow-[0_0_35px_rgba(225,6,0,0.7)]"
            />

            {/* FC Logo Emblem with Dynamic Metallic Reflection, Rotating Outer Ring, and Red Glow */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0, rotate: -15 }}
              animate={{ scale: scene >= 3 ? 0.95 : 1.15, opacity: 1, rotate: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-20 w-40 h-40 md:w-52 md:h-52 rounded-full border-4 border-red-600 shadow-[0_0_60px_rgba(225,6,0,0.95)] overflow-hidden bg-black group"
            >
              {/* Continuously Rotating Dashed Orbit Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/60 animate-spin-slow pointer-events-none" />

              <img
                src="/fast_coverages_logo.jpg"
                alt="FAST COVERAGES Logo"
                className="w-full h-full object-cover transform transition duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Red Light Sweep Metallic Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/50 to-transparent animate-light-sweep pointer-events-none" />
            </motion.div>
          </div>

          {/* Scene-Based Metallic Headline Typography - Positioned Beside Logo */}
          <motion.div 
            layout
            className="flex flex-col items-center md:items-start text-center md:text-left gap-1"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={scene}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center md:items-start gap-1"
              >
                {scene === 1 && (
                  <div className="flex flex-col items-center md:items-start gap-1 font-mono">
                    <span className="text-xs text-red-500 tracking-[0.5em] uppercase font-bold animate-pulse">
                      [ TRANSMISSION INITIALIZING ]
                    </span>
                    <h2 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase">
                      GLOBAL NEWS WIRE ONLINE
                    </h2>
                  </div>
                )}

                {(scene >= 2) && (
                  <div className="flex flex-col items-center md:items-start gap-1">
                    {/* Official Typography: Metallic Silver FAST + Red Gradient COVERAGES + White Subtitle */}
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-none filter drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
                      <span className="bg-gradient-to-b from-slate-100 via-slate-300 to-slate-500 bg-clip-text text-transparent">
                        FAST{' '}
                      </span>
                      <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(225,6,0,0.9)]">
                        COVERAGES
                      </span>
                    </h1>

                    <p className="text-xs md:text-sm lg:text-base font-mono font-black uppercase tracking-[0.45em] text-slate-200 mt-1.5 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
                      GLOBAL NEWS NETWORK
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Scene 4 Floating Live Category Bulletins */}
            <div className="h-10 my-2 flex items-center justify-center md:justify-start overflow-hidden w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeHeadlineIdx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="inline-flex items-center gap-2 bg-red-950/80 border border-red-600/80 px-4 py-1.5 rounded-full text-xs md:text-sm font-mono font-black text-red-100 uppercase tracking-wider shadow-lg"
                >
                  <Zap className="w-4 h-4 text-red-500 animate-bounce" />
                  <span>{headlines[activeHeadlineIdx]}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        {/* Tagline Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-black/80 border-y-2 border-red-600 py-2.5 px-6 w-full shadow-2xl backdrop-blur-md"
        >
          <p className="text-xs md:text-sm font-serif italic text-white font-semibold tracking-wide">
            "The Premier Destination For Real-Time Global News"
          </p>
        </motion.div>

      </div>

      {/* Bottom Broadcast Progress Status Bar */}
      <div className="relative z-30 w-full max-w-md flex flex-col items-center gap-2 mb-2">
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-red-600 via-white to-red-600"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 10.0, ease: 'linear' }}
          />
        </div>
        <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3 h-3" /> VERIFIED INTEL
          </span>
          <span className="flex items-center gap-1">
            <Globe2 className="w-3 h-3 text-red-500 animate-spin" /> 60 FPS BROADCAST
          </span>
        </div>
      </div>
    </div>
  );
}

