import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styles from './SplitScreen.module.css';

const SplitScreen: React.FC = () => {
  const jobSeekerIcons = Array(15).fill(null);
  const companyIcons = Array(15).fill(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controls = useAnimation();

  // Canvas animation for connection attempts
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

    let connectionPoints: { x1: number; y1: number; x2: number; y2: number; progress: number; speed: number; }[] = [];
    
    const createNewConnection = () => {
      const leftSide = Math.random() * (canvas.width * 0.4);
      const rightSide = canvas.width * 0.6 + Math.random() * (canvas.width * 0.4);
      connectionPoints.push({
        x1: leftSide,
        y1: Math.random() * canvas.height,
        x2: rightSide,
        y2: Math.random() * canvas.height,
        progress: 0,
        speed: 0.005 + Math.random() * 0.01
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create new connections randomly
      if (Math.random() < 0.05 && connectionPoints.length < 20) {
        createNewConnection();
      }

      // Draw and update connections
      connectionPoints.forEach((point, index) => {
        const { x1, y1, x2, y2, progress } = point;
        
        // Calculate current point along the line
        const currentX = x1 + (x2 - x1) * progress;
        const currentY = y1 + (y2 - y1) * progress;

        // Draw the line
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(currentX, currentY);
        
        // Gradient for the connection line
        const gradient = ctx.createLinearGradient(x1, y1, currentX, currentY);
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 0, 255, 0.5)');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Add glow effect
        ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
        ctx.shadowBlur = 10;

        // Update progress
        point.progress += point.speed;
        
        // Remove completed connections
        if (point.progress >= 1) {
          connectionPoints.splice(index, 1);
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  return (
    <div className={styles.container}>
      {/* Canvas for connection attempts */}
      <canvas ref={canvasRef} className={styles.connectionCanvas} />

      {/* Left side - Job Seekers */}
      <motion.div 
        className={styles.side}
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className={styles.content}>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={styles.title}
          >
            Job Seekers
          </motion.h2>
          <div className={styles.iconGrid}>
            {jobSeekerIcons.map((_, index) => (
              <motion.div
                key={`seeker-${index}`}
                className={styles.personIcon}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, boxShadow: '0 0 25px rgba(0, 255, 255, 0.5)' }}
                transition={{
                  delay: 0.1 * index,
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                <div className={styles.frustrationBubble}>
                  <motion.span
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    ?!
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Divider */}
      <motion.div 
        className={styles.divider}
        initial={{ height: 0 }}
        animate={{ height: "100%" }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <div className={styles.disconnectedLines}>
          {Array(20).fill(null).map((_, index) => (
            <motion.div
              key={`line-${index}`}
              className={styles.line}
              initial={{ width: 0 }}
              animate={{
                width: "100%",
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                delay: 0.05 * index,
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Right side - Companies */}
      <motion.div 
        className={styles.side}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className={styles.content}>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={styles.title}
          >
            Companies
          </motion.h2>
          <div className={styles.iconGrid}>
            {companyIcons.map((_, index) => (
              <motion.div
                key={`company-${index}`}
                className={styles.companyIcon}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, boxShadow: '0 0 25px rgba(255, 0, 255, 0.5)' }}
                transition={{
                  delay: 0.1 * index,
                  duration: 0.5,
                  ease: "easeOut"
                }}
              >
                <div className={styles.searchBubble}>
                  <motion.span
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    ?
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Background Effects */}
      <div className={styles.backgroundEffects}>
        {Array(50).fill(null).map((_, index) => (
          <motion.div
            key={`particle-${index}`}
            className={styles.particle}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.5, 0],
              y: [-10, -window.innerHeight],
              x: Math.random() > 0.5 ? [0, 50] : [0, -50]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: '100%'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default SplitScreen;
