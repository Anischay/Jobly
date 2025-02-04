import React, { useEffect, useRef } from 'react';
import styles from './MatrixLogo.module.css';

const MatrixLogo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  interface Drop {
    x: number;
    y: number;
    speed: number;
    char: string;
    opacity: number;
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

    const characters = 'JOBLY01';
    const drops: Drop[] = [];
    const fontSize = 20;
    const columns = canvas.width / fontSize;

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops.push({
        x: i * fontSize,
        y: Math.random() * canvas.height,
        speed: Math.random() * 2 + 3,
        char: characters[Math.floor(Math.random() * characters.length)],
        opacity: Math.random()
      });
    }

    let frame = 0;
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.fillStyle = 'rgba(0, 5, 16, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      drops.forEach(drop => {
        // Update character occasionally
        if (Math.random() < 0.05) {
          drop.char = characters[Math.floor(Math.random() * characters.length)];
        }

        // Draw the character
        ctx.fillStyle = `rgba(74, 144, 226, ${drop.opacity})`;
        ctx.fillText(drop.char, drop.x, drop.y);

        // Move drop
        drop.y += drop.speed;

        // Reset drop when it reaches bottom
        if (drop.y > canvas.height) {
          drop.y = 0;
          drop.x = Math.random() * canvas.width;
          drop.speed = Math.random() * 2 + 3;
          drop.opacity = Math.random();
        }
      });

      // Fade in the logo after some frames
      if (frame > 60 && textRef.current) {
        textRef.current.style.opacity = '1';
        textRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
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
    <div className={styles.matrixContainer}>
      <canvas ref={canvasRef} className={styles.matrixCanvas} />
      <div ref={textRef} className={styles.logo}>
        <span className={styles.jobly}>JOBLY</span>
        <span className={styles.tagline}>Revolutionizing Recruitment</span>
      </div>
    </div>
  );
};

export default MatrixLogo;
