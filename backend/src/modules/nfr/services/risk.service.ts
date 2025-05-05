import { riskRepository } from '../repositories/risk.repository';
import { RiskDTO } from '../models/risk.model';

export class RiskService {
  private readonly repository = riskRepository;

  /**
   * Creates a new risk
   */
  async createRisk(data: RiskDTO) {
    return this.repository.create(data);
  }

  /**
   * Gets all risks with pagination
   */
  async getRisks(page: number = 1, limit: number = 10, projectId?: string) {
    const skip = (page - 1) * limit;
    return this.repository.findAll(skip, limit, projectId);
  }

  /**
   * Gets a risk by ID
   */
  async getRiskById(id: string) {
    return this.repository.findById(id);
  }

  /**
   * Gets a risk by code
   */
  async getRiskByCode(code: string) {
    return this.repository.findByCode(code);
  }

  /**
   * Updates an existing risk
   */
  async updateRisk(code: string, data: RiskDTO) {
    // Verify risk exists
    const existingRisk = await this.repository.findByCode(code);
    if (!existingRisk) {
      throw new Error('Risk not found');
    }

    return this.repository.update(code, data);
  }

  /**
   * Deletes a risk
   */
  async deleteRisk(id: string) {
    return this.repository.delete(id);
  }

  /**
   * Gets risks for a specific entity and registry
   */
  async getRisksByEntityAndRegistry(entityType: string, registryCode: string) {
    return this.repository.findByEntityAndRegistry(entityType, registryCode);
  }

  /**
   * Gets risks for a project
   */
  async getRisksByProject(projectId: string) {
    return this.repository.findByProject(projectId);
  }

  /**
   * Searches risks by status
   */
  async searchRisksByStatus(status: string, projectId?: string) {
    return this.repository.searchByStatus(status, projectId);
  }

  /**
   * Searches risks by date
   */
  async searchRisksByDate(month: number, year: number, projectId?: string) {
    return this.repository.searchByDate(month, year, projectId);
  }

  /**
   * Gets the next unique code for a risk
   */
  async getNextCode(projectId: string) {
    return this.repository.getNextCode(projectId);
  }

  /**
   * Calculate PI Index (Probability x Impact) as a numeric value
   */
  calculatePIIndex(probability: string, impact: string): number {
    const probValue = this.getProbabilityValue(probability);
    const impactValue = this.getImpactValue(impact);
    
    return parseFloat((probValue * impactValue).toFixed(2));
  }

  /**
   * Convert probability string to numeric value
   */
  private getProbabilityValue(probability: string): number {
    switch (probability.toLowerCase()) {
      case 'muy alta':
      case 'very high':
        return 0.9;
      case 'alta':
      case 'high':
        return 0.7;
      case 'media':
      case 'medium':
        return 0.5;
      case 'baja':
      case 'low':
        return 0.3;
      case 'muy baja':
      case 'very low':
        return 0.1;
      default:
        // If it's already a numeric string
        {
          const value = parseFloat(probability);
          return isNaN(value) ? 0.5 : value;
        }
    }
  }

  /**
   * Convert impact string to numeric value
   */
  private getImpactValue(impact: string): number {
    switch (impact.toLowerCase()) {
      case 'catastrófico':
      case 'catastrophic':
        return 0.9;
      case 'crítico':
      case 'critical':
        return 0.7;
      case 'moderado':
      case 'moderate':
        return 0.5;
      case 'menor':
      case 'minor':
        return 0.3;
      case 'insignificante':
      case 'insignificant':
        return 0.1;
      default: {
        // If it's already a numeric string
        const value = parseFloat(impact);
        return isNaN(value) ? 0.5 : value;
      }
    }
  }
}

// Export singleton instance of the service
export const riskService = new RiskService();