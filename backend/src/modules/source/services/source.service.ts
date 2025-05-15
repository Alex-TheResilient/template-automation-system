// source.service.ts
import { sourceRepository } from '../repositories/source.repository';
import { SourceDTO, SourceResponse } from '../models/source.model';

export class SourceService {
  private repo = sourceRepository;

  async createSource(projectId: string, data: SourceDTO): Promise<SourceResponse> {
    return this.repo.create(projectId, data);
  }

  async getSourcesByProject(projectId: string, page: number = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return this.repo.findAllByProject(projectId, skip, limit);
  }

  async getSourceByCode(code: string, projectId?: string) {
    return projectId
      ? this.repo.findByCodeAndProject(code, projectId)
      : this.repo.findByCode(code);
  }

  async updateSource(code: string, data: SourceDTO) {
    const current = await this.repo.findByCode(code);
    if (!current) throw new Error('Source not found');
    const newVersion = this.incrementVersion(current.version);
    return this.repo.update(code, data, newVersion);
  }

  async deleteSource(code: string, projectId: string) {
    const source = await this.repo.findByCodeAndProject(code, projectId);
    if (!source) throw new Error('Source not found');
    return this.repo.delete(source.id);
  }

  async searchSourcesByName(projectId: string, name: string) {
    return this.repo.searchByName(projectId, name);
  }

  async getNextCode(projectId: string): Promise<string> {
    return this.repo.getNextCode(projectId);
  }

  private incrementVersion(currentVersion: string): string {
    const [major, minor] = currentVersion.split('.').map(Number);
    return `${major.toString().padStart(2, '0')}.${(minor + 1).toString().padStart(2, '0')}`;
  }
}

export const sourceService = new SourceService();
