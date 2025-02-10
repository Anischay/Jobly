'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { SkillGraph as SkillGraphType } from '@/lib/types';

interface SkillGraphProps {
  data: SkillGraphType;
  width?: number;
  height?: number;
}

export default function SkillGraph({ 
  data, 
  width = 800, 
  height = 600 
}: SkillGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up the canvas
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Clear the canvas
    ctx.clearRect(0, 0, width, height);

    // Draw edges
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    data.edges.forEach(edge => {
      const sourceNode = data.nodes.find(n => n.id === edge.source);
      const targetNode = data.nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        ctx.beginPath();
        ctx.moveTo(sourceNode.x || 0, sourceNode.y || 0);
        ctx.lineTo(targetNode.x || 0, targetNode.y || 0);
        ctx.stroke();
      }
    });

    // Draw nodes
    data.nodes.forEach(node => {
      const x = node.x || Math.random() * width;
      const y = node.y || Math.random() * height;
      const radius = 5 + (node.weight || 1) * 3;

      // Node background
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(147, 51, 234, 0.3)'; // Purple
      ctx.fill();

      // Node border
      ctx.strokeStyle = '#9333EA';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Node label
      ctx.font = '12px Inter';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, x, y + radius + 15);
    });
  }, [data, width, height]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative"
    >
      <canvas
        ref={canvasRef}
        className="bg-gray-900 rounded-lg shadow-xl"
      />
    </motion.div>
  );
}
