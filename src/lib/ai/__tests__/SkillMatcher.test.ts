import { SkillMatcher } from '../SkillMatcher';
import { Job } from '../../types';

describe('SkillMatcher', () => {
  let skillMatcher: SkillMatcher;

  beforeEach(() => {
    skillMatcher = new SkillMatcher();
  });

  const mockJob: Job = {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Tech Corp',
    description: 'Looking for an experienced frontend developer',
    requirements: ['5+ years experience', 'Bachelor\'s degree'],
    skills: ['React', 'TypeScript', 'Next.js', 'TailwindCSS'],
    location: 'Remote',
    type: 'full-time',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  describe('matchJobToSkills', () => {
    it('should return a valid match result', async () => {
      const candidateSkills = ['React', 'TypeScript', 'Vue.js'];
      
      const result = await skillMatcher.matchJobToSkills(mockJob, candidateSkills);
      
      expect(result).toHaveProperty('score');
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
      expect(result.jobId).toBe(mockJob.id);
      expect(result.matchedSkills).toContain('React');
      expect(result.matchedSkills).toContain('TypeScript');
      expect(result.missingSkills).toContain('Next.js');
      expect(result.missingSkills).toContain('TailwindCSS');
    });

    it('should handle empty candidate skills', async () => {
      const candidateSkills: string[] = [];
      
      const result = await skillMatcher.matchJobToSkills(mockJob, candidateSkills);
      
      expect(result.score).toBe(0);
      expect(result.matchedSkills).toHaveLength(0);
      expect(result.missingSkills).toEqual(mockJob.skills);
    });

    it('should handle perfect match', async () => {
      const candidateSkills = [...mockJob.skills];
      
      const result = await skillMatcher.matchJobToSkills(mockJob, candidateSkills);
      
      expect(result.score).toBe(1);
      expect(result.matchedSkills).toEqual(mockJob.skills);
      expect(result.missingSkills).toHaveLength(0);
    });
  });

  describe('improveModel', () => {
    it('should accept feedback for model improvement', async () => {
      const candidateSkills = ['React', 'TypeScript'];
      const matchResult = await skillMatcher.matchJobToSkills(mockJob, candidateSkills);
      
      await expect(
        skillMatcher.improveModel([
          { matchResult, actualSuccess: true }
        ])
      ).resolves.not.toThrow();
    });
  });
});
