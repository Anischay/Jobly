import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './ChaoticNetwork.module.css';

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'job' | 'applicant';
}

interface Connection {
  from: Node;
  to: Node;
  opacity: number;
}

const ChaoticNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const animationFrameRef = useRef<number>();

  // Initialize nodes
  useEffect(() => {
    const nodes: Node[] = [];
    // Create 30 job nodes and 50 applicant nodes
    for (let i = 0; i < 80; i++) {
      nodes.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        type: i < 30 ? 'job' : 'applicant'
      });
    }
    nodesRef.current = nodes;

    // Create initial connections
    const connections: Connection[] = [];
    nodes.forEach(node => {
      if (node.type === 'applicant') {
        // Each applicant tries to connect to 2-3 random jobs
        const numConnections = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < numConnections; i++) {
          const jobNodes = nodes.filter(n => n.type === 'job');
          const randomJob = jobNodes[Math.floor(Math.random() * jobNodes.length)];
          connections.push({
            from: node,
            to: randomJob,
            opacity: Math.random() * 0.5 + 0.1
          });
        }
      }
    });
    connectionsRef.current = connections;

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update nodes
      nodesRef.current.forEach(node => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.type === 'job' ? 6 : 4, 0, Math.PI * 2);
        ctx.fillStyle = node.type === 'job' ? '#00ff88' : '#00ffff';
        ctx.fill();
      });

      // Draw connections
      connectionsRef.current.forEach(conn => {
        ctx.beginPath();
        ctx.moveTo(conn.from.x, conn.from.y);
        ctx.lineTo(conn.to.x, conn.to.y);
        ctx.strokeStyle = `rgba(0, 255, 255, ${conn.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.7; // 70% of viewport height
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <motion.div 
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <canvas 
        ref={canvasRef}
        className={styles.canvas}
      />
      <div className={styles.overlay}>
        <motion.div 
          className={styles.jobLabel}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Jobs
        </motion.div>
        <motion.div 
          className={styles.applicantLabel}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          Applicants
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChaoticNetwork;
