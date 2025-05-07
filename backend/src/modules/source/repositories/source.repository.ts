// source.repository.ts
import { prisma } from '../../../shared/database/prisma';
import { SourceDTO } from '../models/source.model';

export class SourceRepository {
  async create(projectId: string, data: SourceDTO) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new Error('Project not found');

    const code = await this.generateCode(projectId);
    return prisma.source.create({
      data: {
        ...data,
        version: '01.00',
        code : code,
        projectId : projectId,
        creationDate: new Date(),
      },
      include: { project: { select: { code: true } } },
    });
  }

  async update(code: string, data: Partial<SourceDTO>, newVersion?: string) {
    const current = await prisma.source.findFirst({ where: { code } });
    if (!current) throw new Error('Source not found');

    const version = newVersion || this.incrementVersion(current.version);
    return prisma.source.update({
      where: { id: current.id },
      data: { ...data, version, modificationDate: new Date() },
    });
  }

  async findAllByProject(projectId: string, skip = 0, take = 20) {
    return prisma.source.findMany({
      where: { projectId },
      skip,
      take,
      orderBy: { creationDate: 'desc' },
      include: { project: { select: { code: true } } },
    });
  }

  async findByCode(code: string) {
    return prisma.source.findFirst({ 
        where: { code },
        include: { project: { select: { code: true } } },
    });
    
  }

  async findByCodeAndProject(code: string, projectId: string) {
    return prisma.source.findFirst({ 
        where: { code, projectId },
        include: { project: { select: { code: true } } },
    });
  }

  async delete(id: string) {
    return prisma.source.delete({ where: { id } });
  }

  async searchByName(projectId: string, name: string) {
    return prisma.source.findMany({
      where: { 
        projectId, 
        name: { contains: name, mode: 'insensitive' } 
    },
      orderBy: { creationDate: 'desc' },
    });
  }

  async getNextCode(projectId: string): Promise<string> {
    const counter = await this.getNextCounter(projectId);
    return `FUE-${counter.toString().padStart(3, '0')}`;
  }

  async generateCode(projectId: string): Promise<string> {
    const counter = await this.getNextCounter(projectId);
    return `FUE-${counter.toString().padStart(3, '0')}`;
  }

  private async getNextCounter(projectId: string): Promise<number> {
    
    if (!projectId || typeof projectId !== 'string') {
        throw new Error('Invalid project ID');
      }
    console.log(`Generating counter for project ID: ${projectId}`);

    
    try {
        const counter = await prisma.counter.upsert({
        where: {
            entity_contextId: { 
                entity: 'SOURCE', 
                contextId: projectId 
            },
        },
        update: { counter: { increment: 1 } },
        create: { entity: 'SOURCE', 
            contextId: projectId, 
            counter: 1 },
        });
        console.log(`Generated counter: ${counter.counter} for project: ${projectId}`);
        return counter.counter;
    }catch (error) {
        console.error("Error generating counter:", error);
        if (error instanceof Error) {
        throw new Error(`Failed to generate counter: ${error.message}`);
        }
        throw new Error('Failed to generate counter due to an unknown error');
    }
}

  private incrementVersion(version: string): string {
    const [major, minor] = version.split('.');
    return `${major}.${(parseInt(minor) + 1).toString().padStart(2, '0')}`;
  }
}

export const sourceRepository = new SourceRepository();
