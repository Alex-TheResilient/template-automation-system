
import { expertRepository } from "../repositories/expert.repository";
import { ExpertDTO, ExpertResponse } from "../models/expert.model";

export class ExpertService {
  private repo = expertRepository;

  async createExpert(projectId: string, data: ExpertDTO): Promise<ExpertResponse> {
    return this.repo.create(projectId, data);
  }

  async getExpertsByProject(projectId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return this.repo.findAllByProject(projectId, skip, limit);
  }

  async getExpertByCode(code: string, projectId?: string) {
    return projectId
      ? this.repo.findByCodeAndProject(code, projectId)
      : this.repo.findByCode(code);
  }

  async updateExpert(code: string, data: ExpertDTO) {
    const current = await this.repo.findByCode(code);
    if (!current) throw new Error('Expert not found');
    const newVersion = this.incrementVersion(current.version);
    return this.repo.update(code, data, newVersion);
  }

  async deleteExpert(code: string, projectId: string) {
    const expert = await this.repo.findByCodeAndProject(code, projectId);
    if (!expert) throw new Error('Expert not found');
    return this.repo.delete(expert.id);
  }

  async searchExpertsByName(projectId: string, name: string) {
    return this.repo.searchByName(projectId, name);
  }

  async getNextCode(projectId: string) {
    return this.repo.getNextCode(projectId);
  }

  private incrementVersion(currentVersion: string): string {
    const [major, minor] = currentVersion.split('.').map(Number);
    return `${major.toString().padStart(2, '0')}.${(minor + 1).toString().padStart(2, '0')}`;
  }
}

export const expertService = new ExpertService();
