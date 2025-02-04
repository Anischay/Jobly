import React, { useEffect, useRef } from 'react';
import styles from './HolographicTransition.module.css';

const HolographicTransition: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  interface Particle {
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
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

    // Create particles
    const particles: Particle[] = [];
    const numParticles = 200;
    const colors = ['#4A90E2', '#50E3C2', '#F5A623'];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        targetX: Math.random() * canvas.width,
        targetY: Math.random() * canvas.height,
        vx: 0,
        vy: 0,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random()
      });
    }

    let phase = 0;
    const phaseLength = 120;
    let frame = 0;

    const createHolographicText = (text: string) => {
      const fontSize = 150;
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillText(text, 0, 0);

      const textWidth = ctx.measureText(text).width;
      const startX = (canvas.width - textWidth) / 2;
      const startY = canvas.height / 2;

      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillText(text, startX, startY);

      return { startX, startY, width: textWidth, height: fontSize };
    };

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.fillStyle = 'rgba(0, 5, 16, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update phase
      if (frame % phaseLength === 0) {
        phase = Math.floor(frame / phaseLength) % 4;
        
        // Set new target positions based on phase
        particles.forEach(particle => {
          if (phase === 1) {
            // Form a circle
            const angle = Math.random() * Math.PI * 2;
            const radius = 200;
            particle.targetX = canvas.width/2 + Math.cos(angle) * radius;
            particle.targetY = canvas.height/2 + Math.sin(angle) * radius;
          } else if (phase === 2) {
            // Form text "FUTURE"
            const textMetrics = createHolographicText('FUTURE');
            particle.targetX = textMetrics.startX + Math.random() * textMetrics.width;
            particle.targetY = textMetrics.startY - Math.random() * textMetrics.height;
          } else if (phase === 3) {
            // Explode outward
            const angle = Math.random() * Math.PI * 2;
            particle.targetX = canvas.width/2 + Math.cos(angle) * canvas.width;
            particle.targetY = canvas.height/2 + Math.sin(angle) * canvas.height;
          }
        });
      }

      // Update and draw particles
      particles.forEach(particle => {
        // Calculate direction to target
        const dx = particle.targetX - particle.x;
        const dy = particle.targetY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Update velocity with easing
        particle.vx += dx * 0.01;
        particle.vy += dy * 0.01;
        
        // Apply friction
        particle.vx *= 0.95;
        particle.vy *= 0.95;

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Draw particle with glow effect
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw core of particle
        ctx.beginPath();
        ctx.fillStyle = particle.color;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        // Add connecting lines
        particles.forEach(other => {
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(74, 144, 226, ${0.15 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      // Show text overlay based on phase
      if (textRef.current) {
        const messages = ['Welcome to', 'The', 'FUTURE', 'of Recruitment'];
        if (frame % phaseLength === 0) {
          textRef.current.textContent = messages[phase];
          textRef.current.style.opacity = '1';
        } else if (frame % phaseLength === Math.floor(phaseLength * 0.8)) {
          textRef.current.style.opacity = '0';
        }
      }

      frame++;
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
    <div className={styles.holographicContainer}>
      <canvas ref={canvasRef} className={styles.holographicCanvas} />
      <div ref={textRef} className={styles.message}></div>
      <div className={styles.overlay}>
        <div className={styles.glitchText}>JOBLY</div>
        <div className={styles.tagline}>The Future of Recruitment is Here</div>
      </div>
    </div>
  );
};

export default HolographicTransition;
