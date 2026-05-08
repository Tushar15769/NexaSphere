import React, { useEffect, useRef } from 'react';

const GRID_SIZE = 90;
const LIGHT_ALPHA = 0.10;
const DARK_ALPHA = 0.13;
const GLOW_1_RADIUS = 180;
const GLOW_2_RADIUS = 120;

export default function GeometricGridBackground({ theme = 'dark' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;

    function draw() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);

      ctx.save();
      ctx.globalAlpha = theme === 'light' ? LIGHT_ALPHA : DARK_ALPHA;
      ctx.strokeStyle = theme === 'light' ? '#bfae9c' : '#222733';
      for (let x = 0; x < w; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = DARK_ALPHA;
      ctx.fillStyle = theme === 'light' ? '#bfae9c' : '#181c2a';

      ctx.beginPath();
      ctx.moveTo(w * 0.7, h * 0.1);
      ctx.lineTo(w * 0.95, h * 0.7);
      ctx.lineTo(w * 0.55, h * 0.7);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(w * 0.15, h * 0.8);
      ctx.lineTo(w * 0.3, h * 0.95);
      ctx.lineTo(w * 0.1, h * 0.95);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.save();
      const glow1 = ctx.createRadialGradient(w * 0.25, h * 0.7, 0, w * 0.25, h * 0.7, GLOW_1_RADIUS);
      glow1.addColorStop(0, theme === 'light' ? 'rgba(255,200,100,0.13)' : 'rgba(0,212,255,0.13)');
      glow1.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(w * 0.25, h * 0.7, GLOW_1_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = glow1;
      ctx.fill();

      const glow2 = ctx.createRadialGradient(w * 0.8, h * 0.2, 0, w * 0.8, h * 0.2, GLOW_2_RADIUS);
      glow2.addColorStop(0, theme === 'light' ? 'rgba(109,40,217,0.10)' : 'rgba(123,111,255,0.10)');
      glow2.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(w * 0.8, h * 0.2, GLOW_2_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = glow2;
      ctx.fill();
      ctx.restore();

      raf = requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener('resize', draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', draw);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        transition: 'opacity 1.2s',
      }}
    />
  );
}

