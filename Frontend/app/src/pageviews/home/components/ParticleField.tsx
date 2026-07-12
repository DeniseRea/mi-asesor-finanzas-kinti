'use client';

import { useEffect, useRef } from 'react';

interface Dot { x: number; y: number; baseX: number; baseY: number; size: number; alpha: number }

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; const parent = canvas?.parentElement;
    if (!canvas || !parent || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const context = canvas.getContext('2d'); if (!context) return;
    let frame = 0; let width = 0; let height = 0; let dots: Dot[] = []; const pointer = { x: -1000, y: -1000 };
    const resize = () => { width = parent.clientWidth; height = parent.clientHeight; const ratio = Math.min(window.devicePixelRatio, 2); canvas.width = width * ratio; canvas.height = height * ratio; canvas.style.width = `${width}px`; canvas.style.height = `${height}px`; context.setTransform(ratio,0,0,ratio,0,0); dots = Array.from({ length: Math.min(72, Math.max(38, Math.floor(width / 22))) }, (_, index) => { const x = (index * 137.5) % width; const y = (index * 79.3) % height; return { x, y, baseX: x, baseY: y, size: 1 + (index % 3) * .65, alpha: .16 + (index % 5) * .055 }; }); };
    const move = (event: PointerEvent) => { const box = parent.getBoundingClientRect(); pointer.x = event.clientX - box.left; pointer.y = event.clientY - box.top; };
    const leave = () => { pointer.x = -1000; pointer.y = -1000; };
    const draw = () => { context.clearRect(0,0,width,height); for (const dot of dots) { const dx = pointer.x-dot.x; const dy = pointer.y-dot.y; const distance = Math.hypot(dx,dy); if (distance < 180) { const force = (180-distance)/180; dot.x -= dx * force * .018; dot.y -= dy * force * .018; } dot.x += (dot.baseX-dot.x)*.025; dot.y += (dot.baseY-dot.y)*.025; context.beginPath(); context.arc(dot.x,dot.y,dot.size,0,Math.PI*2); context.fillStyle = `rgba(36, 128, 85, ${dot.alpha})`; context.fill(); } frame = requestAnimationFrame(draw); };
    resize(); draw(); window.addEventListener('resize', resize); parent.addEventListener('pointermove', move); parent.addEventListener('pointerleave', leave);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); parent.removeEventListener('pointermove', move); parent.removeEventListener('pointerleave', leave); };
  }, []);
  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0"/>;
}
