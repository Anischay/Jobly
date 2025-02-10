'use client'

import { motion } from 'framer-motion'
import { FC } from 'react'

interface FeatureIconProps {
  className?: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: FC<FeatureIconProps>;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

export const FeatureCard: FC<FeatureCardProps> = ({ feature, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
  >
    <feature.icon className="w-12 h-12 text-blue-500 mb-4" />
    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
    <p className="text-gray-400">{feature.description}</p>
  </motion.div>
) 