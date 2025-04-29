// Importar la instancia compartida
import { prisma } from '../../../shared/database/prisma';
import { OrganizationDTO } from '../models/organization.model';

export class OrganizationRepository {
  /**
   * Crea una nueva organización en la base de datos
   */
  async create(data: OrganizationDTO) {
    const counter = await this.getNextCounter();
    const code = `ORG-${counter.toString().padStart(3, '0')}`;

    return prisma.organization.create({
      data: {
        ...data,
        code: code,
        version: '01.00', // Versión inicial
        creationDate: new Date(),
      },
    });
  }

  /**
   * Obtiene todas las organizaciones con paginación
   */
  async findAll(skip: number, take: number) {
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
  async findById(id: string) {
    return prisma.organization.findUnique({
      where: { id },
    });
  }

  /**
   * Busca una organización por su código
   */
  async findByCode(code: string) {
    return prisma.organization.findUnique({
      where: { code },
    });
  }

  /**
   * Actualiza una organización existente
   */
  async update(code: string, data: Partial<OrganizationDTO>) {
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
  async delete(id: string) {
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
  async searchByName(name: string) {
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
  async searchByDate(month: number, year: number) {
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
  async getNextCounter() {
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

  async getNextCode(): Promise<string> {
    const counter = await this.getNextCounter();
    return `ORG-${counter.toString().padStart(3, '0')}`;
  }
}

// Exportar una instancia singleton del repositorio
export const organizationRepository = new OrganizationRepository();