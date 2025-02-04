import React, { useEffect, useRef } from 'react';
import styles from './DNAStrands.module.css';

const DNAStrands: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  interface Base {
    x: number;
    y: number;
    color: string;
    size: number;
    rotation: number;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const bases: Base[] = [];
    const numBases = 20;
    const colors = ['#4A90E2', '#50E3C2']; // DNA strand colors
    const baseSpacing = canvas.height / numBases;

    // Initialize DNA bases
    for (let i = 0; i < numBases; i++) {
      bases.push({
        x: 0,
        y: i * baseSpacing,
        color: colors[i % 2],
        size: 8,
        rotation: 0
      });
    }

    let time = 0;
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.fillStyle = 'rgba(0, 5, 16, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const amplitude = 100;
      const frequency = 0.002;
      const speed = 0.03;

      time += speed;

      // Draw connecting lines first (backbone)
      ctx.beginPath();
      ctx.moveTo(centerX + Math.sin(time) * amplitude, 0);
      ctx.lineTo(centerX + Math.sin(time + Math.PI * 2) * amplitude, canvas.height);
      ctx.strokeStyle = 'rgba(74, 144, 226, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX - Math.sin(time) * amplitude, 0);
      ctx.lineTo(centerX - Math.sin(time + Math.PI * 2) * amplitude, canvas.height);
      ctx.stroke();

      // Update and draw bases
      bases.forEach((base, i) => {
        const progress = i / (numBases - 1);
        const wave = Math.sin(time + progress * Math.PI * 2);
        
        // Position on the helix
        base.x = centerX + wave * amplitude;
        base.y = i * baseSpacing;
        base.rotation = Math.atan2(
          Math.cos(time + progress * Math.PI * 2) * amplitude,
          baseSpacing
        );

        // Draw base pair connections
        ctx.beginPath();
        ctx.moveTo(base.x, base.y);
        ctx.lineTo(centerX - wave * amplitude, base.y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw base
        ctx.save();
        ctx.translate(base.x, base.y);
        ctx.rotate(base.rotation);
        
        // Glowing effect
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, base.size * 2);
        gradient.addColorStop(0, base.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, base.size * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Base center
        ctx.fillStyle = base.color;
        ctx.beginPath();
        ctx.arc(0, 0, base.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      // Add data particles effect
      if (Math.random() < 0.1) {
        const particleSize = Math.random() * 3 + 1;
        bases.push({
          x: centerX + (Math.random() - 0.5) * amplitude * 3,
          y: canvas.height,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: particleSize,
          rotation: 0
        });
      }

      // Remove particles that are off screen
      while (bases.length > numBases && bases[bases.length - 1].y < 0) {
        bases.pop();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.dnaContainer}>
      <canvas ref={canvasRef} className={styles.dnaCanvas} />
      <div className={styles.overlay}>
        <div className={styles.title}>Precision Matching</div>
        <div className={styles.subtitle}>Understanding the DNA of Career Success</div>
      </div>
    </div>
  );
};

export default DNAStrands;
