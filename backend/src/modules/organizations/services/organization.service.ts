import { Organization } from '@prisma/client';
import { OrganizationRepository } from '../repositories/organization.repository';

export class OrganizationService {
  constructor(private repository: OrganizationRepository) {}

  /**
   * Crea una nueva organización
   */
  async createOrganization(data: Partial<Organization>): Promise<Organization> {
    // Generamos el código único
    const code = await this.generateCode();
    const version = '00.01';

    return this.repository.create({
      code,
      version,
      name: data.name ?? '',
      address: data.address || null,
      phone: data.phone || null,
      legalRepresentative: data.legalRepresentative || null,
      representativePhone: data.representativePhone || null,
      taxId: data.taxId || null,
      contact: data.contact || null,
      contactPhone: data.contactPhone || null,
      status: data.status || null,
      comments: data.comments || null,
    });
  }

  /**
   * Obtiene todas las organizaciones con paginación
   */
  async getOrganizations(page: number = 1, limit: number = 10): Promise<Organization[]> {
    const skip = (page - 1) * limit;
    return this.repository.findAll(skip, limit);
  }

  /**
   * Busca una organización por su código
   */
  async getOrganizationByCode(code: string): Promise<Organization | null> {
    return this.repository.findByCode(code);
  }

  /**
   * Obtiene una organización por su ID
   */
  async getOrganizationById(id: string): Promise<Organization | null> {
    return this.repository.findById(id);
  }

  /**
   * Actualiza una organización existente
   */
  async updateOrganization(code: string, data: Partial<Organization>): Promise<Organization> {
    // Verificamos que la organización existe
    const existingOrg = await this.repository.findByCode(code);
    if (!existingOrg) {
      throw new Error('Organization not found');
    }
    
    // Incrementamos la versión
    const newVersion = this.incrementVersion(existingOrg.version);
    
    return this.repository.update(code, {
      ...data,
      version: newVersion,
    });
  }

  /**
   * Elimina una organización
   */
  async deleteOrganization(id: string): Promise<Organization> {
    return this.repository.delete(id);
  }

  /**
   * Busca organizaciones por nombre
   */
  async searchOrganizations(name: string): Promise<Organization[]> {
    return this.repository.searchByName(name);
  }

  /**
   * Busca organizaciones por fecha
   */
  async searchOrganizationsByDate(month: number, year: number): Promise<Organization[]> {
    return this.repository.searchByDate(month, year);
  }

  /**
   * Obtiene una organización con sus proyectos
   */
  async getOrganizationWithProjects(code: string): Promise<any> {
    return this.repository.findWithProjects(code);
  }

  /**
   * Obtiene el siguiente código único para una organización
   */
  async getNextCode(): Promise<string> {
    const nextCounter = await this.repository.getNextCounter();
    return `ORG-${nextCounter.toString().padStart(3, '0')}`;
  }

  /**
   * Genera un código único para una nueva organización
   */
  private async generateCode(): Promise<string> {
    return this.getNextCode();
  }

  /**
   * Incrementa la versión siguiendo el patrón XX.YY
   */
  private incrementVersion(currentVersion: string): string {
    const [major, minor] = currentVersion.split('.').map(Number);
    return `${major.toString().padStart(2, '0')}.${(minor + 1).toString().padStart(2, '0')}`;
  }

  /**
   * Inicializa la organización principal del sistema
   * Esta organización gestiona a todas las demás
   */
  async initializeMainOrganization(): Promise<Organization | undefined> {
    const mainOrgCode = 'ORG-MAIN'; // Código único para la organización principal

    // Verificar si la organización principal ya existe
    const existingOrg = await this.repository.findByCode(mainOrgCode);

    if (existingOrg) {
      console.log('La organización principal ya existe:', existingOrg.name);
      return existingOrg;
    }

    // Crear la organización principal si no existe
    const mainOrganizationData = {
      code: mainOrgCode,
      version: '00.00', // Versión inicial
      name: 'ReqWizard', // Nombre inicial
      address: 'Dirección de la organización principal',
      phone: '777-0000',
      legalRepresentative: null, // Default value
      representativePhone: null, // Default value
      taxId: null, // Default value
      contact: null, // Default value
      contactPhone: null, // Default value
      status: 'Activo',
      comments: 'Esta es la organización principal del sistema.'
    };

    // Usar el repositorio en lugar de prisma directamente
    const mainOrganization = await this.repository.create(mainOrganizationData);

    console.log('Organización principal creada:', mainOrganization.name);
    return mainOrganization;
  }
}

// Creamos y exportamos una instancia singleton del servicio
export const organizationService = new OrganizationService(new OrganizationRepository());