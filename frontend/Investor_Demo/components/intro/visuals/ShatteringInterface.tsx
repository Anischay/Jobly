import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ShatteringInterface.module.css';

interface Shard {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
  rotationSpeed: number;
}

interface PopupWindow {
  id: number;
  x: number;
  y: number;
  type: 'rejection' | 'application' | 'error' | 'notification';
  content: string;
  delay: number;
}

interface InterfaceRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const popupContents = {
  rejection: [
    "Application Status: Not Selected",
    "Position Already Filled",
    "Requirements Not Met",
    "Experience Level Mismatch",
    "Skills Gap Detected"
  ],
  application: [
    "Application #247 Pending...",
    "Upload Resume (Format Not Supported)",
    "Reformat CV Required",
    "Experience Validation Failed",
    "Skills Assessment Timeout"
  ],
  error: [
    "Error: Invalid Career Path",
    "System Overload: Too Many Applications",
    "Profile Sync Failed",
    "Career Algorithm Error",
    "Job Match System Failure"
  ],
  notification: [
    "Position No Longer Available",
    "300+ Applicants Applied",
    "Skills Update Required",
    "Profile Visibility Low",
    "Market Demand Changed"
  ]
};

const ShatteringInterface: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shards, setShards] = React.useState<Shard[]>([]);
  const [isShattered, setIsShattered] = React.useState(false);
  const [popups, setPopups] = useState<PopupWindow[]>([]);
  const [showMatrix, setShowMatrix] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);

  // Generate random popup windows with better distribution
  useEffect(() => {
    const generatePopups = () => {
      const newPopups: PopupWindow[] = [];
      const types: Array<'rejection' | 'application' | 'error' | 'notification'> = 
        ['rejection', 'application', 'error', 'notification'];

      // Helper for random number in range
      const random = (min: number, max: number) => 
        min + Math.random() * (max - min);

      // Check if a position overlaps with existing popups
      const hasOverlap = (x: number, y: number) => {
        const minDistance = 25; // Minimum distance between popup centers
        return newPopups.some(popup => {
          const dx = popup.x - x;
          const dy = popup.y - y;
          return Math.sqrt(dx * dx + dy * dy) < minDistance;
        });
      };

      // Get a valid position with no overlap
      const getValidPosition = (attempts = 50) => {
        for (let i = 0; i < attempts; i++) {
          // Divide screen into 3 vertical sections for better distribution
          const section = Math.floor(Math.random() * 3);
          let x, y;

          switch (section) {
            case 0: // Left section
              x = random(5, 30);
              y = random(5, 65);
              break;
            case 1: // Middle section
              x = random(35, 65);
              y = random(5, 65);
              break;
            case 2: // Right section
              x = random(70, 95);
              y = random(5, 65);
              break;
          }

          if (!hasOverlap(x, y)) {
            return { x, y };
          }
        }
        return null;
      };

      // Create popups with collision detection
      const numPopups = 12; // Fewer popups for less crowding
      
      for (let i = 0; i < numPopups; i++) {
        const position = getValidPosition();
        if (!position) continue;

        const type = types[Math.floor(Math.random() * types.length)];
        const content = popupContents[type][Math.floor(Math.random() * popupContents[type].length)];

        newPopups.push({
          id: i,
          x: position.x,
          y: position.y,
          type,
          content,
          // Delay based on position - popups appear from center outward
          delay: (Math.abs(position.x - 50) + Math.abs(position.y - 35)) * 0.02
        });
      }

      // Sort by distance from center for outward animation
      newPopups.sort((a, b) => {
        const distA = Math.abs(a.x - 50) + Math.abs(a.y - 35);
        const distB = Math.abs(b.x - 50) + Math.abs(b.y - 35);
        return distA - distB;
      });

      setPopups(newPopups);
    };

    generatePopups();
    
    // Adjust timing sequence
    const matrixTimer = setTimeout(() => {
      setShowMatrix(true);
    }, 3500);

    const glitchTimer = setTimeout(() => {
      setShowGlitch(true);
    }, 4500);

    const shatterTimer = setTimeout(() => {
      setIsShattered(true);
    }, 5500);

    // Cleanup timers
    return () => {
      clearTimeout(matrixTimer);
      clearTimeout(glitchTimer);
      clearTimeout(shatterTimer);
    };
  }, []);

  // Canvas and shattering effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create initial interface
    const drawInterface = (): InterfaceRect => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const interfaceWidth = Math.min(600, canvas.width - 40);
      const interfaceHeight = Math.min(400, canvas.height - 40);
      const x = (canvas.width - interfaceWidth) / 2;
      const y = (canvas.height - interfaceHeight) / 2;

      if (!isShattered) {
        // Interface background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(x, y, interfaceWidth, interfaceHeight);
        
        // Header
        ctx.fillStyle = '#2a2a4e';
        ctx.fillRect(x, y, interfaceWidth, 50);
      }

      return {
        x,
        y,
        width: interfaceWidth,
        height: interfaceHeight
      };
    };

    const interfaceRect = drawInterface();

    // Create and animate shards
    if (isShattered) {
      const createShards = () => {
        const shardSize = 20;
        const newShards: Shard[] = [];

        for (let x = 0; x < interfaceRect.width; x += shardSize) {
          for (let y = 0; y < interfaceRect.height; y += shardSize) {
            const shard: Shard = {
              x: interfaceRect.x + x,
              y: interfaceRect.y + y,
              width: shardSize,
              height: shardSize,
              rotation: Math.random() * 360,
              velocityX: (Math.random() - 0.5) * 15,
              velocityY: (Math.random() - 0.5) * 15,
              rotationSpeed: (Math.random() - 0.5) * 10
            };
            newShards.push(shard);
          }
        }

        setShards(newShards);
      };

      createShards();
    }

    // Animate shards
    let animationFrame: number;
    const animateShards = () => {
      if (!ctx || !isShattered) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      shards.forEach((shard) => {
        ctx.save();
        ctx.translate(shard.x + shard.width / 2, shard.y + shard.height / 2);
        ctx.rotate((shard.rotation * Math.PI) / 180);
        
        // Create gradient for shard
        const gradient = ctx.createLinearGradient(
          -shard.width/2, -shard.height/2,
          shard.width/2, shard.height/2
        );
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#2a2a4e');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-shard.width / 2, -shard.height / 2, shard.width, shard.height);
        
        // Add glowing edge effect
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(-shard.width / 2, -shard.height / 2, shard.width, shard.height);
        ctx.restore();

        // Update shard position with more dramatic movement
        shard.x += shard.velocityX;
        shard.y += shard.velocityY;
        shard.rotation += shard.rotationSpeed;
        shard.velocityY += 0.5; // Increased gravity
        
        // Add slight spin deceleration
        shard.rotationSpeed *= 0.99;
      });

      animationFrame = requestAnimationFrame(animateShards);
    };

    if (isShattered) {
      animateShards();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isShattered, shards]);

  const SystemCrashScreen: React.FC = () => {
    const [glitchText, setGlitchText] = useState('');
    const [errorCode, setErrorCode] = useState('');
    
    useEffect(() => {
      const glitchInterval = setInterval(() => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';
        let text = '';
        for (let i = 0; i < 50; i++) {
          text += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setGlitchText(text);
      }, 100);

      const errorCodes = [
        'ERR_SYSTEM_OVERLOAD',
        'CRITICAL_FAILURE_0x8F',
        'MEMORY_CORRUPTION',
        'STACK_OVERFLOW_0xDE',
      ];
      
      let codeIndex = 0;
      const errorInterval = setInterval(() => {
        setErrorCode(errorCodes[codeIndex]);
        codeIndex = (codeIndex + 1) % errorCodes.length;
      }, 800);

      return () => {
        clearInterval(glitchInterval);
        clearInterval(errorInterval);
      };
    }, []);

    return (
      <motion.div 
        className={styles.systemCrash}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.crashScreen}>
          <div className={styles.crashHeader}>
            <span className={styles.errorSymbol}>!</span>
            SYSTEM FAILURE
            <span className={styles.blinkingCursor}>_</span>
          </div>
          <div className={styles.crashBody}>
            <div className={styles.crashLine}>
              <span className={styles.errorCode}>{errorCode}</span>
              <span className={styles.glitchText}>{glitchText}</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} />
            </div>
            <div className={styles.crashMessages}>
              {[
                'Attempting system recovery...',
                'Scanning memory blocks...',
                'Detecting corrupted sectors...',
                'Recovery failed. Initiating shutdown...'
              ].map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.5 }}
                  className={styles.crashMessage}
                >
                  {msg}
                </motion.div>
              ))}
            </div>
          </div>
          <div className={styles.glitchOverlay} />
        </div>
      </motion.div>
    );
  };

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Base Layer */}
      <div className={styles.baseLayer}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>

      {/* Matrix Effect Layer */}
      {showMatrix && !isShattered && (
        <div className={styles.matrixLayer}>
          <div className={styles.matrixEffect}>
            {Array.from({ length: 50 }).map((_, i) => (
              <div 
                key={i} 
                className={styles.matrixColumn}
                style={{ 
                  animationDelay: `${Math.random() * 2}s`,
                  left: `${(i / 50) * 100}%`,
                  animationDuration: `${15 + Math.random() * 10}s`
                }}
              >
                {Array.from({ length: 25 }).map((_, j) => (
                  <span 
                    key={j}
                    style={{ 
                      animationDelay: `${Math.random() * 5}s`,
                      color: j % 3 === 0 ? '#ff0' : j % 2 === 0 ? '#0f0' : '#0a0'
                    }}
                  >
                    {String.fromCharCode(33 + Math.random() * 93)}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Popup Layer */}
      <div className={styles.popupLayer}>
        <AnimatePresence>
          {!isShattered && popups.map((popup) => (
            <motion.div
              key={popup.id}
              className={`${styles.popup} ${styles[popup.type]}`}
              initial={{ opacity: 0, scale: 0.5, x: `${popup.x}%`, y: `${popup.y}%` }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: [`${popup.x}%`, `${popup.x + (Math.random() - 0.5) * 10}%`],
                y: [`${popup.y}%`, `${popup.y + (Math.random() - 0.5) * 10}%`]
              }}
              exit={{ 
                opacity: 0,
                scale: 0,
                rotate: [0, Math.random() * 180],
                transition: { duration: 0.3 }
              }}
              transition={{ 
                delay: popup.delay,
                duration: 0.5,
                type: "spring",
                stiffness: 150,
                damping: 15
              }}
            >
              <div className={styles.popupHeader}>
                <div className={styles.popupControls}>
                  <span className={styles.popupControl}></span>
                  <span className={styles.popupControl}></span>
                  <span className={styles.popupControl}></span>
                </div>
                <span className={styles.popupTitle}>{popup.type.toUpperCase()}</span>
              </div>
              <div className={styles.popupContent}>
                {popup.content}
                <div className={styles.popupStats}>
                  <span>Queue: {Math.floor(Math.random() * 500) + 100}</span>
                  <span>Wait: {Math.floor(Math.random() * 30) + 5}d</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* System Crash Layer */}
      {isShattered && (
        <SystemCrashScreen />
      )}
    </div>
  );
};

export default ShatteringInterface;
