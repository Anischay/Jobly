import { POST } from '../route';
import { skillMatcher } from '@/lib/ai/SkillMatcher';
import { dataPipeline } from '@/lib/data/DataPipeline';

jest.mock('@/lib/ai/SkillMatcher', () => ({
  skillMatcher: {
    matchJobToSkills: jest.fn()
  }
}));

jest.mock('@/lib/data/DataPipeline', () => ({
  dataPipeline: {
    normalizeSkills: jest.fn(skills => skills.map(s => s.toLowerCase()))
  }
}));

describe('POST /api/jobs/match', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return matched jobs', async () => {
    const mockSkills = ['React', 'TypeScript'];
    const mockScore = 0.8;

    (skillMatcher.matchJobToSkills as jest.Mock).mockResolvedValue({
      score: mockScore,
      jobId: '1',
      matchedSkills: mockSkills,
      missingSkills: ['Next.js']
    });

    const request = new Request('http://localhost:3001/api/jobs/match', {
      method: 'POST',
      body: JSON.stringify({
        skills: mockSkills,
        limit: 10,
        threshold: 0.6
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.matches).toHaveLength(1);
    expect(data.matches[0].match.score).toBe(mockScore);
    expect(dataPipeline.normalizeSkills).toHaveBeenCalledWith(mockSkills);
  });

  it('should validate input', async () => {
    const request = new Request('http://localhost:3001/api/jobs/match', {
      method: 'POST',
      body: JSON.stringify({
        skills: 'not-an-array', // Invalid input
        limit: 10,
        threshold: 0.6
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.error).toBe('Invalid input');
  });

  it('should respect threshold', async () => {
    const mockSkills = ['React'];
    const lowScore = 0.5;

    (skillMatcher.matchJobToSkills as jest.Mock).mockResolvedValue({
      score: lowScore,
      jobId: '1',
      matchedSkills: [],
      missingSkills: mockSkills
    });

    const request = new Request('http://localhost:3001/api/jobs/match', {
      method: 'POST',
      body: JSON.stringify({
        skills: mockSkills,
        threshold: 0.6 // Higher than the match score
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.matches).toHaveLength(0); // No matches above threshold
  });

  it('should limit results', async () => {
    const mockSkills = ['React', 'TypeScript'];
    const mockScore = 0.8;

    (skillMatcher.matchJobToSkills as jest.Mock).mockResolvedValue({
      score: mockScore,
      jobId: '1',
      matchedSkills: mockSkills,
      missingSkills: []
    });

    const request = new Request('http://localhost:3001/api/jobs/match', {
      method: 'POST',
      body: JSON.stringify({
        skills: mockSkills,
        limit: 1 // Only want one result
      })
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.matches).toHaveLength(1);
  });
});
