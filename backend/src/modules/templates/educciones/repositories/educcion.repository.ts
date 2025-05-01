import { prisma } from '../../../../shared/database/prisma';
import { EduccionDTO } from '../models/educcion.model';

export class EduccionRepository {
  /**
   * Creates a new educcion in the database
   */
  async create(projectId: string, data: EduccionDTO) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const code = await this.generateCode(projectId);

    return prisma.educcion.create({
      data: {
        name: data.name,
        description: data.description || '',
        status: data.status || 'Pending',
        importance: data.importance || 'Medium',
        comment: data.comment,
        code: code,
        version: '01.00',
        projectId: projectId,
        creationDate: new Date(),
      },
      include: {
        project: {
          select: {
            code: true,
          },
        },
      },
    });
  }

  /**
   * Updates an existing educcion
   */
  async update(code: string, data: Partial<EduccionDTO>, newVersion?: string) {
    // Primero obtener la educción actual para conocer su versión
    const currentEduccion = await prisma.educcion.findUnique({
      where: { code },
      select: { version: true },
    });

    if (!currentEduccion) {
      throw new Error(`Educcion with code ${code} not found`);
    }

    // Calcular la nueva versión (usar la proporcionada o incrementar automáticamente)
    const version = newVersion || this.incrementVersion(currentEduccion.version);

    return prisma.educcion.update({
      where: { code },
      data: {
        ...data,
        version, // Siempre actualizar la versión
        modificationDate: new Date(),
      },
      include: {
        project: {
          select: {
            code: true,
          },
        },
      },
    });
  }

  /**
   * Deletes an educcion by its ID
   */
  async delete(id: string) {
    return prisma.educcion.delete({
      where: { id },
    });
  }

  /**
   * Gets all educciones from a project with pagination
   */
  async findAllByProject(projectId: string, skip: number = 0, take: number = 20) {
    return prisma.educcion.findMany({
      where: {
        projectId,
      },
      skip,
      take,
      orderBy: {
        creationDate: 'desc',
      },
      include: {
        project: {
          select: {
            code: true,
          },
        },
      },
    });
  }

  /**
   * Finds an educcion by its ID
   */
  async findById(id: string) {
    return prisma.educcion.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            code: true,
          },
        },
      },
    });
  }

  /**
   * Finds an educcion by its code
   */
  async findByCode(code: string) {
    return prisma.educcion.findUnique({
      where: { code },
      include: {
        project: {
          select: {
            code: true,
          },
        },
      },
    });
  }

  /**
   * Searches educciones by name
   */
  async searchByName(projectId: string, name: string) {
    return prisma.educcion.findMany({
      where: {
        projectId,
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: {
        creationDate: 'desc',
      },
      include: {
        project: {
          select: {
            code: true,
          },
        },
      },
    });
  }

  /**
   * Gets an educcion with its ilaciones
   */
  async getEduccionWithIlaciones(code: string) {
    return prisma.educcion.findUnique({
      where: { code },
      include: {
        ilaciones: true,
        project: {
          select: {
            code: true,
          },
        },
      },
    });
  }

  /**
   * Gets next code for a new educcion
   */
  async getNextCode(projectId: string): Promise<string> {
    const counter = await this.getNextCounter(projectId);
    return `EDU-${counter.toString().padStart(3, '0')}`;
  }

  /**
   * Increments the counter for generating unique codes
   */
  async getNextCounter(projectId: string): Promise<number> {
    // Usamos la restricción única compuesta [entity, contextId]
    const counterRecord = await prisma.counter.upsert({
      where: {
        entity_contextId: {
          entity: "educcion",
          contextId: projectId
        }
      },
      update: {
        counter: {
          increment: 1,
        },
      },
      create: {
        entity: "educcion",
        contextId: projectId,
        counter: 1,
      },
    });

    return counterRecord.counter;
  }

  /**
   * Generates a unique code for an educcion within a project
   */
  private async generateCode(projectId: string): Promise<string> {
    return this.getNextCode(projectId);
  }

  /**
   * Increments the version of an educcion
   */
  private incrementVersion(currentVersion: string): string {
    const [major, minor] = currentVersion.split('.');
    const newMinor = (parseInt(minor) + 1).toString().padStart(2, '0');
    return `${major}.${newMinor}`;
  }
}

// Export singleton instance of the repository
export const educcionRepository = new EduccionRepository();