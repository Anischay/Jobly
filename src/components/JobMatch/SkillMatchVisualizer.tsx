'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchResult } from '@/lib/types';

interface SkillMatchVisualizerProps {
  matchResult: MatchResult;
  onSkillClick?: (skill: string) => void;
}

export default function SkillMatchVisualizer({
  matchResult,
  onSkillClick
}: SkillMatchVisualizerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate score colors
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-500';
    if (score >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Animation variants
  const containerVariants = {
    collapsed: {
      height: '100px',
      transition: { duration: 0.3 }
    },
    expanded: {
      height: 'auto',
      transition: { duration: 0.3 }
    }
  };

  const skillVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 }
  };

  return (
    <motion.div
      ref={containerRef}
      className="bg-gray-800 rounded-lg p-6 shadow-xl"
      variants={containerVariants}
      initial="collapsed"
      animate={isExpanded ? 'expanded' : 'collapsed'}
    >
      {/* Score Display */}
      <div className="flex items-center mb-6">
        <div className="relative w-full h-4 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`absolute h-full ${getScoreColor(matchResult.score)}`}
            initial={{ width: 0 }}
            animate={{ width: `${matchResult.score * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="ml-4 text-white font-bold">
          {Math.round(matchResult.score * 100)}%
        </span>
      </div>

      {/* Matched Skills */}
      <div className="mb-4">
        <h3 className="text-white font-semibold mb-2">Matched Skills</h3>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {matchResult.matchedSkills.map(skill => (
              <motion.button
                key={skill}
                variants={skillVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="px-3 py-1 bg-green-600 text-white rounded-full text-sm
                         hover:bg-green-500 transition-colors"
                onClick={() => onSkillClick?.(skill)}
              >
                {skill}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Missing Skills */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4"
          >
            <h3 className="text-white font-semibold mb-2">Missing Skills</h3>
            <div className="flex flex-wrap gap-2">
              {matchResult.missingSkills.map(skill => (
                <motion.button
                  key={skill}
                  variants={skillVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="px-3 py-1 bg-red-600 text-white rounded-full text-sm
                           hover:bg-red-500 transition-colors"
                  onClick={() => onSkillClick?.(skill)}
                >
                  {skill}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand/Collapse Button */}
      <motion.button
        className="w-full mt-2 text-gray-400 hover:text-white transition-colors
                   focus:outline-none"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isExpanded ? 'Show Less' : 'Show More'}
      </motion.button>
    </motion.div>
  );
}
