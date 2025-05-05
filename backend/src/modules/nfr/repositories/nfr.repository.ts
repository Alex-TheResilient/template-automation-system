import { prisma } from '../../../shared/database/prisma';
import { NfrDTO } from '../models/nfr.model';

export class NfrRepository {
  /**
   * Creates a new non-functional requirement in the database
   */
  async create(data: NfrDTO) {
    const counter = await this.getNextCounter(data.projectId);
    const code = `RNF-${counter.toString().padStart(4, '0')}`;

    return prisma.nonFunctionalRequirement.create({
      data: {
        ...data,
        code: code,
        version: '00.01', // Versión inicial
        creationDate: new Date(),
      },
    });
  }

  /**
   * Gets all non-functional requirements with pagination
   */
  async findAll(skip: number, take: number, projectId?: string) {
    return prisma.nonFunctionalRequirement.findMany({
      where: {
        ...(projectId && { projectId: projectId }),
      },
      skip,
      take,
      orderBy: {
        creationDate: 'desc'
      }
    });
  }

  /**
   * Finds a non-functional requirement by ID
   */
  async findById(id: string) {
    return prisma.nonFunctionalRequirement.findUnique({
      where: { id },
    });
  }

  /**
   * Finds a non-functional requirement by code
   */
  async findByCode(code: string) {
    return prisma.nonFunctionalRequirement.findUnique({
      where: { code },
    });
  }

  /**
   * Updates an existing non-functional requirement
   */
  async update(code: string, data: Partial<NfrDTO>, newVersion?: string) {
    return prisma.nonFunctionalRequirement.update({
      where: { code },
      data: {
        ...data,
        ...(newVersion && { version: newVersion }),
        modificationDate: new Date(),
      },
    });
  }

  /**
   * Deletes a non-functional requirement by ID
   */
  async delete(id: string) {
    return prisma.nonFunctionalRequirement.delete({
      where: { id },
    });
  }

  /**
   * Gets a non-functional requirement with its related risks
   */
  async findWithRisks(code: string) {
    const nfr = await prisma.nonFunctionalRequirement.findUnique({
      where: { code },
    });

    if (!nfr) {
      return null;
    }

    const risks = await prisma.risk.findMany({
      where: {
        entityType: 'NFR',
        registryCode: code,
      },
    });

    return {
      ...nfr,
      risks: risks,
    };
  }

  /**
   * Searches non-functional requirements by name
   */
  async searchByName(name: string, projectId?: string) {
    return prisma.nonFunctionalRequirement.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
        ...(projectId && { projectId: projectId }),
      },
      orderBy: {
        creationDate: 'desc',
      },
    });
  }

  /**
   * Searches non-functional requirements by date (month and year)
   */
  async searchByDate(month: number, year: number, projectId?: string) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return prisma.nonFunctionalRequirement.findMany({
      where: {
        creationDate: {
          gte: startDate,
          lte: endDate,
        },
        ...(projectId && { projectId: projectId }),
      },
      orderBy: {
        creationDate: 'desc',
      },
    });
  }

  /**
   * Searches non-functional requirements by status
   */
  async searchByStatus(status: string, projectId?: string) {
    return prisma.nonFunctionalRequirement.findMany({
      where: {
        status: status,
        ...(projectId && { projectId: projectId }),
      },
      orderBy: {
        creationDate: 'desc',
      },
    });
  }

  /**
   * Searches non-functional requirements by quality attribute
   */
  async searchByQualityAttribute(qualityAttribute: string, projectId?: string) {
    return prisma.nonFunctionalRequirement.findMany({
      where: {
        qualityAttribute: qualityAttribute,
        ...(projectId && { projectId: projectId }),
      },
      orderBy: {
        creationDate: 'desc',
      },
    });
  }

  /**
   * Gets next counter for generating unique codes
   */
  async getNextCounter(projectId: string) {
    const counter = await prisma.counter.upsert({
      where: {
        entity_contextId: {
          entity: 'nfr',
          contextId: projectId
        }
      },
      create: {
        entity: 'nfr',
        contextId: projectId,
        counter: 1,
      },
      update: {
        counter: { increment: 1 },
      },
    });

    return counter.counter;
  }

  /**
   * Gets next code for a new non-functional requirement
   */
  async getNextCode(projectId: string): Promise<string> {
    const counter = await this.getNextCounter(projectId);
    return `RNF-${counter.toString().padStart(4, '0')}`;
  }

  /**
   * Gets all non-functional requirements by project
   */
  async findByProject(projectId: string) {
    return prisma.nonFunctionalRequirement.findMany({
      where: { projectId },
      orderBy: {
        creationDate: 'desc',
      },
    });
  }
}

// Export singleton instance of the repository
export const nfrRepository = new NfrRepository();