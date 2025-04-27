import { Organization } from '@prisma/client';
// Importar la instancia compartida
import { prisma } from '../../../shared/database/prisma';


export class OrganizationRepository {
  /**
   * Crea una nueva organización en la base de datos
   */
  async create(data: Omit<Organization, 'id' | 'creationDate' | 'modificationDate'>): Promise<Organization> {
    return prisma.organization.create({
      data: {
        ...data,
        creationDate: new Date(),
      },
    });
  }

  /**
   * Obtiene todas las organizaciones con paginación
   */
  async findAll(skip: number, take: number): Promise<Organization[]> {
    return prisma.organization.findMany({
      skip,
      take,
      orderBy: {
        creationDate: 'desc'
      }
    });
  }

  /**
   * Busca una organización por su ID
   */
  async findById(id: string): Promise<Organization | null> {
    return prisma.organization.findUnique({
      where: { id },
    });
  }

  /**
   * Busca una organización por su código
   */
  async findByCode(code: string): Promise<Organization | null> {
    return prisma.organization.findUnique({
      where: { code },
    });
  }

  /**
   * Actualiza una organización existente
   */
  async update(code: string, data: Partial<Organization>): Promise<Organization> {
    return prisma.organization.update({
      where: { code },
      data: {
        ...data,
        modificationDate: new Date(),
      },
    });
  }

  /**
   * Elimina una organización por su ID
   */
  async delete(id: string): Promise<Organization> {
    return prisma.organization.delete({
      where: { id },
    });
  }

  /**
   * Obtiene una organización con sus proyectos
   */
  async findWithProjects(code: string) {
    return prisma.organization.findUnique({
      where: { code },
      include: { projects: true },
    });
  }

  /**
   * Busca organizaciones por nombre
   */
  async searchByName(name: string): Promise<Organization[]> {
    return prisma.organization.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      orderBy: {
        creationDate: 'desc',
      },
    });
  }

  /**
   * Busca organizaciones por fecha (mes y año)
   */
  async searchByDate(month: number, year: number): Promise<Organization[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return prisma.organization.findMany({
      where: {
        creationDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        creationDate: 'desc',
      },
    });
  }

  /**
   * Incrementa el contador para generar códigos únicos
   */
  async getNextCounter(): Promise<number> {
    const counter = await prisma.counter.upsert({
      where: { 
        entity_contextId: {
          entity: 'organization',
          contextId: 'global'
        }
      },
      create: {
        entity: 'organization',
        contextId: 'global',
        counter: 1,
      },
      update: {
        counter: { increment: 1 },
      },
    });

    return counter.counter;
  }
}