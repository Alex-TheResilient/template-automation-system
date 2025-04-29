import { organizationRepository } from '../repositories/organization.repository';
import { OrganizationDTO } from '../models/organization.model';

export class OrganizationService {
  private repository = organizationRepository;

  /**
   * Crea una nueva organización
   */
  async createOrganization(data: OrganizationDTO) {
    return this.repository.create(data);
  }

  /**
   * Obtiene todas las organizaciones con paginación
   */
  async getOrganizations(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.repository.findAll(skip, limit);
  }

  /**
   * Busca una organización por su código
   */
  async getOrganizationByCode(code: string) {
    return this.repository.findByCode(code);
  }

  /**
   * Obtiene una organización por su ID
   */
  async getOrganizationById(id: string) {
    return this.repository.findById(id);
  }

  /**
   * Actualiza una organización existente
   */
  async updateOrganization(code: string, data: OrganizationDTO) {
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
  async deleteOrganization(id: string) {
    return this.repository.delete(id);
  }

  /**
   * Busca organizaciones por nombre
   */
  async searchOrganizations(name: string) {
    return this.repository.searchByName(name);
  }

  /**
   * Busca organizaciones por fecha
   */
  async searchOrganizationsByDate(month: number, year: number) {
    return this.repository.searchByDate(month, year);
  }

  /**
   * Obtiene una organización con sus proyectos
   */
  async getOrganizationWithProjects(code: string) {
    return this.repository.findWithProjects(code);
  }

  /**
   * Obtiene el siguiente código único para una organización
   */
  async getNextCode() {
    return this.repository.getNextCode();
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
   */
  async initializeMainOrganization() {
    const mainOrgCode = 'ORG-MAIN'; // Código único para la organización principal

    // Verificar si la organización principal ya existe
    const existingOrg = await this.repository.findByCode(mainOrgCode);

    if (existingOrg) {
      console.log('La organización principal ya existe:', existingOrg.name);
      return existingOrg;
    }

    // Crear la organización principal si no existe
    const mainOrganizationData = {
      name: 'ReqWizard',
      address: 'Dirección de la organización principal',
      phone: '777-0000',
      status: 'Activo',
      comments: 'Esta es la organización principal del sistema.',
      version: '01.00'
    };

    const mainOrganization = await this.repository.create(mainOrganizationData);

    console.log('Organización principal creada:', mainOrganization.name);
    return mainOrganization;
  }
}

// Export singleton instance of the service
export const organizationService = new OrganizationService();