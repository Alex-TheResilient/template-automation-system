import { prisma } from '../../../shared/database/prisma';
import { RiskDTO } from '../models/risk.model';

export class RiskRepository {
  /**
   * Creates a new risk in the database
   */
  async create(data: RiskDTO) {
    const counter = await this.getNextCounter(data.projectId);
    const code = `RISK-${counter.toString().padStart(4, '0')}`;

    return prisma.risk.create({
      data: {
        ...data,
        code: code,
        creationDate: new Date(),
      },
    });
  }

  /**
   * Gets all risks with pagination
   */
  async findAll(skip: number, take: number, projectId?: string) {
    return prisma.risk.findMany({
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
   * Finds a risk by ID
   */
  async findById(id: string) {
    return prisma.risk.findUnique({
      where: { id },
    });
  }

  /**
   * Finds a risk by code
   */
  async findByCode(code: string) {
    return prisma.risk.findUnique({
      where: { code },
    });
  }

  /**
   * Updates an existing risk
   */
  async update(code: string, data: Partial<RiskDTO>) {
    return prisma.risk.update({
      where: { code },
      data: {
        ...data,
      },
    });
  }

  /**
   * Deletes a risk by ID
   */
  async delete(id: string) {
    return prisma.risk.delete({
      where: { id },
    });
  }

  /**
   * Gets risks by entity type and registry code
   */
  async findByEntityAndRegistry(entityType: string, registryCode: string) {
    return prisma.risk.findMany({
      where: { 
        entityType: entityType,
        registryCode: registryCode
      },
      orderBy: {
        creationDate: 'desc',
      },
    });
  }

  /**
   * Gets risks by project ID
   */
  async findByProject(projectId: string) {
    return prisma.risk.findMany({
      where: { projectId },
      orderBy: {
        creationDate: 'desc',
      },
    });
  }

  /**
   * Searches risks by status
   */
  async searchByStatus(status: string, projectId?: string) {
    return prisma.risk.findMany({
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
   * Searches risks by date (month and year)
   */
  async searchByDate(month: number, year: number, projectId?: string) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return prisma.risk.findMany({
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
   * Gets next counter for generating unique codes
   */
  async getNextCounter(projectId: string) {
    const counter = await prisma.counter.upsert({
      where: {
        entity_contextId: {
          entity: 'risk',
          contextId: projectId
        }
      },
      create: {
        entity: 'risk',
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
   * Gets next code for a new risk
   */
  async getNextCode(projectId: string): Promise<string> {
    const counter = await this.getNextCounter(projectId);
    return `RISK-${counter.toString().padStart(4, '0')}`;
  }
}

// Export singleton instance of the repository
export const riskRepository = new RiskRepository();