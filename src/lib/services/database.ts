import { PrismaClient } from '@prisma/client';
import { SkillGraph } from '../types';

// Initialize Prisma Client
const prisma = new PrismaClient();

export class DatabaseService {
  // Skill Management
  async createSkill(name: string, category: string) {
    return prisma.skill.create({
      data: {
        name: name.toLowerCase(),
        category,
        weight: 1.0
      }
    });
  }

  async updateSkillEmbedding(skillId: string, embedding: Buffer) {
    return prisma.skill.update({
      where: { id: skillId },
      data: { embedding }
    });
  }

  async getSkillByName(name: string) {
    return prisma.skill.findUnique({
      where: { name: name.toLowerCase() }
    });
  }

  // User Skills
  async addUserSkill(userId: string, skillId: string, proficiency: number) {
    return prisma.userSkill.create({
      data: {
        userId,
        skillId,
        proficiency
      }
    });
  }

  async getUserSkills(userId: string) {
    return prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true }
    });
  }

  // Job Skills
  async addJobSkill(jobListingId: string, skillId: string, importance: number, required: boolean) {
    return prisma.jobSkill.create({
      data: {
        jobListingId,
        skillId,
        importance,
        required
      }
    });
  }

  async getJobSkills(jobListingId: string) {
    return prisma.jobSkill.findMany({
      where: { jobListingId },
      include: { skill: true }
    });
  }

  // Skill Matching
  async createSkillMatch(matchId: string, skillId: string, score: number) {
    return prisma.skillMatch.create({
      data: {
        matchId,
        skillId,
        score
      }
    });
  }

  async getSkillMatches(matchId: string) {
    return prisma.skillMatch.findMany({
      where: { matchId },
      include: { skill: true }
    });
  }

  // Skill Relations
  async createSkillRelation(
    fromSkillId: string,
    toSkillId: string,
    type: string,
    weight: number
  ) {
    return prisma.skillRelation.create({
      data: {
        fromSkillId,
        toSkillId,
        type,
        weight
      }
    });
  }

  async getSkillGraph(): Promise<SkillGraph> {
    const skills = await prisma.skill.findMany();
    const relations = await prisma.skillRelation.findMany();

    return {
      nodes: skills.map(skill => ({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        weight: skill.weight
      })),
      edges: relations.map(relation => ({
        source: relation.fromSkillId,
        target: relation.toSkillId,
        weight: relation.weight
      }))
    };
  }

  // Job Listings
  async createJobListing(data: {
    title: string;
    company: string;
    location: string;
    type: string;
    description: string;
    requirements: string;
    salary?: string;
    userId: string;
  }) {
    return prisma.jobListing.create({
      data
    });
  }

  async getJobListings(filters?: {
    location?: string;
    type?: string;
    skills?: string[];
  }) {
    const where: any = {};

    if (filters?.location) {
      where.location = filters.location;
    }
    if (filters?.type) {
      where.type = filters.type;
    }
    if (filters?.skills?.length) {
      where.skills = {
        some: {
          skill: {
            name: {
              in: filters.skills.map(s => s.toLowerCase())
            }
          }
        }
      };
    }

    return prisma.jobListing.findMany({
      where,
      include: {
        skills: {
          include: {
            skill: true
          }
        }
      }
    });
  }

  // Matches
  async createMatch(userId: string, jobListingId: string, scores: {
    overallScore: number;
    skillMatch: number;
    experienceMatch: number;
    cultureFit: number;
  }) {
    return prisma.match.create({
      data: {
        userId,
        jobListingId,
        ...scores
      }
    });
  }

  async getMatches(userId: string) {
    return prisma.match.findMany({
      where: { userId },
      include: {
        jobListing: true,
        skillMatches: {
          include: {
            skill: true
          }
        }
      }
    });
  }
}

// Export singleton instance
export const db = new DatabaseService();
