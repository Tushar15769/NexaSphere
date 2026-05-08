import { type ReactNode, useEffect, useRef } from 'react';

// Responsive, animated grid + geometric shapes + glows
export default function GeometricGridBackground({ theme = 'dark' }: { theme?: string }): ReactNode {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const canvasEl = canvas;
    const context = ctx;
    let raf = 0;

    function draw(): void {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvasEl.width = w;
      canvasEl.height = h;
      const ctx = context;
      ctx.clearRect(0, 0, w, h);

      // Draw grid
      ctx.save();
      ctx.globalAlpha = theme === 'light' ? 0.10 : 0.13;
      ctx.strokeStyle = theme === 'light' ? '#bfae9c' : '#222733';
      const gridSize = 90;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.restore();

      // Geometric shapes (triangles, polygons)
      ctx.save();
      ctx.globalAlpha = 0.13;
      ctx.fillStyle = theme === 'light' ? '#bfae9c' : '#181c2a';
      // Triangle
      ctx.beginPath();
      ctx.moveTo(w * 0.7, h * 0.1);
      ctx.lineTo(w * 0.95, h * 0.7);
      ctx.lineTo(w * 0.55, h * 0.7);
      ctx.closePath();
      ctx.fill();
      // Polygon
      ctx.beginPath();
      ctx.moveTo(w * 0.15, h * 0.8);
      ctx.lineTo(w * 0.3, h * 0.95);
      ctx.lineTo(w * 0.1, h * 0.95);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Soft radial glows
      ctx.save();
      const glow1 = ctx.createRadialGradient(w * 0.25, h * 0.7, 0, w * 0.25, h * 0.7, 180);
      glow1.addColorStop(0, theme === 'light' ? 'rgba(255,200,100,0.13)' : 'rgba(0,212,255,0.13)');
      glow1.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(w * 0.25, h * 0.7, 180, 0, 2 * Math.PI);
      ctx.fillStyle = glow1;
      ctx.fill();
      const glow2 = ctx.createRadialGradient(w * 0.8, h * 0.2, 0, w * 0.8, h * 0.2, 120);
      glow2.addColorStop(0, theme === 'light' ? 'rgba(109,40,217,0.10)' : 'rgba(123,111,255,0.10)');
      glow2.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(w * 0.8, h * 0.2, 120, 0, 2 * Math.PI);
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
