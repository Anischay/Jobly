// Core Types

export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'candidate' | 'employer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  skills: string[];
  location: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchResult {
  score: number;
  jobId: string;
  userId: string;
  matchedSkills: string[];
  missingSkills: string[];
  createdAt: Date;
}

export interface SkillGraph {
  nodes: SkillNode[];
  edges: SkillEdge[];
}

export interface SkillNode {
  id: string;
  name: string;
  category: string;
  weight: number;
}

export interface SkillEdge {
  source: string;
  target: string;
  weight: number;
}
