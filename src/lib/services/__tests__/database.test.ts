import { PrismaClient } from '@prisma/client';
import { DatabaseService } from '../database';

// Mock PrismaClient
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    skill: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn()
    },
    userSkill: {
      create: jest.fn(),
      findMany: jest.fn()
    },
    jobSkill: {
      create: jest.fn(),
      findMany: jest.fn()
    },
    skillMatch: {
      create: jest.fn(),
      findMany: jest.fn()
    },
    skillRelation: {
      create: jest.fn(),
      findMany: jest.fn()
    },
    jobListing: {
      create: jest.fn(),
      findMany: jest.fn()
    },
    match: {
      create: jest.fn(),
      findMany: jest.fn()
    }
  }))
}));

describe('DatabaseService', () => {
  let db: DatabaseService;
  let prisma: PrismaClient;

  beforeEach(() => {
    jest.clearAllMocks();
    db = new DatabaseService();
    prisma = new PrismaClient();
  });

  describe('Skill Management', () => {
    it('should create a skill', async () => {
      const mockSkill = {
        id: '1',
        name: 'react',
        category: 'frontend',
        weight: 1.0
      };

      (prisma.skill.create as jest.Mock).mockResolvedValue(mockSkill);

      const result = await db.createSkill('React', 'frontend');
      expect(result).toEqual(mockSkill);
      expect(prisma.skill.create).toHaveBeenCalledWith({
        data: {
          name: 'react',
          category: 'frontend',
          weight: 1.0
        }
      });
    });

    it('should update skill embedding', async () => {
      const mockEmbedding = Buffer.from('test');
      const mockSkill = {
        id: '1',
        embedding: mockEmbedding
      };

      (prisma.skill.update as jest.Mock).mockResolvedValue(mockSkill);

      const result = await db.updateSkillEmbedding('1', mockEmbedding);
      expect(result).toEqual(mockSkill);
      expect(prisma.skill.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { embedding: mockEmbedding }
      });
    });
  });

  describe('User Skills', () => {
    it('should add user skill', async () => {
      const mockUserSkill = {
        id: '1',
        userId: 'user1',
        skillId: 'skill1',
        proficiency: 0.8
      };

      (prisma.userSkill.create as jest.Mock).mockResolvedValue(mockUserSkill);

      const result = await db.addUserSkill('user1', 'skill1', 0.8);
      expect(result).toEqual(mockUserSkill);
      expect(prisma.userSkill.create).toHaveBeenCalledWith({
        data: {
          userId: 'user1',
          skillId: 'skill1',
          proficiency: 0.8
        }
      });
    });
  });

  describe('Job Skills', () => {
    it('should add job skill', async () => {
      const mockJobSkill = {
        id: '1',
        jobListingId: 'job1',
        skillId: 'skill1',
        importance: 0.9,
        required: true
      };

      (prisma.jobSkill.create as jest.Mock).mockResolvedValue(mockJobSkill);

      const result = await db.addJobSkill('job1', 'skill1', 0.9, true);
      expect(result).toEqual(mockJobSkill);
      expect(prisma.jobSkill.create).toHaveBeenCalledWith({
        data: {
          jobListingId: 'job1',
          skillId: 'skill1',
          importance: 0.9,
          required: true
        }
      });
    });
  });

  describe('Skill Graph', () => {
    it('should return skill graph', async () => {
      const mockSkills = [
        { id: '1', name: 'react', category: 'frontend', weight: 1.0 },
        { id: '2', name: 'node', category: 'backend', weight: 1.0 }
      ];

      const mockRelations = [
        {
          id: '1',
          fromSkillId: '1',
          toSkillId: '2',
          weight: 0.8,
          type: 'COMPLEMENTARY'
        }
      ];

      (prisma.skill.findMany as jest.Mock).mockResolvedValue(mockSkills);
      (prisma.skillRelation.findMany as jest.Mock).mockResolvedValue(mockRelations);

      const result = await db.getSkillGraph();
      expect(result.nodes).toHaveLength(2);
      expect(result.edges).toHaveLength(1);
      expect(result.edges[0].source).toBe('1');
      expect(result.edges[0].target).toBe('2');
    });
  });

  describe('Job Listings', () => {
    it('should create job listing', async () => {
      const mockJob = {
        id: '1',
        title: 'Senior Dev',
        company: 'Tech Corp',
        location: 'Remote',
        type: 'full-time',
        description: 'Looking for a senior dev',
        requirements: '5+ years experience',
        userId: 'user1'
      };

      (prisma.jobListing.create as jest.Mock).mockResolvedValue(mockJob);

      const result = await db.createJobListing(mockJob);
      expect(result).toEqual(mockJob);
      expect(prisma.jobListing.create).toHaveBeenCalledWith({
        data: mockJob
      });
    });

    it('should filter job listings by skills', async () => {
      const mockJobs = [
        {
          id: '1',
          title: 'Senior Dev',
          skills: [
            { skill: { name: 'react' } }
          ]
        }
      ];

      (prisma.jobListing.findMany as jest.Mock).mockResolvedValue(mockJobs);

      const result = await db.getJobListings({ skills: ['React'] });
      expect(result).toEqual(mockJobs);
      expect(prisma.jobListing.findMany).toHaveBeenCalledWith({
        where: {
          skills: {
            some: {
              skill: {
                name: {
                  in: ['react']
                }
              }
            }
          }
        },
        include: {
          skills: {
            include: {
              skill: true
            }
          }
        }
      });
    });
  });
});
