import { Organization } from '@prisma/client';
import { OrganizationRepository } from '../repositories/organization.repository';
import { OrganizationDTO, OrganizationResponse } from '../models/organization.model';

export class OrganizationService {
  constructor(private repository: OrganizationRepository) {}

  /**
   * Crea una nueva organización
   */
  async createOrganization(data: OrganizationDTO): Promise<OrganizationResponse> {
    // Generamos el código único
    const code = await this.generateCode();
    const version = '00.01';

    const organization = await this.repository.create({
      code,
      version,
      name: data.name,
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

    return this.mapToResponse(organization);
  }

  /**
   * Obtiene todas las organizaciones con paginación
   */
  async getOrganizations(page: number = 1, limit: number = 10): Promise<OrganizationResponse[]> {
    const skip = (page - 1) * limit;
    const organizations = await this.repository.findAll(skip, limit);
    return organizations.map(org => this.mapToResponse(org));
  }

  /**
   * Busca una organización por su código
   */
  async getOrganizationByCode(code: string): Promise<OrganizationResponse | null> {
    const organization = await this.repository.findByCode(code);
    return organization ? this.mapToResponse(organization) : null;
  }


  /**
   * Obtiene una organización por su ID
   */
  async getOrganizationById(id: string): Promise<OrganizationResponse | null> {
    const organization = await this.repository.findById(id);
    return organization ? this.mapToResponse(organization) : null;
  }

  /**
   * Actualiza una organización existente
   */
  async updateOrganization(code: string, data: OrganizationDTO): Promise<OrganizationResponse> {
    // Verificamos que la organización existe
    const existingOrg = await this.repository.findByCode(code);
    if (!existingOrg) {
      throw new Error('Organization not found');
    }
    
    // Incrementamos la versión
    const newVersion = this.incrementVersion(existingOrg.version);
    
    const updated = await this.repository.update(code, {
      ...data,
      version: newVersion,
    });

    return this.mapToResponse(updated);
  }

  /**
   * Elimina una organización
   */
  async deleteOrganization(id: string): Promise<OrganizationResponse> {
    const deleted = await this.repository.delete(id);
    return this.mapToResponse(deleted);
  }

  /**
   * Busca organizaciones por nombre
   */
  async searchOrganizations(name: string): Promise<OrganizationResponse[]> {
    const organizations = await this.repository.searchByName(name);
    return organizations.map(org => this.mapToResponse(org));
  }

  /**
   * Busca organizaciones por fecha
   */
  async searchOrganizationsByDate(month: number, year: number): Promise<OrganizationResponse[]> {
    const organizations = await this.repository.searchByDate(month, year);
    return organizations.map(org => this.mapToResponse(org));
  }

  /**
   * Obtiene una organización con sus proyectos
   */
  async getOrganizationWithProjects(code: string): Promise<any> {
    const result = await this.repository.findWithProjects(code);
    if (!result) return null;
    
    return {
      ...this.mapToResponse(result),
      projects: result.projects // Aquí podrías mapear los proyectos a ProjectResponse si tienes ese DTO
    };
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
  async initializeMainOrganization(): Promise<OrganizationResponse | undefined> {
    const mainOrgCode = 'ORG-MAIN'; // Código único para la organización principal

    // Verificar si la organización principal ya existe
    const existingOrg = await this.repository.findByCode(mainOrgCode);

    if (existingOrg) {
      console.log('La organización principal ya existe:', existingOrg.name);
      return this.mapToResponse(existingOrg);
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
    return this.mapToResponse(mainOrganization);
  }

  private mapToResponse(organization: Organization): OrganizationResponse {
    return {
      id: organization.id,
      code: organization.code,
      version: organization.version,
      name: organization.name,
      creationDate: organization.creationDate,
      modificationDate: organization.modificationDate,
      address: organization.address,
      phone: organization.phone,
      legalRepresentative: organization.legalRepresentative,
      representativePhone: organization.representativePhone,
      taxId: organization.taxId,
      contact: organization.contact,
      contactPhone: organization.contactPhone,
      status: organization.status,
      comments: organization.comments
    };
  }
}

// Creamos y exportamos una instancia singleton del servicio
export const organizationService = new OrganizationService(new OrganizationRepository());