import { nfrRepository } from '../repositories/nfr.repository';
import { NfrDTO } from '../models/nfr.model';

export class NfrService {
  private readonly repository = nfrRepository;

  /**
   * Creates a new non-functional requirement
   */
  async createNfr(data: NfrDTO) {
    return this.repository.create(data);
  }

  /**
   * Gets all non-functional requirements with pagination
   */
  async getNfrs(page: number = 1, limit: number = 10, projectId?: string) {
    const skip = (page - 1) * limit;
    return this.repository.findAll(skip, limit, projectId);
  }

  /**
   * Gets a non-functional requirement by code
   */
  async getNfrByCode(code: string) {
    return this.repository.findByCode(code);
  }

  /**
   * Gets a non-functional requirement by ID
   */
  async getNfrById(id: string) {
    return this.repository.findById(id);
  }

  /**
   * Updates an existing non-functional requirement
   */
  async updateNfr(code: string, data: NfrDTO) {
    // Verify NFR exists
    const existingNfr = await this.repository.findByCode(code);
    if (!existingNfr) {
      throw new Error('Non-functional requirement not found');
    }

    // Increment version
    const newVersion = this.incrementVersion(existingNfr.version);

    // Pasar la versión como parámetro separado
    return this.repository.update(code, data, newVersion);
  }

  /**
   * Deletes a non-functional requirement
   */
  async deleteNfr(id: string) {
    return this.repository.delete(id);
  }

  /**
   * Searches non-functional requirements by name
   */
  async searchNfrs(name: string, projectId?: string) {
    return this.repository.searchByName(name, projectId);
  }

  /**
   * Searches non-functional requirements by date
   */
  async searchNfrsByDate(month: number, year: number, projectId?: string) {
    return this.repository.searchByDate(month, year, projectId);
  }

  /**
   * Searches non-functional requirements by status
   */
  async searchNfrsByStatus(status: string, projectId?: string) {
    return this.repository.searchByStatus(status, projectId);
  }

  /**
   * Searches non-functional requirements by quality attribute
   */
  async searchNfrsByQualityAttribute(qualityAttribute: string, projectId?: string) {
    return this.repository.searchByQualityAttribute(qualityAttribute, projectId);
  }

  /**
   * Gets a non-functional requirement with its risks
   */
  async getNfrWithRisks(code: string) {
    return this.repository.findWithRisks(code);
  }

  /**
   * Gets all non-functional requirements for a project
   */
  async getNfrsByProject(projectId: string) {
    return this.repository.findByProject(projectId);
  }

  /**
   * Gets the next unique code for a non-functional requirement
   */
  async getNextCode(projectId: string) {
    return this.repository.getNextCode(projectId);
  }

  /**
   * Increments version following XX.YY pattern
   */
  private incrementVersion(currentVersion: string): string {
    const [major, minor] = currentVersion.split('.').map(Number);
    return `${major.toString().padStart(2, '0')}.${(minor + 1).toString().padStart(2, '0')}`;
  }
}

// Export singleton instance of the service
export const nfrService = new NfrService();